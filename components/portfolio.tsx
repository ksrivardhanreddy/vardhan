"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LabCard } from "@/components/lab/lab-card";
import { ownerCareerProfile, education } from "@/content/ai/owner-profile";
import type { LabCardData } from "@/content/lab/types";
import { CommandDemo, commandDemos } from "@/components/command-demo";
import { useTheme } from "next-themes";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  Cloud,
  Code2,
  Copy,
  ExternalLink,
  GitBranch,
  Github,
  Layers3,
  Linkedin,
  Menu,
  Moon,
  Pause,
  Play,
  Radio,
  Server,
  ShieldCheck,
  Sun,
  Terminal,
  X,
} from "lucide-react";
import {
  certifications,
  experience,
  expertise,
  profile,
  work,
} from "@/content/portfolio";
const navigation = [
  ["About", "about"],
  ["Experience", "experience"],
  ["Selected Work", "work"],
  ["The Lab", "/lab"],
];
const skillIcons = [Cloud, Code2, GitBranch, Radio, Server, Terminal];
function Infrastructure() {
  return (
    <div
      className="infra-panel"
      aria-label="Illustrative delivery workflow from Git through approval controls to AWS and Kubernetes, with observability"
    >
      <div className="panel-top">
        <span>
          <span className="status-dot" /> PLATFORM OVERVIEW
        </span>
        <span>illustrative architecture</span>
      </div>
      <div className="infra-canvas">
        <div className="infra-source">
          <Github size={19} />
          <span>git push</span>
          <span className="code-muted">main</span>
        </div>
        <div className="connector" />
        <div className="infra-pipeline">
          <GitBranch size={18} />
          <div>
            <strong>Build. Validate. Approve.</strong>
            <small>CI/CD · production controls</small>
          </div>
          <ShieldCheck size={18} />
        </div>
        <div className="connector" />
        <div className="cloud-boundary">
          <div className="boundary-label">
            <Cloud size={13} /> AWS CLOUD <span>managed infrastructure</span>
          </div>
          <div className="cluster-label">
            <Layers3 size={17} /> Kubernetes / EKS
          </div>
          <div className="node-grid">
            {["Workload 01", "Workload 02", "Workload 03"].map((label) => (
              <div className="infra-node" key={label}>
                <div className="pod-grid">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="cluster-footer">
            <span>
              <span className="status-dot" /> health & scaling
            </span>
            <span>Helm · Terraform</span>
          </div>
        </div>
        <div className="connector" />
        <div className="infra-observe">
          <Radio size={17} />
          <span>Metrics. Alerts. Understanding.</span>
          <span className="signal-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
      <div className="panel-bottom">
        <span>infrastructure as code</span>
        <span className="orange">human judgment included ↗</span>
      </div>
    </div>
  );
}
export function Portfolio({ labFeatures }: { labFeatures: LabCardData[] }) {
  const { resolvedTheme, setTheme } = useTheme();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const pageEndRef = useRef<HTMLElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setAtBottom(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (pageEndRef.current) observer.observe(pageEndRef.current);
    return () => observer.disconnect();
  }, []);
  function jumpPage() {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: atBottom ? 0 : document.documentElement.scrollHeight,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }
  const [mounted, setMounted] = useState(false),
    [menuOpen, setMenuOpen] = useState(false),
    [copied, setCopied] = useState(false),
    [animationsPaused, setAnimationsPaused] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(id);
  }, [copied]);
  useEffect(() => {
    if (!menuOpen) return;
    mobileNavRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [menuOpen]);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }
  return (
    <div className={animationsPaused ? "portfolio motion-paused" : "portfolio"}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-inner">
          <a className="wordmark" href="#home" aria-label="Vardhan home">
            V<span className="orange">.</span>
            <span className="wordmark-name">
              Vardhan<span className="code-muted"> / </span>Pro
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map(([label, id]) => (
              <a key={id} href={id.startsWith("/") ? id : `#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="icon-button motion-control"
              aria-label={
                animationsPaused ? "Play animations" : "Pause animations"
              }
              aria-pressed={animationsPaused}
              onClick={() => setAnimationsPaused(!animationsPaused)}
            >
              {animationsPaused ? <Play size={17} /> : <Pause size={17} />}
            </button>
            <button
              className="icon-button"
              aria-label={
                mounted && resolvedTheme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {mounted && resolvedTheme === "light" ? (
                <Moon size={17} />
              ) : (
                <Sun size={17} />
              )}
            </button>
            <a href="#contact" className="nav-contact">
              Let’s Talk <ArrowUpRight size={15} />
            </a>
            <button
              ref={menuButtonRef}
              className="icon-button menu-button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            ref={mobileNavRef}
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {[...navigation, ["Contact", "contact"]].map(([label, id]) => (
              <a
                key={id}
                href={id.startsWith("/") ? id : `#${id}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </nav>
        )}
      </header>
      <main id="main">
        <section id="home" className="hero section-shell">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" /> SENIOR DEVOPS ENGINEER ·
              HYDERABAD, INDIA
            </div>
            <div className="hero-identity">
              <div className="portrait-ring">
                <div className="portrait-crop">
                  <Image
                    src="/images/vardhan-portrait.webp"
                    alt="Srivardhan Reddy Kolan"
                    width={184}
                    height={184}
                    priority
                    sizes="(max-width: 520px) 144px, 184px"
                  />
                </div>
                <span className="portrait-badge">
                  <ShieldCheck size={20} />
                </span>
              </div>
              <div>
                <p className="intro">
                  Hi, I’m <span className="orange">Vardhan.</span>
                </p>
                <p className="identity-name">Srivardhan Reddy Kolan</p>
                <p className="identity-role">Senior DevOps Engineer</p>
              </div>
            </div>
            <h1>
              Senior DevOps &amp;
              <br />
              <span>Platform Engineer.</span>
            </h1>
            <p className="hero-specialties">
              AWS · Kubernetes · Terraform · Linux · Cloud Infrastructure
            </p>
            <p className="hero-description">
              Building reliable cloud platforms, automating infrastructure, and
              solving production engineering challenges.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                View Projects <ArrowUpRight size={17} />
              </a>
              <a
                className="button button-secondary"
                href={profile.resume}
                download
              >
                Download Résumé <ArrowDown size={16} />
              </a>
            </div>
            <div className="hero-secondary-links">
              <a className="text-link" href="#contact">
                Get in Touch <ArrowUpRight size={16} />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
            <div className="hero-footnote">
              <div>
                <strong>Currently at Nemetschek Group · Bluebeam</strong>
                <span>Cloud infrastructure. Real production problems.</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <Infrastructure />
            <div className="visual-caption">
              <span>01 / THE WAY I THINK</span>
              <span>Design → automate → observe → improve</span>
            </div>
          </div>
        </section>
        <div className="credentials-strip">
          <div className="section-shell strip-inner">
            <div className="strip-label">BUILT ON EXPERIENCE</div>
            <div>
              <strong>
                Linux <span>& production operations</span>
              </strong>
            </div>
            <div>
              <strong>
                Cloud <span>& platform engineering</span>
              </strong>
            </div>
            <div className="strip-cert">
              <ShieldCheck size={19} />
              <strong>
                AWS <span>·</span> CKA
              </strong>
            </div>
          </div>
        </div>
        <section
          id="about"
          className="section-shell section-space about-section"
        >
          <div className="section-heading">
            <span className="eyebrow">01 / THE APPROACH</span>
            <h2>
              Good infrastructure
              <br />
              makes room for <em>good work.</em>
            </h2>
          </div>
          <div className="about-copy">
            <p>
              I’m {profile.name}, a Senior DevOps Engineer based in Hyderabad.
              My path started in Linux and application support, then grew into
              cloud infrastructure, Kubernetes, and platform engineering.
            </p>
            <p>
              I like the work between a system working once and a system working
              reliably: repeatable infrastructure, thoughtful release controls,
              useful monitoring, and a clear understanding of what went wrong.
            </p>
            <a
              className="text-link"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              More about my journey <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="expertise-grid">
            {expertise.map((item, index) => {
              const Icon = skillIcons[index];
              return (
                <article className="expertise-card" key={item.title}>
                  <Icon size={22} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="tags">
                    {item.tools.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        <section id="experience" className="section-space experience-section">
          <div className="section-shell">
            <div className="section-heading heading-row">
              <div>
                <span className="eyebrow">02 / THE JOURNEY</span>
                <h2>
                  Built through
                  <br />
                  <em>hands-on experience.</em>
                </h2>
              </div>
              <p>
                From Linux fundamentals to production platforms.
                <br />A career spent close to the systems.
              </p>
            </div>
            <div className="timeline">
              {experience.map((job, index) => (
                <article
                  className={`experience-item ${job.current ? "current" : ""}`}
                  key={job.company}
                >
                  <div className="experience-date">
                    <span className="timeline-dot" />
                    <span>{job.period}</span>
                    {job.current && (
                      <span className="current-label">CURRENT</span>
                    )}
                  </div>
                  <div className="experience-body">
                    <div className="job-heading">
                      <h3>{job.company}</h3>
                      <span className="job-index">0{index + 1}</span>
                    </div>
                    <p className="job-role">{job.role}</p>
                    <p className="job-summary">{job.summary}</p>
                    <details className="job-details" open={job.current}>
                      <summary>
                        Contributions <ChevronDown size={15} />
                      </summary>
                      <ul>
                        {job.highlights.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </details>
                    <div className="tags">
                      {job.tools.map((tool) => (
                        <span key={tool}>{tool}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="work" className="section-shell section-space">
          <div className="section-heading heading-row">
            <div>
              <span className="eyebrow">03 / SELECTED WORK</span>
              <h2>
                Real systems.
                <br />
                <em>Considered decisions.</em>
              </h2>
            </div>
            <p>
              A closer look at problems I’ve worked on.
              <br />
              Based on my professional experience.
            </p>
          </div>
          <div className="work-grid">
            {work.map((item, index) => (
              <article className="work-card" id={item.id} key={item.number}>
                <div className="work-card-top">
                  <span>{item.category}</span>
                  <span>/{item.number}</span>
                </div>
                <div
                  className="mini-flow"
                  aria-label={item.diagram.join(" to ")}
                >
                  {item.diagram.map((step, index) => (
                    <div key={step}>
                      {index > 0 && <span className="flow-arrow">→</span>}
                      <span
                        className={
                          index === 1 ? "flow-node flow-active" : "flow-node"
                        }
                      >
                        {index === 1 ? (
                          <ShieldCheck size={16} />
                        ) : index === 0 ? (
                          <GitBranch size={16} />
                        ) : (
                          <Layers3 size={16} />
                        )}
                        <span>{step}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <CommandDemo
                  {...commandDemos[index]}
                  paused={animationsPaused}
                />
                <p className="project-status">
                  {item.status} · {item.contextLabel}
                </p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="tags">
                  {item.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
                <details className="work-details">
                  <summary>
                    Explore the work <span className="details-plus">+</span>
                  </summary>
                  <div>
                    <h4>The context</h4>
                    <p>{item.context}</p>
                    <h4>My contribution</h4>
                    <p>{item.contribution}</p>
                    <h4>Engineering obstacle</h4>
                    <p>{item.obstacle}</p>
                    <h4>Result and evidence boundary</h4>
                    <p>{item.result}</p>
                    <h4>Constraints</h4>
                    <p>{item.constraints}</p>
                    <h4>Future improvements</h4>
                    <p>{item.nextSteps}</p>
                    <h4>The takeaway</h4>
                    <p>{item.takeaway}</p>
                  </div>
                </details>
              </article>
            ))}
          </div>
        </section>
        <section id="lab" className="section-shell lab-section">
          <div className="lab-copy">
            <span className="eyebrow">
              <span className="status-dot" /> 04 / ALWAYS EXPERIMENTING
            </span>
            <h2>
              Production mindset.
              <br />
              <em>Home lab curiosity.</em>
            </h2>
            <p>
              A Proxmox-based playground for learning by doing. I explore
              Kubernetes, self-hosted tools, automation, and local LLMs—then
              bring that practical understanding back to platform engineering.
            </p>
            <div className="tags">
              <span>Proxmox</span>
              <span>Kubernetes</span>
              <span>Docker</span>
              <span>Local LLMs</span>
              <span>Observability</span>
            </div>
            <Link className="text-link" href="/lab">
              Explore the Engineering Lab <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="lab-terminal">
            <div className="terminal-title">
              <span>
                <i />
                <i />
                <i />
              </span>
              <span>vardhan@homelab ~</span>
              <Terminal size={14} />
            </div>
            <CommandDemo
              command="cat learning.md"
              output={[
                "Proxmox: Virtualization & Self-hosting",
                "Kubernetes: Containers & Orchestration",
                "Observability: Metrics & Dashboards",
                "Local LLMs: Exploring AI Infrastructure",
              ]}
              paused={animationsPaused}
            />
            <div className="terminal-footer">
              <Server size={13} /> PERSONAL LAB / EXPLORATION, NOT PRODUCTION
            </div>
          </div>
        </section>
        <section
          className="section-shell lab-home-featured"
          aria-labelledby="lab-featured-title"
        >
          <p className="eyebrow">PERSONAL ENGINEERING LAB</p>
          <h2 id="lab-featured-title">Built, investigated, documented.</h2>
          <p>
            Personal infrastructure stories, separate from professional Selected
            Work. Historical activity, not a live service inventory.
          </p>
          <div className="lab-card-grid">
            {labFeatures.map((article) => (
              <LabCard article={article} key={article.slug} />
            ))}
          </div>
          <Link className="button button-secondary" href="/lab">
            Explore the Engineering Lab <ArrowUpRight size={17} />
          </Link>
        </section>
        <section
          id="certifications"
          className="section-shell section-space certification-section"
        >
          <div className="cert-heading">
            <span className="eyebrow">05 / THE FOUNDATIONS</span>
            <h2>
              Learning, <em>validated.</em>
            </h2>
          </div>
          <div className="cert-grid">
            {certifications.map((cert) => {
              const Card = cert.url ? "a" : "article";
              return (
                <Card
                  className="cert-card"
                  href={cert.url ?? undefined}
                  key={cert.short}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src={cert.image} alt="" width="68" height="68" />
                  <div>
                    <span className="cert-short">{cert.short}</span>
                    <h3>{cert.name}</h3>
                    <p>{cert.issuer}</p>
                    <p className="credential-status">{cert.status}</p>
                    {cert.url && (
                      <span className="verify">
                        Verify credential <ExternalLink size={12} />
                      </span>
                    )}
                  </div>
                  {cert.url && (
                    <ArrowUpRight className="cert-arrow" size={17} />
                  )}
                </Card>
              );
            })}
          </div>
          <div className="education">
            <span>EDUCATION</span>
            <p>
              {education.degree} <span>· {education.institution}</span>
            </p>
          </div>
        </section>
        <section id="contact" className="contact-section">
          <div className="section-shell">
            <div className="eyebrow">06 / WHAT’S NEXT?</div>
            <div className="contact-layout">
              <div>
                <h2>
                  Let’s build something
                  <br />
                  <em>that holds up.</em>
                </h2>
                <p>
                  Cloud platforms, delivery workflows, or a good infrastructure
                  problem.
                  <br />
                  I’m happy to compare notes.
                </p>
                <div id="opportunities" className="recruiter-facts">
                  <h3>Career &amp; Opportunities</h3>
                  <p>
                    {ownerCareerProfile.totalItExperience};{" "}
                    {ownerCareerProfile.devopsExperience}.
                  </p>
                  <p>
                    {ownerCareerProfile.availability}. Notice period:{" "}
                    {ownerCareerProfile.noticePeriod}.
                  </p>
                  <p>{ownerCareerProfile.sponsorship}.</p>
                  <p>{ownerCareerProfile.motivation}.</p>
                  {ownerCareerProfile.workPreferences && (
                    <p>{ownerCareerProfile.workPreferences}.</p>
                  )}
                </div>
                <a className="contact-email" href={`mailto:${profile.email}`}>
                  {profile.email}
                  <ArrowUpRight size={25} />
                </a>
                <button className="copy-email" onClick={copyEmail}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Email copied" : "Copy email address"}
                </button>
                <span role="status" className="sr-only">
                  {copied ? "Email address copied to clipboard" : ""}
                </span>
              </div>
              <div className="contact-links">
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={19} /> LinkedIn <ArrowUpRight size={16} />
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={19} /> GitHub <ArrowUpRight size={16} />
                </a>
                <a
                  href={profile.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code2 size={19} /> Technical Notes <ArrowUpRight size={16} />
                </a>
                <a href={profile.resume} download>
                  <ArrowDown size={19} /> Download Résumé{" "}
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer ref={pageEndRef} className="site-footer section-shell">
        <a className="wordmark" href="#home">
          V<span className="orange">.</span>
        </a>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <span>
          Hosted on Cloudflare. Privacy-friendly Cloudflare Web Analytics.
        </span>
        <a href="#home">Back to Top ↑</a>
      </footer>
      <button
        className="page-jump"
        onClick={jumpPage}
        aria-label={atBottom ? "Go to top of page" : "Go to bottom of page"}
        title={atBottom ? "Go to top" : "Go to bottom"}
      >
        {atBottom ? <ArrowUp size={25} /> : <ArrowDown size={25} />}
        <span>{atBottom ? "Top" : "Bottom"}</span>
      </button>
    </div>
  );
}
