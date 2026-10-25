import type { LabStatus, LabTopic } from "./types";
/** No detail routes, repository links or completion claims for proposed work. */
export const labRoadmap: {
  title: string;
  status: LabStatus;
  topics: LabTopic[];
  summary: string;
  milestones: string[];
}[] = [
  {
    title: "AI platform and local coding agents",
    status: "learning",
    topics: ["AI Infra", "Automation"],
    summary:
      "Exploring open-weight models, hardware sizing, quantization, serving concepts and coding-agent workflows. No working inference endpoint or GPU deployment is established.",
    milestones: [
      "Planned: choose and deploy one isolated model endpoint; record real hardware, runtime and setup.",
      "Planned: publish a benchmark method before measuring latency, time to first token and throughput.",
      "Planned: add authentication, logging, metrics and resource limits; compare one configuration change.",
    ],
  },
  {
    title: "GitOps-controlled K3s deployment",
    status: "planned",
    topics: ["Kubernetes", "Automation"],
    summary:
      "A proposed demo application managed by Argo CD or Flux. Professional Argo CD familiarity does not establish a completed personal GitOps deployment.",
    milestones: [
      "Planned: implement and verify reconciliation, rollback and bootstrap before publishing a case study.",
    ],
  },
  {
    title: "Home Assistant presence automation",
    status: "planned",
    topics: ["Automation"],
    summary:
      "A possible ESP32-C3 and LD2410-series presence prototype with ESPHome/Home Assistant. A finished physical prototype is not established.",
    milestones: [
      "Planned: define a low-voltage prototype and measure actual reliability. Any mains work requires appropriately certified equipment and professional installation.",
    ],
  },
  {
    title: "Private homelab service inventory",
    status: "planned",
    topics: ["Automation", "Networking"],
    summary:
      "Explore a secure way to document service ownership, backups and access. No running inventory application is claimed.",
    milestones: [
      "Planned: design a private inventory without publishing addresses, passwords or secret references.",
    ],
  },
];
