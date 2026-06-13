"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import AnimatedText from "./AnimatedText";
import MobileHorizontalScroll from "./MobileHorizontalScroll";
import { useTransitionRouter } from "@/components/PageTransition";
import { PROJECTS } from "@/data/projects";

export default function AboutProjectsScroll() {
  const router = useTransitionRouter();

  const openProject = (project: (typeof PROJECTS)[number]) => {
    if (project.externalUrl) {
      window.open(project.externalUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push(`/projects/${project.slug}`);
    }
  };

  return (
    <section className="mt-16">
      <Reveal className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3">
        <span className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>Selected</span>
          <span>Work</span>
        </span>
        <h2 className="col-[3/6] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/6] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] max-sm:text-[clamp(28px,8vw,36px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)]">
          Projects
        </h2>
      </Reveal>

      <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 max-sm:mt-6 mt-[50px]">
        <div className="col-[3/-1] max-sm:col-[1/-1] sm:col-[1/-1] lg:col-[3/-1] -mx-5 max-sm:-mx-3 px-5 max-sm:px-3">
          <MobileHorizontalScroll className="lg:cursor-grab lg:active:cursor-grabbing">
            {PROJECTS.map((project, index) => (
              <Reveal
                key={project.slug}
                delay={0.04 * index}
                className="shrink-0 snap-start flex flex-col"
                style={{ width: "clamp(240px, 72vw, 380px)" }}
              >
                <button
                  type="button"
                  aria-label={`Open project ${project.title.replace("\n", " ")}`}
                  className="relative w-full overflow-hidden bg-[#050505] border border-white/5 cursor-pointer group"
                  style={{ aspectRatio: "4/5" }}
                  onClick={() => openProject(project)}
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
                </button>
                <button
                  type="button"
                  aria-label={`Open project ${project.title.replace("\n", " ")}`}
                  onClick={() => openProject(project)}
                  className="mt-4 text-left flex flex-col gap-2"
                >
                  <span className="font-medium text-[clamp(18px,1.4vw,24px)] leading-[110%] tracking-[-0.04em] text-[#c5c5c5]">
                    <AnimatedText text={project.title.replace("\n", " ")} className="projects-name-text" />
                  </span>
                  <span className="font-medium text-sm leading-[140%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)] line-clamp-2">
                    {project.subtitle}
                  </span>
                </button>
              </Reveal>
            ))}
          </MobileHorizontalScroll>
        </div>
      </div>
    </section>
  );
}
