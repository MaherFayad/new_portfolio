"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import AnimatedText from "@/components/AnimatedText";
import WavyString from "@/components/WavyString";
import FooterStripe from "@/components/FooterStripe";
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

  return (
    <main className="min-h-screen w-full px-5 max-sm:px-3 overflow-x-clip flex flex-col pb-0">

      {/* Header */}
      <Reveal aboveFold as="header" className="w-full mt-5 relative z-10">
        <SiteHeader variant="static" />
      </Reveal>

      {/* Page Title Hero */}
      <section className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 w-full items-start mt-[clamp(80px,9vw,130px)] max-sm:mt-20">
        <Reveal aboveFold className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-start lg:row-start-1 [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
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
          product design work across web, mobile, and Web3
        </Reveal>
      </section>

      <WavyString className="mt-20 max-sm:mt-10" />

      {/* Projects Grid */}
      <section className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3">
        <div className="col-[3/-1] max-sm:col-[1/-1] sm:col-[1/-1] lg:col-[3/-1] grid grid-cols-2 max-sm:grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-16 max-sm:gap-y-10">
          {PROJECTS.map((project, index) => (
            <Reveal key={project.slug} delay={0.04 * (index % 4)} className="flex flex-col">
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
                    sizes="(max-width: 1023px) 100vw, 50vw"
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
        </div>
      </section>

      <WavyString className="mt-20" />

      {/* Footer Section */}
      <footer className="pb-10">
        {/* Footer logo banner */}
        <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 max-sm:mt-6 mt-10 max-sm:hidden">
          <Reveal className="col-[2/4] sm:col-[1/3] lg:col-[2/4] block w-[219px] max-sm:w-[180px] h-[55px]">
            <Link href="/">
              <img alt="Maher Fayad" src="/assets/logo.svg" width="200" height="55" className="w-auto h-[55px]" />
            </Link>
          </Reveal>
        </div>

        {/* Footer labels */}
        <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 mt-8">
          <Reveal className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-right">
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
              Maher
            </span>
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
              Fayad
            </span>
          </Reveal>
          <Reveal className="col-[2/3] max-sm:hidden sm:max-lg:hidden flex flex-col text-left">
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm !text-[#c5c5c5]">
              Product
            </span>
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm !text-[#c5c5c5]">
              Designer
            </span>
          </Reveal>
        </div>

        {/* Wobbly animated footer line banner */}
        <div className="mt-[60px] max-sm:mt-8 w-full h-[320px] max-sm:h-[200px] lg:max-dt:h-[clamp(220px,22.333vw-33.1px,440px)] relative overflow-hidden">
          <FooterStripe />
        </div>

        {/* Footer bottom details & mail link */}
        <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 max-sm:mt-8 mt-[60px] sm:mt-[20px] md:mt-[20px] items-start">
          <Reveal className="col-[1/3] row-start-2 sm:col-[1/3] lg:col-[1/3] lg:block sm:hidden max-sm:hidden">
            <img alt="" src="/dc.svg" width="30" height="31" className="block" />
            <p className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm mt-3.5 leading-[140%]">
              Creating intuitive user interfaces and user experiences across complex web apps and digital platforms.
            </p>
          </Reveal>

          <Reveal className="col-[4/9] sm:col-[1/5] lg:col-[4/9] sm:row-start-2 max-sm:col-[1/3]">
            <Link href="/contacts" className="font-medium text-[64px] leading-[100%] tracking-[-0.06em] text-[#c5c5c5] no-underline block max-sm:text-[clamp(36px,8vw,34px)] lg:max-dt:text-[clamp(44px,5.333vw-10.61px,64px)] md:max-dt:text-[clamp(32px,5.333vw-10.61px,54px)] sm:max-lg:text-[clamp(26px,6.25vw,28px)] dt:text-[64px]">
              <span className="pl-[calc((100%+20px)/5)] block max-sm:pl-0">
                <AnimatedText text="I am ready" className="projects-name-text" />
              </span>
              <AnimatedText text="to discuss your project" className="projects-name-text" />
            </Link>
          </Reveal>

          <Reveal className="col-[10/13] sm:col-[3/5] lg:col-[10/13] lg:max-dt:col-[9/13] max-sm:col-[1/5] max-sm:row-start-2 sm:row-start-2 max-sm:mt-10 flex flex-col items-start">
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm pb-2.5">
              Contacts
            </span>
            <a
              href="mailto:Contact@maherfayad.com"
              className="mt-[30px] max-sm:mt-4 max-sm:text-[22px] font-medium text-[38px] leading-[100%] tracking-[-0.06em] text-[#c5c5c5] underline decoration-[7%] underline-offset-[12.5%] hover:opacity-70 lg:max-dt:text-[clamp(26px,3.2vw-6.77px,38px)] sm:max-dt:text-[clamp(22px,3.2vw-6.77px,26px)] dt:text-[38px]"
            >
              Contact@maherfayad.com
            </a>
          </Reveal>
        </div>
      </footer>

    </main>
  );
}
