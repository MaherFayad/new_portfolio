"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import AnimatedText from "./AnimatedText";

interface Badge {
  name: string;
  title: string;
  image: string;
  link: string;
  gradient: string;
  glow: string;
}

const BADGES: Badge[] = [
  {
    name: "Google UX Design Professional Certificate",
    title: "Google UX Design",
    image: "/assets/badges/google-ux-design-professional-certificate.webp",
    link: "https://www.credly.com/badges/5f3aa817-a4c2-4cee-8364-bd8b163a737b/public_url",
    gradient: "linear-gradient(135deg, #1A73E8 0%, #1557B0 100%)",
    glow: "rgba(66, 133, 244, 0.15)"
  },
  {
    name: "Google Data Analytics Professional Certificate",
    title: "Google Data Analytics",
    image: "/assets/badges/google-data-analytics-professional-certificate.webp",
    link: "https://www.credly.com/badges/4b94e10d-d67c-43cb-b529-f9127c04ed91/public_url",
    gradient: "linear-gradient(135deg, #EA4335 0%, #C5221F 100%)",
    glow: "rgba(234, 67, 53, 0.15)"
  },
  {
    name: "Enterprise Design Thinking Practitioner",
    title: "IBM Design Thinking",
    image: "/assets/badges/enterprise-design-thinking-practitioner.webp",
    link: "https://www.credly.com/badges/ed0ef7e8-cc68-41e9-8e10-664be336e779/public_url",
    gradient: "linear-gradient(135deg, #0F62FE 0%, #001C60 100%)",
    glow: "rgba(15, 98, 254, 0.15)"
  },
  {
    name: "Enterprise Design Thinking Co-Creator",
    title: "IBM Co-Creator",
    image: "/assets/badges/Enterprise-Design-Thinking-Co-Creator.webp",
    link: "https://www.credly.com/badges/32de5750-f31b-470d-a179-8dadc54756fd/public_url",
    gradient: "linear-gradient(135deg, #002D9C 0%, #001040 100%)",
    glow: "rgba(0, 45, 156, 0.15)"
  },
  {
    name: "McKinsey Forward Program",
    title: "McKinsey Forward",
    image: "/assets/badges/mckinsey-forward-program.webp",
    link: "https://www.credly.com/badges/0e8306a5-d19b-4524-94ca-a2f501be3d81/public_url",
    gradient: "linear-gradient(135deg, #051C48 0%, #002D9C 100%)",
    glow: "rgba(5, 28, 72, 0.25)"
  },
  {
    name: "Meta Front-End Developer Certificate",
    title: "Meta Front-End Dev",
    image: "/assets/badges/meta-front-end-developer-certificate.webp",
    link: "https://www.credly.com/badges/2e307edc-0639-42bb-a70c-c6cac291fec3/public_url",
    gradient: "linear-gradient(135deg, #0064E0 0%, #7F14E5 100%)",
    glow: "rgba(127, 20, 229, 0.15)"
  },
  {
    name: "Product Analytics Certification",
    title: "Product Analytics",
    image: "/assets/badges/Product-Analytics-Certification.webp",
    link: "https://www.credly.com/badges/bf32a815-e57e-4ed4-8475-45ccdceb586a/public_url",
    gradient: "linear-gradient(135deg, #E65100 0%, #F57C00 100%)",
    glow: "rgba(230, 81, 0, 0.15)"
  },
];

const CARD_WIDTH = 380;
const CARD_GAP = 20;

function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <a
      href={badge.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-none flex flex-col items-center relative overflow-hidden w-full h-[210px] sm:h-[230px] lg:h-[380px] cursor-pointer"
      style={{ backgroundColor: "hsl(33, 14%, 12%)", transformStyle: "preserve-3d" }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${badge.glow} 0%, transparent 70%)`,
        }}
      />
      <img
        alt=""
        className="mt-4 lg:mt-[40px] relative z-1 select-none pointer-events-none w-auto h-auto max-w-[1.75rem] lg:max-w-[3.5rem] opacity-40 group-hover:opacity-100 transition-opacity duration-300"
        src="/ar.svg"
      />
      <h3 className="mt-2 lg:mt-[20px] font-medium text-[0.8125rem] sm:text-sm lg:text-2xl tracking-[-0.04em] text-white relative z-1 pointer-events-none px-2 lg:px-6 text-center w-full max-w-full line-clamp-2 break-words">
        <AnimatedText text={badge.title} className="projects-name-text" />
      </h3>
      <div
        className="absolute bottom-0 left-1/2 w-[108px] h-[108px] sm:w-[120px] sm:h-[120px] lg:w-[240px] lg:h-[240px] -translate-x-1/2 translate-y-[6%] lg:translate-y-[25%] transition-transform duration-[0.6s] ease-in-out pointer-events-none"
      >
        <img
          src={badge.image}
          alt={badge.name}
          className="w-full h-full object-contain object-bottom filter saturate-50 group-hover:saturate-100 lg:group-hover:scale-[1.05] transition-all duration-[0.6s]"
        />
      </div>
    </a>
  );
}

export default function BadgesGrid() {
  const [slideIdx, setSlideIdx] = useState(BADGES.length);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePrevSlide = () => {
    if (slideIdx <= 0) return;
    setIsTransitioning(true);
    setSlideIdx(slideIdx - 1);
  };

  const handleNextSlide = () => {
    const len = BADGES.length;
    if (slideIdx >= len * 3 - 1) return;
    setIsTransitioning(true);
    setSlideIdx(slideIdx + 1);
  };

  return (
    <section className="relative w-full py-10 overflow-hidden">
      
      {/* 1. Header (12-Column aligned) */}
      <Reveal className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-[last_baseline]">
        <span className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>Learning &</span>
          <span>Badges</span>
        </span>
        <h2 className="col-[3/7] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/7] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] max-sm:text-[clamp(28px,8vw,36px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)]">
          Certificates
        </h2>
      </Reveal>

      {/* 2. Carousel Slider (380px cards width) */}
      <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 max-sm:mt-6 mt-[50px] items-start">
        <div className="col-[3/-1] max-sm:col-[1/-1] sm:col-[1/-1] lg:col-[3/-1]">
          {/* Mobile & tablet: all badges in a grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 lg:hidden">
            {BADGES.map((badge) => (
              <div key={badge.name} className="overflow-hidden min-w-0">
                <BadgeCard badge={badge} />
              </div>
            ))}
          </div>

          {/* Desktop: transform carousel */}
          <div
            data-lenis-prevent
            className="hidden lg:block overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
          <div
            className={`flex gap-5 select-none will-change-transform ${
              isTransitioning ? "transition-transform duration-500 ease-in-out" : ""
            }`}
            onTransitionEnd={() => {
              const len = BADGES.length;
              if (slideIdx >= len * 2) {
                setIsTransitioning(false);
                setSlideIdx(slideIdx - len);
              } else if (slideIdx < len) {
                setIsTransitioning(false);
                setSlideIdx(slideIdx + len);
              }
            }}
            style={{
              transform: `translateX(-${slideIdx * (CARD_WIDTH + CARD_GAP)}px)`,
            }}
          >
            {[...BADGES, ...BADGES, ...BADGES].map((badge, index) => (
              <div
                key={`${badge.name}-${index}`}
                className="shrink-0 overflow-hidden"
                style={{ width: `${CARD_WIDTH}px` }}
              >
                <BadgeCard badge={badge} />
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* 3. Slider Controls & Desc */}
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
            Always learning, always improving. Verified credentials from leading tech organizations and global consultancies.
          </p>
          <p className="mt-[30px] max-sm:mt-4 ml-[35%] lg:ml-[25%] xl:ml-[35%] max-sm:ml-0 font-medium text-sm leading-[120%] tracking-[-0.03em] text-[rgba(197,197,197,0.62)]">
            Professional certifications in user experience design, front-end software development, analytical data frameworks, and design thinking methodologies.
          </p>
        </div>
      </div>

    </section>
  );
}
