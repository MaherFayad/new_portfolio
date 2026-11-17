import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV & Experience | Senior Product Designer (GCC)",
  description:
    "Maher Fayad, Senior Product Designer: CV and career history across Almosafer, Al Rajhi Bank (41 e-business revamps behind a 47%/81% lift in account openings and transactions), Contact Financial, and independent freelance work. 7 verified credentials.",
  alternates: { canonical: "/about" },
};

const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: "About Maher Fayad",
  mainEntity: { "@id": "https://www.maherfayad.com/#person" },
  isPartOf: { "@id": "https://www.maherfayad.com/#website" },
  url: "https://www.maherfayad.com/about",
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
