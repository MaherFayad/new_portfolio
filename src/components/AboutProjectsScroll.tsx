"use client";

import { useRef } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import AnimatedText from "./AnimatedText";
import MobileHorizontalScroll from "./MobileHorizontalScroll";
import { useTransitionRouter } from "@/components/PageTransition";
import { PROJECTS } from "@/data/projects";

const CARD_GAP = 16;

const arrowButtonClassName =
  "group w-[clamp(60px,12vw,86px)] max-sm:w-[60px] lg:w-[86px] h-14 rounded-full bg-[rgba(197,197,197,0.15)] border-none outline-none cursor-pointer flex justify-center items-center relative overflow-hidden transition-all duration-300 z-1 hover:animate-[rotate_0.7s_ease-in-out_both] [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:pointer-events-none [&>span]:group-hover:animate-[storm_0.7s_ease-in-out_both] [&>span]:group-hover:[animation-delay:0.06s]";

export default function AboutProjectsScroll() {
  const router = useTransitionRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const openProject = (project: (typeof PROJECTS)[number]) => {
    if (project.externalUrl) {
      window.open(project.externalUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push(`/projects/${project.slug}`);
    }
  };

  const getHref = (project: (typeof PROJECTS)[number]) =>
    project.externalUrl ?? `/projects/${project.slug}`;

  const handleClick = (e: React.MouseEvent, project: (typeof PROJECTS)[number]) => {
    if (project.externalUrl) return;
    e.preventDefault();
    router.push(`/projects/${project.slug}`);
  };

  const scrollByCard = (direction: 1 | -1) => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector<HTMLElement>("[data-project-card]");
    const amount = (card?.offsetWidth ?? 380) + CARD_GAP;
    container.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section className="mt-16">
      <Reveal className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3">
        <span className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>Selected</span>
          <span>Work</span>
        </span>
        <h2 className="col-[3/6] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/6] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] max-sm:text-[clamp(28px,8vw,36px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)]">
          Projects
        </h2>
      </Reveal>

      <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 max-sm:mt-6 mt-[50px]">
        <div className="col-[3/-1] max-sm:col-[1/-1] sm:col-[1/-1] lg:col-[3/-1] -mx-5 max-sm:-mx-3 px-5 max-sm:px-3">
          <MobileHorizontalScroll ref={scrollRef} className="lg:cursor-grab lg:active:cursor-grabbing">
            {PROJECTS.map((project, index) => (
              <div
                key={project.slug}
                data-project-card
                className="shrink-0 snap-start flex flex-col"
                style={{ width: "clamp(240px, 72vw, 380px)" }}
              >
                <Reveal delay={0.04 * index} className="flex flex-col">
                <a
                  href={getHref(project)}
                  target={project.externalUrl ? "_blank" : undefined}
                  rel={project.externalUrl ? "noopener noreferrer" : undefined}
                  aria-label={`Open project ${project.title.replace("\n", " ")}`}
                  className="relative w-full overflow-hidden bg-[#050505] border border-white/5 cursor-pointer group block"
                  style={{ aspectRatio: "4/5" }}
                  onClick={(e) => handleClick(e, project)}
                >
                  {project.images[0] && (
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1023px) 72vw, 380px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  )}
                  {project.externalUrl && (
                    <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-[#c5c5c5] transition-all duration-300 lg:opacity-0 lg:translate-x-2 lg:-translate-y-2 group-hover:lg:opacity-100 group-hover:lg:translate-x-0 group-hover:lg:translate-y-0">
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
                  className="mt-4 text-left flex flex-col gap-2 no-underline block"
                >
                  <span className="font-medium text-[clamp(18px,1.4vw,24px)] leading-[110%] tracking-[-0.04em] text-[#c5c5c5]">
                    <AnimatedText text={project.title.replace("\n", " ")} className="projects-name-text" />
                  </span>
                  <span className="font-medium text-sm leading-[140%] tracking-[-0.03em] text-[rgba(197,197,197,0.62)] line-clamp-2">
                    {project.subtitle}
                  </span>
                </a>
                </Reveal>
              </div>
            ))}
          </MobileHorizontalScroll>

          <div className="flex gap-2 mt-8 max-sm:hidden">
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Previous project"
              className={arrowButtonClassName}
              type="button"
            >
              <span>
                <img alt="" className="block z-2 transition-[filter] duration-300 w-6 h-6 lg:w-8 lg:h-8" src="/arl.svg" />
              </span>
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Next project"
              className={arrowButtonClassName}
              type="button"
            >
              <span>
                <img alt="" className="block z-2 transition-[filter] duration-300 w-6 h-6 lg:w-8 lg:h-8" src="/arr.svg" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
