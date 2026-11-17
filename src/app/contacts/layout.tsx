import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Contact Maher Fayad | Product Design for GCC & Remote Teams",
  },
  description:
    "Start a project with Maher Fayad: senior product design and design systems. Riyadh-based, remote-ready. Replies within one business day.",
  alternates: { canonical: "/contacts" },
};

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Maher Fayad",
  url: "https://maherfayad.com/contacts",
  isPartOf: { "@id": "https://maherfayad.com/#website" },
  mainEntity: { "@id": "https://maherfayad.com/#person" },
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      {children}
    </>
  );
}
