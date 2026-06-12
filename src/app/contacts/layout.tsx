import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Contact Maher Fayad | Product Design for GCC & Remote Teams",
  },
  description:
    "Start a project with Maher Fayad | senior product design, and design systems. Riyadh-based, remote-ready. Replies within one business day.",
  alternates: { canonical: "/contacts" },
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
