import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { parseMarkdown } from "../../scripts/build-knowledge-index.mjs";
const doc = (body: string, meta = "") =>
  `---\ntitle: "Example"\ntags: [k3s]\nurl: "/lab/self-hosted-kubernetes-proxmox"\nstatus: published\ncontentType: project\nlastReviewed: "2026-10-25"\n${meta}---\n${body}`;
test("index has a deterministic content hash, unique IDs and bounded nonempty chunks", () => {
  const index = JSON.parse(
    readFileSync("public/knowledge-base/index.json", "utf8"),
  );
  assert.equal(
    index.corpusVersion,
    createHash("sha256").update(JSON.stringify(index.chunks)).digest("hex"),
  );
  assert.equal(
    new Set(index.chunks.map((c: { id: string }) => c.id)).size,
    index.chunks.length,
  );
  for (const chunk of index.chunks)
    assert.ok(chunk.text.trim() && chunk.text.split(/\s+/).length <= 450);
  assert.deepEqual(
    parseMarkdown(doc("## Hello\nPublic evidence."), "sample"),
    parseMarkdown(doc("## Hello\nPublic evidence."), "sample"),
  );
});
test("fences/raw HTML stripped, nested heading context and duplicate IDs disambiguated", () => {
  const chunks = parseMarkdown(
    doc(
      "## Parent\nPublic evidence.\n```sh\n## Fake\necho omit\n```\n### Child\nMore public text.\n### Child\nOther text.\n<script>alert(1)</script>",
    ),
    "sample",
  );
  assert.equal(chunks.length, 3);
  assert.equal(chunks[1].heading, "Parent / Child");
  assert.notEqual(chunks[1].id, chunks[2].id);
  assert.ok(!JSON.stringify(chunks).includes("echo omit"));
  assert.ok(!JSON.stringify(chunks).includes("alert(1)"));
});
test("long sections split; draft/unapproved metadata/secrets never enter output", () => {
  assert.equal(
    parseMarkdown(doc("## Long\n" + "word ".repeat(1000)), "long").length,
    4,
  );
  assert.deepEqual(
    parseMarkdown(
      doc("Draft").replace("status: published", "status: draft"),
      "draft",
    ),
    [],
  );
  for (const source of [
    "missing",
    doc("Text", "unknown: true\n"),
    doc("Text").replace(
      "/lab/self-hosted-kubernetes-proxmox",
      "javascript:alert(1)",
    ),
    doc("Text").replace("2026-10-25", "2026-02-30"),
    doc("Private " + ["192", "168", "1", "99"].join(".")),
    doc("Text", "title: duplicate\n"),
  ])
    assert.throws(() => parseMarkdown(source, "invalid"));
});
test("actual export validator rejects missing routes and fragments", async () => {
  const { validateSourceLinks } = await import(
    "../../scripts/validate-knowledge-links.mjs"
  );
  assert.throws(() =>
    validateSourceLinks({
      chunks: [{ id: "bad-route", url: "/does-not-exist" }],
    }),
  );
  assert.throws(() =>
    validateSourceLinks({
      chunks: [{ id: "bad-anchor", url: "/#does-not-exist" }],
    }),
  );
  assert.doesNotThrow(() =>
    validateSourceLinks({ chunks: [{ id: "good", url: "/#contact" }] }),
  );
});
