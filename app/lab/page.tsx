import type { Metadata } from "next";
import Link from "next/link";
import { LabIndex } from "@/components/lab/lab-index";
import { labDisclaimer } from "@/content/lab/types";
import { publishedLabArticles, toLabCard } from "@/content/lab/articles";
const title = "Personal Engineering Lab | Srivardhan Reddy Kolan";
const description =
  "Personal K3s, Proxmox, Linux, networking and observability case studies, with clearly separated AI infrastructure learning and planned experiments.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/lab" },
  openGraph: {
    title,
    description,
    url: "/lab",
    type: "website",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image.png"],
  },
};
export default function LabPage() {
  return (
    <main id="main" className="section-shell lab-main">
      <header className="lab-hero">
        <p className="eyebrow">PERSONAL ENGINEERING LAB</p>
        <h1>
          Systems I build.
          <br />
          <em>Problems I debug.</em>
          <br />
          Lessons I document.
        </h1>
        <p className="lab-lead">
          A running record of personal infrastructure work: self-hosted
          Kubernetes, Linux operations, networking, observability and
          experiments toward AI platform engineering.
        </p>
        <p>
          I use a personal lab to explore what happens beyond the happy path:
          nodes change, DNS gets overwritten, containers end up attached to the
          wrong daemon, and applications need ingress, metrics and consistent
          operational workflows.
        </p>
        <p className="lab-disclaimer">
          {labDisclaimer} These pages describe documented activities, not a live
          service-status inventory.
        </p>
      </header>
      <LabIndex articles={publishedLabArticles.map(toLabCard)} />
      <section className="lab-faq">
        <h2>What counts as a project here?</h2>
        <p>
          A deployed service, an operational problem with a documented
          resolution, or an explicitly labeled experiment. Each page states what
          was actually done and what remains to be built.
        </p>
        <Link className="text-link" href="/#work">
          Read professional Selected Work separately →
        </Link>
      </section>
    </main>
  );
}
