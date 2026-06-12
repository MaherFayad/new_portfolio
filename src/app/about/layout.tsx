import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV & Experience | Senior Product Designer (GCC)",
  description:
    "Maher Fayad's CV: Senior Product Designer at Almosafer; previously Al Rajhi Bank (+47% account openings, +81% transactions), Contact Financial, and a trusted freelance practice. 7 verified credentials.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
