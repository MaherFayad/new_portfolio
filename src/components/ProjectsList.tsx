"use client";

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTransitionRouter } from "@/components/PageTransition";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import AnimatedText from "./AnimatedText";
import { PROJECTS } from "@/data/projects";

// Load Three.js component dynamically only on the client-side
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
  const [webglActive, setWebglActive] = useState(false);
  const [webglReady, setWebglReady] = useState(false);

  const measureWidthRef = useRef<() => void>(() => { });

  const handleWebGLReady = useCallback(() => {
    setWebglReady(true);
  }, []);

  // Pre-load all covers as HTML Image elements
  useEffect(() => {
    if (projects.length === 0) return;
    for (const p of projects) {
      const cover = p.images[0];
      if (cover) {
        const img = new window.Image();
        img.src = cover;
      }
    }
    const displacement = new window.Image();
    displacement.src = "/displacement.webp";
  }, [projects]);

  // Pre-load inside Three.js texture cache
  useEffect(() => {
    if (projects.length === 0) return;
    const covers = projects.map((p) => p.images[0]).filter(Boolean);
    webglRef.current?.preloadImages(covers);
  }, [projects, size.width, webglActive]);

  // Detect viewport size
  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    setIsMobile(query.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  // Lazy-load WebGL canvas on desktop when project container approaches viewport
  useEffect(() => {
    if (isMobile) {
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
  }, [isMobile]);

  // Handle sizes and canvas layouts via observers
  useLayoutEffect(() => {
    if (isMobile) {
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
  }, [isMobile, projects.length]);

  const handleMouseEnter = (index: number) => {
    setHoveredIdx(index);
    if (index === activeIdx) return;
    setActiveIdx(index);

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
    <section id="projects-section" className="mt-[clamp(80px,9.615vw-54.6px,130px)] lg:max-dt:mt-[clamp(90px,5.333vw-16.3px,90px)] sm:max-lg:mt-[60px] max-sm:mt-10">

      {/* Viewport heading reveal */}
      <Reveal className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-[last_baseline]">
        <span className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>Best</span>
          <span>Cases</span>
        </span>
        <h2 className="col-[10/12] max-sm:col-[3/5] sm:col-[3/5] lg:col-[10/12] font-medium text-[clamp(28px,2.308vw-4.3px,40px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] text-right max-sm:text-[clamp(22px,6vw,28px)] lg:max-dt:text-[clamp(28px,3.2vw-4.77px,40px)] dt:text-[clamp(28px,2.308vw-4.3px,40px)]">
          Projects
        </h2>
      </Reveal>

      {isMobile ? (
        /* Mobile Layout: 2-column grid cards list */
        <>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 max-sm:grid-cols-1">
            {projects.map((project, index) => (
              <Reveal key={project.slug} delay={0.05 * index} className="flex flex-col">
                <button
                  type="button"
                  aria-label={`Open project ${project.title.replace("\n", " ")}`}
                  className="relative w-full aspect-square overflow-hidden border border-white/10 bg-[#050505] cursor-pointer"
                  onClick={() => openProject(project)}
                >
                  {project.images[0] && (
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      sizes="(min-width: 640px) and (max-width: 1023px) 50vw, 100vw"
                      className="object-cover"
                    />
                  )}
                </button>
                <button
                  type="button"
                  aria-label={`Open project ${project.title.replace("\n", " ")}`}
                  onClick={() => openProject(project)}
                  className="mt-5 text-left font-medium text-[1.125rem] leading-[1.15] tracking-[-0.06em] text-[#c5c5c5] no-underline"
                >
                  <AnimatedText text={project.title.replace("\n", " ")} className="projects-name-text" />
                </button>
              </Reveal>
            ))}
          </div>
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
                  className="font-medium text-[clamp(40px,3.462vw-8.47px,58px)] leading-[100%] tracking-[-0.06em] text-[#c5c5c5] no-underline text-right w-full block transition-opacity duration-300 max-sm:text-[clamp(24px,6vw,32px)] lg:max-dt:text-[clamp(40px,4.8vw-9.15px,58px)] dt:text-[clamp(40px,3.462vw-8.47px,58px)]"
                  style={{
                    opacity: hoveredIdx !== null && hoveredIdx !== index ? 0.3 : 1,
                  }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => handleClick(e, project)}
                >
                  <AnimatedText text={project.title.replace("\n", " ")} className="projects-name-text" />
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
                {webglActive && (
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
