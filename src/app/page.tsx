"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/Reveal";
import AnimatedText from "@/components/AnimatedText";
import WavyString from "@/components/WavyString";
import ConcentricCircles from "@/components/ConcentricCircles";
import ProjectsList from "@/components/ProjectsList";
import FooterStripe from "@/components/FooterStripe";
import SliderPopup from "@/components/SliderPopup";
import Glitch from "@/components/Glitch";
import Magnetic from "@/components/Magnetic";
import BrandsGrid from "@/components/BrandsGrid";
import BadgesGrid from "@/components/BadgesGrid";
import PluginsGrid from "@/components/PluginsGrid";
import DevPlayground from "@/components/DevPlayground";
import MobileHorizontalScroll from "@/components/MobileHorizontalScroll";

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
];

// Dual-audience services block: each service framed as a business result with a proof point.
const SERVICES_OFFERED = [
  {
    ref: "01",
    name: "Product Design",
    description: "End-to-end product design for web and mobile, from problem framing and user flows to shipped, developer-ready UI.",
    proof: "Proof: +47% online account openings and +81% e-business transactions at Al Rajhi Bank.",
  },
  {
    ref: "02",
    name: "Design Systems",
    description: "Scalable, token-driven design systems and Figma libraries, including bilingual AR/EN and RTL components, so teams ship consistent UI faster.",
    proof: "Proof: author of two published Figma community plugins that automate color and numeric tokens.",
  },
  {
    ref: "03",
    name: "UX Audits",
    description: "Heuristic and accessibility audits that turn usability friction into a prioritized, build-ready list of fixes.",
    proof: "Proof: delivered 41 revamps and enhancements across Al Rajhi e-business platforms.",
  },
  {
    ref: "04",
    name: "Analytics-informed Design",
    description: "Funnel and behavioral analytics translated into design decisions that measurably move conversion and engagement.",
    proof: "Proof: bilingual travel booking funnels at Almosafer, the GCC's leading travel platform.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [stickyActive, setStickyActive] = useState(false);
  const [slideIdx, setSlideIdx] = useState(SERVICES.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState("honors");

  // Parallax scroll for mockups container
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // Show/hide fixed sticky header on scroll up
  useEffect(() => {
    let lastScroll = 0;
    const threshold = 180;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > threshold && currentScroll < lastScroll) {
        setStickyActive(true);
      } else {
        setStickyActive(false);
      }
      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section for right sidebar navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;

      const heroEl = document.getElementById("hero-section");
      const projectsEl = document.getElementById("projects-section");
      const agencyEl = document.getElementById("agency-section");
      const contactsEl = document.getElementById("contacts-section");

      if (contactsEl && scrollPos >= contactsEl.offsetTop) {
        setActiveSection("contacts");
      } else if (agencyEl && scrollPos >= agencyEl.offsetTop) {
        setActiveSection("agency");
      } else if (projectsEl && scrollPos >= projectsEl.offsetTop) {
        setActiveSection("work");
      } else {
        setActiveSection("honors");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
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

      {/* 2. Sticky Header (Scroll Triggered) */}
      <div
        aria-hidden={!stickyActive}
        className={`fixed top-0 left-0 right-0 z-50 pt-5 transition-transform duration-500 ease-in-out pointer-events-none ${stickyActive ? "translate-y-0" : "-translate-y-[calc(100%+100px)]"
          }`}
      >
        <div className="pointer-events-auto w-full px-[20px] max-sm:px-[12px] md:px-[20px] lg:px-[20px]">
          <div className="grid grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-5 w-full h-8 items-end backdrop-blur-md pb-4 pt-1 border-b border-white/5 rounded-b-xl">
            <div className="col-span-1 lg:col-span-3">
              <Glitch>
                <Link href="/" tabIndex={-1}>
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
                <Link
                  href="/about"
                  className="font-semibold text-sm uppercase text-[#c5c5c5] underline underline-offset-4 hover:opacity-70"
                  tabIndex={-1}
                >
                  ABOUT
                </Link>
              </Magnetic>
              <Magnetic range={40} strength={0.4}>
                <Link
                  href="/contacts"
                  className="font-semibold text-sm uppercase text-[#c5c5c5] underline underline-offset-4 hover:opacity-70"
                  tabIndex={-1}
                >
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
        </div>
      </div>

      {/* 3. Hero Section */}
      <section id="hero-section" className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 w-full items-start max-sm:h-auto max-sm:min-h-0 rp-hero-section lg:h-auto lg:!mt-[calc(843.5658px-17.7514vw)] min-[1024px]:max-[1399px]:h-[450px] min-[1024px]:max-[1399px]:!mt-[80px] sm:max-lg:h-auto sm:max-lg:!mt-[140px] max-sm:!mt-[300px]">

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
                  <span className="font-semibold text-sm tracking-[-0.03em] uppercase text-[#c5c5c5] underline underline-offset-[14%] decoration-[10%] leading-[140%]">
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
            Interfaces and digital
          </span>
          brands that accelerate
          revenue
        </Reveal>

        {/* Design Awards Stats */}
        <Reveal aboveFold className="col-[11/12] max-sm:mt-5 max-sm:col-[3/4] sm:col-[3/4] sm:row-start-2 lg:row-start-1 sm:mt-5 sm:flex lg:col-[11/12] lg:mt-[90px] flex flex-col gap-[14px] self-start">
          <span className="font-medium text-[32px] leading-[100%] tracking-[-0.03em] text-[#c5c5c5] max-sm:text-[24px] lg:max-dt:text-[clamp(22px,3.2vw-4.77px,32px)] sm:max-lg:text-[clamp(24px,3.2vw-4.77px,28px)]">
            50+
          </span>
          <span className="flex flex-col [&>span]:block">
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none max-sm:text-[10px] lg:max-dt:text-[clamp(11px,0.8vw+0.8px,11px)] sm:max-lg:text-[clamp(11px,1.25vw-0.5px,14px)]">
              COMPLETED
            </span>
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none max-sm:text-[10px] lg:max-dt:text-[clamp(11px,0.8vw+0.8px,11px)] sm:max-lg:text-[clamp(11px,1.25vw-0.5px,14px)]">
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
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none max-sm:text-[10px] lg:max-dt:text-[clamp(11px,0.8vw+0.8px,11px)] sm:max-lg:text-[clamp(11px,1.25vw-0.5px,14px)]">
              YEARS OF
            </span>
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none max-sm:text-[10px] lg:max-dt:text-[clamp(11px,0.8vw+0.8px,11px)] sm:max-lg:text-[clamp(11px,1.25vw-0.5px,14px)]">
              EXPERIENCE
            </span>
          </span>
        </Reveal>

      </section>

      {/* 4. Parallax mockups container */}
      <section
        ref={parallaxRef}
        className="relative w-full overflow-hidden bg-black z-0 mt-[60px] max-sm:!mt-[clamp(6rem,4vw+4rem,3rem)] sm:mt-[140px] min-[1024px]:max-[1399px]:!-mt-[-10px] 2xl:mt-[calc(260px-8vw)] min-[1920px]:max-[2000px]:!-mt-[calc(110px-8vw)] min-[1024px]:mt-[max(20px,calc(400px-22vw))] min-[1536px]:mt-[max(10px,calc(30px-8vw))] h-[300px] sm:h-[45vw] md:h-[500px] lg:h-[730px]"
      >
        <Reveal className="absolute inset-0 z-0 overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 bg-black pointer-events-none" />
          <motion.div className="absolute inset-0 z-[1] w-full h-[120%] top-[-10%]" style={{ y: bgY }}>
            {/* Background Gradient Mesh Blobs replicating SolverCorp */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              {/* Blue Blur Blob (Left/Center) */}
              <div className="absolute mt-[-10%] md:mt-0 left-[-80%] md:left-[-25%] bg-[#1146F2] blur-[180px] w-[1537px] md:w-[1809px] h-[1444px] rounded-full opacity-60" />
              {/* Purple Blur Blob (Right/Top) */}
              <div className="absolute right-[-80%] md:right-[-10%] bg-[#873AE3] blur-[150px] w-[1710px] h-[1367px] rounded-full opacity-60" />
              {/* Dark Overlap Blending Mask (Bottom/Center) */}
              <div className="absolute ml-[-90%] md:ml-[-50%] lg:ml-[-32%] mt-[10%] md:mt-[7%] bg-[#070707] blur-[142px] w-[1502px] md:w-[2774px] h-[1174px] md:h-[1444px] rounded-full opacity-90" />
            </div>
          </motion.div>
        </Reveal>

        {/* Floating Phones */}
        <div className="absolute inset-0 flex justify-center items-end pointer-events-none">
          <div className="relative w-full max-w-[1200px] h-full flex justify-center items-end">

            {/* Back phone */}
            <div className="absolute left-1/2 z-[1] float-back-phone-anim" style={{ bottom: "clamp(-100px, -15vw, -60px)", width: "fit-content" }}>
              <img
                alt="Back Phone"
                className="w-[180px] max-sm:w-[160px] md:w-[320px] lg:w-[480px] h-auto block"
                src="/back-phone.png"
                loading="lazy"
              />
            </div>

            {/* Top phone */}
            <div className="absolute left-1/2 z-[5] float-top-phone-anim" style={{ bottom: "clamp(-60px, -10vw, -30px)", width: "fit-content" }}>
              <img
                alt="Top Phone"
                className="w-[180px] max-sm:w-[160px] md:w-[320px] lg:w-[480px] h-auto block"
                src="/top-phone.png"
                loading="lazy"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 5. Projects list section */}
      <ProjectsList />

      {/* 6. Interactive Divider 1 */}
      <WavyString className="mt-20" />

      {/* 7. What we do section */}
      <section className="overflow-hidden">

        {/* Header reveal */}
        <Reveal className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-[last_baseline]">
          <span className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
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
            {/* Mobile: native touch scroll */}
            <MobileHorizontalScroll className="lg:hidden -mx-3 px-3">
              {SERVICES.map((serv, index) => (
                <div
                  key={serv.id}
                  className="shrink-0 snap-center overflow-hidden"
                  style={{ width: "min(calc(100vw - 24px), 455px)" }}
                >
                  <div
                    aria-label={serv.label}
                    className="group rounded-none flex flex-col items-center relative overflow-hidden w-full h-[580px] min-h-[280px] cursor-pointer"
                    onClick={() => setActiveCardIndex(index)}
                  >
                    <div className="absolute inset-0 w-full h-full -z-1">
                      <img alt="" className="w-full h-full object-cover" src={serv.mobileImage} />
                    </div>
                    <img
                      alt=""
                      className="mt-[43px] relative z-1 select-none pointer-events-none w-auto h-auto max-w-[4rem]"
                      src="/ar.svg"
                    />
                    <h3 className="mt-[22px] font-medium text-[clamp(29px,8vw,40px)] leading-[100%] tracking-[-0.06em] text-white relative z-1 pointer-events-none px-4 text-center">
                      <AnimatedText text={serv.title} className="projects-name-text" />
                    </h3>
                  </div>
                </div>
              ))}
            </MobileHorizontalScroll>

            {/* Desktop: transform carousel */}
            <div className="hidden lg:block overflow-hidden">
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
            <p className="mt-[30px] max-sm:mt-4 ml-[35%] lg:ml-[25%] xl:ml-[35%] max-sm:ml-0 font-medium text-sm leading-[120%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)]">
              From banking platforms to bilingual travel funnels, I design user-friendly interfaces that captivate and engage audiences, with results like 47% more account openings and 81% more transactions.
            </p>
          </div>
        </div>

      </section>

      {/* 7b. Interactive Divider */}
      <WavyString className="mt-20" />

      {/* 7c. Services (dual-audience, outcome-led) */}
      <section className="mt-16">
        <Reveal className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-start">
          <span className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
            <span>How I</span>
            <span>Help</span>
          </span>
          <h2 className="col-[3/6] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/6] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] max-sm:text-[clamp(28px,8vw,36px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)]">
            Services
          </h2>
          <p className="col-[8/12] max-sm:col-[1/5] sm:col-[1/5] lg:col-[8/12] max-sm:mt-4 font-medium text-base max-sm:text-sm leading-[150%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)] self-end">
            For teams hiring senior individual contributors across the GCC and remote, and for founders and agencies who need a designer who ships. Every engagement is scoped to a business result.
          </p>
        </Reveal>

        <div className="mt-[50px] max-sm:mt-6 border-t border-white/10">
          {SERVICES_OFFERED.map((svc, idx) => (
            <Reveal key={svc.name} delay={idx * 0.04}>
              <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 py-10 max-sm:py-6 border-b border-white/10 items-start">
                <span className="col-[3/4] max-sm:col-[1/5] sm:col-[1/2] lg:col-[3/4] font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)]">
                  {svc.ref}
                </span>
                <h3 className="col-[4/8] max-sm:col-[1/5] sm:col-[2/5] lg:col-[4/8] font-medium text-[clamp(24px,1.8vw,32px)] max-sm:text-[20px] leading-[110%] tracking-[-0.04em] text-[#c5c5c5]">
                  <AnimatedText text={svc.name} className="projects-name-text" />
                </h3>
                <div className="col-[8/12] max-sm:col-[1/5] sm:col-[1/5] lg:col-[8/12] flex flex-col gap-3 max-sm:mt-2">
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
      <WavyString className="mt-20" />

      {/* 9. About section */}
      <section className="relative">
        <div className="grid grid-cols-12 max-sm:grid-cols-1 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-start">

          {/* Header left */}
          <Reveal className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left [&>span]:block block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
            <span>About</span>
            <span>Maher</span>
          </Reveal>

          {/* Logo middle */}
          <div className="col-[3/5] max-sm:col-span-1 sm:col-[1/3] lg:col-[3/5]">
            <Reveal delay={0.2} as="p" className="max-sm:text-sm font-medium text-base leading-[120%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)] lg:max-dt:text-[clamp(14px,0.8vw+0.8px,18px)] sm:max-dt:text-[clamp(14px,2.133vw-3.84px,16px)] dt:text-sm">
              Creative & Intuitive
              <br />
              User Interface and User
              <br />
              Experience Designer
            </Reveal>
          </div>

          {/* Copyright details right */}
          <div className="col-[11/12] max-sm:col-start-4 max-sm:col-span-1 max-sm:mt-4 flex flex-col">
            <Reveal delay={0.3} className="text-left [&>span]:block block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none text-[clamp(11px,0.8vw+0.8px,11px)] lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
              <span>Creating high-</span>
              <span>quality projects</span>
            </Reveal>
          </div>
        </div>

        {/* 3D Concentric holographic circles */}
        <Reveal duration={1.5} y={50} style={{ perspective: 800, marginTop: -100 }}>
          <ConcentricCircles />
        </Reveal>

        {/* About description paragraphs */}
        <div className="grid grid-cols-4 max-sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 max-sm:mt-10">
          <Reveal as="p" className="col-span-4 max-sm:col-start-2 max-sm:col-span-3 sm:col-[2/5] lg:col-[8/12] font-medium text-[clamp(26px,1.923vw-0.92px,36px)] leading-[100%] tracking-[-0.03em] text-[#c5c5c5] max-sm:text-[clamp(18px,5vw,22px)] lg:max-dt:text-[clamp(18px,2.133vw-3.84px,26px)] dt:text-[clamp(26px,1.923vw-0.92px,36px)]">
            <span className="max-sm:pl-0 pl-[calc((100%+20px)/4)] sm:pl-[calc((100%+20px)/3)] block">
              Senior Product Designer
            </span>
            crafting measurable, bilingual experiences for travel, banking, and fintech
          </Reveal>

          <Reveal delay={0.1} as="p" className="col-span-4 max-sm:col-start-2 max-sm:col-span-3 sm:col-[3/5] lg:col-[9/12] mt-[30px] max-sm:mt-4 max-sm:text-sm sm:mt-[10px] font-medium text-base leading-[120%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)] text-[clamp(16px,0.8vw+0.8px,16px)] lg:max-dt:text-[clamp(12px,0.8vw+0.8px,11px)] dt:text-md">
            Currently at Almosafer, the GCC&apos;s leading travel platform, after Al Rajhi Bank, AZMX, and Contact Financial Holding, delivering high-converting products.
          </Reveal>
        </div>

        <WavyString className="mt-20" />
        <BrandsGrid />
        <WavyString className="mt-20" />
        <PluginsGrid />
        <WavyString className="mt-20" />
        <DevPlayground />
        <WavyString className="mt-20" />
        <BadgesGrid />

      </section>

      {/* 10. Interactive Divider 3 */}
      <WavyString className="mt-20" />

      {/* 11. Footer Section */}
      <footer className="pb-10">

        {/* Footer logo banner */}
        <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 max-sm:mt-6 mt-10 max-sm:hidden">
          <Reveal className="col-[2/4] sm:col-[1/3] lg:col-[2/4] block w-[219px] max-sm:w-[180px] h-[55px]">
            <Link href="/">
              <img alt="Maher Fayad" src="/assets/logo.svg" width="200" height="55" className="w-auto h-[40px]" />
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

      <SliderPopup
        isOpen={activeCardIndex !== null}
        onClose={() => setActiveCardIndex(null)}
        card={activeCardIndex !== null ? SERVICES[activeCardIndex] : null}
      />
    </main>
  );
}
