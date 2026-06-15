"use client";

import { PLUGINS } from "@/data/plugins";

interface ChatPluginCardProps {
  slug: string;
  onNavigate?: () => void;
  compact?: boolean;
}

export default function ChatPluginCard({ slug, onNavigate, compact = false }: ChatPluginCardProps) {
  const plugin = PLUGINS.find((p) => p.slug === slug);

  if (!plugin) {
    return null;
  }

  const { name, description, link, image } = plugin;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
      className={`group my-6 flex flex-col gap-4 text-left cursor-pointer ${
        compact ? "shrink-0 snap-start w-[clamp(220px,72vw,300px)]" : "w-full"
      }`}
    >
      {/* Tag Label */}
      <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
        Figma Plugin
      </span>

      {/* Aspect Video Plugin Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden border border-white/5 bg-black/40">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Info Details */}
      <div className="flex flex-col gap-2.5 mt-2">
        <h4 className="text-3xl font-medium tracking-tight text-white leading-none">
          {name}
        </h4>
        <p className="text-sm font-medium text-white/50 leading-relaxed max-w-xl">
          {description}
        </p>
      </div>

      {/* Call to Action - Uppercase Underlined CTA */}
      <div className="pt-2">
        <span className="group/cta inline-flex items-center text-xs font-bold tracking-wider text-white uppercase underline underline-offset-4 decoration-white/20 group-hover:decoration-white transition-all duration-300 gap-1.5">
          VIEW PLUGIN (FIGMA)
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 font-normal">&gt;</span>
        </span>
      </div>
    </a>
  );
}
