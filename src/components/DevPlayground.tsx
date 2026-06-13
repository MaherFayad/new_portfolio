"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import AnimatedText from "./AnimatedText";
import MobileHorizontalScroll from "./MobileHorizontalScroll";

interface DevProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  url: string;
  heroImage: string;
}

const DEV_PROJECTS: DevProject[] = [
  {
    id: "ar15-customizer",
    title: "AR-15 Customizer",
    description: "An interactive Rive-powered weapon customizer with real-time part swapping and state machine logic. No AI, pure craftsmanship.",
    tech: ["Rive", "WebGL2", "State Machines"],
    url: "https://ar-15.vercel.app/",
    heroImage: "/dev-playground/ar15-hero.webp",
  },
  {
    id: "project-ath",
    title: "Project ATH",
    description:
      "A crypto All-Time-High tracker dashboard built with Rive animations and Unicorn Studio, featuring animated gauges and live data.",
    tech: ["Rive", "Unicorn Studio", "WebGL2"],
    url: "https://rive-test-omega.vercel.app/",
    heroImage: "/dev-playground/project-ath-hero.webp",
  },
  {
    id: "gta-vi",
    title: "GTA VI Landing",
    description:
      "A cinematic GTA VI fan landing page with GSAP-powered scroll animations, parallax layers, and immersive transitions.",
    tech: ["GSAP", "React", "Vite"],
    url: "https://gta-6-gsap.netlify.app/",
    heroImage: "/dev-playground/gta-vi-hero.webp",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function DevPlayground() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const gradientY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      id="dev-playground-section"
      className="mt-[clamp(80px,9.615vw-54.6px,130px)] lg:max-dt:mt-[clamp(90px,5.333vw-16.3px,90px)] sm:max-lg:mt-[60px] max-sm:mt-10 relative"
    >
      {/* Ambient Glow Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10 overflow-hidden"
        style={{ y: gradientY }}
        aria-hidden
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.06)_0%,transparent_70%)]" />
      </motion.div>

      {/* Section Header */}
      <Reveal className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-[last_baseline]">
        <span className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>Dev</span>
          <span>Lab</span>
        </span>
        <h2 className="col-[3/8] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/8] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] max-sm:text-[clamp(28px,8vw,36px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)]">
          Dev Playground
        </h2>
        <p className="col-[9/12] max-sm:col-[1/5] max-sm:mt-3 sm:col-[1/5] sm:mt-3 lg:col-[9/12] lg:mt-0 font-medium text-sm leading-[120%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)] self-end lg:max-dt:text-[clamp(11px,0.8vw+0.8px,14px)]">
          Personal projects I built for fun, handcrafted with zero AI involvement. Pure code, pure creativity.
        </p>
      </Reveal>

      {/* Mobile: horizontal scroll */}
      <div className="lg:hidden mt-8">
        <MobileHorizontalScroll className="">
          {DEV_PROJECTS.map((project) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 snap-start block"
              style={{ width: "min(82vw, 360px)" }}
              aria-label={`Visit ${project.title}, opens in new tab`}
            >
              <div className="relative z-10 h-full flex flex-col overflow-hidden border border-white/[0.06] rounded-xl bg-[rgba(255,255,255,0.02)]">
                <div className="relative w-full aspect-video overflow-hidden">
                  <img
                    src={project.heroImage}
                    alt={`${project.title} hero`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <h3 className="font-medium text-[clamp(20px,5vw,26px)] leading-[100%] tracking-[-0.06em] text-[#c5c5c5]">
                    {project.title}
                  </h3>
                  <p className="font-medium text-[13px] leading-[140%] tracking-[-0.01em] text-[rgba(197,197,197,0.45)]">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.tech.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase rounded-full border border-white/[0.08] text-[rgba(197,197,197,0.35)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </MobileHorizontalScroll>
      </div>

      {/* Desktop: motion grid with hover/fade effects */}
      <motion.div
        className="hidden lg:grid grid-cols-12 gap-5 mt-[50px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="col-span-2" />
        {DEV_PROJECTS.map((project) => {
          const isHovered = hoveredId === project.id;
          const isFaded = hoveredId !== null && !isHovered;

          return (
            <motion.a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              className="col-span-3 group relative block overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                opacity: isFaded ? 0.35 : 1,
                transition: "opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
              aria-label={`Visit ${project.title}, opens in new tab`}
            >
              <div className="relative z-10 h-full flex flex-col overflow-hidden border border-white/[0.06] rounded-xl bg-[rgba(255,255,255,0.02)] backdrop-blur-sm transition-all duration-500 group-hover:border-white/[0.12] group-hover:bg-[rgba(255,255,255,0.04)]">
                <div className="relative w-full aspect-video overflow-hidden">
                  <img
                    src={project.heroImage}
                    alt={`${project.title} hero`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
                <div className="p-8 flex flex-col justify-between flex-1 min-h-[220px]">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-[11px] tracking-[0.2em] uppercase text-[rgba(197,197,197,0.25)]">
                      {String(DEV_PROJECTS.indexOf(project) + 1).padStart(2, "0")}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/5 group-hover:rotate-[0deg] rotate-[-45deg]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[rgba(197,197,197,0.4)] transition-colors duration-300 group-hover:text-[#c5c5c5]">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-medium text-[clamp(26px,1.923vw-0.92px,36px)] leading-[100%] tracking-[-0.06em] text-[#c5c5c5] lg:max-dt:text-[clamp(22px,2.133vw-3.84px,30px)]">
                      <AnimatedText text={project.title} className="projects-name-text" />
                    </h3>
                    <p className="mt-3 font-medium text-[13px] leading-[140%] tracking-[-0.01em] text-[rgba(197,197,197,0.45)] max-w-[90%]">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {project.tech.map((tag) => (
                      <span key={tag} className="px-3 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase rounded-full border border-white/[0.08] text-[rgba(197,197,197,0.35)] transition-all duration-300 group-hover:border-white/[0.15] group-hover:text-[rgba(197,197,197,0.55)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(139,92,246,0.5)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </motion.a>
          );
        })}
      </motion.div>
    </section>
  );
}
