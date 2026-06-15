"use client";

import Link from "next/link";
import { PROJECTS } from "@/data/projects";

interface ChatProjectCardProps {
  slug: string;
}

export default function ChatProjectCard({ slug }: ChatProjectCardProps) {
  // Find project in static data
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return null;
  }

  const { title, subtitle, caseFraming, externalUrl } = project;
  const isExternal = !!externalUrl;

  return (
    <div className="my-4 w-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300 p-5 rounded-none flex flex-col gap-4 text-left">
      {/* Header Info */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold tracking-wider text-white/40 uppercase">
          Project Case Study
        </span>
        <h4 className="text-lg font-medium tracking-tight text-[#c5c5c5] leading-none">
          {title}
        </h4>
        <span className="text-xs font-medium text-white/50 leading-relaxed italic">
          {caseFraming.role}
        </span>
      </div>

      {/* Outcome / Subtitle Highlights */}
      <p className="text-sm font-medium text-[#c5c5c5] leading-relaxed border-l-2 border-white/20 pl-3">
        {subtitle}
      </p>

      {/* Case Framing Grid (Role, Problem, Outcome) */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 text-[11px] leading-relaxed">
        <div>
          <span className="block font-semibold text-white/30 uppercase tracking-wide">
            Problem
          </span>
          <span className="text-white/70 block mt-0.5">{caseFraming.problem}</span>
        </div>
        <div>
          <span className="block font-semibold text-white/30 uppercase tracking-wide">
            Outcome
          </span>
          <span className="text-[#c5c5c5] font-medium block mt-0.5">{caseFraming.outcome}</span>
        </div>
      </div>

      {/* Call to Action - Uppercase Underlined Link CTA (No Pill Buttons) */}
      <div className="pt-2">
        {isExternal ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center text-xs font-bold tracking-wider text-white uppercase underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all duration-300"
          >
            VIEW CASE STUDY (BEHANCE)
          </a>
        ) : (
          <Link
            href={`/projects/${slug}`}
            className="group inline-flex items-center text-xs font-bold tracking-wider text-white uppercase underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all duration-300"
          >
            VIEW CASE STUDY
          </Link>
        )}
      </div>
    </div>
  );
}
