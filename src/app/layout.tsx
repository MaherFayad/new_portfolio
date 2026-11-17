import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import RootLayoutClient from "./RootLayoutClient";
import { CREDENTIALS, PROFILE, SERVICES_OFFERED, SITE_URL } from "@/data/profile";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://maherfayad.com"),
  title: {
    default:
      "Maher Fayad | Senior Product Designer (UX/UI, Design Systems)",
    template: "%s | Maher Fayad",
  },
  description:
    "Senior Product Designer in Riyadh, Saudi Arabia. Design systems and analytics-informed product design for banking, fintech, and travel. Delivered 41 revamps at Al Rajhi Bank within the program that lifted account openings 47% and transactions 81%.",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    // machine-readable profile for AI agents (see src/lib/llms.ts)
    types: { "text/markdown": "/llms.txt" },
  },
  authors: [{ name: "Maher Fayad", url: "https://maherfayad.com" }],
  creator: "Maher Fayad",
  keywords: [
    "senior product designer Riyadh",
    "senior product designer Saudi Arabia",
    "UX designer GCC",
    "Figma design systems consultant",
    "Maher Fayad",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title:
      "Maher Fayad | Senior Product Designer (UX/UI, Design Systems)",
    description:
      "Senior Product Designer in Riyadh, Saudi Arabia. Design systems and analytics-informed product design for banking, fintech, and travel.",
    url: "https://maherfayad.com",
    siteName: "Maher Fayad | Senior Product Designer",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Maher Fayad | Senior Product Designer (UX/UI, Design Systems)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maher Fayad | Senior Product Designer",
    description:
      "Senior Product Designer in Riyadh, Saudi Arabia. Design systems and analytics-informed product design.",
    images: ["/opengraph-image.png"],
  },
};

// One connected graph: the Person is the entity every other page's structured data points back to
// (ProfilePage on /about, CollectionPage on /work, CreativeWork on each case study).
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PROFILE.name,
      jobTitle: PROFILE.jobTitle,
      description: PROFILE.summary,
      worksFor: { "@type": "Organization", name: PROFILE.employer },
      url: SITE_URL,
      image: `${SITE_URL}/assets/Maher.png`,
      email: `mailto:${PROFILE.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
      knowsLanguage: ["ar", "en"],
      knowsAbout: [
        "Product Design",
        "UX Design",
        "Design Systems",
        "Product Analytics",
        "Arabic and English (RTL) interface design",
        "Figma plugin development",
      ],
      hasOccupation: {
        "@type": "Occupation",
        name: PROFILE.jobTitle,
        occupationLocation: { "@type": "Country", name: "Saudi Arabia" },
        skills: "Product design, design systems, UX research, product analytics, bilingual AR/EN interfaces",
      },
      makesOffer: SERVICES_OFFERED.map((svc) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: svc.name,
          description: svc.description,
          areaServed: ["Saudi Arabia", "Gulf Cooperation Council", "Remote"],
          provider: { "@id": `${SITE_URL}/#person` },
        },
      })),
      hasCredential: CREDENTIALS.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: c.name,
        url: c.url,
      })),
      sameAs: [
        PROFILE.linkedin,
        ...CREDENTIALS.map((c) => c.url),
        "https://www.figma.com/community/plugin/1444818529763652434/primitive-semantic-colors-generator",
        "https://www.figma.com/community/plugin/1457720620225105340/numeric-tokens-generator",
        PROFILE.figma,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Maher Fayad | Senior Product Designer",
      description: PROFILE.summary,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="jSkR22cF6TasEMLo9kxXI633TLgjeEot3Fo9U-Rx6pA" />
        <noscript>
          <style>{`[data-reveal],[data-page-shell]{opacity:1!important;transform:none!important;pointer-events:auto!important}.loader{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <RootLayoutClient>{children}</RootLayoutClient>
        <Analytics />
        <SpeedInsights />
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "xamm9rf994");
            `,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MDGXQYTFN1"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-MDGXQYTFN1');
            `,
          }}
        />
      </body>
    </html>
  );
}
