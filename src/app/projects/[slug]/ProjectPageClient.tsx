"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useHomeRevealGate } from "@/components/HomeRevealGate";
import Reveal from "@/components/Reveal";
import AnimatedText from "@/components/AnimatedText";
import WavyString from "@/components/WavyString";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import SanarteCaseStudy from "@/components/projects/SanarteCaseStudy";
import LFGCaseStudy from "@/components/projects/LFGCaseStudy";
import CaseFramingSection from "@/components/projects/CaseFramingSection";
import MiniCaseStudy from "@/components/projects/MiniCaseStudy";
import ProjectNavActions from "@/components/projects/ProjectNavActions";
import { PROJECTS } from "@/data/projects";

function galleryImageAlt(projectTitle: string, imagePath: string, idx: number): string {
  const basename = decodeURIComponent(imagePath.split("/").pop() ?? "")
    .replace(/\.\w+$/, "")
    .replace(/%20/g, " ")
    .replace(/[-_]/g, " ")
    .trim();

  if (basename && !/^\d+$/.test(basename)) {
    return `${projectTitle} — ${basename}`;
  }

  return `${projectTitle} — case study panel ${idx + 1}`;
}

export default function ProjectPageClient() {
  const params = useParams();
  const revealGate = useHomeRevealGate();
  const slug = params.slug as string;

  // Static data, resolved synchronously (no fetch, no loading screen)
  const project = PROJECTS.find((p) => p.slug === slug) ?? null;
  const nextProjectObj = project
    ? PROJECTS.find((p) => p.slug === project.nextProject) ?? null
    : null;

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
        <SiteHeader variant="static" />
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
            <>
              {project.miniCase && <MiniCaseStudy miniCase={project.miniCase} />}
              {galleryImages.map((imagePath, idx) => (
                <Reveal key={idx} delay={idx * 0.05} className="w-full">
                  <img
                    alt={galleryImageAlt(project.title, imagePath, idx)}
                    src={imagePath}
                    draggable="false"
                    loading="lazy"
                    className="w-full h-auto block object-cover max-w-full"
                  />
                </Reveal>
              ))}
            </>
          )}
        </div>
      </div>

      <WavyString className="mt-20 max-sm:mt-14" />

      <ProjectNavActions nextProject={nextProjectObj} />

      {/* Interactive Divider */}
      <WavyString className="mt-20" />      {/* Footer Section */}
      <Footer />

    </main>
  );
}
