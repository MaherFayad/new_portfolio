import type { Metadata } from "next";
import { PROJECTS } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work | Senior Product Designer (GCC)",
  description:
    "Selected product design work by Maher Fayad: banking and travel platforms, mobile apps, design systems, and web products shipped for Almosafer, Al Rajhi Bank, and freelance clients.",
  alternates: { canonical: "/work" },
};

const collectionPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Work",
  url: "https://maherfayad.com/work",
  isPartOf: { "@id": "https://maherfayad.com/#website" },
  author: { "@id": "https://maherfayad.com/#person" },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: PROJECTS.map((project, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: project.title,
      url: `https://maherfayad.com/projects/${project.slug}`,
    })),
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />
      {children}
    </>
  );
}
