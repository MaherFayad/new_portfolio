"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import AnimatedText from "@/components/AnimatedText";
import Magnetic from "@/components/Magnetic";
import type { Project } from "@/data/projects";

interface ProjectNavActionsProps {
  nextProject: Project | null;
}

const sideLabelClass =
  "flex flex-col text-left [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm";

const proseClass =
  "font-medium text-base max-sm:text-sm leading-[150%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)] lg:max-dt:text-[clamp(12px,0.8vw+0.8px,11px)] dt:text-md";

export default function ProjectNavActions({ nextProject }: ProjectNavActionsProps) {
  const nextHref = nextProject
    ? nextProject.externalUrl ?? `/projects/${nextProject.slug}`
    : null;
  const nextIsExternal = Boolean(nextProject?.externalUrl);

  return (
    <section className="mt-20 max-sm:mt-14">
      <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-start">
        <Reveal className={`col-span-1 max-sm:hidden sm:max-lg:hidden ${sideLabelClass}`}>
          <span>Keep</span>
          <span>Going</span>
        </Reveal>

        <Reveal
          as="h2"
          className="col-[3/7] max-sm:col-[1/5] sm:col-[1/4] lg:col-[3/7] font-medium text-[clamp(28px,2.308vw-4.3px,40px)] leading-[100%] tracking-[-0.06em] text-[#c5c5c5] max-sm:text-[clamp(22px,6vw,28px)]"
        >
          What&apos;s next
        </Reveal>

        <Reveal delay={0.05} className={`col-[11/12] max-sm:hidden sm:max-lg:hidden ${sideLabelClass}`}>
          <span>Contact</span>
          <span>or browse</span>
        </Reveal>
      </div>

      <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 mt-10 max-sm:mt-8 items-start">
        {/* Contact */}
        <Reveal className="col-[3/6] max-sm:col-[1/5] sm:col-[1/3] lg:col-[3/6]">
          <span className={`${sideLabelClass} max-sm:flex sm:hidden`}>
            <span>Contact</span>
          </span>
          <Magnetic range={60} strength={0.35}>
            <Link
              href="/contacts"
              className="group mt-4 max-sm:mt-2 inline-flex items-center gap-4 no-underline"
            >
              <div className="relative w-14 h-14 shrink-0">
                <div className="absolute inset-[2px] rounded-full bg-[#c5c5c5] scale-0 group-hover:scale-100 transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) z-2" />
                <svg className="absolute top-0 left-0 z-1" height="56" viewBox="0 0 80 80" width="56">
                  <circle cx="40" cy="40" r="38" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
                </svg>
                <svg className="absolute top-0 left-0 z-2 rotate-90" height="56" viewBox="0 0 80 80" width="56">
                  <circle
                    cx="40"
                    cy="40"
                    fill="none"
                    r="38"
                    stroke="#c5c5c5"
                    strokeDasharray="238.76"
                    strokeDashoffset="226.82"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c5c5c5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-3 transition-colors duration-300 group-hover:stroke-black"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <span className="font-semibold text-sm uppercase text-[#c5c5c5] underline underline-offset-4 decoration-[10%] group-hover:opacity-70">
                Discuss a project
              </span>
            </Link>
          </Magnetic>
          <p className={`${proseClass} mt-4 max-sm:mt-3 max-w-[280px]`}>
            Senior roles, freelance work, or design systems.
          </p>
        </Reveal>

        {/* Next project */}
        {nextProject && nextHref && (
          <Reveal delay={0.08} className="col-[7/12] max-sm:col-[1/5] sm:col-[2/5] lg:col-[7/12] max-sm:mt-10">
            <span className={sideLabelClass}>
              <span>Next</span>
              <span>Project</span>
            </span>

            <Magnetic range={52} strength={0.1} className="block w-full">
              <Link
                href={nextHref}
                target={nextIsExternal ? "_blank" : undefined}
                rel={nextIsExternal ? "noopener noreferrer" : undefined}
                className="group block mt-4 max-sm:mt-3 no-underline w-full"
              >
                {nextProject.images[0] && (
                  <div className="relative w-full aspect-[2/1] max-sm:aspect-[16/10] border border-white/10 overflow-hidden bg-[#050505] mb-5 max-sm:mb-4">
                    <img
                      alt=""
                      src={nextProject.images[0]}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}

                <span className="font-medium text-[clamp(28px,2.8vw,44px)] max-sm:text-[clamp(22px,6vw,28px)] leading-[100%] tracking-[-0.06em] text-[#c5c5c5] block">
                  <AnimatedText text={nextProject.title} className="projects-name-text" />
                </span>

                <p className={`${proseClass} mt-3 max-w-lg line-clamp-2`}>
                  {nextProject.subtitle}
                </p>

                <span className="mt-5 max-sm:mt-4 inline-flex items-center gap-3 font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] group-hover:text-[#c5c5c5] transition-colors duration-300">
                  {nextIsExternal ? "View on Behance" : "View case study"}
                  <img
                    alt=""
                    src="/arr.svg"
                    width="24"
                    height="24"
                    className="w-6 h-6 opacity-60 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </span>
              </Link>
            </Magnetic>
          </Reveal>
        )}
      </div>
    </section>
  );
}
