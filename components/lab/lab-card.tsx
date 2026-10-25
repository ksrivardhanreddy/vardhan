import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { statusLabels, type LabCardData } from "@/content/lab/types";
export function LabCard({ article }: { article: LabCardData }) {
  return (
    <article className="lab-story-card">
      <p className={`lab-status lab-status-${article.status}`}>
        {statusLabels[article.status]}
        {article.resolved ? " · Resolved" : ""}
      </p>
      <p className="lab-card-category">{article.category}</p>
      <h3>
        <Link href={`/lab/${article.slug}`}>
          {article.title}
          <ArrowUpRight size={20} aria-hidden="true" />
        </Link>
      </h3>
      <p>{article.summary}</p>
      <div className="tags">
        {article.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <p className="lab-read-time">{article.minutes} min read · Personal lab</p>
    </article>
  );
}
