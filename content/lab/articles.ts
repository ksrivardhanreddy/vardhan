import type { LabArticle, LabCardData } from "./types";

/** Source: owner-supplied Engineering Lab specification. Historical activity,
 * not a live service inventory. No publication dates until actual launch. */
export const labArticles: LabArticle[] = [
  {
    slug: "self-hosted-kubernetes-proxmox",
    title: "Building a Self-Hosted Kubernetes Platform with Proxmox and K3s",
    summary:
      "A small multi-node personal K3s environment, with explicit ingress and service-IP decisions and a separate monitoring layer.",
    category: "Kubernetes / Platform Engineering / Virtualization",
    status: "implemented",
    topics: ["Kubernetes", "Networking"],
    tags: [
      "Proxmox VE",
      "K3s",
      "Helm",
      "NGINX Ingress",
      "MetalLB",
      "Linux",
      "Tailscale",
    ],
    featured: true,
    published: true,
    diagram: "k3s",
    related: [
      "kubernetes-observability-grafana-prometheus",
      "proxmox-network-recovery-motherboard",
    ],
    sections: [
      {
        id: "motivation",
        heading: "Why I built it",
        paragraphs: [
          "Managed Kubernetes abstracts away many platform decisions. I wanted hands-on experience with the virtualization layer, cluster nodes, networking, traffic ingress and Helm-based add-ons—and a way to inspect system health when something fails.",
        ],
      },
      {
        id: "environment",
        heading: "Environment and context",
        paragraphs: [
          "My personal lab uses an ASUS NUC 14 Pro with an Intel Core Ultra 5 125H and 48 GB of RAM. Proxmox runs on dedicated SSD storage, with separate NVMe capacity available for virtual-machine data. These are documented setup details, not a statement that every service is currently running.",
          "I set up K3s across a control-plane node and a worker node. This is a resource-conscious home lab, not a highly available or multi-zone production cluster.",
        ],
      },
      {
        id: "implementation",
        heading: "Implementation and engineering decisions",
        items: [
          "Separate host management from cluster VMs so that individual cluster nodes can be rebuilt.",
          "Disable bundled Traefik and ServiceLB; deploy NGINX Ingress to study HTTP routing explicitly.",
          "Use MetalLB for LoadBalancer service addresses on the local network, where no cloud-provider load balancer exists.",
          "Use Helm-based add-ons and kube-prometheus-stack for cluster metrics and dashboards.",
          "Use Tailscale for private connectivity and routing experiments; private access is not evidence of hardened public exposure.",
        ],
      },
      {
        id: "tradeoffs",
        heading: "Tradeoffs and failure boundaries",
        paragraphs: [
          "Explicit ingress and service-IP management make controller behavior easier to study but create more configuration to maintain. Virtual machines separate the lab's layers; they do not remove the physical host as a shared failure point.",
          "Service exposure and secure external publication are different problems. No public router forwarding, production failover, distributed control-plane resilience or disaster-recovery objective is claimed.",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome and evidence boundary",
        paragraphs: [
          "The documented setup includes the K3s nodes, NGINX Ingress, MetalLB and monitoring components. The source material describes setup and troubleshooting activities; it does not establish uptime, user traffic, benchmarks or current availability. Original command output, screenshots and a sanitized public repository have not been supplied.",
        ],
      },
      {
        id: "lessons",
        heading: "Lessons learned",
        items: [
          "LoadBalancer service addressing, ingress controllers and Kubernetes Services solve different parts of the traffic path.",
          "Host, VM, network and Kubernetes layers all matter during diagnosis.",
          "Recovery notes are valuable in a lab where hardware and configuration change.",
        ],
      },
      {
        id: "next",
        heading: "Next iterations",
        items: [
          "Version-control a sanitized bootstrap example.",
          "Demonstrate one application deployment and rollback.",
          "Document backup and restore of a non-sensitive test workload.",
          "Publish personal GitOps work only after implementation and verification.",
        ],
      },
    ],
  },
  {
    slug: "kubernetes-observability-grafana-prometheus",
    title: "Making a Homelab Kubernetes Cluster Observable",
    summary:
      "Deploying kube-prometheus-stack and accessing Grafana through NGINX Ingress to inspect a personal K3s cluster.",
    category: "Observability / Kubernetes",
    status: "implemented",
    topics: ["Observability", "Kubernetes"],
    tags: [
      "Prometheus",
      "Grafana",
      "kube-prometheus-stack",
      "Helm",
      "K3s",
      "NGINX Ingress",
    ],
    featured: true,
    published: true,
    related: ["self-hosted-kubernetes-proxmox"],
    sections: [
      {
        id: "problem",
        heading: "The problem",
        paragraphs: [
          "A cluster can report healthy nodes while workloads struggle. I wanted more context than an occasional kubectl get pods and a consistent place to inspect cluster state over time.",
        ],
      },
      {
        id: "context",
        heading: "Part of the K3s platform",
        paragraphs: [
          "This is the monitoring layer of the same Proxmox/K3s lab, not a separate unrelated deployment or an employer monitoring system.",
        ],
      },
      {
        id: "implementation",
        heading: "Implementation",
        paragraphs: [
          "I installed kube-prometheus-stack into the K3s environment and configured access to Grafana through NGINX Ingress. This provided a practical way to inspect Kubernetes metrics and dashboards while experimenting with workloads and maintenance.",
        ],
      },
      {
        id: "tradeoffs",
        heading: "Design and operational tradeoffs",
        paragraphs: [
          "Monitoring should be considered separately from the workloads it observes, while staying within a modest lab's resource budget. Dashboard access also needs protection. A private ingress URL alone does not establish authentication, TLS, durable storage, long-term retention or reliable alert delivery.",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome and evidence boundary",
        paragraphs: [
          "The documented work establishes the stack installation and Grafana ingress. No dashboard screenshots, incident measurements or alert-delivery evidence are available in the supplied material. Retention, persistent volumes, external alerts and uptime targets remain unverified.",
        ],
      },
      {
        id: "lessons",
        heading: "Lessons learned",
        paragraphs: [
          "Metrics provide context rather than automatic diagnoses. Useful investigation correlates metrics with deployments, logs, node status and actual application symptoms.",
        ],
      },
      {
        id: "next",
        heading: "Next iteration",
        items: [
          "Add actual sanitized node and pod dashboard screenshots.",
          "Document a specific question answered through metrics.",
          "Verify retention, storage and alert delivery before making operational claims.",
        ],
      },
    ],
  },
  {
    slug: "docker-snap-apt-daemon-conflict",
    title: "Why docker ps Was Empty While a Containerized Service Was Running",
    summary:
      "Resolved a personal Ubuntu host's conflicting Docker views by identifying competing Snap and apt installations.",
    category: "Linux / Containers / Root Cause Analysis",
    status: "troubleshooting",
    resolved: true,
    topics: ["Linux", "Networking"],
    tags: ["Ubuntu", "Docker Engine", "Snap", "systemd", "containerd"],
    featured: true,
    published: true,
    sections: [
      {
        id: "symptom",
        heading: "The symptom",
        paragraphs: [
          "A web application remained reachable on its published port, yet docker ps returned no running containers. That contradiction suggested the CLI and the active service were not describing the same daemon context.",
        ],
      },
      {
        id: "investigation",
        heading: "Investigation across system layers",
        paragraphs: [
          "I checked the listening port with ss and inspected process ancestry. docker-proxy, a container runtime shim and the application process showed that container processes were running despite the empty CLI view.",
          "The host had separate Docker installations from Snap and apt, with separate daemon/runtime contexts. The CLI was observing a different daemon from the one associated with the live service. This explains why an empty container list did not mean there were no running container processes.",
        ],
      },
      {
        id: "diagnostics",
        heading: "Illustrative diagnostic commands",
        code: "sudo ss -lntp\nps aux | grep -E 'dockerd|containerd|docker-proxy'\nwhich docker\ndocker context ls\ndocker info\nsnap list docker\nsystemctl status docker",
        note: "Examples only, not exact executed order or recorded output. Establish daemon ownership and workload impact before stopping any service; do not stop a production daemon based on this example.",
      },
      {
        id: "resolution",
        heading: "Resolution and outcome",
        paragraphs: [
          "After identifying installation and process ownership, I stopped the Snap-managed Docker daemon and restarted the systemd-managed Docker service. The CLI then showed two running containers, including the previously missing application container, and the web service remained reachable.",
          "Removing the redundant Snap installation was proposed as follow-up. The notes do not establish that removal was completed.",
        ],
      },
      {
        id: "tradeoffs",
        heading: "Tradeoffs and evidence boundary",
        paragraphs: [
          "Restarting a daemon can affect its workloads. This was a personal Ubuntu host, not an employer system or a measured enterprise outage. No exact output, downtime measurement or generalized zero-downtime guarantee is provided.",
        ],
      },
      {
        id: "lessons",
        heading: "Lessons learned",
        paragraphs: [
          "When an administrative command contradicts a reachable service, check sockets, process ownership, packaging, daemon endpoints and CLI context together. Evidence from multiple layers can explain apparently impossible states.",
        ],
      },
      {
        id: "next",
        heading: "Next steps",
        items: [
          "Review whether the redundant installation can be safely removed.",
          "Document the intended Docker installation and CLI context for future maintenance.",
        ],
      },
    ],
  },
  {
    slug: "tailscale-systemd-resolved-dns",
    title: "Diagnosing DNS Configuration Conflicts on a Linux Homelab Host",
    summary:
      "Tracing resolver ownership when Tailscale DNS settings and an Ubuntu host's intended local resolvers diverged.",
    category: "Linux / Networking / DNS",
    status: "troubleshooting",
    topics: ["Linux", "Networking"],
    tags: ["Tailscale", "Ubuntu", "systemd-resolved", "DNS"],
    published: true,
    sections: [
      {
        id: "problem",
        heading: "Problem and context",
        paragraphs: [
          "While experimenting with Tailscale private networking and subnet routing, resolver configuration on an Ubuntu host became confusing. Tailscale-managed settings and the intended local DNS settings were not aligned.",
        ],
      },
      {
        id: "investigation",
        heading: "Investigation and correction",
        paragraphs: [
          "I inspected /etc/resolv.conf and identified management by systemd-resolved or Tailscale at different stages. In the documented sequence, disabling acceptance of Tailscale DNS settings and restarting systemd-resolved restored the expected local resolver list.",
        ],
      },
      {
        id: "tradeoffs",
        heading: "Resolver ownership and tradeoffs",
        paragraphs: [
          "/etc/resolv.conf is often generated or a symlink. Editing it directly is not a durable fix. First identify the controlling component—NetworkManager, systemd-resolved, DHCP or a VPN client—and change its supported configuration source.",
          "DNS changes can affect private-name resolution as well as ordinary lookups. Validate the applications and names relevant to the intended configuration; do not infer success solely from one file.",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome and evidence boundary",
        paragraphs: [
          "The notes show the intended local nameservers in the resolver file after correction. This is evidence of that configuration state, not a comprehensive or long-term DNS reliability test. Real addresses, tailnet identifiers and device names are omitted.",
        ],
      },
      {
        id: "lessons",
        heading: "Lessons learned",
        paragraphs: [
          "Find the owner of generated configuration before editing it. Confirm behavior with resolver tools and application checks as well as inspecting the file.",
        ],
      },
      {
        id: "next",
        heading: "Next verification",
        items: [
          "Use resolvectl, dig and relevant application tests to validate the desired resolution behavior.",
          "Document persistence across a reconnect or reboot before claiming a durable correction.",
        ],
      },
    ],
  },
  {
    slug: "proxmox-network-recovery-motherboard",
    title: "Recovering Host Networking After a Homelab Motherboard Replacement",
    summary:
      "Correcting changed interface identity and bridge membership during personal Proxmox host recovery.",
    category: "Linux / Virtualization / Networking",
    status: "troubleshooting",
    topics: ["Linux", "Networking"],
    tags: ["Proxmox VE", "Linux interfaces", "Bridge networking", "initramfs"],
    published: true,
    related: ["self-hosted-kubernetes-proxmox"],
    sections: [
      {
        id: "context",
        heading: "Context and symptom",
        paragraphs: [
          "After replacing the motherboard in my homelab mini PC, the network interface identity changed and host networking needed attention. A management bridge can depend on an interface name or hardware identity even when the operating system and storage remain intact.",
        ],
      },
      {
        id: "investigation",
        heading: "Investigation and recovery",
        paragraphs: [
          "I investigated the physical NIC identity and bridge configuration, corrected the relevant mapping, brought the Proxmox bridge back into a working state and updated initramfs as part of recovery. Exact interface names, MAC addresses and host inventory are omitted.",
        ],
      },
      {
        id: "tradeoffs",
        heading: "Recovery tradeoffs",
        paragraphs: [
          "Changes to a virtualization host's bridge can affect management access. A console recovery plan and a record of bridge relationships are useful before hardware changes. This article does not provide a generic sequence of repair commands: the required correction depends on the actual host.",
        ],
      },
      {
        id: "outcome",
        heading: "Outcome and evidence boundary",
        paragraphs: [
          "The source material records recovery of the bridge and the initramfs update. It does not establish downtime, VM outage impact, rollback history or throughput measurements. No such results are inferred.",
        ],
      },
      {
        id: "lessons",
        heading: "Lessons learned",
        paragraphs: [
          "Networking depends on interface identity, bridge membership and boot-time discovery as well as IP configuration. Hardware replacement can invalidate assumptions in otherwise unchanged configuration.",
        ],
      },
      {
        id: "next",
        heading: "Next steps",
        items: [
          "Keep a sanitized recovery checklist and verify the intended bridge relationships after future hardware changes.",
          "Review console access and validation steps before modifying host networking.",
        ],
      },
    ],
  },
  {
    slug: "homelab-maintenance-operational-checklist",
    title: "Treating a Home Infrastructure Lab Like an Operated Platform",
    summary:
      "An evolving maintenance plan for a personal virtualized and containerized lab—not a scheduled automation system.",
    category: "Operations / Learning Notes",
    status: "learning",
    topics: ["Linux", "Kubernetes", "Observability", "Automation"],
    tags: ["Proxmox", "K3s", "Maintenance planning"],
    published: true,
    sections: [
      {
        id: "motivation",
        heading: "Why a checklist",
        paragraphs: [
          "Repeatable checks matter more than a one-time successful installation. This is an evolving operational plan, not evidence that each check is automated or regularly completed.",
        ],
      },
      {
        id: "checklist",
        heading: "Maintenance checklist",
        items: [
          "Review Proxmox updates, kernel changes and reboot implications.",
          "Inspect hypervisor and VM health, CPU/memory pressure and headroom.",
          "Review SSD/NVMe capacity, filesystem trim and storage health.",
          "Check K3s readiness, unhealthy pods and service exposure.",
          "Review MetalLB/NGINX Ingress configuration and endpoint reachability.",
          "Inspect monitoring availability and alerting configuration.",
          "Review Tailscale connectivity and DNS resolver ownership.",
          "Plan backups, snapshots and a restore test before risky changes.",
          "Record what changed, why, how to validate it and how to undo it.",
        ],
      },
      {
        id: "boundaries",
        heading: "Tradeoffs and evidence boundary",
        paragraphs: [
          "A checklist is useful only when matched to the actual system and impact of the change. These practices are proposed checks; no formal SLOs, scheduled automation or regularly completed restore drills are claimed.",
        ],
      },
      {
        id: "lessons",
        heading: "Lesson and next step",
        paragraphs: [
          "Make operational assumptions explicit. Apply the checklist to a future non-sensitive change and record the actual validation and recovery observations before claiming repeatability.",
        ],
      },
    ],
  },
];
// An actual draft exercises the publication gate. It is neither routed nor indexed.
labArticles.push({
  slug: "ai-platform-learning-track",
  title: "My Roadmap from Platform Engineering to AI Infrastructure",
  summary:
    "A learning draft about model-serving concepts; no finished inference deployment or measurements.",
  category: "AI Infrastructure / Learning",
  status: "learning",
  topics: ["AI Infra"],
  tags: ["Model-serving concepts"],
  published: false,
  sections: [
    {
      id: "planned",
      heading: "Proposed milestones",
      paragraphs: [
        "Choose a model and runtime, implement an isolated endpoint, then publish actual setup and measurements. All milestones remain planned.",
      ],
    },
  ],
});
export const publishedLabArticles = labArticles.filter(
  (article) => article.published,
);
export function getLabArticle(slug: string) {
  return publishedLabArticles.find((article) => article.slug === slug);
}
export function readingMinutes(article: LabArticle) {
  const words = [
    article.title,
    article.summary,
    ...article.sections.flatMap((s) => [
      s.heading,
      ...(s.paragraphs ?? []),
      ...(s.items ?? []),
      s.code ?? "",
      s.note ?? "",
    ]),
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function toLabCard(article: LabArticle): LabCardData {
  const { slug, title, summary, category, status, resolved, topics, tags } =
    article;
  return {
    slug,
    title,
    summary,
    category,
    status,
    resolved,
    topics,
    tags,
    minutes: readingMinutes(article),
  };
}
