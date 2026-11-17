import type { Metadata } from "next";
import { HIRE_FAQ, SITE_URL } from "@/data/profile";

export const metadata: Metadata = {
  title: { absolute: "Hire a Senior Product Designer in Riyadh | Maher Fayad" },
  description:
    "Hire Maher Fayad, Senior Product Designer in Riyadh, Saudi Arabia: product design, design systems, and UX audits for banking, fintech, and travel products in Arabic and English. Open to freelance projects and audits, remote worldwide.",
  alternates: { canonical: "/hire", types: { "text/markdown": "/llms.txt" } },
  openGraph: {
    title: "Hire a Senior Product Designer in Riyadh | Maher Fayad",
    description:
      "Product design, design systems, and UX audits for banking, fintech, and travel products in Arabic and English.",
    url: "/hire",
    type: "website",
  },
};

// The questions and answers below are the ones shown on the page, word for word.
const hireJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/hire`,
      url: `${SITE_URL}/hire`,
      name: "Hire Maher Fayad, Senior Product Designer in Riyadh",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "FAQPage",
      mainEntity: HIRE_FAQ.map((qa) => ({
        "@type": "Question",
        name: qa.question,
        acceptedAnswer: { "@type": "Answer", text: qa.answer },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Hire", item: `${SITE_URL}/hire` },
      ],
    },
  ],
};

export default function HireLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hireJsonLd) }} />
      {children}
    </>
  );
}
