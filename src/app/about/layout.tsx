import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV & Experience | Senior Product Designer (GCC)",
  description:
    "Maher Fayad's CV: Senior Product Designer at Almosafer; previously Al Rajhi Bank (+47% account openings, +81% transactions), Contact Financial, and a trusted freelance practice. 7 verified credentials.",
  alternates: { canonical: "/about" },
};

const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: { "@type": "Person", name: "Maher Fayad", url: "https://maherfayad.com" },
  url: "https://maherfayad.com/about",
  dateCreated: "2024-03-01T00:00:00.000Z",
  dateModified: "2026-06-01T00:00:00.000Z",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />
      {children}
    </>
  );
}
