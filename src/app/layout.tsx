import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import RootLayoutClient from "./RootLayoutClient";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://maherfayad.com"),
  title: {
    default:
      "Maher Fayad | Senior Product Designer (UX/UI, Design Systems)",
    template: "%s | Maher Fayad",
  },
  description:
    "Senior Product Designer in Riyadh, Saudi Arabia. Design systems, and analytics-informed product design for banking, fintech, and travel. +47% onboarding, +81% transactions.",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  keywords: [
    "senior product designer Riyadh",
    "senior product designer Saudi Arabia",
    "UX designer GCC",
    "Figma design systems consultant",
    "Maher Fayad",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title:
      "Maher Fayad | Senior Product Designer (UX/UI, Design Systems)",
    description:
      "Senior Product Designer in Riyadh, Saudi Arabia. Design systems, and analytics-informed product design for banking, fintech, and travel.",
    url: "https://maherfayad.com",
    siteName: "Maher Fayad | Senior Product Designer",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1024,
        height: 1024,
        alt: "Maher Fayad | Senior Product Designer (UX/UI, Design Systems)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maher Fayad | Senior Product Designer",
    description:
      "Senior Product Designer in Riyadh, Saudi Arabia. Design systems, and analytics-informed product design.",
    images: ["/opengraph-image.png"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Maher Fayad",
  jobTitle: "Senior Product Designer",
  worksFor: { "@type": "Organization", name: "Almosafer" },
  url: "https://maherfayad.com",
  email: "mailto:Contact@maherfayad.com",
  address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
  knowsLanguage: ["ar", "en"],
  knowsAbout: [
    "Product Design",
    "UX Design",
    "Design Systems",
    "Product Analytics",
  ],
  sameAs: [
    "https://www.linkedin.com/in/maherfayad",
    "https://www.credly.com/badges/5f3aa817-a4c2-4cee-8364-bd8b163a737b/public_url",
    "https://www.credly.com/badges/4b94e10d-d67c-43cb-b529-f9127c04ed91/public_url",
    "https://www.credly.com/badges/ed0ef7e8-cc68-41e9-8e10-664be336e779/public_url",
    "https://www.credly.com/badges/32de5750-f31b-470d-a179-8dadc54756fd/public_url",
    "https://www.credly.com/badges/0e8306a5-d19b-4524-94ca-a2f501be3d81/public_url",
    "https://www.credly.com/badges/2e307edc-0639-42bb-a70c-c6cac291fec3/public_url",
    "https://www.credly.com/badges/bf32a815-e57e-4ed4-8475-45ccdceb586a/public_url",
    "https://www.figma.com/community/plugin/1444818529763652434/primitive-semantic-colors-generator",
    "https://www.figma.com/community/plugin/1457720620225105340/numeric-tokens-generator",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <meta name="google-site-verification" content="jSkR22cF6TasEMLo9kxXI633TLgjeEot3Fo9U-Rx6pA" />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <RootLayoutClient>{children}</RootLayoutClient>
        <Analytics />
      </body>
    </html>
  );
}
