export const profile = {
  name: "Srivardhan Reddy Kolan",
  email: "sri@srivardhanreddy.com",
  github: "https://github.com/ksrivardhanreddy",
  linkedin: "https://www.linkedin.com/in/srivardhanreddykolan",
  blog: "https://hashnode.vardhan.pro",
  resume: "/resume.pdf",
};
export const expertise = [
  {
    title: "Cloud & Kubernetes",
    description: "Build the foundation. Keep it dependable.",
    tools: ["AWS", "EKS", "Kubernetes", "Docker", "Helm", "NGINX Ingress"],
  },
  {
    title: "Infrastructure as Code",
    description: "Repeatable infrastructure, reviewed as code.",
    tools: [
      "Terraform",
      "Terragrunt",
      "Ansible",
      "CloudFormation",
      "Bash",
      "Python",
    ],
  },
  {
    title: "Delivery & GitOps",
    description: "Make the path to production safer.",
    tools: ["GitLab CI", "Jenkins", "Argo CD", "GitHub Actions", "Git"],
  },
  {
    title: "Observability & Operations",
    description: "Understand the system. Find the cause.",
    tools: ["Prometheus", "Grafana", "CloudWatch", "Linux", "RCA", "ITIL"],
  },
  {
    title: "Linux & Networking",
    description: "Operational foundations for troubleshooting systems.",
    tools: ["RHEL", "Ubuntu", "DNS", "TCP/IP", "Load balancing", "Shell"],
  },
  {
    title: "Exploring AI Infrastructure",
    description: "Personal learning, separate from production experience.",
    tools: [
      "Local LLM experiments",
      "Proxmox homelab",
      "Model serving concepts",
    ],
  },
];
export const experience = [
  {
    company: "Nemetschek Group · Bluebeam",
    role: "Technical Analyst - DevOps",
    period: "2025 — Present",
    current: true,
    summary:
      "Supporting the infrastructure behind Bluebeam products, from AWS and EKS operations to production deployment governance.",
    highlights: [
      "Designed and validated GitLab Protected Environment approval controls before downstream Terraform pipelines execute.",
      "Built and maintained Terraform/Terragrunt workflows for AWS networking, environment configuration, and reusable modules.",
      "Investigated production incidents involving Redis health, pod evictions, HPA sizing, and EC2 hardware failures.",
      "Improved operational readiness through dashboards, alerts, RCA documentation, and cross-team production reviews.",
    ],
    tools: ["AWS / EKS", "Terraform", "Terragrunt", "GitLab CI", "Prometheus"],
  },
  {
    company: "MKS Vision Pvt Ltd.",
    role: "Senior DevOps Engineer",
    period: "2024 — 2025",
    current: false,
    summary:
      "Worked on AWS migration, Kubernetes operations, and delivery automation, with a focus on reliable production platforms.",
    highlights: [
      "Led migration work for business applications moving from on-premises infrastructure to AWS.",
      "Designed and managed CI/CD pipelines for microservices and implemented Kubernetes configurations for production workloads.",
      "Established monitoring with Prometheus and Grafana and conducted root cause analysis for production incidents.",
    ],
    tools: [
      "AWS",
      "Kubernetes",
      "Terraform",
      "Jenkins",
      "Argo CD",
      "Prometheus",
    ],
  },
  {
    company: "AVYA IT Pvt Ltd.",
    role: "DevOps Engineer",
    period: "2018 — 2024",
    current: false,
    summary:
      "Helped move applications from on-premises environments to AWS and made delivery and operations more repeatable.",
    highlights: [
      "Developed Jenkins CI/CD pipelines for monolithic and microservice applications.",
      "Managed Docker and Kubernetes workloads across development, test, and production.",
      "Automated Linux provisioning and deployments with Ansible; implemented Prometheus and Grafana monitoring.",
    ],
    tools: ["AWS", "Kubernetes", "Jenkins", "Ansible", "Linux"],
  },
  {
    company: "CDK Global",
    role: "Sr. Process Associate",
    period: "2017 — 2018",
    current: false,
    summary:
      "Administered Red Hat Linux servers and supported critical environments around the clock.",
    highlights: [
      "Handled server builds, patching, users, LVM, cron, service checks, and network troubleshooting.",
      "Provided production incident response and operational documentation.",
    ],
    tools: ["RHEL", "Shell", "LVM", "Networking"],
  },
  {
    company: "Tech Mahindra",
    role: "Linux L2 Production Support Engineer",
    period: "2013 — 2015",
    current: false,
    summary:
      "Built a foundation in Linux operations and L2 application support within an ITIL environment.",
    highlights: [
      "Handled incidents, change requests, Linux deployments, and shell scripting documentation.",
    ],
    tools: ["Linux", "ITIL", "Application support"],
  },
];
export const work = [
  {
    number: "01",
    category: "DEPLOYMENT GOVERNANCE",
    id: "deployment-approval-controls",
    status: "Completed",
    contextLabel: "Professional · public-safe",
    title: "GitLab approval controls for Terraform delivery",
    description:
      "GitLab approval controls that protect infrastructure changes before a downstream pipeline starts.",
    tools: ["GitLab CI", "Terraform", "Protected Environments"],
    context:
      "Production infrastructure changes need an explicit approval boundary, including when a parent pipeline triggers downstream Terraform jobs.",
    contribution:
      "Designed and validated Protected Environment controls and parent trigger-job behavior using environment action:start before downstream execution.",
    obstacle:
      "A parent trigger job introduces a second pipeline boundary. Approval had to be checked before downstream infrastructure execution, rather than assuming a downstream job would enforce it.",
    result:
      "Validated approval controls and trigger-job behavior. This summary describes the control design; it does not claim measured incident reduction or deployment-speed gains.",
    constraints:
      "Employer configuration and logs are private. The diagram is a sanitized conceptual flow, not an employer infrastructure map.",
    nextSteps:
      "Future improvement: maintain regression scenarios for approved, rejected, and unapproved parent-to-child runs as pipeline configuration evolves.",
    takeaway:
      "Approval behavior needs to be validated across pipeline boundaries, alongside the infrastructure plan itself.",
    diagram: ["Parent pipeline", "Approval gate", "Terraform"],
  },
  {
    number: "02",
    category: "PRODUCTION RELIABILITY",
    id: "eks-incident-investigation",
    status: "Completed",
    contextLabel: "Professional · public-safe",
    title: "Investigating EKS workload and node failures",
    description:
      "Incident analysis across applications, Kubernetes, and the underlying EC2 infrastructure.",
    tools: ["EKS", "Redis", "CloudWatch", "Prometheus"],
    context:
      "Kubernetes symptoms can originate in workload sizing, application health, or the nodes hosting the cluster.",
    contribution:
      "Investigated Redis degradation, memory-driven pod evictions, HPA/request mismatches, and NodeNotReady events caused by EC2 hardware issues. Documented findings for follow-up.",
    obstacle:
      "Similar Kubernetes symptoms required investigation at different layers: application health, workload resource requests, and underlying EC2 node health.",
    result:
      "Documented investigation findings and root causes for operational follow-up. No response-time or availability metrics are claimed.",
    constraints:
      "This summarizes separate investigations; it is not a single incident or a published employer architecture.",
    nextSteps:
      "Future improvement: use sanitized investigation checklists to make recurring diagnostic steps easier to repeat.",
    takeaway:
      "Useful incident response connects workload signals to infrastructure evidence and leaves a clear RCA for the next engineer.",
    diagram: ["Signals", "Cluster analysis", "Root cause"],
  },
  {
    number: "03",
    category: "PLATFORM VISIBILITY",
    id: "kubernetes-cost-evaluation",
    status: "Completed evaluation",
    contextLabel: "Professional · public-safe",
    title: "Evaluating Kubernetes cost visibility",
    description:
      "Evaluating Kubernetes cost visibility to support better showback and chargeback conversations.",
    tools: ["OpenCost", "VictoriaMetrics", "Kubernetes"],
    context:
      "Cluster-level cost visibility helps teams understand resource ownership and discuss infrastructure spend.",
    contribution:
      "Evaluated OpenCost with VictoriaMetrics and compared cluster-level insights against existing SaaS cost tooling.",
    obstacle:
      "The evaluation compared cluster-level cost signals with existing SaaS tooling; visibility alone does not establish realized cost savings.",
    result:
      "Evaluated OpenCost with VictoriaMetrics for cost visibility. This was an evaluation, not a claim of completed chargeback rollout or savings.",
    constraints:
      "Internal cost data, configuration, and comparisons are not public.",
    nextSteps:
      "Future improvement: define acceptance criteria for data coverage and allocation accuracy before any rollout decision.",
    takeaway:
      "The focus was evaluating cost visibility patterns and the information available to teams.",
    diagram: ["Metrics", "Cost allocation", "Visibility"],
  },
];
export const certifications = [
  {
    short: "CKA",
    status: "Active",
    name: "Certified Kubernetes Administrator",
    issuer: "Cloud Native Computing Foundation",
    image: "/images/CKA.png",
    url: "https://www.credly.com/badges/53f1f54f-e8bd-4433-8ace-11816a98ee42",
  },
  {
    short: "AWS",
    status: "Active",
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    image: "/images/AWS-SAA.png",
    url: "https://www.credly.com/badges/dfb30d20-556c-4737-b9f7-f876e98e3989",
  },
  {
    short: "RHCE",
    status: "Previously earned · expired",
    name: "Red Hat Certified Engineer (v7)",
    issuer: "Red Hat",
    image: "/images/rhce.png",
    url: null, // The legacy verification service returned HTTP 500 during audit.
  },
];
