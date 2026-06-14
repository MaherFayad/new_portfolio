import type { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";

const BASE = "https://maherfayad.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/contacts`, changeFrequency: "yearly", priority: 0.8 },
    ...PROJECTS.map((project) => ({
      url: `${BASE}/projects/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
