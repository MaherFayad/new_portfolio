"use client";

import Link from "next/link";
import { PROJECTS } from "@/data/projects";

interface ChatProjectCardProps {
  slug: string;
  onNavigate?: () => void;
  compact?: boolean;
}

export default function ChatProjectCard({ slug, onNavigate, compact = false }: ChatProjectCardProps) {
  // Find project in static data
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return null;
  }

  const { title, subtitle, externalUrl, images } = project;
  const isExternal = !!externalUrl;
  const primaryImage = images && images.length > 0 ? images[0] : null;

  return (
    <div
      className={`group my-6 flex flex-col gap-4 text-left ${
        compact ? "shrink-0 snap-start w-[clamp(220px,72vw,300px)]" : "w-full"
      }`}
    >
      {/* Tag Label */}
      <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
        Project Case Study
      </span>

      {/* Aspect Video Project Thumbnail */}
      {primaryImage && (
        <div className="relative w-full aspect-video overflow-hidden border border-white/5 bg-black/40">
          <img
            src={primaryImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      {/* Info Details */}
      <div className="flex flex-col gap-2.5 mt-2">
        <h4 className="text-3xl font-medium tracking-tight text-white leading-none">
          {title}
        </h4>
        <p className="text-sm font-medium text-white/50 leading-relaxed max-w-xl">
          {subtitle}
        </p>
      </div>

      {/* Call to Action - Uppercase Underlined Link CTA */}
      <div className="pt-2">
        {isExternal ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className="group/cta inline-flex items-center text-xs font-bold tracking-wider text-white uppercase underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all duration-300 gap-1.5"
          >
            VIEW CASE STUDY (BEHANCE)
            <span className="inline-block transition-transform duration-300 group-hover/cta:translate-x-1 font-normal">&gt;</span>
          </a>
        ) : (
          <Link
            href={`/projects/${slug}`}
            onClick={onNavigate}
            className="group/cta inline-flex items-center text-xs font-bold tracking-wider text-white uppercase underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all duration-300 gap-1.5"
          >
            VIEW CASE STUDY
            <span className="inline-block transition-transform duration-300 group-hover/cta:translate-x-1 font-normal">&gt;</span>
          </Link>
        )}
      </div>
    </div>
  );
}
