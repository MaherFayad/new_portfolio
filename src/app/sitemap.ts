import type { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";
import { SITE_URL } from "@/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  // build time: the site is static, so every deploy is the last modification
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/work`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/hire`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/contacts`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    ...PROJECTS.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.7,
      images: project.images.slice(0, 1).map((src) => `${SITE_URL}${src}`),
    })),
  ];
}
