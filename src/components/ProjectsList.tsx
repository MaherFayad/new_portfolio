"use client";

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTransitionRouter } from "@/components/PageTransition";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import AnimatedText from "./AnimatedText";
import { PROJECTS } from "@/data/projects";
import { useMouseEffectsEnabled } from "@/hooks/useMouseEffectsEnabled";
import MobileHorizontalScroll from "./MobileHorizontalScroll";

// Load Three.js displacement canvas only on wide desktop viewports
const DisplacementHover = dynamic(() => import("./DisplacementHover"), {
  ssr: false,
});

const easeBezier = "cubic-bezier(0.76, 0, 0.24, 1)";
const viewportOpts = { once: true, amount: 0.12, margin: "0px 0px -48px 0px" };

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22, marginBottom: 30 },
  visible: {
    opacity: 1,
    y: 0,
    marginBottom: 0,
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function ProjectsList() {
  const router = useTransitionRouter();
  const projects = PROJECTS;
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const webglRef = useRef<any>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const displacementEnabled = useMouseEffectsEnabled();
  const [webglActive, setWebglActive] = useState(false);
  const [webglReady, setWebglReady] = useState(false);

  const measureWidthRef = useRef<() => void>(() => { });

  const handleWebGLReady = useCallback(() => {
    setWebglReady(true);
  }, []);

  // Pre-load cover images for the static fallback preview
  useEffect(() => {
    if (projects.length === 0 || !displacementEnabled) return;
    for (const p of projects) {
      const cover = p.images[0];
      if (cover) {
        const img = new window.Image();
        img.src = cover;
      }
    }
    const displacement = new window.Image();
    displacement.src = "/displacement.webp";
  }, [projects, displacementEnabled]);

  // Pre-load inside Three.js texture cache
  useEffect(() => {
    if (projects.length === 0 || !displacementEnabled) return;
    const covers = projects.map((p) => p.images[0]).filter(Boolean);
    webglRef.current?.preloadImages(covers);
  }, [projects, size.width, webglActive, displacementEnabled]);

  // Detect viewport size
  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    setIsMobile(query.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  // Lazy-load WebGL canvas when project preview approaches viewport (1100px+ only)
  useEffect(() => {
    if (!displacementEnabled) {
      setWebglActive(false);
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setWebglActive(true);
        }
      },
      { rootMargin: "100px", threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [displacementEnabled]);

  // Handle sizes and canvas layouts via observers
  useLayoutEffect(() => {
    if (!displacementEnabled) {
      setWebglActive(false);
      measureWidthRef.current = () => { };
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const handleResize = () => {
      const w = el.offsetWidth;
      if (w > 0) {
        setSize({ width: w, height: w });
      }
    };

    measureWidthRef.current = handleResize;

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(el);
    handleResize();

    const frameId = requestAnimationFrame(() => {
      handleResize();
    });

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      measureWidthRef.current = () => { };
    };
  }, [displacementEnabled, projects.length]);

  const handleMouseEnter = (index: number) => {
    setHoveredIdx(index);
    if (index === activeIdx) return;
    setActiveIdx(index);

    if (!displacementEnabled) return;

    const nextCover = projects[index]?.images[0];
    if (nextCover) {
      webglRef.current?.transitionTo(nextCover);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIdx(null);
  };

  const getHref = (project: (typeof projects)[number]) =>
    project.externalUrl ?? `/projects/${project.slug}`;

  const openProject = (project: (typeof projects)[number]) => {
    if (project.externalUrl) {
      window.open(project.externalUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push(`/projects/${project.slug}`);
    }
  };

  const handleClick = (e: React.MouseEvent, project: (typeof projects)[number]) => {
    // Let normal (and modified) clicks on external links use the browser's default behavior.
    if (project.externalUrl) return;
    e.preventDefault();
    router.push(`/projects/${project.slug}`);
  };

  const activeImage = projects[activeIdx]?.images[0] ?? projects[0]?.images[0] ?? "";
  const activeTitle = projects[activeIdx]?.title ?? projects[0]?.title ?? "";

  return (
    <section id="projects-section" className="mt-[clamp(20px,3vw,40px)] lg:max-dt:mt-[30px] sm:max-lg:mt-[25px] max-sm:mt-[15px]">

      {/* Viewport heading reveal */}
      <Reveal className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-[last_baseline]">
        <span className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>Best</span>
          <span>Cases</span>
        </span>
        <h2 className="col-[10/12] max-sm:col-[1/5] sm:col-[3/5] lg:col-[10/12] font-medium text-[clamp(28px,2.308vw-4.3px,40px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] text-right max-sm:text-left max-sm:text-[clamp(22px,6vw,28px)] lg:max-dt:text-[clamp(28px,3.2vw-4.77px,40px)] dt:text-[clamp(28px,2.308vw-4.3px,40px)]">
          Projects
        </h2>
      </Reveal>

      {isMobile ? (
        /* Mobile Layout: horizontal scroll cards, ~2.5 visible for scroll teasing */
        <>
          <MobileHorizontalScroll className="mt-8">
            {projects.map((project, index) => (
              <Reveal
                key={project.slug}
                delay={0.04 * index}
                className="shrink-0 snap-start overflow-hidden flex flex-col"
                style={{ width: "clamp(220px, 68vw, 320px)" }}
              >
                <a
                  href={getHref(project)}
                  target={project.externalUrl ? "_blank" : undefined}
                  rel={project.externalUrl ? "noopener noreferrer" : undefined}
                  aria-label={`Open project ${project.title.replace("\n", " ")}`}
                  className="relative w-full overflow-hidden bg-[#050505] cursor-pointer block"
                  style={{ aspectRatio: "4/5" }}
                  onClick={(e) => handleClick(e, project)}
                >
                  {project.images[0] && (
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1023px) 70vw, 100vw"
                      className="object-cover"
                    />
                  )}
                  {project.externalUrl && (
                    <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-[#c5c5c5]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-[1.05rem] h-[1.05rem]"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </div>
                  )}
                </a>
                <a
                  href={getHref(project)}
                  target={project.externalUrl ? "_blank" : undefined}
                  rel={project.externalUrl ? "noopener noreferrer" : undefined}
                  aria-label={`Open project ${project.title.replace("\n", " ")}`}
                  onClick={(e) => handleClick(e, project)}
                  className="mt-3 text-left font-medium text-[1rem] leading-[1.15] tracking-[-0.06em] text-[#c5c5c5] no-underline block"
                >
                  <AnimatedText text={project.title.replace("\n", " ")} className="projects-name-text" />
                </a>
              </Reveal>
            ))}
          </MobileHorizontalScroll>
        </>
      ) : (
        /* Desktop Layout: Interactive Hover list and Three.js canvas */
        <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 mt-[50px] max-sm:mt-6 items-start">

          {/* Left: Text links */}
          <motion.div
            className="col-[1/7] max-sm:col-[1/5] sm:col-[1/5] lg:col-[1/7] flex flex-col items-end w-full"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOpts}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.slug}
                variants={itemVariants}
                className="w-full flex justify-end"
              >
                <a
                  href={getHref(project)}
                  target={project.externalUrl ? "_blank" : undefined}
                  rel={project.externalUrl ? "noopener noreferrer" : undefined}
                  className="font-medium text-[clamp(40px,3.462vw-8.47px,58px)] leading-[100%] tracking-[-0.06em] text-[#c5c5c5] no-underline w-full flex items-center justify-end transition-opacity duration-300 max-sm:text-[clamp(24px,6vw,32px)] lg:max-dt:text-[clamp(40px,4.8vw-9.15px,58px)] dt:text-[clamp(40px,3.462vw-8.47px,58px)]"
                  style={{
                    opacity: hoveredIdx !== null && hoveredIdx !== index ? 0.3 : 1,
                  }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => handleClick(e, project)}
                >
                  <AnimatedText text={project.title.replace("\n", " ")} className="projects-name-text" />
                  {project.externalUrl && (
                    <motion.span
                      initial={{ width: 0, marginLeft: 0, opacity: 0, scale: 0.6, x: "-0.2em", y: "0.2em" }}
                      animate={{
                        width: hoveredIdx === index ? "0.75em" : 0,
                        marginLeft: hoveredIdx === index ? "0.15em" : 0,
                        opacity: hoveredIdx === index ? 1 : 0,
                        scale: hoveredIdx === index ? 1 : 0.6,
                        x: hoveredIdx === index ? 0 : "-0.2em",
                        y: hoveredIdx === index ? 0 : "0.2em",
                      }}
                      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                      className="inline-flex items-center justify-center shrink-0 overflow-hidden text-current"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-[0.75em] h-[0.75em]"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </motion.span>
                  )}
                </a>
              </motion.div>
            ))}
          </motion.div>

          {/* Right: Sticky WebGL Canvas preview */}
          <div className="col-[8/12] max-sm:hidden sm:max-lg:hidden sticky top-10">
            <Reveal className="w-full overflow-hidden relative projects-canvas-wrap">
              <div ref={containerRef} className="relative w-full aspect-square">
                {/* Fallback image */}
                {activeImage && (
                  <div
                    className={`absolute inset-0 ${webglActive && webglReady ? "z-0" : "z-[1]"}`}
                    style={{
                      opacity: webglActive && webglReady ? 0 : 1,
                      transition: `opacity 450ms ${easeBezier}`,
                      pointerEvents: webglActive && webglReady ? "none" : "auto",
                    }}
                  >
                    <Image
                      src={activeImage}
                      alt={activeTitle}
                      fill
                      sizes="(min-width: 1024px) 33vw, 0"
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                {/* WebGL Canvas */}
                {displacementEnabled && webglActive && (
                  <div
                    className="absolute inset-0 z-[1]"
                    style={{
                      opacity: +webglReady,
                      transition: `opacity 450ms ${easeBezier}`,
                      pointerEvents: webglReady ? "auto" : "none",
                    }}
                  >
                    <DisplacementHover
                      ref={webglRef}
                      initialImage={activeImage}
                      displacementImage="/displacement.webp"
                      intensity={0.5}
                      speedIn={0.6}
                      width={size.width}
                      height={size.height}
                      onWebGLReady={handleWebGLReady}
                    />
                  </div>
                )}
              </div>
            </Reveal>

            {/* Bottom text banner */}
            <Reveal delay={0.2} as="p" className="mt-[clamp(30px,3.846vw-23.85px,50px)] flex flex-col font-medium text-[clamp(14px,1.154vw-2.15px,20px)] leading-[100%] tracking-[-0.03em] text-[#c5c5c5] !opacity-70 max-w-[calc((100%-20px)/4*2+20px)] [&>span]:block [&>span]:mb-1 lg:max-dt:text-[clamp(14px,1.6vw-2.38px,20px)] dt:text-[clamp(14px,1.154vw-2.15px,20px)]">
              <span>Let's give the next level</span>
              <span>for your business</span>
            </Reveal>
          </div>

        </div>
      )}
    </section>
  );
}
