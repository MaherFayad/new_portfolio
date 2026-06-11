"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Reveal from "@/components/Reveal";
import AnimatedText from "@/components/AnimatedText";
import WavyString from "@/components/WavyString";
import FooterStripe from "@/components/FooterStripe";
import Glitch from "@/components/Glitch";
import Magnetic from "@/components/Magnetic";
import SanarteCaseStudy from "@/components/projects/SanarteCaseStudy";
import LFGCaseStudy from "@/components/projects/LFGCaseStudy";

interface Project {
  slug: string;
  title: string;
  subtitle: string;
  paragraph: string;
  images: string[];
  nextProject: string;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [nextProjectObj, setNextProjectObj] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data: Project[]) => {
        setProjects(data);
        const current = data.find((p) => p.slug === slug);
        if (current) {
          setProject(current);
          const next = data.find((p) => p.slug === current.nextProject);
          if (next) setNextProjectObj(next);
        } else {
          // Fallback if not found
          router.push("/");
        }
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        router.push("/");
      });
  }, [slug, router]);

  // Handle scroll to top in footer
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <span className="text-sm font-semibold tracking-widest uppercase animate-pulse">
          Loading Project...
        </span>
      </div>
    );
  }

  // Get gallery images (excluding the covers if needed, but in the payload, images[0] is cover and others are detail panels!)
  // The first image is the cover (e.g., /1.webp or /2.webp), and images[1..] are the detailed slides.
  const galleryImages = project.images.slice(1);

  return (
    <main className="min-h-screen w-full px-5 max-sm:px-3 overflow-x-clip">

      {/* Top Header bar */}
      <header className="w-full mt-5 relative z-10">
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
      </header>

      {/* Main Title Section */}
      <section
        className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 sm:gap-5 md:gap-5 lg:gap-x-5 lg:gap-y-0 mt-[6.25rem] max-sm:mt-[4rem]"
        style={{ animation: "fade-up 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0.15s both" }}
      >
        <h1 className="col-[3/9] max-sm:col-[1/5] sm:col-[1/5] md:col-[1/5] lg:col-[3/9] row-start-1 text-[#c5c5c5] font-medium text-[64px] leading-[100%] tracking-[-0.06em] self-start max-sm:text-[clamp(28px,8vw,40px)]">
          <span className="block whitespace-pre-line">{project.title}</span>
        </h1>

        <p className="col-[4/8] max-sm:col-[1/5] sm:col-[1/5] md:col-[1/5] lg:max-xl:col-[4/10] xl:col-[4/8] row-start-2 font-medium text-xl leading-[100%] tracking-[-0.03em] text-[#c5c5c5] opacity-70 self-start max-sm:text-base mt-[1.2rem]">
          <span className="block pl-[calc((100%+20px)/4)] max-sm:pl-0 sm:pl-[calc((100%+20px)/4)]">
            {project.subtitle}
          </span>
        </p>

        <p className="col-[5/7] max-sm:col-[2/5] sm:col-[2/5] md:col-[2/5] lg:max-xl:col-[5/9] xl:col-[5/8] row-start-3 font-medium text-sm leading-[120%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)] self-start mt-[1.2rem]">
          {project.paragraph}
        </p>
      </section>

      {/* Image Gallery / Case Study Content Grid */}
      <div
        className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 sm:gap-5 md:gap-5 lg:gap-x-5 lg:gap-y-0 mt-[60px] max-sm:mt-8"
        style={{ animation: "fade-up 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0.3s both" }}
      >
        <div className="col-[3/11] max-sm:col-[1/5] sm:col-[1/5] md:col-[1/5] lg:col-[3/11] flex flex-col gap-5 w-full">
          {slug === "sanarte" ? (
            <SanarteCaseStudy />
          ) : slug === "lfg" ? (
            <LFGCaseStudy />
          ) : (
            galleryImages.map((imagePath, idx) => (
              <div key={idx} className="w-full">
                <img
                  alt={`${project.title} — image ${idx + 1}`}
                  src={imagePath}
                  draggable="false"
                  loading="lazy"
                  className="w-full h-auto block object-cover max-w-full"
                />
              </div>
            ))
          )}
        </div>

        {/* Action Blocks: Contact Us & Next Work */}
        <div className="col-[3/11] max-sm:col-[1/5] sm:col-[1/5] md:col-[1/5] lg:col-[3/11] grid grid-cols-2 max-sm:grid-cols-1 gap-5 mt-10">

          {/* Link to Contacts */}
          <Link
            href="/contacts"
            className="flex items-center justify-center no-underline cursor-pointer h-[18rem] max-sm:h-[12rem] lg:max-xl:h-[clamp(210px,20.8vw-3.1px,288px)]"
            style={{ background: "linear-gradient(145deg, rgba(255,68,0,1) 0%, rgba(255,98,0,1) 100%)" }}
          >
            <AnimatedText text="Contact Us" className="font-medium text-[2.5rem] leading-none tracking-[-0.06em] text-white max-sm:text-[1.25rem]" />
          </Link>

          {/* Link to Next Project */}
          {nextProjectObj && (
            <Link
              href={`/projects/${nextProjectObj.slug}`}
              className="flex items-center justify-center no-underline cursor-pointer h-[18rem] max-sm:h-[12rem] lg:max-xl:h-[clamp(210px,20.8vw-3.1px,288px)]"
              style={{ background: "linear-gradient(180deg, rgba(102,105,101,1) 0%, rgba(148,156,149,1) 100%)" }}
            >
              <AnimatedText text="Next Work" className="font-medium text-[2.5rem] leading-none tracking-[-0.06em] text-white max-sm:text-[1.25rem]" />
            </Link>
          )}

        </div>
      </div>

      {/* Interactive Divider */}
      <WavyString className="mt-20" />      {/* Footer Section */}
      <footer className="pb-10">
        <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-center">

          {/* EST 2019 */}
          <div className="col-span-1">
            <div className="flex items-center gap-1.5">
              <img alt="" src="/est.svg" width="32" height="32" className="opacity-60" />
              <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm text-left">
                <span className="block">EST.</span>
                <span className="block">2019</span>
              </span>
            </div>
          </div>

          {/* Go Top */}
          <div className="col-[4/5] sm:col-[3/4] lg:col-[4/5]">
            <button
              type="button"
              onClick={handleScrollTop}
              aria-label="Scroll to top"
              className="flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer text-inherit transition-opacity duration-300 hover:opacity-70"
            >
              <img alt="" src="/top.svg" width="32" height="32" />
              <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[#c5c5c5] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm text-left">
                <span className="block">GO</span>
                <span className="block">TOP</span>
              </span>
            </button>
          </div>

          {/* Copyright banner */}
          <div className="col-[10/13] sm:col-[4/5] lg:col-[10/13] lg:max-dt:col-[9/13] max-sm:hidden">
            <div className="flex items-center gap-1.5">
              <img alt="" src="/c.svg" width="32" height="32" className="opacity-60" />
              <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm text-left">
                <span className="block">2026 ©</span>
                <span className="block">Copyright</span>
              </span>
            </div>
          </div>

        </div>

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
              © Maher
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
