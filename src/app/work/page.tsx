"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import AnimatedText from "@/components/AnimatedText";
import WavyString from "@/components/WavyString";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import { useTransitionRouter } from "@/components/PageTransition";
import { PROJECTS } from "@/data/projects";

export default function WorkPage() {
  const router = useTransitionRouter();

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

  return (
    <main className="min-h-screen w-full px-5 max-sm:px-3 overflow-x-clip flex flex-col pb-0">

      {/* Header */}
      <Reveal aboveFold as="header" className="w-full mt-5 relative z-10">
        <SiteHeader variant="static" />
      </Reveal>

      {/* Page Title Hero */}
      <section className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 w-full items-start mt-[clamp(80px,9vw,130px)] max-sm:mt-20">
        <Reveal aboveFold className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-start lg:row-start-1 [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>Selected</span>
          <span>Work</span>
        </Reveal>

        <Reveal
          aboveFold
          as="h1"
          className="col-[3/10] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/10] text-[#c5c5c5] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] max-sm:text-[clamp(28px,8vw,40px)] sm:text-[clamp(40px,4.688vw,56px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)] leading-[100%] tracking-[-0.06em] self-start min-w-0"
        >
          <span className="block pl-[calc((100%+20px)/7)] lg:max-dt:pl-[calc((100%+20px)/7)] sm:max-lg:pl-[calc((100%+20px)/4)] max-sm:pl-0">
            All Projects
          </span>
          product design work across banking, travel, mobile, and web platforms
        </Reveal>
      </section>

      <WavyString className="mt-20 max-sm:mt-10" />

      {/* Projects Grid */}
      <section className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3">
        <div className="col-[3/-1] max-sm:col-[1/-1] sm:col-[1/-1] lg:col-[3/-1] grid grid-cols-2 max-sm:grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-16 max-sm:gap-y-10">
          {PROJECTS.map((project, index) => (
            <Reveal key={project.slug} delay={0.04 * (index % 4)} className="flex flex-col">
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
                    sizes="(max-width: 1023px) 100vw, 50vw"
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
          ))}
        </div>
      </section>

      <WavyString className="mt-20" />

      <Footer />

    </main>
  );
}
