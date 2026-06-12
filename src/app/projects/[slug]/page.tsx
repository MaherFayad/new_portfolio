"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useHomeRevealGate } from "@/components/HomeRevealGate";
import Reveal from "@/components/Reveal";
import AnimatedText from "@/components/AnimatedText";
import WavyString from "@/components/WavyString";
import FooterStripe from "@/components/FooterStripe";
import Glitch from "@/components/Glitch";
import Magnetic from "@/components/Magnetic";
import SanarteCaseStudy from "@/components/projects/SanarteCaseStudy";
import LFGCaseStudy from "@/components/projects/LFGCaseStudy";
import CaseFramingSection from "@/components/projects/CaseFramingSection";
import ProjectNavActions from "@/components/projects/ProjectNavActions";
import { PROJECTS } from "@/data/projects";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const revealGate = useHomeRevealGate();
  const slug = params.slug as string;

  // Static data, resolved synchronously (no fetch, no loading screen)
  const project = PROJECTS.find((p) => p.slug === slug) ?? null;
  const nextProjectObj = project
    ? PROJECTS.find((p) => p.slug === project.nextProject) ?? null
    : null;

  // Unknown slug: send home
  useEffect(() => {
    if (!project) router.push("/");
  }, [project, router]);

  if (!project) {
    return null;
  }

  // Get gallery images (excluding the covers if needed, but in the payload, images[0] is cover and others are detail panels!)
  // The first image is the cover (e.g., /1.webp or /2.webp), and images[1..] are the detailed slides.
  const galleryImages = project.images.slice(1);

  return (
    <main className="min-h-screen w-full px-5 max-sm:px-3 overflow-x-clip">

      {/* Top Header bar */}
      <Reveal aboveFold as="header" className="w-full mt-5 relative z-10">
        <div className="grid grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-5 w-full h-8 items-end">
          <div className="col-span-1 lg:col-span-3">
            <Glitch>
              <Link href="/">
                <img
                  alt="Maher Fayad"
                  src="/assets/logo.svg"
                  width="115"
                  height="32"
                  className="w-[115px] h-8"
                />
              </Link>
            </Glitch>
          </div>
          <nav aria-label="Primary" className="col-start-2 lg:col-start-5 lg:col-span-4 max-sm:col-start-3 self-end flex justify-center gap-8 pointer-events-auto">
            <Magnetic range={40} strength={0.4}>
              <Link href="/about" className="font-semibold text-sm uppercase text-[#c5c5c5] underline underline-offset-4 hover:opacity-70">
                ABOUT
              </Link>
            </Magnetic>
            <Magnetic range={40} strength={0.4}>
              <Link href="/contacts" className="font-semibold text-sm uppercase text-[#c5c5c5] underline underline-offset-4 hover:opacity-70">
                CONTACTS
              </Link>
            </Magnetic>
          </nav>
          <div className="col-start-3 lg:col-start-11 max-sm:hidden flex flex-col text-right self-end">
            <span className="block font-semibold text-[clamp(11px,0.533vw+5.54px,14px)] tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none">
              MAHER
            </span>
            <span className="block font-semibold text-[clamp(11px,0.533vw+5.54px,14px)] tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none">
              FAYAD
            </span>
          </div>
          <div className="col-start-4 lg:col-start-12 max-sm:hidden flex flex-col text-left self-end">
            <span className="block font-semibold text-[clamp(11px,0.533vw+5.54px,14px)] tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none">
              PRODUCT
            </span>
            <span className="block font-semibold text-[clamp(11px,0.533vw+5.54px,14px)] tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none">
              DESIGNER
            </span>
          </div>
        </div>
      </Reveal>

      {/* Main Title Section */}
      <section className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 sm:gap-5 md:gap-5 lg:gap-x-5 lg:gap-y-0 mt-[6.25rem] max-sm:mt-[4rem]">
        <Reveal
          aboveFold
          as="h1"
          className="col-[3/9] max-sm:col-[1/5] sm:col-[1/5] md:col-[1/5] lg:col-[3/9] row-start-1 text-[#c5c5c5] font-medium text-[64px] leading-[100%] tracking-[-0.06em] self-start max-sm:text-[clamp(28px,8vw,40px)]"
        >
          <span className="block whitespace-pre-line">{project.title}</span>
        </Reveal>

        <Reveal
          aboveFold
          delay={0.08}
          as="p"
          className="col-[4/8] max-sm:col-[1/5] sm:col-[1/5] md:col-[1/5] lg:max-xl:col-[4/10] xl:col-[4/8] row-start-2 font-medium text-xl leading-[100%] tracking-[-0.03em] text-[#c5c5c5] opacity-70 self-start max-sm:text-base mt-[1.2rem]"
        >
          <span className="block pl-[calc((100%+20px)/4)] max-sm:pl-0 sm:pl-[calc((100%+20px)/4)]">
            {project.subtitle}
          </span>
        </Reveal>
      </section>

      {project.caseFraming && <CaseFramingSection framing={project.caseFraming} />}


      {/* Image Gallery / Case Study Content Grid */}
      <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 sm:gap-5 md:gap-5 lg:gap-x-5 lg:gap-y-0 mt-10 max-sm:mt-8">
        <div className="col-[3/11] max-sm:col-[1/5] sm:col-[1/5] md:col-[1/5] lg:col-[3/11] flex flex-col gap-5 w-full">
          {slug === "sanarte" ? (
            <SanarteCaseStudy />
          ) : slug === "lfg" ? (
            <LFGCaseStudy />
          ) : (
            galleryImages.map((imagePath, idx) => (
              <Reveal key={idx} delay={idx * 0.05} className="w-full">
                <img
                  alt={`${project.title} image ${idx + 1}`}
                  src={imagePath}
                  draggable="false"
                  loading="lazy"
                  className="w-full h-auto block object-cover max-w-full"
                />
              </Reveal>
            ))
          )}
        </div>
      </div>

      <WavyString className="mt-20 max-sm:mt-14" />

      <ProjectNavActions nextProject={nextProjectObj} />

      {/* Interactive Divider */}
      <WavyString className="mt-20" />      {/* Footer Section */}
      <footer className="pb-10">
        {/* Footer logo banner */}
        <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 max-sm:mt-6 mt-10 max-sm:hidden">
          <div className="col-[2/4] sm:col-[1/3] lg:col-[2/4] block w-[219px] max-sm:w-[180px] h-[55px]">
            <Link href="/">
              <img alt="Maher Fayad" src="/assets/logo.svg" width="200" height="55" className="w-auto h-[40px]" />
            </Link>
          </div>
        </div>

        {/* Footer labels */}
        <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 mt-8">
          <div className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-right">
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
              Maher
            </span>
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
              Fayad
            </span>
          </div>
          <div className="col-[2/3] max-sm:hidden sm:max-lg:hidden flex flex-col text-left">
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm !text-[#c5c5c5]">
              Product
            </span>
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm !text-[#c5c5c5]">
              Designer
            </span>
          </div>
        </div>

        {/* Wobbly animated footer line banner */}
        <div className="mt-[60px] max-sm:mt-8 w-full h-[320px] max-sm:h-[200px] lg:max-dt:h-[clamp(220px,22.333vw-33.1px,440px)] relative overflow-hidden">
          <FooterStripe />
        </div>

        {/* Footer bottom details & mail link */}
        <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 max-sm:mt-8 mt-[60px] sm:mt-[20px] md:mt-[20px] items-start">
          <div className="col-[1/3] row-start-2 sm:col-[1/3] lg:col-[1/3] lg:block sm:hidden max-sm:hidden">
            <img alt="" src="/dc.svg" width="30" height="31" className="block" />
            <p className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm mt-3.5 leading-[140%]">
              Creating intuitive user interfaces and user experiences across complex web apps and digital platforms.
            </p>
          </div>

          <div className="col-[4/9] sm:col-[1/5] lg:col-[4/9] sm:row-start-2 max-sm:col-[1/3]">
            <Link href="/contacts" className="font-medium text-[64px] leading-[100%] tracking-[-0.06em] text-[#c5c5c5] no-underline block max-sm:text-[clamp(36px,8vw,34px)] lg:max-dt:text-[clamp(44px,5.333vw-10.61px,64px)] md:max-dt:text-[clamp(32px,5.333vw-10.61px,54px)] sm:max-lg:text-[clamp(26px,6.25vw,28px)] dt:text-[64px]">
              <span className="pl-[calc((100%+20px)/5)] block max-sm:pl-0">
                <AnimatedText text="I am ready" className="projects-name-text" />
              </span>
              <AnimatedText text="to discuss your project" className="projects-name-text" />
            </Link>
          </div>

          <div className="col-[10/13] sm:col-[3/5] lg:col-[10/13] lg:max-dt:col-[9/13] max-sm:col-[1/5] max-sm:row-start-2 sm:row-start-2 max-sm:mt-10 flex flex-col items-start">
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm pb-2.5">
              Contacts
            </span>
            <a
              href="mailto:Contact@maherfayad.com"
              className="mt-[30px] max-sm:mt-4 max-sm:text-[22px] font-medium text-[38px] leading-[100%] tracking-[-0.06em] text-[#c5c5c5] underline decoration-[7%] underline-offset-[12.5%] hover:opacity-70 lg:max-dt:text-[clamp(26px,3.2vw-6.77px,38px)] sm:max-dt:text-[clamp(22px,3.2vw-6.77px,26px)] dt:text-[38px]"
            >
              Contact@maherfayad.com
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}
