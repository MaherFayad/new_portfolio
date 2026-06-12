import type { MetadataRoute } from "next";

const BASE = "https://maherfayad.com";

const PROJECT_SLUGS = [
  "sanarte",
  "lfg",
  "airlab",
  "campus51",
  "deployo",
  "dhsc",
  "kobe-bryant",
  "nft-print-pro",
  "pexlp",
  "sacred-stacks",
  "six-clovers",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/contacts`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    ...PROJECT_SLUGS.map((slug) => ({
      url: `${BASE}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
