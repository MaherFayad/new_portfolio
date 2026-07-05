"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import AnimatedText from "@/components/AnimatedText";
import WavyString from "@/components/WavyString";
import ToonFireball from "@/components/ToonFireball";
import ProjectsList from "@/components/ProjectsList";
import Footer from "@/components/Footer";
import Glitch from "@/components/Glitch";
import Magnetic from "@/components/Magnetic";
import BrandsGrid from "@/components/BrandsGrid";
import BadgesGrid from "@/components/BadgesGrid";
import PluginsGrid from "@/components/PluginsGrid";
import DevPlayground from "@/components/DevPlayground";
import ParallaxMockups from "@/components/ParallaxMockups";
import Testimonials from "@/components/Testimonials";
import WhatIDoMobileCarousel from "@/components/WhatIDoMobileCarousel";
import SiteHeader from "@/components/SiteHeader";

const SliderPopup = dynamic(() => import("@/components/SliderPopup"), {
  ssr: false,
});

// Slider cards metadata for "What we do" section
const SERVICES = [
  {
    id: "research",
    title: "Research & Discovery",
    image: "/card1.webp",
    mobileImage: "/card1_compressed.webp",
    popupImage: "/sliderpopup/ppbg1.svg",
    subtitle: "Diving deep into user research, competitor landscapes, and business goals",
    paragraph: "To craft a truly impactful design, I grasp both user challenges and business objectives. I run interviews, surveys, and funnel analyses to unearth the insights that decide what gets built.",
    points: ["Competitor Analysis", "User Interviews", "Persona Creation", "Funnel & Analytics Review", "Problem Scoping"],
    label: "Open Research & Discovery details",
  },
  {
    id: "design",
    title: "Design & Prototyping",
    image: "/card2.webp",
    mobileImage: "/card2_compressed.webp",
    popupImage: "/sliderpopup/ppbg2.svg",
    subtitle: "Iterating from wireframes and sketches to pixel-perfect design systems",
    paragraph: "I design intuitive interfaces from low-fidelity wireframes to high-fidelity interactive prototypes, building scalable design systems, bilingual AR/EN layouts, and the Figma plugins that automate them.",
    points: ["Sketches & Wireframes", "Interactive Prototypes", "Design Systems & Tokens", "AR/EN & RTL Layouts", "Figma Components & Plugins"],
    label: "Open Design & Prototyping details",
  },
  {
    id: "design-systems",
    title: "Design Systems",
    image: "/card4.webp",
    mobileImage: "/card4_compressed.webp",
    popupImage: "/sliderpopup/ppbg4.svg",
    subtitle: "Building scalable, token-driven systems that keep large products consistent",
    paragraph: "I architect design systems from primitive tokens to documented component libraries, and I build the Figma plugins that automate them. Two of my token-generation plugins are live on Figma Community, used by teams beyond my own.",
    points: ["Token Architecture", "Component Libraries", "Figma Plugin Automation", "Theming & Dark Mode", "System Documentation"],
    label: "Open Design Systems details",
  },
  {
    id: "testing",
    title: "Testing & Iteration",
    image: "/card3.webp",
    mobileImage: "/card3_compressed.webp",
    popupImage: "/sliderpopup/ppbg3.svg",
    subtitle: "Rigorous testing and developer hand-off for flawless execution",
    paragraph: "I test prototypes with real users, audit against accessibility standards, and iterate with analytics in hand, collaborating closely with development teams until designs ship exactly as intended.",
    points: ["Usability Testing", "Accessibility Audits", "Product Analytics", "Dev Collaboration", "Continuous Improvement"],
    label: "Open Testing & Iteration details",
  },
  {
    id: "analytics",
    title: "Product Analytics",
    image: "/card6.webp",
    mobileImage: "/card6_compressed.webp",
    popupImage: "/sliderpopup/ppbg6.svg",
    subtitle: "Turning funnel data into design decisions with measurable outcomes",
    paragraph: "Every redesign I ship starts and ends with the numbers. I build funnels in Amplitude, find the drop-offs, design against them, and verify the lift. That process ran through the 41 revamps I delivered on the Al Rajhi e-business team, feeding the program that drove a +47% boost in account openings and +81% in transactions.",
    points: ["Funnel Analysis", "Drop-off Diagnosis", "A/B Test Design", "Dashboard Building", "Impact Measurement"],
    label: "Open Product Analytics details",
  },
];

// Dual-audience services block: each service framed as a business result with a proof point.
const SERVICES_OFFERED = [
  {
    ref: "01",
    name: "Product Design",
    description: "End-to-end product design for web and mobile, from problem framing and user flows to shipped, developer-ready UI.",
    proof: "Shipped the Al Rajhi payroll revamp within the e-business program that lifted account openings 47% and transactions 81%.",
  },
  {
    ref: "02",
    name: "Design Systems",
    description: "Scalable, token-driven design systems and Figma libraries, including bilingual AR/EN and RTL components, so teams ship consistent UI faster.",
    proof: "Author of two published Figma community plugins that automate color and numeric tokens.",
  },
  {
    ref: "03",
    name: "UX Audits",
    description: "Heuristic and accessibility audits that turn usability friction into a prioritized, build-ready list of fixes.",
    proof: "Delivered 41 revamps and enhancements across Al Rajhi e-business platforms.",
  },
  {
    ref: "04",
    name: "Analytics-informed Design",
    description: "Funnel and behavioral analytics translated into design decisions that measurably move conversion and engagement.",
    proof: "Bilingual travel booking funnels at Almosafer, the GCC's leading travel platform.",
  },
];

// Headline results, given their own visual weight so they land on a skim.
const RESULTS = [
  { value: "+47%", label: ["ACCOUNT OPENINGS", "AT AL RAJHI"] },
  { value: "+81%", label: ["E-BUSINESS", "TRANSACTIONS"] },
  { value: "41", label: ["PLATFORM REVAMPS", "DELIVERED"] },
];

export default function HomePage() {
  const router = useRouter();
  const [slideIdx, setSlideIdx] = useState(SERVICES.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState("honors");
  const activeSectionRef = useRef("honors");

  useEffect(() => {
    void import("@/components/SliderPopup");
  }, []);

  // Track active section for right sidebar navigation
  useEffect(() => {
    let ticking = false;

    const updateSection = () => {
      ticking = false;
      const scrollPos = window.scrollY + window.innerHeight / 2;

      const heroEl = document.getElementById("hero-section");
      const projectsEl = document.getElementById("projects-section");
      const contactsEl = document.getElementById("contacts-section");

      let nextSection = "honors";
      if (contactsEl && scrollPos >= contactsEl.offsetTop) {
        nextSection = "contacts";
      } else if (projectsEl && scrollPos >= projectsEl.offsetTop) {
        nextSection = "work";
      } else if (heroEl) {
        nextSection = "honors";
      }

      if (nextSection !== activeSectionRef.current) {
        activeSectionRef.current = nextSection;
        setActiveSection(nextSection);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateSection();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const handlePrevSlide = () => {
    if (!isTransitioning) return;
    setSlideIdx((prev) => prev - 1);
  };

  const handleNextSlide = () => {
    if (!isTransitioning) return;
    setSlideIdx((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  return (
    <main className="min-h-screen w-full px-5 max-sm:px-3 overflow-x-clip flex flex-col pb-0">

      {/* 1. Header (Static) */}
      <Reveal aboveFold as="header" className="w-full mt-5 relative z-10">
        <SiteHeader variant="static" />
      </Reveal>



      {/* 3. Hero Section */}
      <section id="hero-section" className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 w-full items-start max-sm:h-auto max-sm:min-h-0 rp-hero-section lg:h-auto lg:!mt-[calc(843.5658px-17.7514vw)] min-[1024px]:max-[1399px]:h-[450px] min-[1024px]:max-[1399px]:!mt-[80px] sm:max-lg:h-auto sm:max-lg:!mt-[140px] max-sm:!mt-[160px]">

        {/* Contact Button */}
        <Reveal aboveFold className="col-span-2 max-sm:mt-2 max-sm:row-start-2 max-sm:col-[1/3] sm:col-[1/3] sm:row-start-2 sm:mt-2.5 sm:flex lg:col-span-2 lg:row-auto lg:mt-0 self-start flex items-start justify-between sm:max-lg:text-[clamp(0.75rem,2.2vw-2.115vw,1.125rem)] max-sm:text-[0.75rem]">
          <div style={{ position: "relative", width: "fit-content" }}>
            <Magnetic range={120} strength={0.4}>
              <Link
                href="/contacts"
                aria-label="Contact"
                className="group flex items-center gap-5 cursor-pointer bg-transparent border-none p-0 text-inherit text-left no-underline"
              >
                <div className="relative w-20 h-20 shrink-0">
                  <div className="absolute inset-[2px] rounded-full bg-[#c5c5c5] scale-0 group-hover:scale-100 transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) z-2" />
                  <svg className="showreel-ring-bg absolute top-0 left-0 z-1" height="80" viewBox="0 0 80 80" width="80">
                    <circle cx="40" cy="40" r="38" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
                  </svg>
                  <svg className="showreel-ring-arc absolute top-0 left-0 z-2 rotate-90" height="80" viewBox="0 0 80 80" width="80">
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
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c5c5c5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 z-3 transition-colors duration-300 ease-in-out group-hover:stroke-black"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="flex items-start lg:max-dt:hidden max-sm:hidden">
                  <span className="font-semibold text-sm tracking-[-0.03em] uppercase text-[#c5c5c5] no-underline leading-[140%]">
                    CONTACT
                  </span>
                </div>
              </Link>
            </Magnetic>
          </div>
        </Reveal>

        {/* Hero Title Heading */}
        <Reveal aboveFold as="h1" className="col-[3/10] max-sm:col-[1/5] max-sm:row-start-1 max-sm:text-[clamp(28px,8vw,40px)] sm:col-[1/5] sm:row-start-1 sm:text-[clamp(48px,4.688vw,68px)] lg:col-[3/10] dt:text-[clamp(46px,3.462vw-2.46px,64px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] text-[#c5c5c5] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] leading-[100%] tracking-[-0.06em] self-start">
          <span className="block pl-[calc((100%+20px)/7)] lg:max-dt:pl-[calc((100%+20px)/7)] sm:max-lg:pl-[calc((100%+20px)/4)] max-sm:pl-0">
            Senior Product Designer
          </span>
          crafting interfaces that
          accelerate revenue
        </Reveal>

        {/* Design Awards Stats */}
        <Reveal aboveFold className="col-[11/12] max-sm:mt-5 max-sm:col-[3/4] sm:col-[3/4] sm:row-start-2 lg:row-start-1 sm:mt-5 sm:flex lg:col-[11/12] lg:mt-[90px] flex flex-col gap-[14px] self-start">
          <span className="font-medium text-[32px] leading-[100%] tracking-[-0.03em] text-[#c5c5c5] max-sm:text-[24px] lg:max-dt:text-[clamp(22px,3.2vw-4.77px,32px)] sm:max-lg:text-[clamp(24px,3.2vw-4.77px,28px)]">
            50+
          </span>
          <span className="flex flex-col [&>span]:block">
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none max-sm:text-[10px] lg:max-dt:text-[clamp(11px,0.8vw+0.8px,11px)] sm:max-lg:text-[clamp(11px,1.25vw-0.5px,14px)]">
              COMPLETED
            </span>
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none max-sm:text-[10px] lg:max-dt:text-[clamp(11px,0.8vw+0.8px,11px)] sm:max-lg:text-[clamp(11px,1.25vw-0.5px,14px)]">
              PROJECTS
            </span>
          </span>
        </Reveal>

        {/* Experience Stats */}
        <Reveal aboveFold className="col-[12/13] max-sm:mt-5 max-sm:col-[4/5] sm:col-[4/5] sm:row-start-2 lg:row-start-1 sm:mt-5 sm:flex lg:col-[12/13] lg:mt-[90px] flex flex-col gap-[14px] self-start">
          <span className="font-medium text-[32px] leading-[100%] tracking-[-0.03em] text-[#c5c5c5] max-sm:text-[24px] lg:max-dt:text-[clamp(22px,3.2vw-4.77px,32px)] sm:max-lg:text-[clamp(24px,3.2vw-4.77px,28px)]">
            4+
          </span>
          <span className="flex flex-col [&>span]:block">
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none max-sm:text-[10px] lg:max-dt:text-[clamp(11px,0.8vw+0.8px,11px)] sm:max-lg:text-[clamp(11px,1.25vw-0.5px,14px)]">
              YEARS OF
            </span>
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none max-sm:text-[10px] lg:max-dt:text-[clamp(11px,0.8vw+0.8px,11px)] sm:max-lg:text-[clamp(11px,1.25vw-0.5px,14px)]">
              EXPERIENCE
            </span>
          </span>
        </Reveal>

      </section>

      {/* 4. Parallax mockups container */}
      <ParallaxMockups />

      {/* 5. Projects list section */}
      <ProjectsList />

      {/* 6. Interactive Divider 1 */}
      <WavyString className="max-sm:mt-10 mt-20" />

      {/* 7. What we do section */}
      <section className="overflow-hidden">

        {/* Header reveal */}
        <Reveal className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-[last_baseline]">
          <span className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
            <span>Types of</span>
            <span>Activities</span>
          </span>
          <h2 className="col-[3/6] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/6] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] max-sm:text-[clamp(28px,8vw,36px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)]">
            What I do
          </h2>
        </Reveal>

        {/* Carousel Slider */}
        <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 max-sm:mt-6 mt-[50px] items-start">
          <div className="col-[3/-1] max-sm:col-[1/-1] sm:col-[1/-1] lg:col-[3/-1]">
            <WhatIDoMobileCarousel
              services={SERVICES}
              onSelect={setActiveCardIndex}
            />

            {/* Desktop: transform carousel */}
            <div
              data-lenis-prevent
              className="hidden lg:block overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div
                className={`flex gap-5 select-none will-change-transform ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""
                  }`}
                onTransitionEnd={() => {
                  const len = SERVICES.length;
                  if (slideIdx >= len * 2) {
                    setIsTransitioning(false);
                    setSlideIdx(slideIdx - len);
                  } else if (slideIdx < len) {
                    setIsTransitioning(false);
                    setSlideIdx(slideIdx + len);
                  }
                }}
                style={{
                  transform: `translateX(-${slideIdx * (455 + 20)}px)`,
                }}
              >
                {[...SERVICES, ...SERVICES, ...SERVICES].map((serv, index) => (
                  <div
                    key={`${serv.id}-${index}`}
                    className="shrink-0 overflow-hidden"
                    style={{ width: "455px" }}
                  >
                    <div
                      aria-label={serv.label}
                      className="group rounded-none flex flex-col items-center relative overflow-hidden w-full h-[clamp(390px,28.846vw-13.85px,540px)] max-sm:h-[580px] max-sm:min-h-[280px] max-lg:h-auto max-lg:aspect-[3/4] lg:max-dt:h-[clamp(374px,39.467vw-30.2px,522px)] cursor-pointer"
                      onClick={() => setActiveCardIndex(index % SERVICES.length)}
                    >
                      <div className="absolute inset-0 w-full h-full -z-1 transition-transform duration-[0.6s] ease-in-out group-hover:scale-[1.03]">
                        <img alt="" className="w-full h-full object-cover" src={serv.image} />
                      </div>

                      <img
                        alt=""
                        className="mt-[clamp(43px,3.269vw-2.77px,60px)] relative z-1 select-none pointer-events-none w-auto h-auto max-w-[4rem]"
                        src="/ar.svg"
                      />

                      <h3 className="mt-[clamp(22px,1.538vw-1.54px,30px)] font-medium text-[clamp(29px,2.115vw-0.61px,40px)] leading-[100%] tracking-[-0.06em] text-white relative z-1 pointer-events-none">
                        <AnimatedText text={serv.title} className="projects-name-text" />
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slider Controls & desc */}
        <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 max-sm:mt-8 mt-[70px] items-start">
          <div className="col-span-4 max-sm:col-span-2 sm:col-[1/2] lg:col-[3/5] flex gap-2 max-lg:hidden">
            <button
              onClick={handlePrevSlide}
              aria-label="Previous slide"
              className="group w-[clamp(60px,12vw,86px)] max-sm:w-[60px] lg:w-[86px] h-14 rounded-full bg-[rgba(197,197,197,0.15)] border-none outline-none cursor-pointer flex justify-center items-center relative overflow-hidden transition-all duration-300 z-1 hover:animate-[rotate_0.7s_ease-in-out_both] [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:pointer-events-none [&>span]:group-hover:animate-[storm_0.7s_ease-in-out_both] [&>span]:group-hover:[animation-delay:0.06s]"
              type="button"
            >
              <span>
                <img alt="Previous" className="block z-2 transition-[filter] duration-300 w-6 h-6 lg:w-8 lg:h-8" src="/arl.svg" />
              </span>
            </button>
            <button
              onClick={handleNextSlide}
              aria-label="Next slide"
              className="group w-[clamp(60px,12vw,86px)] max-sm:w-[60px] lg:w-[86px] h-14 rounded-full bg-[rgba(197,197,197,0.15)] border-none outline-none cursor-pointer flex justify-center items-center relative overflow-hidden transition-all duration-300 z-1 hover:animate-[rotate_0.7s_ease-in-out_both] [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:pointer-events-none [&>span]:group-hover:animate-[storm_0.7s_ease-in-out_both] [&>span]:group-hover:[animation-delay:0.06s]"
              type="button"
            >
              <span>
                <img alt="Next" className="block z-2 transition-[filter] duration-300 w-6 h-6 lg:w-8 lg:h-8" src="/arr.svg" />
              </span>
            </button>
          </div>

          <div className="col-[2/5] md:col-[3/5] lg:col-[6/11] xl:col-[6/9] max-sm:row-start-2">
            <p className="font-medium text-xl leading-[100%] tracking-[-0.03em] text-[#c5c5c5] opacity-70 max-sm:text-base">
              <span className="inline-block w-[35%] lg:w-[25%] xl:w-[35%]" />
              I pride myself on crafting digital products that not only meet but exceed expectations, with outcomes I can put numbers on.
            </p>
            <p className="mt-[30px] max-sm:mt-4 ml-[35%] lg:ml-[25%] xl:ml-[35%] max-sm:ml-0 font-medium text-sm leading-[120%] tracking-[-0.03em] text-[rgba(197,197,197,0.62)]">
              From banking platforms to bilingual travel funnels, I design user-friendly interfaces that captivate and engage audiences, with work feeding results like 47% more account openings and 81% more transactions at Al Rajhi.
            </p>
          </div>
        </div>

      </section>

      {/* 7b. Interactive Divider */}
      <WavyString className="max-sm:mt-10 mt-20" />

      {/* 7c. Services (dual-audience, outcome-led) */}
      <section className="mt-16">
        <Reveal className="grid max-lg:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-start">
          <span className="col-span-1 max-lg:hidden lg:flex flex-col text-left self-end [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
            <span>How I</span>
            <span>Help</span>
          </span>
          <h2 className="max-lg:col-[1/5] lg:col-[3/6] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] max-sm:text-[clamp(28px,8vw,36px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)]">
            Services
          </h2>
          <p className="max-lg:col-[1/5] lg:col-[8/12] max-lg:mt-4 font-medium text-base max-sm:text-sm leading-[150%] tracking-[-0.03em] text-[rgba(197,197,197,0.62)] lg:self-end">
            The craft above, packaged into engagements: for teams hiring senior individual contributors across the GCC and remote, and for founders and agencies who need a designer who ships. Every engagement is scoped to a business result.
          </p>
        </Reveal>


        <div className="mt-[50px] max-sm:mt-6 border-t border-white/10">
          {SERVICES_OFFERED.map((svc, idx) => (
            <Reveal key={svc.name} delay={idx * 0.04}>
              <div className="grid max-lg:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 py-10 max-sm:py-6 border-b border-white/10 items-start">
                <span className="max-lg:col-[1/5] lg:col-[3/4] font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)]">
                  {svc.ref}
                </span>
                <h3 className="max-lg:col-[1/5] lg:col-[4/8] font-medium text-[clamp(24px,1.8vw,32px)] max-sm:text-[20px] leading-[110%] tracking-[-0.04em] text-[#c5c5c5] max-lg:mt-1">
                  <span className="lg:hidden">{svc.name}</span>
                  <span className="hidden lg:inline">
                    <AnimatedText text={svc.name} className="projects-name-text" />
                  </span>
                </h3>
                <div className="max-lg:col-[1/5] lg:col-[8/12] flex flex-col gap-3 max-lg:mt-2">
                  <p className="font-medium text-sm text-[#c5c5c5] opacity-70 leading-[150%]">
                    {svc.description}
                  </p>
                  <p className="font-semibold text-sm tracking-[-0.03em] text-[#c5c5c5] leading-[140%]">
                    {svc.proof}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 8. Interactive Divider 2 */}
      <WavyString className="max-sm:mt-10 mt-20 relative z-10" />

      {/* 9. About section */}
      <section className="relative">
        <div className="relative z-[1] grid grid-cols-12 max-sm:grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-start">

          {/* Header left */}
          <Reveal className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left [&>span]:block block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
            <span>About</span>
            <span>Maher</span>
          </Reveal>

          {/* Logo middle */}
          <div className="col-[3/5] max-sm:col-span-1 sm:col-[1/3] lg:col-[3/5]">
            <Reveal delay={0.2} as="p" className="max-sm:text-sm font-medium text-base leading-[120%] tracking-[-0.03em] text-[rgba(197,197,197,0.62)] lg:max-dt:text-[clamp(14px,0.8vw+0.8px,18px)] sm:max-dt:text-[clamp(14px,2.133vw-3.84px,16px)] dt:text-sm">
              Creative & Intuitive
              <br />
              User Interface and User
              <br />
              Experience Designer
            </Reveal>
          </div>

          {/* Copyright details right */}
          <div className="col-[11/12] max-sm:col-start-2 max-sm:col-span-1 max-sm:mt-0 flex flex-col items-end">
            <Reveal delay={0.3} className="text-left max-sm:text-right [&>span]:block block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none text-[clamp(11px,0.8vw+0.8px,11px)] lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
              Don't ask about the fireball. <br /> I'm as confused as you are. <br /> But come on kinda sick, right?
            </Reveal>
          </div>
        </div>

        {/* 3D Concentric holographic circles */}
        <Reveal duration={1.5} y={50} className="lg:-mt-[100px] -mt-[40px] max-sm:mt-0 max-sm:mb-4" style={{ perspective: 800 }}>
          <ToonFireball />
        </Reveal>

        {/* About description paragraphs */}
        <div className="relative z-[1] grid grid-cols-4 max-sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 max-sm:mt-10">
          <Reveal as="p" className="col-span-4 max-sm:col-start-1 max-sm:col-span-4 sm:col-[2/5] lg:col-[8/12] font-medium text-[clamp(26px,1.923vw-0.92px,36px)] leading-[100%] tracking-[-0.03em] text-[#c5c5c5] max-sm:text-[clamp(18px,5vw,22px)] lg:max-dt:text-[clamp(18px,2.133vw-3.84px,26px)] dt:text-[clamp(26px,1.923vw-0.92px,36px)]">
            <span className="max-sm:pl-0 pl-[calc((100%+20px)/4)] sm:pl-[calc((100%+20px)/3)] block">
              Senior Product Designer
            </span>
            crafting measurable, bilingual experiences for travel, banking, and fintech
          </Reveal>

          <Reveal delay={0.1} as="p" className="col-span-4 max-sm:col-start-1 max-sm:col-span-4 sm:col-[3/5] lg:col-[9/12] mt-[30px] max-sm:mt-4 max-sm:text-sm sm:mt-[10px] font-medium text-base leading-[120%] tracking-[-0.03em] text-[rgba(197,197,197,0.62)] text-[clamp(16px,0.8vw+0.8px,16px)] lg:max-dt:text-[clamp(12px,0.8vw+0.8px,11px)] dt:text-md">
            Currently at Almosafer, the GCC&apos;s leading travel platform, designing bilingual booking funnels and design systems, after Al Rajhi Bank, AZMX, and Contact Financial Holding.
          </Reveal>
        </div>

        <WavyString className="max-sm:mt-10 mt-20" />
        <BrandsGrid />
        <WavyString className="max-sm:mt-10 mt-20" />
        <PluginsGrid />
        <WavyString className="max-sm:mt-10 mt-20" />
        <DevPlayground />
        <WavyString className="max-sm:mt-10 mt-20" />
        <BadgesGrid />

      </section>

      {/* 9b. Testimonials (shared with About) */}
      <WavyString className="max-sm:mt-10 mt-20" />
      <Testimonials />

      {/* 10. Interactive Divider 3 */}
      <WavyString className="max-sm:mt-10 mt-20" />

      <Footer />

      <SliderPopup
        isOpen={activeCardIndex !== null}
        onClose={() => setActiveCardIndex(null)}
        card={activeCardIndex !== null ? SERVICES[activeCardIndex] : null}
      />
    </main>
  );
}
