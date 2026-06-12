"use client";

import Link from "next/link";
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
  { name: ["YEARS OF", "EXPERIENCE"], value: "4+" },
  { name: ["COMPLETED", "PROJECTS"], value: "50+" },
  { name: ["UX COURSES", "TAKEN"], value: "90+" },
  { name: ["BRANDS", "WORKED WITH"], value: "40+" },
];

const TIMELINE = [
  {
    position: "Senior Product Designer",
    company: "Almosafer",
    time: "2025 - Present",
    points: [
      "Designing for the GCC's leading travel platform across Arabic and English product experiences.",
      "Driving design-system work and analytics-informed funnel improvements across booking journeys.",
      "Building AI-augmented design workflows with Figma MCP and Claude-driven design ops.",
    ],
  },
  {
    position: "Sr. User Experience Designer",
    company: "AZMX · Al Rajhi Bank",
    time: "Dec. 2023 - 2025",
    points: [
      "Delivered 41 revamps and enhancements to Al Rajhi e-business platforms.",
      "Boosted online account openings by 47% and e-business transactions by 81%.",
      "Teamed up with premier groups in Saudi Arabia's vibrant tech ecosystem to drive digital innovation.",
    ],
  },
  {
    position: "Product Designer",
    company: "Contact Financial Holding",
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

const TESTIMONIALS = [
  {
    quote:
      "Maher is one of the best designers and overall people I have collaborated with, We need more people like him in this space. I had the pleasure of hiring Maher on multiple occasions for various tasks a few times and now for my own project too. He honestly became my go-to for design services.",
    name: "Grigory Yusufov",
    role: "Mindful Magic, Business Owner",
  },
  {
    quote:
      "I had the pleasure of working with Maher on a UX/UI design project, and I must say that he is a talented and intuitive designer. From the very beginning, Maher was focused on understanding my user needs and desires, and he incorporated them seamlessly into the design process.",
    name: "Joey Dakwerk",
    role: "Phonic, Business Owner",
  },
  {
    quote:
      "Maher did a wonderful job. Everything went smoothly, communication was fluent, delivered on time and as expected. I highly recommend working with Maher",
    name: "Salim Boudi",
    role: "Iteration X, Business Owner",
  },
];

export default function AboutPage() {
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

      {/* 1. Intro Heading (atomic hero geometry: side label, indented display H1, stats right) */}
      <section className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 w-full items-start mt-[clamp(120px,16vw,220px)] max-sm:mt-20">
        <Reveal aboveFold className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-start [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>About</span>
          <span>Me</span>
        </Reveal>

        <Reveal aboveFold as="h1" className="col-[3/10] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/10] text-[#c5c5c5] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] max-sm:text-[clamp(28px,8vw,40px)] sm:text-[clamp(40px,4.688vw,56px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)] leading-[100%] tracking-[-0.06em] self-start">
          <span className="block pl-[calc((100%+20px)/7)] lg:max-dt:pl-[calc((100%+20px)/7)] sm:max-lg:pl-[calc((100%+20px)/4)] max-sm:pl-0">
            Senior Product Designer
          </span>
          shipping bilingual experiences that move business numbers
        </Reveal>

        <Reveal aboveFold className="col-[11/12] max-sm:mt-5 max-sm:col-[1/3] sm:col-[3/4] sm:row-start-2 lg:row-start-1 sm:mt-5 lg:mt-[90px] flex flex-col gap-[14px] self-start">
          <span className="font-medium text-[32px] leading-[100%] tracking-[-0.03em] text-[#c5c5c5] max-sm:text-[24px] lg:max-dt:text-[clamp(22px,3.2vw-4.77px,32px)] sm:max-lg:text-[clamp(24px,3.2vw-4.77px,28px)]">
            90+
          </span>
          <span className="flex flex-col [&>span]:block">
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none max-sm:text-[10px] lg:max-dt:text-[clamp(11px,0.8vw+0.8px,11px)] sm:max-lg:text-[clamp(11px,1.25vw-0.5px,14px)]">
              UX COURSES
            </span>
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none max-sm:text-[10px] lg:max-dt:text-[clamp(11px,0.8vw+0.8px,11px)] sm:max-lg:text-[clamp(11px,1.25vw-0.5px,14px)]">
              TAKEN
            </span>
          </span>
        </Reveal>

        <Reveal aboveFold className="col-[12/13] max-sm:mt-5 max-sm:col-[3/5] sm:col-[4/5] sm:row-start-2 lg:row-start-1 sm:mt-5 lg:mt-[90px] flex flex-col gap-[14px] self-start">
          <span className="font-medium text-[32px] leading-[100%] tracking-[-0.03em] text-[#c5c5c5] max-sm:text-[24px] lg:max-dt:text-[clamp(22px,3.2vw-4.77px,32px)] sm:max-lg:text-[clamp(24px,3.2vw-4.77px,28px)]">
            40+
          </span>
          <span className="flex flex-col [&>span]:block">
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none max-sm:text-[10px] lg:max-dt:text-[clamp(11px,0.8vw+0.8px,11px)] sm:max-lg:text-[clamp(11px,1.25vw-0.5px,14px)]">
              BRANDS
            </span>
            <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none max-sm:text-[10px] lg:max-dt:text-[clamp(11px,0.8vw+0.8px,11px)] sm:max-lg:text-[clamp(11px,1.25vw-0.5px,14px)]">
              WORKED WITH
            </span>
          </span>
        </Reveal>

        {/* CV link */}
        <Reveal aboveFold delay={0.15} className="col-[3/10] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/10] mt-8 max-sm:mt-6">
          <Magnetic range={60} strength={0.4}>
            <a
              href="https://drive.google.com/file/d/17gjXpoyjISAdNi6Jw8E-3052SkGq1TRc/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sm uppercase text-[#c5c5c5] underline underline-offset-4 hover:opacity-70"
            >
              VIEW FULL CV ↗
            </a>
          </Magnetic>
        </Reveal>
      </section>

      <WavyString className="mt-20" />

      {/* 2. Who am I (photo left, display lead + body right, flat stats row) */}
      <section className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 mt-16 items-start">
        <Reveal className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>Who</span>
          <span>I am</span>
        </Reveal>

        <Reveal className="col-[3/6] max-sm:col-[1/5] sm:col-[1/3] lg:col-[3/6] self-stretch relative z-10">
          <img
            src="/assets/Maher.png"
            alt="Maher Fayad"
            className="w-full border border-white/5 object-cover max-sm:relative sm:absolute sm:top-0 sm:left-0 sm:h-[calc(100%+180px)]"
            style={{ transform: "scaleX(-1)" }}
          />
        </Reveal>

        <div className="col-[7/12] max-sm:col-[1/5] sm:col-[3/5] lg:col-[7/12] flex flex-col max-sm:mt-6">
          <Reveal as="p" className="font-medium text-[clamp(26px,1.923vw-0.92px,36px)] leading-[100%] tracking-[-0.03em] text-[#c5c5c5] max-sm:text-[clamp(18px,5vw,22px)] lg:max-dt:text-[clamp(18px,2.133vw-3.84px,26px)] dt:text-[clamp(26px,1.923vw-0.92px,36px)]">
            <span className="max-sm:pl-0 pl-[calc((100%+20px)/4)] sm:pl-[calc((100%+20px)/3)] block">
              Senior Product Designer
            </span>
            at Almosafer, the GCC&apos;s leading travel platform, crafting measurable bilingual experiences
          </Reveal>

          <Reveal delay={0.1} as="p" className="mt-[30px] max-sm:mt-4 ml-[25%] max-sm:ml-0 font-medium text-base max-sm:text-sm leading-[150%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)]">
            My professional trajectory is marked by significant roles at Almosafer, Al Rajhi Bank, AZMX, Contact Financial Holding, GameIT, Algoriza, and British Council. I run a flourishing freelance career on Upwork collaborating with Supersight, Theradome, the Milt Olin Foundation, Solidity Studios, Brackets, and IterationX.
          </Reveal>

          <Reveal delay={0.15} as="p" className="mt-[16px] max-sm:mt-3 ml-[25%] max-sm:ml-0 font-medium text-base max-sm:text-sm leading-[150%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)]">
            My journey spans volunteering with the United Nations, TEDx, Enactus, ASME, and Mansoura Motorsport.
          </Reveal>

          {/* Flat stats row */}
          <div className="flex flex-wrap gap-x-[clamp(28px,3.4vw,64px)] gap-y-8 mt-12 max-sm:mt-8">
            {STATS.map((stat, idx) => (
              <Reveal key={stat.value + idx} delay={0.2 + 0.05 * idx} className="flex flex-col gap-[14px]">
                <span className="font-medium text-[32px] leading-[100%] tracking-[-0.03em] text-[#c5c5c5] max-sm:text-[24px]">
                  {stat.value}
                </span>
                <span className="flex flex-col [&>span]:block">
                  {stat.name.map((line) => (
                    <span key={line} className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none max-sm:text-[10px]">
                      {line}
                    </span>
                  ))}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WavyString className="mt-20" />

      {/* 3. Experience (bordered rows, atomic table rhythm) */}
      <section className="mt-16">
        <Reveal className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3">
          <span className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
            <span>Career</span>
            <span>Path</span>
          </span>
          <h2 className="col-[3/6] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/6] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] max-sm:text-[clamp(28px,8vw,36px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)]">
            Experience
          </h2>
        </Reveal>

        <div className="mt-[50px] max-sm:mt-6 border-t border-white/10">
          {TIMELINE.map((item, idx) => (
            <Reveal key={item.company + item.position} delay={idx * 0.04}>
              <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 py-10 max-sm:py-6 border-b border-white/10 items-start">
                <div className="col-[3/7] max-sm:col-[1/5] sm:col-[1/3] lg:col-[3/7]">
                  <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none">
                    {item.position}
                  </span>
                  <span className="block font-medium text-[clamp(24px,1.8vw,32px)] max-sm:text-[20px] leading-[110%] tracking-[-0.04em] text-[#c5c5c5] mt-3">
                    <AnimatedText text={item.company} className="projects-name-text" />
                  </span>
                </div>
                <span className="col-[7/9] max-sm:col-[1/5] sm:col-[3/5] lg:col-[7/9] font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] max-sm:mt-2">
                  {item.time}
                </span>
                <ul className="col-[9/13] max-sm:col-[1/5] sm:col-[1/5] lg:col-[9/13] flex flex-col gap-2 max-sm:mt-2">
                  {item.points.map((pt, pidx) => (
                    <li key={pidx} className="font-medium text-sm text-[#c5c5c5] opacity-70 leading-[150%]">
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <WavyString className="mt-20" />

      {/* 4. Expertise (numbered bordered rows) */}
      <section className="mt-16">
        <Reveal className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3">
          <span className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
            <span>Core</span>
            <span>Skills</span>
          </span>
          <h2 className="col-[3/6] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/6] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] max-sm:text-[clamp(28px,8vw,36px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)]">
            Expertise
          </h2>
        </Reveal>

        <div className="mt-[50px] max-sm:mt-6 border-t border-white/10">
          {EXPERTISE.map((exp, idx) => (
            <Reveal key={exp.name} delay={idx * 0.04}>
              <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 py-10 max-sm:py-6 border-b border-white/10 items-start">
                <span className="col-[3/4] max-sm:col-[1/5] sm:col-[1/2] lg:col-[3/4] font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)]">
                  {exp.ref}
                </span>
                <h3 className="col-[4/8] max-sm:col-[1/5] sm:col-[2/5] lg:col-[4/8] font-medium text-[clamp(24px,1.8vw,32px)] max-sm:text-[20px] leading-[110%] tracking-[-0.04em] text-[#c5c5c5]">
                  <AnimatedText text={exp.name} className="projects-name-text" />
                </h3>
                <p className="col-[8/12] max-sm:col-[1/5] sm:col-[1/5] lg:col-[8/12] font-medium text-sm text-[#c5c5c5] opacity-70 leading-[150%] max-sm:mt-2">
                  {exp.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <WavyString className="mt-20" />

      {/* 5. Testimonials (flat bordered columns) */}
      <section className="mt-16">
        <Reveal className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3">
          <span className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
            <span>Client</span>
            <span>Words</span>
          </span>
          <h2 className="col-[3/8] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/8] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] max-sm:text-[clamp(28px,8vw,36px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)]">
            What clients say
          </h2>
        </Reveal>

        <div className="mt-[50px] max-sm:mt-6 border-t border-white/10">
          {TESTIMONIALS.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 0.05}>
              <figure className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 py-12 max-sm:py-8 border-b border-white/10 items-start">
                <blockquote className="col-[3/9] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/9] font-medium text-[clamp(18px,1.4vw,24px)] max-sm:text-[16px] leading-[140%] tracking-[-0.03em] text-[#c5c5c5]">
                  “{t.quote}”
                </blockquote>
                <figcaption className="col-[10/13] max-sm:col-[1/5] sm:col-[1/5] lg:col-[10/13] flex flex-col gap-1 max-sm:mt-3">
                  <span className="font-medium text-base text-[#c5c5c5] tracking-[-0.03em]">
                    {t.name}
                  </span>
                  <span className="font-semibold text-xs tracking-[-0.03em] text-[rgba(197,197,197,0.4)] uppercase leading-[140%]">
                    {t.role}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
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
