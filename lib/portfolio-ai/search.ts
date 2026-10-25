import { overviewIntent, overviewRetrieval } from "./overview";
import { blockedQuestion, validQuestion } from "./privacy";
import type { KnowledgeIndex, Retrieval, SearchResult } from "./types";
const stop = new Set(
  "a an the is are was were have has had do does did i you he his she her it its they their we our my your me what which how can could would should about tell explain please vardhan srivardhan reddy kolan of for to in on at with and or from this that there any been used use work experience background projects project built skills skill include includes need information know more next where who why when hold holds earned any run runs home engineer engineering demonstrate demonstrates tools include its".split(
    " ",
  ),
);
const aliases: Record<string, string[]> = {
  platforms: ["platform"],
  architecture: ["environment", "context"],
  models: ["model"],
  certificates: ["certified"],
  k8s: ["kubernetes"],
  k3s: ["kubernetes"],
  eks: ["kubernetes", "aws"],
  amazon: ["aws"],
  iac: ["terraform", "infrastructure", "code"],
  terraform: ["iac"],
  cicd: ["pipelines", "deployment", "automation"],
  prom: ["prometheus"],
  observability: ["monitoring", "metrics", "grafana", "prometheus"],
  monitoring: ["observability", "prometheus", "grafana"],
  llmops: ["llm", "ai", "inference"],
  certification: ["certified"],
  certifications: ["certified"],
  certs: ["certified"],
  certificate: ["certified"],
  resume: ["résumé"],
  résumé: ["resume"],
  homelab: ["proxmox", "k3s"],
  metalb: ["metallb"],
  kubernetes: ["kubernetes"],
  kubernets: ["kubernetes"],
  kubernetses: ["kubernetes"],
  kubernettes: ["kubernetes"],
  platform: ["platform"],
  ingress: ["nginx"],
  learning: ["research", "planned"],
  learn: ["learning", "research"],
  linkedin: ["linkedin"],
  contact: ["email"],
  job: ["role"],
  suitable: ["role"],
  fit: ["role"],
};
export function tokenize(text: string): string[] {
  return (
    text
      .normalize("NFKC")
      .toLowerCase()
      .replace(/ci\s*\/\s*cd/g, "cicd")
      .replace(/home\s+lab/g, "homelab")
      .replace(/ai\s+infra\b/g, "ai infrastructure")
      .match(/[\p{L}\p{N}]+(?:[.-][\p{L}\p{N}]+)*/gu) ?? []
  );
}
export function queryTokens(text: string): string[] {
  return Array.from(
    new Set(
      tokenize(text)
        .filter((t) => !stop.has(t))
        .flatMap((t) => [t, ...(aliases[t] ?? [])]),
    ),
  );
}
/** Weighted fields, not repeated raw words. k1=1.2 b=.75; IDF ln(1+(N-df+.5)/(df+.5)). Scores are not probabilities. */
export function search(index: KnowledgeIndex, question: string): Retrieval {
  if (!validQuestion(question) || blockedQuestion(question))
    return { state: "none", results: [], direct: true };
  const intent = overviewIntent(question);
  if (intent) return overviewRetrieval(index, intent);
  const tokens = queryTokens(question);
  if (!tokens.length) return { state: "none", results: [], direct: true };
  let candidates = index.chunks;
  if (/linkedin/i.test(question))
    candidates = candidates.filter((c) => c.documentId === "linkedin");
  else if (/resume|résumé/i.test(question))
    candidates = candidates.filter((c) => c.documentId === "resume");
  else if (/email|contact/i.test(question))
    candidates = candidates.filter((c) => c.documentId === "contact");
  else if (/certif|\bcka\b|\brhce\b|\bsaa\b/i.test(question))
    candidates = candidates.filter((c) => c.contentType === "certification");
  const credentialMentions = Array.from(
    new Set(question.toLowerCase().match(/\b(?:aws|cka|rhce|saa)\b/g) ?? []),
  );
  if (
    candidates.length &&
    candidates.every((c) => c.contentType === "certification") &&
    credentialMentions.length
  )
    candidates = candidates.filter((c) =>
      credentialMentions.some(
        (name) => c.documentId === `cert-${name === "saa" ? "aws" : name}`,
      ),
    );
  const credentialBundle =
    candidates.length > 1 &&
    candidates.every((c) => c.contentType === "certification");
  const originals = new Set(tokenize(question).filter((t) => !stop.has(t)));
  const allDocs = index.chunks.map((chunk) => ({
    chunk,
    fields: [
      tokenize(chunk.title),
      tokenize(chunk.heading),
      tokenize(chunk.tags.join(" ")),
      tokenize(chunk.text),
    ],
  }));
  const candidateIds = new Set(candidates.map((c) => c.id));
  const docs = allDocs.filter((d) => candidateIds.has(d.chunk.id));
  const averages = [0, 1, 2, 3].map(
    (i) =>
      allDocs.reduce((sum, d) => sum + d.fields[i].length, 0) /
      Math.max(1, allDocs.length),
  );
  const results: SearchResult[] = docs
    .map((d) => {
      const matched = tokens.filter((t) => d.fields.some((f) => f.includes(t)));
      let score = 0;
      for (const t of matched) {
        const df = allDocs.filter((doc) =>
          doc.fields.some((f) => f.includes(t)),
        ).length;
        const termWeight = originals.has(t) ? 1 : 0.4;
        const idf = Math.log(1 + (allDocs.length - df + 0.5) / (df + 0.5));
        for (let f = 0; f < 4; f++) {
          const tf = d.fields[f].filter((x) => x === t).length;
          if (tf)
            score +=
              (termWeight * [3, 4, 3, 1][f] * idf * (tf * 2.2)) /
              (tf +
                1.2 *
                  (0.25 + (0.75 * d.fields[f].length) / (averages[f] || 1)));
        }
      }
      if (
        /projects|homelab|built|architecture/i.test(question) &&
        d.chunk.contentType === "project"
      )
        score *= 1.8;
      return {
        chunk: d.chunk,
        score,
        matchedTokens: matched,
        coverage: matched.length / tokens.length,
      };
    })
    .filter((r) => r.score >= 1.5 && r.coverage >= 0.2)
    .sort((a, b) => b.score - a.score || a.chunk.id.localeCompare(b.chunk.id));
  const raw = tokenize(question).filter((t) => !stop.has(t));
  const top = results[0];
  if (
    !top ||
    !raw.some(
      (t) =>
        top.matchedTokens.includes(t) ||
        (aliases[t] ?? []).some((a) => top.matchedTokens.includes(a)),
    )
  )
    return { state: "none", results: [], direct: true };
  // Requiring meaningful query coverage rejects questions that merely mention a common platform word.
  const known = raw.filter(
    (t) => docs.some((d) => d.fields.some((f) => f.includes(t))) || aliases[t],
  );
  if (known.length / Math.max(raw.length, 1) < 0.35)
    return { state: "none", results: [], direct: true };
  const direct =
    /(?:resume|résumé|linkedin|contact|email|certif|\bcka\b|\brhce\b|\bsaa\b)/i.test(
      question,
    );
  const seen = new Set<string>();
  const selected = results
    .filter((r) => r.score >= top.score * 0.42)
    .filter((r) => {
      if (seen.has(r.chunk.documentId)) return false;
      seen.add(r.chunk.documentId);
      return true;
    })
    .slice(0, direct ? (credentialBundle ? 3 : 1) : 4);
  return {
    state:
      selected.length > 1 && top.score < selected[1].score * 1.12
        ? "ambiguous"
        : "matched",
    results: selected,
    direct,
  };
}
