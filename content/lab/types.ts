export const labTopics = [
  "Kubernetes",
  "Linux",
  "Networking",
  "Observability",
  "Automation",
  "AI Infra",
] as const;
export type LabTopic = (typeof labTopics)[number];
export type LabStatus =
  | "implemented"
  | "troubleshooting"
  | "in-progress"
  | "learning"
  | "planned";
export const statusLabels: Record<LabStatus, string> = {
  implemented: "Implemented",
  troubleshooting: "Troubleshooting case study",
  "in-progress": "In progress",
  learning: "Learning / research",
  planned: "Planned",
};
export type LabSection = {
  id: string;
  heading: string;
  paragraphs?: string[];
  items?: string[];
  code?: string;
  note?: string;
};
export type LabArticle = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  status: LabStatus;
  resolved?: boolean;
  topics: LabTopic[];
  tags: string[];
  featured?: boolean;
  /** Included in the static build. Deployment still requires owner review. */
  published: boolean;
  publishedAt?: string;
  updatedAt?: string;
  sections: LabSection[];
  diagram?: "k3s";
  related?: string[];
  evidenceLinks?: { label: string; href: string }[];
};

export const labDisclaimer =
  "These are personal lab projects and learning notes. Architecture diagrams are simplified for publication; internal addresses and sensitive configuration are omitted. Professional work is documented separately.";

export type LabCardData = Pick<
  LabArticle,
  | "slug"
  | "title"
  | "summary"
  | "category"
  | "status"
  | "resolved"
  | "topics"
  | "tags"
> & { minutes: number };
