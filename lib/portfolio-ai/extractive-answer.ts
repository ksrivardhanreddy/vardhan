import { queryTokens, search } from "./search";
import type { Answer, KnowledgeIndex, SearchResult, SourceLink } from "./types";
export const NO_EVIDENCE =
  "I don't have verified information about that in the public portfolio. I can explain Vardhan’s published projects, skills and experience; you can browse the Engineering Lab or contact him directly.";
export function sourcesFor(results: SearchResult[]): SourceLink[] {
  const seen = new Set<string>();
  return results
    .filter((r) => {
      if (seen.has(r.chunk.url)) return false;
      seen.add(r.chunk.url);
      return true;
    })
    .slice(0, 3)
    .map((r) => ({
      id: r.chunk.id,
      title: `${r.chunk.title} — ${r.chunk.heading}`,
      url: r.chunk.url,
    }));
}
export function composeAnswer(index: KnowledgeIndex, question: string): Answer {
  const retrieval = search(index, question);
  if (retrieval.intent === "greeting")
    return {
      mode: "knowledge",
      answer:
        "Hi! I can help you explore Vardhan’s published projects, technical skills, professional experience and learning plans. Try ‘explain projects’, ‘what are his skills?’ or a specific technology such as Kubernetes.",
      sources: [],
    };
  if (retrieval.intent && retrieval.results.length) {
    const snippets = retrieval.results
      .map((result) => {
        const text = result.chunk.text
          .replace(/^Personal lab — [^.]+\.\s*/, "")
          .replace(/^Professional · public-safe\.\s*/, "")
          .replace(/^Professional experience:\s*/, "");
        const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z])/);
        const excerpt =
          result.chunk.contentType === "skill"
            ? text
            : sentences
                .filter((sentence) => sentence.length < 450)
                .slice(0, 2)
                .join(" ");
        const context =
          result.chunk.documentId.startsWith("lab-") ||
          result.chunk.documentId === "02-networking"
            ? "Personal lab"
            : result.chunk.documentId.startsWith("work-")
              ? "Professional work"
              : result.chunk.contentType === "experience"
                ? "Professional experience"
                : result.chunk.heading;
        return excerpt ? `${context}: ${excerpt}` : "";
      })
      .filter(Boolean);
    return {
      mode: "knowledge",
      answer: snippets.join("\n\n"),
      sources: sourcesFor(retrieval.results),
    };
  }
  if (!retrieval.results.length)
    return { mode: "knowledge", answer: NO_EVIDENCE, sources: [] };
  if (
    retrieval.direct &&
    retrieval.results.length > 1 &&
    retrieval.results.every((r) => r.chunk.contentType === "certification")
  )
    return {
      mode: "knowledge",
      answer: retrieval.results
        .map((r) => r.chunk.text.split(/(?<=[.!?])\s/)[0])
        .join(" "),
      sources: sourcesFor(retrieval.results),
    };
  const tokens = queryTokens(question);
  const sentences: string[] = [];
  const used: SearchResult[] = [];
  for (const result of retrieval.results.slice(0, retrieval.direct ? 1 : 3)) {
    const candidates = result.chunk.text
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .filter((s) => tokens.some((t) => s.toLowerCase().includes(t)))
      .slice(0, 2);
    for (const sentence of candidates) {
      if (
        sentences.length >= 4 ||
        sentences.join(" ").length + sentence.length > 1000
      )
        break;
      if (!sentences.some((s) => s === sentence || s.includes(sentence))) {
        const prefix =
          result.chunk.documentId.startsWith("lab-") ||
          result.chunk.documentId === "02-networking"
            ? "Personal lab: "
            : result.chunk.documentId.startsWith("work-")
              ? "Professional work: "
              : result.chunk.contentType === "learning"
                ? "Learning / planned work: "
                : "";
        sentences.push(prefix + sentence);
        used.push(result);
      }
    }
    if (sentences.length >= 3) break;
  }
  return {
    mode: "knowledge",
    answer: sentences.length
      ? sentences.join(" ")
      : "These published pages may help. The specific answer is not documented in enough detail for a summary.",
    sources: sourcesFor(used.length ? used : retrieval.results),
  };
}
