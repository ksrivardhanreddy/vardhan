import type { KnowledgeIndex, Retrieval } from "./types";
export type OverviewIntent =
  | "projects"
  | "skills"
  | "experience"
  | "about"
  | "greeting";
/** Broad portfolio navigation is a deterministic intent, not an empty BM25 query.
 * Extra subject words deliberately fall through to retrieval instead of inventing projects. */
export function overviewIntent(question: string): OverviewIntent | undefined {
  const normalized = question
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\bwhat[’']?s\b/g, "what is")
    .replace(/\b(?:he[’']s)\b/g, "he is")
    .replace(/\binformation technology\b/g, "it")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (/^(hi|hello|hey)( there)?$/.test(normalized)) return "greeting";
  const generic = new Set(
    "a an the i you your yourself he his him me my vardhan srivardhan reddy kolan s who what which how can could would do does have has is are tell explain describe show list summarize summary overview about please all of and work worked done built on in for projects project skills skill experience experiences background career portfolio professional technical yourself it industry sector field roles role responsibilities journey employment history previous current past jobs job give provide an overview brief briefly detailed detail details walk through so far".split(
      " ",
    ),
  );
  if (!normalized || normalized.split(" ").some((word) => !generic.has(word)))
    return;
  if (/\bprojects?\b/.test(normalized)) return "projects";
  if (/\bskills?\b/.test(normalized)) return "skills";
  if (
    /\bexperience(?:s)?\b|\bcareer\b|\bbackground\b|\bemployment\b|\broles?\b|\bjobs?\b/.test(
      normalized,
    )
  )
    return "experience";
  if (
    /\babout\b|\byourself\b|\bportfolio\b|^who\b/.test(normalized) ||
    /^(what (do you|does he) do)$/.test(normalized)
  )
    return "about";
}
export function overviewRetrieval(
  index: KnowledgeIndex,
  intent: OverviewIntent,
): Retrieval {
  const preferred: Record<Exclude<OverviewIntent, "greeting">, string[]> = {
    projects: [
      "02-networking::homelab-architecture-overview",
      "lab-kubernetes-observability-grafana-prometheus::implementation",
      "work-01::professional-scope",
    ],
    skills: [
      "skills::cloud-kubernetes",
      "skills::infrastructure-as-code",
      "skills::delivery-gitops",
    ],
    experience: [
      "faq-experience-total::answer",
      "experience::nemetschek-group-bluebeam-technical-analyst-devops",
      "experience::mks-vision-pvt-ltd-senior-devops-engineer",
      "experience::avya-it-pvt-ltd-devops-engineer",
    ],
    about: [
      "01-about::professional-focus",
      "01-about::platform-engineering-relevance",
    ],
  };
  const chunks =
    intent === "greeting"
      ? []
      : preferred[intent].flatMap((id) => {
          const chunk = index.chunks.find((c) => c.id === id);
          return chunk ? [chunk] : [];
        });
  return {
    state: chunks.length || intent === "greeting" ? "matched" : "none",
    direct: true,
    intent,
    results: chunks.map((chunk) => ({
      chunk,
      score: 0,
      coverage: 0,
      matchedTokens: [],
    })),
  };
}
