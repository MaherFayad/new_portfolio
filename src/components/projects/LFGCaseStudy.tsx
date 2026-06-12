"use client";

import { useEffect, useState, useRef } from "react";
import Reveal from "../Reveal";

const SECTIONS = [
  { id: "client-background", title: "Client Background" },
  { id: "client-requirements", title: "Client Requirements" },
  { id: "octalysis-framework", title: "Octalysis Framework" },
  { id: "ui-design", title: "UI Design" },
];

export default function LFGCaseStudy() {
  const [activeSection, setActiveSection] = useState("client-background");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0.1,
    });

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full flex gap-10 mt-16 max-lg:flex-col items-start relative pointer-events-auto">
      {/* Sticky Table of Contents Sidebar */}
      <Reveal aboveFold as="aside" className="w-[260px] shrink-0 sticky top-32 max-lg:hidden flex flex-col gap-4">
        <span className="block font-bold text-xs tracking-widest text-[rgba(197,197,197,0.4)] uppercase">
          Table of Contents
        </span>
        <nav className="flex flex-col gap-2 border-l border-white/5 pl-4">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`text-left text-sm font-semibold py-1.5 transition-all duration-300 ${
                activeSection === sec.id
                  ? "text-[#c5c5c5] translate-x-1 underline decoration-[#c5c5c5]/40 underline-offset-4"
                  : "text-[rgba(197,197,197,0.4)] hover:text-white"
              }`}
            >
              {sec.title}
            </button>
          ))}
        </nav>
      </Reveal>

      {/* Main Content Article */}
      <article className="flex-1 w-full flex flex-col gap-16">
        
        {/* Client request note */}
        <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-6 text-sm text-[rgba(197,197,197,0.6)] leading-[160%]">
          <span className="block font-bold text-[#c5c5c5] mb-2">💡 Client Request Note</span>
          This document is altered from the original design and some features are stripped away, so it may appear for some screens to not fully add up due to requests from the client for this case study.
        </Reveal>

        {/* Section 1: Client Background */}
        <section id="client-background" className="flex flex-col gap-6 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#c5c5c5]">Client Background</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-sm text-[#c5c5c5] opacity-75 leading-[160%]">
              Founded in December 2013 after Milt Olin, a prominent Music Entertainment Attorney, tragically lost his life due to distracted driving. The Milt Olin Foundation team, along with Milt’s widow Louise Olin, is committed to making our roads safer by eliminating distracted driving through education, community awareness, collaboration, and advocacy. Thus, the Let’s Freakin’ Go (LFG) App was born.
            </p>
          </Reveal>
        </section>

        {/* Section 2: Client Requirements */}
        <section id="client-requirements" className="flex flex-col gap-6 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#c5c5c5]">Client Requirements</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-sm text-[#c5c5c5] opacity-75 leading-[160%]">
              The client requested a mobile app that uses gamification aspects to help users stay on track with daily habits by chasing rewards while also addressing internal motivations.
            </p>
          </Reveal>
        </section>

        {/* Section 3: Octalysis Framework */}
        <section id="octalysis-framework" className="flex flex-col gap-6 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#c5c5c5]">Octalysis Framework</h2>
          </Reveal>
          
          <Reveal delay={0.05}>
            <p className="text-sm text-[#c5c5c5] opacity-75 leading-[160%] mb-4">
              The Octalysis framework, conceptualized by Yu-kai Chou, is a gamification model that transforms mundane tasks into engaging experiences, motivating user participation through rewards and challenges.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <img
              src="/assets/Projects/LFG/octalysis.webp"
              alt="Octalysis Framework diagram"
              className="w-full h-auto rounded-[24px] border border-white/5 mb-8 object-cover"
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-6 flex flex-col gap-2">
              <h3 className="font-semibold text-md text-[#c5c5c5]">1. Epic Meaning & Calling</h3>
              <p className="text-xs text-[#c5c5c5] opacity-70 leading-[150%]">
                Taps into user desire to be part of a larger mission. Crafting a compelling narrative and utilizing inclusive imagery that reinforces the user's role in the app's ecosystem.
              </p>
            </Reveal>

            <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-6 flex flex-col gap-2">
              <h3 className="font-semibold text-md text-[#c5c5c5]">2. Development & Accomplishment</h3>
              <p className="text-xs text-[#c5c5c5] opacity-70 leading-[150%]">
                Progression and achievement metrics. Multi-tier achievement systems, goal benchmarking, and reward escalation for higher milestone achievements.
              </p>
            </Reveal>

            <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-6 flex flex-col gap-2">
              <h3 className="font-semibold text-md text-[#c5c5c5]">3. Empowerment of Creativity & Feedback</h3>
              <p className="text-xs text-[#c5c5c5] opacity-70 leading-[150%]">
                Customizable goal-setting tailored to personal ambitions. Incorporating dynamic activity options and user-created activities to foster a sense of ownership.
              </p>
            </Reveal>

            <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-6 flex flex-col gap-2">
              <h3 className="font-semibold text-md text-[#c5c5c5]">4. Ownership & Possession</h3>
              <p className="text-xs text-[#c5c5c5] opacity-70 leading-[150%]">
                Intrinsic motivation for ownership. Integrating digital rewards and collectibles like NFTs for a tangible sense of possession.
              </p>
            </Reveal>

            <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-6 flex flex-col gap-2">
              <h3 className="font-semibold text-md text-[#c5c5c5]">5. Social Influence & Relatedness</h3>
              <p className="text-xs text-[#c5c5c5] opacity-70 leading-[150%]">
                Fostering community spirit. Introducing in-app forums, social challenges, leaderboards, and friendly competitions.
              </p>
            </Reveal>

            <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-6 flex flex-col gap-2">
              <h3 className="font-semibold text-md text-[#c5c5c5]">6. Scarcity & Impatience</h3>
              <p className="text-xs text-[#c5c5c5] opacity-70 leading-[150%]">
                Urgency drives engagement. Time-limited challenges, rare collectibles, and daily check-in streaks that diminish after inactivity.
              </p>
            </Reveal>

            <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-6 flex flex-col gap-2">
              <h3 className="font-semibold text-md text-[#c5c5c5]">7. Unpredictability & Curiosity</h3>
              <p className="text-xs text-[#c5c5c5] opacity-70 leading-[150%]">
                Random reward mechanisms (mystery boxes or hidden achievements) keep users engaged and curious.
              </p>
            </Reveal>

            <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-6 flex flex-col gap-2">
              <h3 className="font-semibold text-md text-[#c5c5c5]">8. Loss & Avoidance</h3>
              <p className="text-xs text-[#c5c5c5] opacity-70 leading-[150%]">
                Fear of missing out. Decay mechanisms where earned rewards or streak statuses are lost after a period of inactivity.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Section 4: UI Design */}
        <section id="ui-design" className="flex flex-col gap-6 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#c5c5c5]">UI Design</h2>
          </Reveal>
          
          <div className="flex flex-col gap-6">
            <Reveal delay={0.05}>
              <img src="/assets/Projects/LFG/LFG%20-%200.webp" alt="UI screen 1" className="w-full h-auto rounded-[24px] border border-white/5 object-cover" />
            </Reveal>
            <Reveal delay={0.1}>
              <img src="/assets/Projects/LFG/LFG%20-%201.webp" alt="UI screen 2" className="w-full h-auto rounded-[24px] border border-white/5 object-cover" />
            </Reveal>
            <Reveal delay={0.15}>
              <img src="/assets/Projects/LFG/LFG%20-%202.webp" alt="UI screen 3" className="w-full h-auto rounded-[24px] border border-white/5 object-cover" />
            </Reveal>
            <Reveal delay={0.2}>
              <img src="/assets/Projects/LFG/LFG%20-%203.webp" alt="UI screen 4" className="w-full h-auto rounded-[24px] border border-white/5 object-cover" />
            </Reveal>
            <Reveal delay={0.25}>
              <img src="/assets/Projects/LFG/LFG%20-%204.webp" alt="UI screen 5" className="w-full h-auto rounded-[24px] border border-white/5 object-cover" />
            </Reveal>
            <Reveal delay={0.3}>
              <img src="/assets/Projects/LFG/LFG%20-%205.webp" alt="UI screen 6" className="w-full h-auto rounded-[24px] border border-white/5 object-cover" />
            </Reveal>
          </div>
        </section>

      </article>
    </div>
  );
}
