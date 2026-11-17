import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import ProjectPageClient from "./ProjectPageClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function truncateDescription(text: string, max = 155): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3).trimEnd()}...`;
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {};
  }

  const title = `${project.title} Case Study`;
  const description = truncateDescription(project.subtitle);
  // share the project's own cover instead of the generic site card
  const image = project.images[0] ?? "/opengraph-image.png";

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${project.slug}`,
      types: { "text/markdown": `/projects/${project.slug}.md` },
    },
    openGraph: {
      title,
      description,
      url: `https://maherfayad.com/projects/${project.slug}`,
      type: "article",
      authors: ["https://maherfayad.com/about"],
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const url = `https://maherfayad.com/projects/${project.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#case-study`,
        name: `${project.title} Case Study`,
        headline: project.title,
        description: project.subtitle,
        abstract: project.caseFraming.outcome,
        url,
        image: project.images.slice(0, 3).map((src) => `https://maherfayad.com${src}`),
        genre: "Product design case study",
        inLanguage: "en",
        author: { "@id": "https://maherfayad.com/#person" },
        creator: { "@id": "https://maherfayad.com/#person" },
        isPartOf: { "@id": "https://maherfayad.com/#website" },
        ...(project.externalUrl ? { sameAs: project.externalUrl } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://maherfayad.com" },
          { "@type": "ListItem", position: 2, name: "Work", item: "https://maherfayad.com/work" },
          { "@type": "ListItem", position: 3, name: project.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProjectPageClient />
    </>
  );
}
