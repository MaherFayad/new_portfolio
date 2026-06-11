import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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
  title: "Maher Fayad | Product Designer",
  description:
    "Product Designer crafting converting interfaces and experiences that delight users and boost businesses.",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Maher Fayad | Product Designer",
    description:
      "Product Designer crafting converting interfaces and experiences that delight users and boost businesses.",
    url: "https://maherfayad.com",
    siteName: "Maher Fayad Portfolio",
    images: [
      {
        url: "/meta.webp",
        width: 1200,
        height: 630,
        alt: "Maher Fayad | Product Designer",
      },
    ],
    locale: "en",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maher Fayad | Product Designer",
    description:
      "Product Designer crafting converting interfaces and experiences that delight users and boost businesses.",
    images: ["/meta.webp"],
  },
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
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
