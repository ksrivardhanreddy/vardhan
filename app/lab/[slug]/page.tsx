import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  publishedLabArticles,
  getLabArticle,
  readingMinutes,
} from "@/content/lab/articles";
import { statusLabels } from "@/content/lab/types";
import { labDisclaimer } from "@/content/lab/types";
import { K3sDiagram } from "@/components/lab/k3s-diagram";
export const dynamicParams = false;
export function generateStaticParams() {
  return publishedLabArticles.map(({ slug }) => ({ slug }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getLabArticle((await params).slug);
  if (!article) notFound();
  const title = `${article.title} | Vardhan Engineering Lab`;
  return {
    title,
    description: article.summary,
    alternates: { canonical: `/lab/${article.slug}` },
    openGraph: {
      title,
      description: article.summary,
      type: "article",
      url: `/lab/${article.slug}`,
      images: ["/opengraph-image.png"],
      ...(article.publishedAt ? { publishedTime: article.publishedAt } : {}),
      ...(article.updatedAt ? { modifiedTime: article.updatedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.summary,
      images: ["/opengraph-image.png"],
    },
  };
}
export default async function LabArticlePage({ params }: Props) {
  const article = getLabArticle((await params).slug);
  if (!article) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.summary,
    url: `https://www.vardhan.pro/lab/${article.slug}`,
    author: {
      "@type": "Person",
      name: "Srivardhan Reddy Kolan",
      url: "https://www.vardhan.pro/",
    },
    image: "https://www.vardhan.pro/opengraph-image.png",
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
  };
  return (
    <main id="main" className="section-shell lab-main lab-article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\u003c"),
        }}
      />
      <nav className="lab-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Portfolio</Link>
        <span aria-hidden="true">/</span>
        <Link href="/lab">Engineering Lab</Link>
      </nav>
      <article>
        <header className="lab-article-header">
          <p className="eyebrow">PERSONAL ENGINEERING LAB</p>
          <p className="lab-status">
            {statusLabels[article.status]}
            {article.resolved ? " · Resolved" : ""}
          </p>
          <h1>{article.title}</h1>
          <p className="lab-lead">{article.summary}</p>
          <p>
            {article.category} · {readingMinutes(article)} min read
          </p>
          {article.publishedAt && (
            <p>
              Published{" "}
              <time dateTime={article.publishedAt}>{article.publishedAt}</time>
              {article.updatedAt && (
                <>
                  {" "}
                  · Updated{" "}
                  <time dateTime={article.updatedAt}>{article.updatedAt}</time>
                </>
              )}
            </p>
          )}
          <div className="tags">
            {article.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <p className="lab-disclaimer">{labDisclaimer}</p>
        </header>
        <div className="lab-article-layout">
          <aside className="lab-toc">
            <nav aria-label="On this page">
              <h2>On this page</h2>
              <ul>
                {article.diagram && (
                  <li>
                    <a href="#conceptual-architecture">
                      Conceptual architecture
                    </a>
                  </li>
                )}
                {article.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.heading}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className="lab-prose">
            {article.diagram && (
              <section id="conceptual-architecture">
                <h2>Conceptual architecture</h2>
                <K3sDiagram />
              </section>
            )}
            {article.sections.map((section) => (
              <section id={section.id} key={section.id}>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {section.items && (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.code && (
                  <>
                    <p className="lab-code-label">
                      Illustrative diagnostic commands — no recorded output
                    </p>
                    <pre
                      tabIndex={0}
                      aria-label="Illustrative diagnostic commands"
                    >
                      <code>{section.code}</code>
                    </pre>
                  </>
                )}
                {section.note && (
                  <p className="lab-disclaimer">{section.note}</p>
                )}
              </section>
            ))}
            {!!article.evidenceLinks?.length && (
              <section>
                <h2>Supporting material</h2>
                <ul>
                  {article.evidenceLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </article>
      {!!article.related?.length && (
        <section className="lab-related">
          <h2>Continue exploring</h2>
          <ul>
            {article.related.map((slug) => {
              const related = getLabArticle(slug);
              return related ? (
                <li key={slug}>
                  <Link href={`/lab/${slug}`}>{related.title} →</Link>
                </li>
              ) : null;
            })}
          </ul>
        </section>
      )}
      <Link className="button button-secondary" href="/lab">
        ← Back to the Engineering Lab
      </Link>
    </main>
  );
}
