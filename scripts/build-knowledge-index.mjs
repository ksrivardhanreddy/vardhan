import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { resolve, basename } from "node:path";
import { pathToFileURL } from "node:url";
import { parseDocument } from "yaml";
import { marked } from "marked";
import {
  profile,
  expertise,
  experience,
  work,
  certifications,
} from "../content/portfolio.ts";
import { publishedLabArticles } from "../content/lab/articles.ts";
import { labRoadmap } from "../content/lab/roadmap.ts";
import { careerFaq } from "../content/ai/career-faq.ts";
const contentTypes = [
  "about",
  "experience",
  "skill",
  "certification",
  "project",
  "blog",
  "contact",
  "learning",
];
export const slugify = (value) =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const privatePattern =
  /(?:AKIA[A-Z0-9]{16}|-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----|gh[pousr]_[\w]{30,}|\b192\.168\.\d{1,3}\.\d{1,3}\b|\b10\.(?:\d{1,3}\.){2}\d{1,3}\b|\b172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\b|\b(?:[a-f0-9]{2}:){5}[a-f0-9]{2}\b|(?:password|api[_-]?key|secret[_-]?key)\s*[:=]\s*["']?[A-Za-z0-9_+/=-]{12,})/i;
const allowedExternal = new Set([
  profile.github,
  profile.linkedin,
  ...certifications.map((c) => c.url).filter(Boolean),
]);
export function allowedUrl(url) {
  if (typeof url !== "string" || /[<>"'\s\\]/.test(url) || url.includes(".."))
    return false;
  if (url.startsWith("/") && !url.startsWith("//"))
    return /^\/[a-zA-Z0-9/#._-]*$/.test(url);
  return allowedExternal.has(url);
}
function plain(tokens) {
  return tokens
    .map((t) => {
      if (["html", "code", "image"].includes(t.type)) return "";
      if (t.type === "link")
        return /^(javascript|data):/i.test(t.href)
          ? ""
          : plain(t.tokens ?? [{ type: "text", text: t.text }]);
      if (t.tokens) return plain(t.tokens);
      if (t.items) return t.items.map((i) => plain(i.tokens ?? [])).join(" ");
      return t.text ?? "";
    })
    .join(" ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
export function parseMarkdown(source, documentId) {
  if (privatePattern.test(source))
    throw new Error(`Blocked sensitive pattern in ${documentId}`);
  const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!front) throw new Error(`Missing frontmatter: ${documentId}`);
  const yaml = parseDocument(front[1], { uniqueKeys: true });
  if (yaml.errors.length) throw new Error(`Malformed metadata: ${documentId}`);
  const meta = yaml.toJS();
  if (meta?.status === "draft") return [];
  const keys = [
    "title",
    "tags",
    "url",
    "status",
    "contentType",
    "lastReviewed",
  ];
  if (
    !meta ||
    Object.keys(meta).some((k) => !keys.includes(k)) ||
    ![meta.title, meta.url].every((x) => typeof x === "string" && !!x.trim()) ||
    !Array.isArray(meta.tags) ||
    !meta.tags.every((x) => typeof x === "string" && x.length < 80) ||
    meta.status !== "published" ||
    !contentTypes.includes(meta.contentType) ||
    !allowedUrl(meta.url)
  )
    throw new Error(`Invalid metadata: ${documentId}`);
  if (
    meta.lastReviewed &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(meta.lastReviewed) ||
      !Number.isFinite(Date.parse(meta.lastReviewed)) ||
      new Date(meta.lastReviewed).toISOString().slice(0, 10) !==
        meta.lastReviewed)
  )
    throw new Error(`Invalid review date: ${documentId}`);
  const sections = [];
  let heading = "Overview",
    parent = "",
    content = [];
  function flush() {
    const text = plain(content);
    if (text) sections.push({ heading, text });
    content = [];
  }
  for (const token of marked.lexer(front[2])) {
    if (token.type === "heading" && (token.depth === 2 || token.depth === 3)) {
      flush();
      const label = plain(token.tokens);
      if (token.depth === 2) parent = label;
      heading = token.depth === 3 && parent ? `${parent} / ${label}` : label;
    } else content.push(token);
  }
  flush();
  if (!sections.length) throw new Error(`Empty document: ${documentId}`);
  const counts = new Map();
  const chunks = [];
  for (const section of sections) {
    const words = section.text.split(/\s+/);
    for (let start = 0; start < words.length; start += 300) {
      const text = words.slice(start, start + 300).join(" ");
      const stem = slugify(section.heading) || "overview";
      const count = (counts.get(stem) ?? 0) + 1;
      counts.set(stem, count);
      chunks.push({
        id: `${documentId}::${stem}${count > 1 ? `-${count}` : ""}`,
        documentId,
        title: meta.title,
        heading: section.heading,
        text,
        tags: meta.tags,
        url: meta.url,
        contentType: meta.contentType,
        ...(meta.lastReviewed ? { lastReviewed: meta.lastReviewed } : {}),
      });
    }
  }
  return chunks;
}
function markdown(meta, sections) {
  return `---\n${Object.entries(meta)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join(
      "\n",
    )}\nstatus: published\nlastReviewed: "2026-10-25"\n---\n\n${sections.map(([h, t]) => `## ${h}\n${t}`).join("\n\n")}\n`;
}
export function generatePublicMarkdown(root) {
  const directory = resolve(root, "knowledge/generated");
  mkdirSync(directory, { recursive: true });
  for (const name of readdirSync(directory))
    if (name.endsWith(".md")) rmSync(resolve(directory, name));
  const files = [];
  const save = (id, title, tags, url, contentType, sections) => {
    const name = `${id}.md`;
    writeFileSync(
      resolve(directory, name),
      markdown({ title, tags, url, contentType }, sections),
    );
    files.push(`generated/${name}`);
  };
  save(
    "experience",
    "Professional experience",
    ["aws", "eks", "kubernetes", "terraform", "linux", "career"],
    "/#experience",
    "experience",
    experience.map((job) => [
      `${job.company} — ${job.role}`,
      `Professional experience: ${job.role} at ${job.company}, ${job.period}. ${job.summary} ${job.highlights.join(" ")}`,
    ]),
  );
  save(
    "skills",
    "Technical capabilities",
    ["skills", "infrastructure", "automation"],
    "/#about",
    "skill",
    expertise.map((e) => [
      e.title,
      `${e.description} ${e.tools.join(", ")}. ${e.title.includes("AI") ? "This is personal learning, not professional production AI deployment." : ""}`,
    ]),
  );
  for (const cert of certifications)
    save(
      `cert-${cert.short.toLowerCase()}`,
      cert.name,
      [
        "certified",
        "certification",
        cert.short.toLowerCase(),
        ...(cert.short === "AWS" ? ["saa"] : []),
      ],
      "/#certifications",
      "certification",
      [
        [
          "Credential status",
          `${cert.name}, issued by ${cert.issuer}: ${cert.status}. ${cert.short === "RHCE" ? "RHCE is historical and expired, not currently active." : "No expiry date is documented in the public portfolio."}`,
        ],
      ],
    );
  for (const item of work)
    save(
      `work-${item.number}`,
      item.title,
      item.tools,
      `/#${item.id}`,
      "project",
      [
        [
          "Professional scope",
          `${item.contextLabel}. ${item.description} ${item.contribution}`,
        ],
        [
          "Result and limitations",
          `${item.result} ${item.constraints} ${item.takeaway}`,
        ],
      ],
    );
  for (const article of publishedLabArticles)
    save(
      `lab-${article.slug}`,
      article.title,
      article.tags,
      `/lab/${article.slug}`,
      article.status === "learning" ? "learning" : "project",
      article.sections
        .filter((s) => (s.paragraphs?.length ?? 0) + (s.items?.length ?? 0) > 0)
        .map((s) => [
          s.heading,
          `Personal lab — ${article.status}${article.resolved ? ", resolved" : ""}. ${[...(s.paragraphs ?? []), ...(s.items ?? [])].join(" ")}`,
        ]),
    );
  save(
    "learning",
    "Learning tracks and planned experiments",
    [
      "ai",
      "llm",
      "llmops",
      "inference",
      "learning",
      "research",
      "planned",
      "gitops",
    ],
    "/lab",
    "learning",
    labRoadmap.map((track) => [
      track.title,
      `${track.status}: ${track.summary} ${track.milestones.join(" ")}`,
    ]),
  );
  for (const [id, title, url, text] of [
    [
      "contact",
      "Contact Vardhan",
      "/#contact",
      `The public portfolio email is ${profile.email}. Use the Contact section to get in touch.`,
    ],
    [
      "resume",
      "Download résumé",
      profile.resume,
      "The current public résumé is a two-page PDF, available through Download Résumé on the portfolio.",
    ],
    [
      "linkedin",
      "LinkedIn profile",
      profile.linkedin,
      `Vardhan's public LinkedIn profile is ${profile.linkedin}.`,
    ],
    [
      "github",
      "GitHub profile",
      profile.github,
      `Vardhan's public GitHub profile is ${profile.github}. No private repositories or live account access are available to this assistant.`,
    ],
  ])
    save(id, title, [id, "links"], url, "contact", [[title, text]]);
  return files;
}
export function buildIndex(root = process.cwd()) {
  const manifest = JSON.parse(
    readFileSync(resolve(root, "knowledge/manifest.json"), "utf8"),
  );
  if (
    !Array.isArray(manifest.approvedFiles) ||
    manifest.approvedFiles.some(
      (f) => typeof f !== "string" || !/^\d[\w-]*\.md$/.test(f),
    )
  )
    throw new Error("Invalid corpus allowlist");
  const generated = manifest.generatedPublicContent
    ? generatePublicMarkdown(root)
    : [];
  const files = [...manifest.approvedFiles, ...generated];
  const chunks = [];
  for (const file of files)
    chunks.push(
      ...parseMarkdown(
        readFileSync(resolve(root, "knowledge", file), "utf8"),
        basename(file, ".md"),
      ),
    );
  if (manifest.generatedPublicContent) {
    for (const faq of careerFaq) {
      if (
        !allowedUrl(faq.url) ||
        privatePattern.test(faq.answer) ||
        faq.questions.some((q) => privatePattern.test(q))
      )
        throw new Error(`Unsafe FAQ: ${faq.id}`);
      chunks.push({
        id: `faq-${faq.id}::answer`,
        documentId: `faq-${faq.id}`,
        title: faq.questions[0],
        heading: faq.category,
        text: faq.answer,
        tags: [faq.category, faq.kind, faq.origin],
        questions: faq.questions,
        url: faq.url,
        contentType: "about",
        lastReviewed: "2026-10-25",
      });
    }
  }
  if (!chunks.length || new Set(chunks.map((c) => c.id)).size !== chunks.length)
    throw new Error("Empty corpus or duplicate chunk IDs");
  const corpusVersion = createHash("sha256")
    .update(JSON.stringify(chunks))
    .digest("hex");
  const generatedAt = new Date(
    Math.max(...chunks.map((c) => Date.parse(c.lastReviewed ?? "1970-01-01"))),
  ).toISOString();
  const index = { schemaVersion: 1, corpusVersion, generatedAt, chunks };
  mkdirSync(resolve(root, "public/knowledge-base"), { recursive: true });
  writeFileSync(
    resolve(root, "public/knowledge-base/index.json"),
    JSON.stringify(index),
  );
  console.log(
    `Knowledge index: ${files.length} approved documents; ${chunks.length} chunks; ${Buffer.byteLength(JSON.stringify(index))} bytes. Source URLs validated after export. Drafts/unlisted files excluded.`,
  );
  return index;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  buildIndex();
