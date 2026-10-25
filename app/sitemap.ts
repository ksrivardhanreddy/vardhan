import type { MetadataRoute } from "next";
import { publishedLabArticles } from "@/content/lab/articles";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.vardhan.pro/" },
    { url: "https://www.vardhan.pro/lab" },
    ...publishedLabArticles.map((article) => ({
      url: `https://www.vardhan.pro/lab/${article.slug}`,
      ...(article.updatedAt || article.publishedAt
        ? { lastModified: article.updatedAt ?? article.publishedAt }
        : {}),
    })),
  ];
}
