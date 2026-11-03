import {
  profile,
  experience,
  expertise,
  certifications,
  work,
} from "../portfolio";
import { publishedLabArticles } from "../lab/articles";
import { ownerCareerProfile as owner, education } from "./owner-profile";
export type CareerFaq = {
  id: string;
  category: string;
  questions: string[];
  answer: string;
  url: string;
  kind: "fact" | "boundary";
  origin: "published" | "owner-confirmed" | "public-limit";
};
const entries: CareerFaq[] = [];
function add(
  id: string,
  category: string,
  questions: string[],
  answer: string,
  url: string,
  kind: CareerFaq["kind"] = "fact",
  origin: CareerFaq["origin"] = "published",
) {
  entries.push({ id, category, questions, answer, url, kind, origin });
}
const opp = "/#opportunities",
  about = "/#about",
  jobs = "/#experience",
  certs = "/#certifications";
const kube = "/lab/self-hosted-kubernetes-proxmox",
  obs = "/lab/kubernetes-observability-grafana-prometheus",
  docker = "/lab/docker-snap-apt-daemon-conflict",
  dns = "/lab/tailscale-systemd-resolved-dns",
  nic = "/lab/proxmox-network-recovery-motherboard",
  maintenance = "/lab/homelab-maintenance-operational-checklist";
add(
  "introduction",
  "profile",
  [
    "Tell me about Vardhan",
    "Who is Srivardhan Reddy Kolan?",
    "Introduce yourself",
    "Give me a professional introduction",
  ],
  `${profile.name} is a Senior DevOps Engineer based in Hyderabad. His focus includes AWS, Kubernetes/EKS, Terraform/Terragrunt, Linux, CI/CD, observability and production reliability. His public portfolio separates professional contributions from personal engineering-lab work and AI infrastructure learning.`,
  about,
);
add(
  "experience-total",
  "career",
  [
    "years of experience?",
    "How many years of IT experience does Vardhan have?",
    "What is your total experience?",
    "How experienced is he?",
    "Total IT exp",
  ],
  `${owner.totalItExperience} and ${owner.devopsExperience}. These are Vardhan's confirmed overall experience statements, not a claim of that duration with every individual technology.`,
  opp,
  "fact",
  "owner-confirmed",
);
add(
  "devops-years",
  "career",
  [
    "How many years in DevOps?",
    "What is your relevant DevOps experience?",
    "Devops exp?",
    "How long have you worked in DevOps?",
  ],
  `${owner.devopsExperience}, within ${owner.totalItExperience}. Technology-specific tenure such as exact years with EKS or Terraform is not separately published.`,
  opp,
  "fact",
  "owner-confirmed",
);
add(
  "career-start",
  "career",
  [
    "When did your career begin?",
    "What was your first IT role?",
    "How did he start in technology?",
  ],
  "The published career timeline begins with Linux L2 Production Support Engineer at Tech Mahindra, 2013–2015. It then lists CDK Global, AVYA IT, MKS Vision and Nemetschek Group · Bluebeam. The timeline uses years rather than precise joining/leaving months.",
  jobs,
);
add(
  "career-timeline",
  "career",
  [
    "Which companies has Vardhan worked for?",
    "Show the employment history",
    "List all employers",
    "Summarize your career timeline",
  ],
  experience
    .map((job) => `${job.company}: ${job.role}, ${job.period}.`)
    .join(" "),
  jobs,
);
const current = experience[0];
add(
  "current-role",
  "career",
  [
    "Where do you work now?",
    "What is your current designation?",
    "Who is his current employer?",
    "Is Vardhan at Bluebeam?",
  ],
  `His current published role is ${current.role} at ${current.company}, ${current.period}. The portfolio's Senior DevOps & Platform Engineer headline describes his professional focus; the employer-specific title remains Technical Analyst - DevOps.`,
  jobs,
);
add(
  "current-scope",
  "career",
  [
    "What are your current responsibilities?",
    "What does Vardhan do at Bluebeam?",
    "Describe the current job scope",
  ],
  `${current.summary} ${current.highlights.join(" ")}`,
  jobs,
);
for (const [index, alias] of [
  [0, "Bluebeam"],
  [1, "MKS Vision"],
  [2, "AVYA IT"],
  [3, "CDK Global"],
  [4, "Tech Mahindra"],
] as const) {
  const job = experience[index];
  add(
    `employer-${index + 1}`,
    "employers",
    [
      `What did you do at ${alias}?`,
      `What was your role at ${alias}?`,
      `${alias} experience and dates`,
    ],
    `${job.role} at ${job.company}, ${job.period}. ${job.summary} ${job.highlights.slice(0, 2).join(" ")}`,
    jobs,
  );
}
add(
  "current-dates",
  "career",
  [
    "When did you join Bluebeam?",
    "Since when are you at Nemetschek?",
    "How long have you worked at Bluebeam?",
  ],
  "The approved public timeline lists Nemetschek Group · Bluebeam as 2025–Present. Precise joining months are not published, so the assistant does not calculate exact tenure at this employer.",
  jobs,
);
add(
  "career-gaps",
  "career",
  ["Could you explain career breaks?", "Explain employment gap"],
  "For detailed career discussions, please contact Vardhan directly. His published professional experience is available on the portfolio.",
  "/#contact",
  "boundary",
  "owner-confirmed",
);
add(
  "availability",
  "recruiting",
  [
    "Are you looking for a job?",
    "Is Vardhan open to opportunities?",
    "Are you available for interviews?",
    "Can recruiters approach him?",
  ],
  `${owner.availability}. Recruiters can contact him at ${profile.email} or through his LinkedIn profile to discuss a suitable role and arrange an interview.`,
  opp,
  "fact",
  "owner-confirmed",
);
add(
  "notice-period",
  "recruiting",
  [
    "What is your notice period?",
    "How soon can you join?",
    "When could Vardhan start?",
    "Is your notice negotiable?",
    "Are you an immediate joiner?",
  ],
  `His notice period is ${owner.noticePeriod}. An exact joining date should be agreed directly with him; he is not presented as an immediate joiner.`,
  opp,
  "fact",
  "owner-confirmed",
);
add(
  "work-arrangement",
  "recruiting",
  [
    "Are you open to remote work?",
    "Would you accept hybrid or office work?",
    "What work arrangements do you prefer?",
    "Remote hybrid or onsite?",
  ],
  `${owner.workPreferences}. Any specific role's working arrangement should be discussed directly.`,
  opp,
  "fact",
  "owner-confirmed",
);
add(
  "india-location",
  "recruiting",
  [
    "What is your preferred location in India?",
    "Are you based in Hyderabad?",
    "Which Indian city do you prefer?",
    "Is Bangalore your preferred location?",
  ],
  "Vardhan is based in Hyderabad and Hyderabad is his preferred work location within India. He is open to remote, hybrid and on-site arrangements. Do not infer a preference for another Indian city without discussing the role with him.",
  opp,
  "fact",
  "owner-confirmed",
);
add(
  "relocation",
  "recruiting",
  [
    "Are you willing to relocate abroad?",
    "Would you relocate to another country?",
    "Are overseas opportunities welcome?",
    "Is international relocation possible?",
  ],
  "Vardhan is open to relocation to other countries. He has not published a fixed country shortlist, and employer sponsorship is needed for roles outside India. Exact relocation arrangements should be discussed for the specific opportunity.",
  opp,
  "fact",
  "owner-confirmed",
);
add(
  "sponsorship",
  "recruiting",
  [
    "Do you need visa sponsorship?",
    "What is your work authorization?",
    "Can he work outside India without sponsorship?",
    "Does Vardhan need employer sponsorship abroad?",
  ],
  `${owner.sponsorship}. This is his stated sponsorship requirement, not a determination of eligibility for a particular visa or country. A recruiter should confirm the requirements of the specific role directly with him.`,
  opp,
  "fact",
  "owner-confirmed",
);
add(
  "job-change",
  "recruiting",
  [
    "Why are you looking for a change?",
    "Why do you want a new job?",
    "What motivates your next career move?",
    "Why leave your current role?",
  ],
  `${owner.motivation}. This does not imply dissatisfaction with a particular employer or an immediate departure.`,
  opp,
  "fact",
  "owner-confirmed",
);
add(
  "target-roles",
  "role-fit",
  [
    "What roles suit Vardhan?",
    "Is he a fit for Senior DevOps?",
    "What kind of engineer is he?",
    "Which positions align with his background?",
  ],
  "His published AWS, Kubernetes/EKS, infrastructure-as-code, CI/CD and operations work is relevant to Senior DevOps, cloud infrastructure and platform-engineering roles. AI infrastructure is an emerging learning direction, not an established production-inference specialty.",
  about,
);
add(
  "platform-fit",
  "role-fit",
  [
    "Could he be a Platform Engineer?",
    "Why consider Vardhan for platform engineering?",
    "What platform skills does he bring?",
  ],
  "The public examples show repeatable infrastructure, protected deployment workflows, Kubernetes troubleshooting, observability and operational documentation. Those are relevant foundations for platform engineering. Exact ownership scope, organizational scale and role expectations should be assessed directly rather than inferred from tool lists.",
  about,
);
add(
  "sre-fit",
  "role-fit",
  [
    "Does Vardhan have SRE experience?",
    "Is he suitable for a reliability role?",
    "What reliability engineering background does he have?",
  ],
  "His documented work includes production incident investigation, root cause analysis, dashboards, alerting and deployment controls. Those capabilities are relevant to reliability work. The public history does not list an SRE job title, formal SLO ownership or error-budget outcomes.",
  "/#eks-incident-investigation",
);
add(
  "leadership",
  "role-fit",
  [
    "Have you managed a team?",
    "What is your team size?",
    "Does he mentor engineers?",
    "Describe leadership experience",
  ],
  "The approved public description is limited to technical contributions, including infrastructure workflows, migration work, deployment controls and incident investigation. People-management responsibilities, direct-report counts and mentoring scope are not published; please discuss those directly with Vardhan.",
  jobs,
  "boundary",
  "owner-confirmed",
);
add(
  "education",
  "education",
  [
    "What is your education?",
    "What degree does Vardhan hold?",
    "Where did he study?",
    "Academic qualifications?",
  ],
  `${education.degree}, ${education.institution}. A graduation year, GPA and additional degree details are not published in this portfolio.`,
  certs,
);
add(
  "graduation-details",
  "education",
  [
    "What year did you graduate?",
    "What was your GPA?",
    "Is he a masters graduate?",
  ],
  "The portfolio lists a bachelor's degree in Computer Science and Mathematics from Osmania University, Hyderabad. It does not publish a graduation year, GPA or master's degree; those details must not be invented.",
  certs,
  "boundary",
  "public-limit",
);
add(
  "skills-overview",
  "skills",
  [
    "What are your strongest technical skills?",
    "What is your technology stack?",
    "Which tools does Vardhan use?",
    "List his technical capabilities",
  ],
  expertise
    .filter((e) => !e.title.includes("AI"))
    .map((e) => `${e.title}: ${e.tools.join(", ")}.`)
    .join(" "),
  about,
);
const toolFacts: [string, string[], string][] = [
  [
    "aws",
    [
      "What AWS experience do you have?",
      "How has he worked with Amazon Web Services?",
      "Which cloud provider is documented?",
    ],
    "AWS is the documented professional cloud platform, including EKS operations and Terraform/Terragrunt infrastructure workflows. The public experience also describes migration of applications from on-premises infrastructure to AWS. The portfolio does not establish a completed multi-cloud platform.",
  ],
  [
    "eks",
    [
      "What is your EKS experience?",
      "Have you worked with Amazon EKS in production?",
      "How do you troubleshoot EKS?",
    ],
    "Professional work includes AWS/EKS operations and investigation of Redis degradation, pod memory evictions, HPA/request mismatches and EC2 node-health failures. The public case study is a generalized summary; internal cluster details and logs are not available.",
  ],
  [
    "terraform",
    [
      "How have you used Terraform?",
      "Explain your IaC background",
      "What infrastructure-as-code experience does he have?",
    ],
    "Vardhan has built and maintained Terraform/Terragrunt workflows for AWS changes, including reusable modules and environment configuration. A professional case study describes approval controls before downstream Terraform execution. Public configuration, infrastructure state and measured provisioning gains are not supplied.",
  ],
  [
    "terragrunt",
    [
      "Have you used Terragrunt?",
      "Where does Terragrunt appear in your work?",
      "Terraform or Terragrunt experience?",
    ],
    "Terragrunt is documented alongside Terraform in professional AWS infrastructure workflows. The public material mentions environment configuration and reusable modules, but does not publish a detailed Terragrunt repository layout.",
  ],
  [
    "ansible",
    [
      "What is your Ansible experience?",
      "How did you automate Linux provisioning?",
      "Which configuration-management tool is listed?",
    ],
    "Ansible is documented for Linux provisioning and deployment automation, including AVYA IT work. Bash and Python are also listed for automation. No public playbook repository, fleet size or percentage time saving is claimed.",
  ],
  [
    "cloudformation",
    [
      "Do you know CloudFormation?",
      "Is AWS CloudFormation in your skills?",
      "What CloudFormation project can I inspect?",
    ],
    "CloudFormation appears in the published infrastructure-as-code skills. The portfolio gives more concrete project detail for Terraform/Terragrunt; it does not supply a dedicated public CloudFormation case study.",
  ],
  [
    "kubernetes",
    [
      "What Kubernetes experience do you have?",
      "Have you used k8s?",
      "Explain his container orchestration background",
    ],
    "Professional experience covers Kubernetes/EKS operations, workload configurations and troubleshooting. Separately, his personal Proxmox lab uses K3s with a control-plane node and a worker. Personal lab topology is not presented as employer production architecture.",
  ],
  [
    "docker",
    [
      "What Docker experience do you have?",
      "How have you used containers?",
      "Does he know Docker Engine?",
    ],
    "Docker appears in professional container-workload experience and personal lab work. A documented personal Ubuntu case study explains how separate Snap and apt Docker installations caused a misleading empty docker ps view, and how daemon ownership was investigated.",
  ],
  [
    "helm",
    [
      "Have you used Helm?",
      "Where is Helm demonstrated?",
      "How did he install Kubernetes add-ons?",
    ],
    "Helm appears in the published skill set and personal K3s platform. The lab monitoring stack uses kube-prometheus-stack, with Grafana accessed through ingress. No public Helm release repository or production release count is supplied.",
  ],
  [
    "nginx",
    [
      "What ingress controller is in your lab?",
      "Why did you use NGINX Ingress?",
      "How is HTTP traffic routed in K3s?",
    ],
    "The personal lab disabled bundled Traefik and ServiceLB, and used NGINX Ingress for HTTP routing. MetalLB supplies local LoadBalancer service addresses; ingress routes traffic toward Kubernetes Services and workload pods.",
  ],
  [
    "linux",
    [
      "What is your Linux background?",
      "Which operating systems have you supported?",
      "How strong is his systems administration experience?",
    ],
    "The public career begins with Linux L2 production support and includes Red Hat Linux administration. Published responsibilities include server builds, patching, users, LVM, cron, service checks, shell scripting and networking troubleshooting.",
  ],
  [
    "python-shell",
    [
      "Which programming languages do you use?",
      "Do you write Python or Bash?",
      "What scripting experience is documented?",
    ],
    "Python, Bash and shell scripting are documented for infrastructure and operations automation. This supports a scripting/automation background; it does not establish production ownership of a large Python application or advanced application-development specialization.",
  ],
  [
    "networking",
    [
      "What networking experience does he have?",
      "Has he worked with DNS and load balancing?",
      "How does he diagnose network problems?",
    ],
    "The public skills include DNS, TCP/IP and load balancing. Personal troubleshooting stories discuss DNS resolver ownership and recovering Proxmox bridge networking after hardware changes. No private addressing or home-network endpoints are published.",
  ],
  [
    "observability",
    [
      "What monitoring tools have you used?",
      "What observability experience is documented?",
      "Do you use metrics and dashboards?",
    ],
    "Prometheus, Grafana and CloudWatch are documented in professional operations. The personal K3s lab separately uses kube-prometheus-stack and Grafana ingress. Public examples cover investigation and visibility, without claiming measured uptime or a hardened external alerting service.",
  ],
  [
    "prometheus",
    [
      "How have you used Prometheus?",
      "Is Prometheus deployed in the homelab?",
      "Which metrics stack does he know?",
    ],
    "Prometheus is documented in professional monitoring and the personal kube-prometheus-stack installation. The lab case study describes cluster visibility; retention, persistent storage and external alert delivery remain unverified.",
  ],
  [
    "grafana",
    [
      "What Grafana work have you done?",
      "Are there Grafana dashboards?",
      "How is Grafana accessed in the lab?",
    ],
    "Grafana is listed in professional monitoring work, and the personal K3s case study records Grafana access through NGINX Ingress. No original dashboard screenshots have been supplied to the public case study, and hardened authentication/TLS is not inferred from ingress alone.",
  ],
  [
    "cloudwatch",
    [
      "What is your CloudWatch experience?",
      "Does he use AWS monitoring?",
      "How is CloudWatch connected to incident work?",
    ],
    "CloudWatch appears in professional AWS/EKS operations and in the generalized production-reliability case study. The portfolio does not publish actual employer log streams, dashboard URLs, alert rules or internal identifiers.",
  ],
  [
    "cicd",
    [
      "What CI/CD tools have you used?",
      "Describe pipeline automation experience",
      "Which delivery systems does he know?",
    ],
    "The published delivery tools include GitLab CI, Jenkins, Argo CD, GitHub Actions and Git. Concrete professional examples include Jenkins pipelines and GitLab Protected Environment controls for downstream Terraform workflows.",
  ],
  [
    "jenkins",
    [
      "What Jenkins experience do you have?",
      "Have you built Jenkins pipelines?",
      "Which roles involved Jenkins?",
    ],
    "Jenkins is documented in AVYA IT delivery workflows and MKS Vision's technology stack. The public work includes CI/CD for monolithic and microservice applications, without publishing employer Jenkinsfiles, plugins or job counts.",
  ],
  [
    "gitlab",
    [
      "What is your GitLab CI experience?",
      "How did he implement deployment approvals?",
      "What protected environment work is documented?",
    ],
    "The documented professional example designed and validated GitLab Protected Environment controls, including parent trigger-job behavior before downstream Terraform jobs execute. Approval behavior was checked across pipeline boundaries; no proprietary pipeline configuration is public.",
  ],
  [
    "github-actions",
    [
      "Have you used GitHub Actions?",
      "Is GitHub Actions part of your stack?",
      "Can I see a GitHub Actions achievement?",
    ],
    "GitHub Actions is listed among delivery skills. The portfolio's detailed professional pipeline story focuses on GitLab, so it does not supply a separate quantified GitHub Actions accomplishment or public workflow case study.",
  ],
  [
    "argocd",
    [
      "Have you worked with Argo CD?",
      "What GitOps experience do you have?",
      "Is Argo CD running in the personal lab?",
    ],
    "Argo CD appears in the professional MKS Vision stack and GitOps skills. A personal GitOps-controlled K3s application is still planned; professional familiarity must not be described as a completed personal Argo CD or Flux deployment.",
  ],
  [
    "itil",
    [
      "Do you have ITIL operations experience?",
      "What process experience is documented?",
      "Have you handled incidents and changes?",
    ],
    "The Tech Mahindra/Linux support history describes an ITIL environment with incidents, changes and operational documentation. This is operational process experience, not a claim of an ITIL certification.",
  ],
];
for (const [id, questions, answer] of toolFacts)
  add(`skill-${id}`, "technical-skills", questions, answer, about);

for (const cert of certifications)
  add(
    `cert-${cert.short.toLowerCase()}`,
    "certifications",
    [
      `Does Vardhan hold ${cert.short}?`,
      `What is the status of his ${cert.short} certification?`,
      `Is ${cert.short} currently active?`,
    ],
    `${cert.name}, issued by ${cert.issuer}: ${cert.status}. ${cert.short === "RHCE" ? "This is a historical, expired credential; its verification record remains linked on the portfolio." : "An exact expiry date is not published in the portfolio."}`,
    certs,
  );
for (const item of work) {
  add(
    `professional-${item.id}`,
    "professional-projects",
    [`Explain ${item.title}`, `Describe the ${item.title} project`],
    `Professional work: ${item.description} ${item.contribution} ${item.result} ${item.constraints}`,
    `/#${item.id}`,
  );
}
for (const article of publishedLabArticles) {
  const overview = article.sections.find((s) => s.paragraphs?.length);
  add(
    `personal-${article.slug}`,
    "personal-lab",
    [`Explain ${article.title}`, `Tell me about ${article.title}`],
    `Personal lab — ${article.status}. ${overview?.paragraphs?.slice(0, 2).join(" ") ?? article.title} This is personal hands-on work, not an employer production deployment.`,
    `/lab/${article.slug}`,
  );
}
for (const [id, questions, answer, url] of [
  [
    "lab-kubernetes",
    [
      "How is your personal Kubernetes lab organized?",
      "Describe your Proxmox K3s architecture",
    ],
    "Personal lab: Proxmox hosts K3s with a control-plane node and a worker. NGINX Ingress routes HTTP traffic, MetalLB provides local LoadBalancer addresses, and kube-prometheus-stack provides monitoring. This does not establish production high availability.",
    kube,
  ],
  [
    "lab-monitoring",
    [
      "What monitoring runs in your home lab?",
      "Describe personal lab observability",
    ],
    "Personal lab: kube-prometheus-stack supplies Prometheus and Grafana, with Grafana reached through ingress. Public documentation does not verify persistent storage, retention, hardened TLS or external alert delivery.",
    obs,
  ],
  [
    "docker-conflict",
    [
      "What caused the empty docker ps output?",
      "Explain the Snap and apt Docker conflict",
    ],
    "Personal troubleshooting: separate Snap and apt Docker installations created confusion about which daemon owned the running containers. The case study describes investigating daemon ownership rather than assuming the containers had disappeared.",
    docker,
  ],
  [
    "dns-recovery",
    [
      "What DNS problem did you troubleshoot?",
      "Explain your Tailscale resolver issue",
    ],
    "Personal troubleshooting: the documented issue concerned resolver ownership involving Tailscale and systemd-resolved. The published case study explains the diagnosis and correction without disclosing private network endpoints.",
    dns,
  ],
  [
    "bridge-recovery",
    [
      "How did you recover networking after replacing the motherboard?",
      "Explain Proxmox bridge recovery",
    ],
    "Personal troubleshooting: hardware changes affected network-interface identity and the Proxmox bridge mapping. The case study describes restoring the correct interface-to-bridge configuration and validating connectivity.",
    nic,
  ],
  [
    "maintenance",
    [
      "How do you maintain the home lab?",
      "What does your operational checklist cover?",
    ],
    "The personal lab maintenance checklist covers checking platform health and validating workloads and connectivity after changes. It is a published operating checklist, not evidence of a measured availability SLA or a completed disaster-recovery exercise.",
    maintenance,
  ],
  [
    "learning-status",
    [
      "Have you deployed production AI infrastructure?",
      "What AI infrastructure have you completed?",
      "Are you running production LLM inference?",
    ],
    "AI infrastructure, model serving and related GitOps experiments are learning or planned directions in the public portfolio. No completed employer production LLM deployment, GPU fleet ownership or inference performance measurement is claimed.",
    "/lab",
  ],
  [
    "technology-tenure",
    [
      "How many years of Kubernetes experience do you have?",
      "How many years with Terraform?",
      "How many years with AWS?",
    ],
    "Vardhan confirms 10+ years of IT experience and 8+ years in DevOps. Exact years with each individual technology are not published; please ask him directly rather than treating the overall DevOps total as tool-specific tenure.",
    opp,
  ],
  [
    "measurements",
    [
      "What cost savings have you achieved?",
      "What uptime improvement can you prove?",
      "Do you have quantified project results?",
    ],
    "The public case studies describe technical contributions and qualitative outcomes. Verified cost-saving percentages, availability improvements and infrastructure scale measurements are not published; the assistant cannot supply invented figures.",
    "/#work",
  ],
  [
    "behavioral",
    [
      "Tell me about a difficult technical problem",
      "Give an example of troubleshooting under pressure",
    ],
    "A documented professional example is EKS incident investigation involving Redis degradation, pod evictions, workload requests and node health. Personal troubleshooting examples are separately documented in the Engineering Lab. Interview-specific details and personal reflections should be discussed directly with Vardhan.",
    "/#eks-incident-investigation",
  ],
  [
    "salary-boundary",
    ["What is your expected salary?", "What is your current compensation?"],
    "Compensation details are not published. Please contact Vardhan directly to discuss the role and compensation.",
    "/#contact",
  ],
  [
    "references",
    ["Can you provide references?", "Can you share client contacts?"],
    "References and client contact details are not published. Please contact Vardhan directly for any appropriate reference discussion.",
    "/#contact",
  ],
  [
    "contact-link",
    ["How can I reach Vardhan?", "How do I arrange an interview?"],
    `Contact Vardhan at ${profile.email}, or use his LinkedIn profile linked from the portfolio. Interview times must be agreed directly; this assistant cannot book meetings.`,
    "/#contact",
  ],
] as [string, string[], string, string][])
  add(id, "career-details", questions, answer, url, "boundary", "public-limit");
export const careerFaq = entries;
