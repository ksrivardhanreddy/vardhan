export type ContentType =
  | "about"
  | "experience"
  | "skill"
  | "certification"
  | "project"
  | "blog"
  | "contact"
  | "learning";
export type KnowledgeChunk = {
  id: string;
  documentId: string;
  title: string;
  heading: string;
  text: string;
  tags: string[];
  url: string;
  contentType: ContentType;
  questions?: string[];
  lastReviewed?: string;
};
export type KnowledgeIndex = {
  schemaVersion: 1;
  corpusVersion: string;
  generatedAt: string;
  chunks: KnowledgeChunk[];
};
export type SearchResult = {
  chunk: KnowledgeChunk;
  score: number;
  matchedTokens: string[];
  coverage: number;
};
export type Retrieval = {
  intent?: import("./overview").OverviewIntent;
  state: "matched" | "ambiguous" | "none";
  results: SearchResult[];
  direct: boolean;
};
export type SourceLink = { id: string; title: string; url: string };
export type Answer = {
  mode: "ai" | "knowledge";
  answer: string;
  sources: SourceLink[];
  model?: string;
  requestId?: string;
};
export type UiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: Answer["mode"];
  sources?: SourceLink[];
};
