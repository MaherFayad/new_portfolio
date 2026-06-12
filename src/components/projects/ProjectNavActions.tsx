"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import AnimatedText from "@/components/AnimatedText";
import Magnetic from "@/components/Magnetic";
import type { Project } from "@/data/projects";

interface ProjectNavActionsProps {
  nextProject: Project | null;
}

export default function ProjectNavActions({ nextProject }: ProjectNavActionsProps) {
  const nextHref = nextProject
    ? nextProject.externalUrl ?? `/projects/${nextProject.slug}`
    : null;
  const nextIsExternal = Boolean(nextProject?.externalUrl);

  return (
    <section className="mt-20 max-sm:mt-14">
      <Reveal className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3">
        <span className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>Keep</span>
          <span>Going</span>
        </span>
        <h2 className="col-[3/6] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/6] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] max-sm:text-[clamp(28px,8vw,36px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)]">
          What&apos;s next
        </h2>
      </Reveal>

      <div className="mt-[50px] max-sm:mt-6 border-t border-white/10">
        <Reveal delay={0.04}>
          <Magnetic range={80} strength={0.25}>
            <Link
              href="/contacts"
              className="group grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 py-10 max-sm:py-6 border-b border-white/10 items-center no-underline hover:opacity-80 transition-opacity duration-300"
            >
              <span className="col-[3/4] max-sm:col-[1/5] sm:col-[1/2] lg:col-[3/4] font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)]">
                01
              </span>
              <span className="col-[4/8] max-sm:col-[1/5] sm:col-[2/5] lg:col-[4/8] font-medium text-[clamp(24px,1.8vw,32px)] max-sm:text-[20px] leading-[110%] tracking-[-0.04em] text-[#c5c5c5]">
                Contact
              </span>
              <div className="col-[8/12] max-sm:col-[1/5] sm:col-[1/5] lg:col-[8/12] flex items-center justify-between gap-6 max-sm:mt-2">
                <p className="font-medium text-sm text-[#c5c5c5] opacity-70 leading-[150%]">
                  Discuss a role, freelance project, or design systems engagement.
                </p>
                <img
                  alt=""
                  src="/arcon.svg"
                  width="26"
                  height="26"
                  className="shrink-0 w-6 h-6 opacity-70 transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
            </Link>
          </Magnetic>
        </Reveal>

        {nextProject && nextHref && (
          <Reveal delay={0.08}>
            <Magnetic range={80} strength={0.25}>
              <Link
                href={nextHref}
                target={nextIsExternal ? "_blank" : undefined}
                rel={nextIsExternal ? "noopener noreferrer" : undefined}
                className="group grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 py-10 max-sm:py-6 border-b border-white/10 items-center no-underline hover:opacity-80 transition-opacity duration-300"
              >
                <span className="col-[3/4] max-sm:col-[1/5] sm:col-[1/2] lg:col-[3/4] font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)]">
                  02
                </span>
                <div className="col-[4/8] max-sm:col-[1/5] sm:col-[2/5] lg:col-[4/8] flex flex-col gap-2">
                  <span className="font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none">
                    Next project
                  </span>
                  <span className="font-medium text-[clamp(24px,1.8vw,32px)] max-sm:text-[20px] leading-[110%] tracking-[-0.04em] text-[#c5c5c5]">
                    <AnimatedText text={nextProject.title} className="projects-name-text" />
                  </span>
                </div>
                <div className="col-[8/12] max-sm:col-[1/5] sm:col-[1/5] lg:col-[8/12] flex items-center justify-between gap-6 max-sm:mt-2">
                  <div className="flex items-center gap-5 min-w-0 flex-1">
                    {nextProject.images[0] && (
                      <div className="shrink-0 w-16 h-16 max-sm:w-14 max-sm:h-14 border border-white/10 overflow-hidden bg-[#050505]">
                        <img
                          alt=""
                          src={nextProject.images[0]}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <p className="font-medium text-sm text-[#c5c5c5] opacity-70 leading-[150%] line-clamp-2">
                      {nextProject.subtitle}
                    </p>
                  </div>
                  <img
                    alt=""
                    src="/arr.svg"
                    width="32"
                    height="32"
                    className="shrink-0 w-8 h-8 opacity-70 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </Link>
            </Magnetic>
          </Reveal>
        )}
      </div>
    </section>
  );
}
