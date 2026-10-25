import { Portfolio } from "@/components/portfolio";
import { profile } from "@/content/portfolio";
import { publishedLabArticles, toLabCard } from "@/content/lab/articles";
export default function Page() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: "https://www.vardhan.pro",
    jobTitle: "Senior DevOps Engineer",
    sameAs: [profile.github, profile.linkedin],
    knowsAbout: [
      "AWS",
      "Kubernetes",
      "Terraform",
      "CI/CD",
      "Platform Engineering",
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(person).replace(/</g, "\u003c"),
        }}
      />
      <Portfolio
        labFeatures={publishedLabArticles
          .filter((article) => article.featured)
          .map(toLabCard)}
      />
    </>
  );
}
