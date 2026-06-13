"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import { useMouseEffectsEnabled } from "@/hooks/useMouseEffectsEnabled";

interface Plugin {
  name: string;
  image: string;
  link: string;
  description: string;
  glow: string;
}

const PLUGINS: Plugin[] = [
  {
    name: "Primitive & Semantic Colors Generator",
    image: "/assets/Plugins/primitive_colors_generator_1x.webp",
    link: "https://www.figma.com/community/plugin/1444818529763652434/primitive-semantic-colors-generator/",
    description: "Create, manage, and document comprehensive color systems with ease. Perfect for design systems, brand guidelines, and maintaining color consistency across projects.",
    glow: "rgba(0, 217, 174, 0.12)"
  },
  {
    name: "Numeric Tokens Generator",
    image: "/assets/Plugins/numeric_tokens_generator_1x.webp",
    link: "https://www.figma.com/community/plugin/1457720620225105340/numeric-tokens-generator",
    description: "Transform your design workflow with a comprehensive design system generator that creates and manages typography, spacing, border radius, and shadow systems.",
    glow: "rgba(164, 53, 240, 0.12)"
  },
];

function PluginCardStatic({ plugin }: { plugin: Plugin }) {
  return (
    <div
      onClick={() => window.open(plugin.link, "_blank", "noopener,noreferrer")}
      className="relative flex flex-col gap-6 bg-white/[0.01] backdrop-blur-[6px] border border-white/5 rounded-[24px] p-6 cursor-pointer overflow-hidden transition-colors duration-300 hover:border-white/10 hover:bg-white/[0.03] lg:col-span-1 md:col-span-2 col-span-2"
    >
      <div className="w-full aspect-video rounded-xl overflow-hidden pointer-events-none">
        <img
          src={plugin.image}
          alt={plugin.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl max-sm:text-xl font-medium text-[#c5c5c5]">
          {plugin.name}
        </h3>
        <p className="text-[rgba(197,197,197,0.6)] text-sm leading-[150%] tracking-[-0.01em]">
          {plugin.description}
        </p>
      </div>
    </div>
  );
}

function PluginCardInteractive({ plugin }: { plugin: Plugin }) {
  const [hovered, setHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 12 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);
  const scale = useSpring(hovered ? 1.02 : 1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);

    setGlowPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => window.open(plugin.link, "_blank", "noopener,noreferrer")}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      className="relative flex flex-col gap-6 bg-white/[0.01] backdrop-blur-[6px] border border-white/5 rounded-[24px] p-6 cursor-pointer overflow-hidden transition-colors duration-300 hover:border-white/10 hover:bg-white/[0.03] lg:col-span-1 md:col-span-2 col-span-2"
    >
      {/* Interactive mouse tracking glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle 180px at ${glowPos.x}px ${glowPos.y}px, ${plugin.glow}, transparent)`,
        }}
      />

      {/* Glow border highlight */}
      <div 
        className="absolute inset-0 border border-white/10 rounded-[24px] pointer-events-none transition-opacity duration-300"
        style={{ opacity: hovered ? 0.3 : 0 }}
      />

      {/* Image Preview Container */}
      <div 
        className="w-full aspect-video rounded-xl overflow-hidden pointer-events-none transition-transform duration-[0.6s]"
        style={{
          transform: hovered ? "translateZ(20px)" : "translateZ(0px)",
        }}
      >
        <img
          src={plugin.image}
          alt={plugin.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Title & Desc */}
      <div 
        className="flex flex-col gap-2 transition-transform duration-[0.6s]"
        style={{
          transform: hovered ? "translateZ(30px)" : "translateZ(0px)",
        }}
      >
        <h3 className="text-2xl max-sm:text-xl font-medium text-[#c5c5c5]">
          {plugin.name}
        </h3>
        <p className="text-[rgba(197,197,197,0.6)] text-sm leading-[150%] tracking-[-0.01em]">
          {plugin.description}
        </p>
      </div>

    </motion.div>
  );
}

function PluginCard({
  plugin,
  mouseEffectsEnabled,
}: {
  plugin: Plugin;
  mouseEffectsEnabled: boolean;
}) {
  return mouseEffectsEnabled ? (
    <PluginCardInteractive plugin={plugin} />
  ) : (
    <PluginCardStatic plugin={plugin} />
  );
}

export default function PluginsGrid() {
  const mouseEffectsEnabled = useMouseEffectsEnabled();

  return (
    <section className="relative w-full py-10">
      <div className="grid grid-cols-12 max-sm:grid-cols-1 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-start">
        
        {/* Left-aligned vertical column header matching page style */}
        <Reveal className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left [&>span]:block block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>Figma</span>
          <span>Plugins</span>
        </Reveal>

        {/* Right content column */}
        <div className="col-span-10 lg:col-[3/13] sm:col-[1/5] max-sm:col-span-1 flex flex-col gap-10">
          <Reveal>
            <h2 className="font-medium text-[clamp(28px,2.5vw,48px)] leading-[110%] tracking-[-0.04em] text-[#c5c5c5]">
              Figma plugins I developed
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6" style={{ perspective: 1000 }}>
            {PLUGINS.map((plugin, idx) => (
              <Reveal key={plugin.name} delay={idx * 0.04}>
                <PluginCard plugin={plugin} mouseEffectsEnabled={mouseEffectsEnabled} />
              </Reveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
