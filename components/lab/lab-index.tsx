"use client";
import { useEffect, useState } from "react";
import { LabCard } from "./lab-card";
import {
  labTopics,
  statusLabels,
  type LabCardData,
  type LabTopic,
} from "@/content/lab/types";
import { labRoadmap } from "@/content/lab/roadmap";
export function LabIndex({ articles }: { articles: LabCardData[] }) {
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);
  const [topic, setTopic] = useState<LabTopic | "All">("All");
  const stories = articles.filter(
    (a) => topic === "All" || a.topics.includes(topic),
  );
  const plans = labRoadmap.filter(
    (a) => topic === "All" || a.topics.includes(topic),
  );
  return (
    <>
      <div
        className="lab-filters"
        hidden={!interactive}
        role="group"
        aria-label="Filter Engineering Lab by topic"
      >
        {(["All", ...labTopics] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={topic === value}
            onClick={() => setTopic(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <p role="status" className="lab-results">
        {stories.length} {stories.length === 1 ? "story" : "stories"} ·{" "}
        {plans.length} learning / planned{" "}
        {plans.length === 1 ? "track" : "tracks"}
        {topic === "All" ? "" : ` in ${topic}`}
      </p>
      <section aria-labelledby="documented-stories">
        <h2 id="documented-stories">Documented personal work</h2>
        {stories.length ? (
          <div className="lab-card-grid">
            {stories.map((article) => (
              <LabCard article={article} key={article.slug} />
            ))}
          </div>
        ) : (
          <p className="lab-empty">
            No documented case study in this topic yet. The learning tracks
            below describe future work.
          </p>
        )}
      </section>
      {plans.length > 0 && (
        <section className="lab-roadmap" aria-labelledby="learning-roadmap">
          <p className="eyebrow">
            FUTURE WORK · SEPARATE FROM IMPLEMENTED PROJECTS
          </p>
          <h2 id="learning-roadmap">Learning tracks and planned experiments</h2>
          <p>
            Milestones are proposals, not completed deployments or measured
            results. There are no case-study or repository links for unbuilt
            work.
          </p>
          <div className="lab-card-grid">
            {plans.map((plan) => (
              <article
                className="lab-story-card lab-planned-card"
                key={plan.title}
              >
                <p className="lab-status">{statusLabels[plan.status]}</p>
                <h3>{plan.title}</h3>
                <p>{plan.summary}</p>
                <ul>
                  {plan.milestones.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
