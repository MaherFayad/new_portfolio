"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import AnimatedText from "@/components/AnimatedText";
import WavyString from "@/components/WavyString";
import FooterStripe from "@/components/FooterStripe";
import Glitch from "@/components/Glitch";
import Magnetic from "@/components/Magnetic";
import BrandsGrid from "@/components/BrandsGrid";
import BadgesGrid from "@/components/BadgesGrid";
import PluginsGrid from "@/components/PluginsGrid";

const STATS = [
  { name: "YEARS OF EXPERIENCE", value: "4+" },
  { name: "COMPLETED PROJECTS", value: "40+" },
  { name: "UX COURSES TAKEN", value: "80+" },
  { name: "BRANDS WORKED WITH", value: "25" },
];

const TIMELINE = [
  {
    position: "Sr. User Experience Designer",
    company: "AZMX",
    time: "Dec. 2023 - Present",
    points: [
      "Collaborated with AZMX clients to craft user-centric designs that resonate with customer needs.",
      "Engaged with Al Rajhi Bank (leading financial institution in the Middle East) to design premium user experiences.",
      "Teamed up with premier groups in Saudi Arabia's vibrant tech ecosystem to drive digital innovation.",
    ],
  },
  {
    position: "Product Designer",
    company: "Contact",
    time: "Dec. 2022 - Nov. 2023",
    points: [
      "Spearheaded user-centric, visually captivating design lifecycle from initial ideation to implementation.",
      "Crafted user flows, high-fidelity mockups, interactive prototypes, and ran comprehensive user research.",
      "Contributed to core financial products, including Contact Now and Contact Brokerage apps.",
    ],
  },
  {
    position: "UI/UX Designer",
    company: "GameIT",
    time: "Jun. 2022 - Dec. 2022",
    points: [
      "Refined website experiences for maximum usability, engagement, and customer satisfaction.",
      "Collaborated with marketing to deliver high-quality video and visual brand assets.",
      "Partnered with the game development team to optimize accessibility of game user interfaces.",
    ],
  },
  {
    position: "Freelance UI/UX Designer",
    company: "Upwork",
    time: "Aug. 2022 - Present",
    points: [
      "Collaborated with Solidity Studios, Supersight, Konica Minolta, Mit Olin Foundation, and Brackets.",
      "Implemented gamification aspects using the Octalysis framework to build high-engagement habit-tracking apps.",
      "Designed remote team collaboration platforms integrating sound-based destress workflows.",
    ],
  },
  {
    position: "User Experience Intern Designer",
    company: "Algoriza",
    time: "Mar. 2022 - Jun. 2022",
    points: [
      "Mastered UX design processes, user interview methodologies, and target customer mapping.",
      "Practiced interface guidelines, responsive web grids, accessibility standards, and styling guides.",
    ],
  },
  {
    position: "Intern",
    company: "British Council",
    time: "Jun. 2018 - May 2019",
    points: [
      "Interfaced between the British Council and the university to coordinate events and academic cooperation.",
      "Successfully led the organization of major events, each drawing over 200 participants.",
    ],
  },
];

const EXPERTISE = [
  {
    ref: "01",
    name: "UI Design",
    description: "I craft interfaces where every button, click, tap, and swipe feels natural and satisfying. Bringing digital products to life with crisp layout hierarchies, smooth typography, and cohesive component systems.",
  },
  {
    ref: "02",
    name: "UX Research",
    description: "I perform qualitative and quantitative user research, surveys, and structured user interviews to unpack real pain points and business goals, designing for real-world scenarios and user desires.",
  },
  {
    ref: "03",
    name: "Analytics",
    description: "I analyze user behavioral metrics and conversion funnels to unearth performance issues, making data-informed layout tweaks that keep users engaged and optimize overall business metrics.",
  },
  {
    ref: "04",
    name: "Heuristic Evaluation",
    description: "I audit existing products to identify accessibility roadblocks, compliance flaws, and usability snags. Providing step-by-step improvements to align interfaces with standard design best practices.",
  },
];

export default function AboutPage() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen w-full px-5 max-sm:px-3 overflow-x-clip flex flex-col pb-0">
      
      {/* Header (Static layout) */}
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

      {/* Intro Heading Section */}
      <section className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 w-full mt-24">
        <Reveal className="col-[3/11] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/11] flex flex-col gap-8 items-center text-center">
          <h1 className="text-[#c5c5c5] font-medium text-[clamp(24px,2.5vw,36px)] leading-[140%] tracking-[-0.03em] max-w-3xl">
            🚀 Seeking a UI/UX Designer to Elevate Your Product? Dive into a world where your brand shines bright, distinct as a flamingo amid a sea of pigeons.
          </h1>
          <Magnetic range={60} strength={0.4}>
            <a
              href="https://drive.google.com/file/d/17gjXpoyjISAdNi6Jw8E-3052SkGq1TRc/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center font-bold text-sm tracking-[0.1em] uppercase text-black bg-white px-8 py-4 rounded-full hover:bg-white/90 transition-colors pointer-events-auto"
            >
              View Full CV
            </a>
          </Magnetic>
        </Reveal>
      </section>

      <WavyString className="mt-20" />

      {/* Biography & Stats Section */}
      <section className="grid grid-cols-12 max-sm:grid-cols-1 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-8 mt-16">
        <div className="col-[3/6] max-sm:col-span-1 sm:col-[1/2] lg:col-[3/6] flex flex-col gap-6">
          <Reveal>
            <img
              src="/assets/about.webp"
              alt="Maher Fayad Character"
              className="w-full h-auto rounded-[24px] border border-white/5 object-cover"
            />
          </Reveal>
        </div>

        <div className="col-[7/11] max-sm:col-span-1 sm:col-[3/5] lg:col-[7/11] flex flex-col gap-8">
          <Reveal>
            <h2 className="font-medium text-[clamp(36px,3vw,56px)] leading-[100%] tracking-[-0.05em] text-[#c5c5c5]">
              Who am I?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-medium text-lg leading-[160%] tracking-[-0.03em] text-[#c5c5c5] opacity-75">
              I am a seasoned UI/UX Designer specialized in crafting intuitive user interfaces and enriching experiences. My journey in design spans across volunteering with esteemed organizations such as the United Nations, TEDx, Enactus, ASME, and Mansoura Motorsport.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-medium text-lg leading-[160%] tracking-[-0.03em] text-[#c5c5c5] opacity-75">
              My professional trajectory is marked by significant roles at AZMX, Al Rajhi Bank, Contact Financial Holding, GameIT, Algoriza, and British Council. Additionally, I run a flourishing freelance career on Upwork collaborating with companies like Supersight, Theradome, the Milt Olin Foundation, Solidity Studios, Brackets, and IterationX.
            </p>
          </Reveal>

          {/* Core Stats counter */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {STATS.map((stat, idx) => (
              <Reveal key={stat.name} delay={0.3 + 0.05 * idx} className="bg-[#141414] border border-white/5 rounded-[20px] p-6 flex flex-col gap-2">
                <span className="block font-bold text-xs tracking-[-0.02em] text-[rgba(197,197,197,0.4)]">
                  {stat.name}
                </span>
                <span className="block font-medium text-4xl text-[#c5c5c5] tracking-[-0.05em]">
                  {stat.value}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WavyString className="mt-20" />

      {/* Professional Timeline / Work Experience Section */}
      <section className="grid grid-cols-12 max-sm:grid-cols-1 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-8 mt-16">
        <div className="col-[3/11] max-sm:col-span-1 sm:col-[1/5] lg:col-[3/11] flex flex-col gap-12">
          <Reveal>
            <h2 className="font-medium text-[clamp(36px,3vw,56px)] leading-[100%] tracking-[-0.05em] text-[#c5c5c5]">
              Experience
            </h2>
          </Reveal>

          <div className="flex flex-col gap-6">
            {TIMELINE.map((item, idx) => (
              <Reveal key={item.company + item.position} delay={idx * 0.05} className="bg-[#141414] border border-white/5 rounded-[24px] p-8 flex flex-col gap-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="block font-bold text-sm tracking-[-0.02em] text-[rgba(197,197,197,0.4)] uppercase">
                      {item.position}
                    </span>
                    <span className="block font-medium text-2xl text-[#c5c5c5] tracking-[-0.03em] mt-1">
                      {item.company}
                    </span>
                  </div>
                  <span className="block font-semibold text-sm tracking-[-0.03em] text-[rgba(197,197,197,0.4)] uppercase mt-1">
                    {item.time}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  {item.points.map((pt, pidx) => (
                    <li key={pidx} className="font-medium text-sm text-[#c5c5c5] opacity-75 leading-[150%]">
                      {pt}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WavyString className="mt-20" />

      {/* Expertise / Skill Cards Section */}
      <section className="grid grid-cols-12 max-sm:grid-cols-1 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-8 mt-16">
        <div className="col-[3/11] max-sm:col-span-1 sm:col-[1/5] lg:col-[3/11] flex flex-col gap-12">
          <Reveal>
            <h2 className="font-medium text-[clamp(36px,3vw,56px)] leading-[100%] tracking-[-0.05em] text-[#c5c5c5]">
              Expertise
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXPERTISE.map((exp, idx) => (
              <Reveal key={exp.name} delay={idx * 0.05} className="bg-[#141414] border border-white/5 rounded-[24px] p-8 flex flex-col gap-6">
                <span className="font-bold text-xs text-[rgba(197,197,197,0.4)] tracking-widest block">
                  {exp.ref}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium text-2xl text-[#c5c5c5] tracking-[-0.03em]">
                    {exp.name}
                  </h3>
                  <p className="font-medium text-sm text-[#c5c5c5] opacity-70 leading-[150%]">
                    {exp.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WavyString className="mt-28" />

      {/* Brands, Plugins, and Badges Grid insertions */}
      <BrandsGrid />
      <WavyString className="mt-20" />
      <PluginsGrid />
      <WavyString className="mt-20" />
      <BadgesGrid />

      <WavyString className="mt-20" />

      {/* Footer Section */}
      <footer className="pb-10">
        
        {/* Footer Top info line */}
        <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-center">
          <Reveal className="col-span-1">
            <div className="flex items-center gap-1.5">
              <img alt="" src="/est.svg" width="32" height="32" className="opacity-60" />
              <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm text-left">
                <span className="block">EST.</span>
                <span className="block">2019</span>
              </span>
            </div>
          </Reveal>

          <Reveal className="col-[4/5] sm:col-[3/4] lg:col-[4/5]">
            <button
              onClick={handleScrollTop}
              aria-label="Scroll to top"
              className="flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer text-inherit transition-opacity duration-300 hover:opacity-70"
              type="button"
            >
              <img alt="" src="/top.svg" width="32" height="32" />
              <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[#c5c5c5] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm text-left">
                <span className="block">GO</span>
                <span className="block">TOP</span>
              </span>
            </button>
          </Reveal>

          <Reveal className="col-[10/13] sm:col-[4/5] lg:col-[10/13] lg:max-dt:col-[9/13] max-sm:hidden">
            <div className="flex items-center gap-1.5">
              <img alt="" src="/c.svg" width="32" height="32" className="opacity-60" />
              <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm text-left">
                <span className="block">2026 ©</span>
                <span className="block">Copyright</span>
              </span>
            </div>
          </Reveal>
        </div>

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
              © Maher
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
