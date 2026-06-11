"use client";

import { useEffect, useState, useRef } from "react";
import Reveal from "../Reveal";

const SECTIONS = [
  { id: "project-overview", title: "Project Overview" },
  { id: "the-plan", title: "The Plan" },
  { id: "competitor-analysis", title: "Competitor Analysis" },
  { id: "literature-review", title: "Literature Review" },
  { id: "user-interviews", title: "User Interviews" },
  { id: "define-personas", title: "Define & Personas" },
  { id: "wireframes", title: "Wireframes" },
  { id: "usability-testing", title: "Usability Testing" },
  { id: "style-guide", title: "Style Guide" },
  { id: "ui-design", title: "UI Design" },
];

export default function SanarteCaseStudy() {
  const [activeSection, setActiveSection] = useState("project-overview");
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
      <aside className="w-[260px] shrink-0 sticky top-32 max-lg:hidden flex flex-col gap-4">
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
      </aside>

      {/* Main Content Article */}
      <article className="flex-1 w-full flex flex-col gap-16">
        {/* Section 1: Overview */}
        <section id="project-overview" className="flex flex-col gap-8 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#c5c5c5]">Project Overview</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-8 flex flex-col gap-4">
              <h3 className="font-medium text-lg text-[rgba(197,197,197,0.5)]">Client Background</h3>
              <p className="text-sm text-[#c5c5c5] opacity-75 leading-[160%]">
                My client is a researcher at a university in Canada who plans to use this project for research purposes and as a source of income. He wants to improve remote workspaces using soundscapes and various cognitive techniques, utilizing connections in the research market to monetize aggregate data.
              </p>
            </Reveal>

            <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-8 flex flex-col gap-4">
              <h3 className="font-medium text-lg text-[rgba(197,197,197,0.5)]">Client Requirements</h3>
              <p className="text-sm text-[#c5c5c5] opacity-75 leading-[160%]">
                To design a mobile app using sound to destress remote workers and increase productivity. The app collects data with full user consent and absolute privacy to sell anonymous insights to research centers and universities, with a subscription model for future expansion.
              </p>
            </Reveal>

            <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-8 flex flex-col gap-4">
              <h3 className="font-medium text-lg text-[rgba(197,197,197,0.5)]">Problem Statement</h3>
              <p className="text-sm text-[#c5c5c5] opacity-75 leading-[160%]">
                Leaders want to address remote worker disconnection and sync teams to be happier and more productive. However, remote workers face social isolation and loneliness, reducing creativity and increasing turnover.
              </p>
            </Reveal>

            <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-8 flex flex-col gap-4">
              <h3 className="font-medium text-lg text-[rgba(197,197,197,0.5)]">Project & Business Goals</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-[#c5c5c5] opacity-75 leading-[160%]">
                <li>Acquire enough active users to test and refine AI sound models.</li>
                <li>Ensure long-term user retention through engaging daily routines.</li>
                <li>Form enterprise partnerships with large remote-first teams.</li>
                <li>Ensure high usability and delightful user journeys.</li>
              </ul>
            </Reveal>
          </div>

          <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-8 flex flex-col gap-4">
            <h3 className="font-medium text-lg text-[rgba(197,197,197,0.5)]">Core Hypotheses</h3>
            <ul className="list-decimal list-inside space-y-2 text-sm text-[#c5c5c5] opacity-75 leading-[160%]">
              <li>Remote workers experience workplace disconnection frequently.</li>
              <li>Listening to music or soundscapes alleviates workplace stress.</li>
              <li>Functional music increases productivity and output quality.</li>
              <li>Users are willing to listen to scientific soundscapes if proven to reduce stress.</li>
              <li>The primary audience consists of tech-savvy youth aged 25-40 who work remotely.</li>
            </ul>
          </Reveal>
        </section>

        {/* Section 2: The Plan */}
        <section id="the-plan" className="flex flex-col gap-8 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#c5c5c5]">The Research Plan</h2>
          </Reveal>

          <Reveal className="overflow-hidden border border-white/5 rounded-[24px] bg-[#141414]">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2">
                    <th className="px-6 py-4 font-bold text-xs uppercase text-[rgba(197,197,197,0.5)] tracking-wider">Method</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-[rgba(197,197,197,0.5)] tracking-wider">Type</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-[rgba(197,197,197,0.5)] tracking-wider">Related Hypotheses</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-[rgba(197,197,197,0.5)] tracking-wider">Why</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/1">
                    <td className="px-6 py-4 font-semibold text-[#c5c5c5]">Competitor Analysis</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Exploratory</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-40">N/A</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">To check competitor products and identify features to learn from.</td>
                  </tr>
                  <tr className="hover:bg-white/1">
                    <td className="px-6 py-4 font-semibold text-[#c5c5c5]">Literature Review (Online)</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Exploratory</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Disconnection & Target Audience</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Accelerates findings using credible existing data pools since timelines were compressed.</td>
                  </tr>
                  <tr className="hover:bg-white/1">
                    <td className="px-6 py-4 font-semibold text-[#c5c5c5]">Literature Review (Papers)</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Exploratory</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Sound relief & productivity boost</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Provides scientifically supported backing for the music and productivity thesis.</td>
                  </tr>
                  <tr className="hover:bg-white/1">
                    <td className="px-6 py-4 font-semibold text-[#c5c5c5]">User Interviews</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Exploratory</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Willingness to listen to non-music soundscapes</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Verifies if remote users are open to utilizing scientific audio tools and best delivery channels.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>

        {/* Section 3: Competitor Analysis */}
        <section id="competitor-analysis" className="flex flex-col gap-8 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#c5c5c5]">Competitor Analysis</h2>
          </Reveal>

          <Reveal className="overflow-hidden border border-white/5 rounded-[24px] bg-[#141414]">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2">
                    <th className="px-6 py-4 font-bold text-xs uppercase text-[rgba(197,197,197,0.5)] tracking-wider">Metric</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-[rgba(197,197,197,0.5)] tracking-wider">Calm</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-[rgba(197,197,197,0.5)] tracking-wider">Headspace</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-[rgba(197,197,197,0.5)] tracking-wider">Mindfi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/1">
                    <td className="px-6 py-4 font-semibold text-[#c5c5c5]">Primary Audience</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">General users seeking relaxation.</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">General mindfulness seekers.</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Young professionals and office teams.</td>
                  </tr>
                  <tr className="hover:bg-white/1">
                    <td className="px-6 py-4 font-semibold text-[#c5c5c5]">Customer Reviews</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">PlayStore 4.1 / AppStore 4.8. Easy to use, rich library.</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">PlayStore 3.3 / AppStore 4.8. Structured content courses.</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">PlayStore 4.0 / AppStore 4.7. Good mood suggestions.</td>
                  </tr>
                  <tr className="hover:bg-white/1">
                    <td className="px-6 py-4 font-semibold text-[#c5c5c5]">USPs</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Sleep stories & breathing metrics.</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">SOS mini-sessions, guided tasks.</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">AI-powered tracking, customized ambient feeds.</td>
                  </tr>
                  <tr className="hover:bg-white/1">
                    <td className="px-6 py-4 font-semibold text-[#c5c5c5]">Strengths</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Very clean UI, massive audio asset catalog.</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Easy to follow for beginners.</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Personalized scheduling and mood metrics.</td>
                  </tr>
                  <tr className="hover:bg-white/1">
                    <td className="px-6 py-4 font-semibold text-[#c5c5c5]">Weaknesses</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">High subscription cost.</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Limited free content.</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">Smaller library catalog.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>

        {/* Section 4: Literature Review */}
        <section id="literature-review" className="flex flex-col gap-8 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#c5c5c5]">Literature Review</h2>
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-8 flex flex-col gap-4">
              <h3 className="font-semibold text-lg text-[#c5c5c5]">Key Findings</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-[#c5c5c5] opacity-75 leading-[160%]">
                <li><strong>Remote Isolation:</strong> 80% of remote workers would consider leaving their job for one focused on mental health benefits.</li>
                <li><strong>Music Therapy:</strong> Stanford researchers note that listening to structured soundscapes changes brain waves as effectively as standard medication.</li>
                <li><strong>Productivity Spikes:</strong> Mindlab International experiments show 88% of users work with higher accuracy, and 81% complete tasks quicker under correct soundscapes.</li>
              </ul>
            </Reveal>

            {/* Lit review charts grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Reveal delay={0.05}>
                <img src="/assets/Projects/Sanarte/1.webp" alt="Chart 1" className="w-full h-auto rounded-[20px] border border-white/5 object-cover" />
              </Reveal>
              <Reveal delay={0.1}>
                <img src="/assets/Projects/Sanarte/2.webp" alt="Chart 2" className="w-full h-auto rounded-[20px] border border-white/5 object-cover" />
              </Reveal>
              <Reveal delay={0.15}>
                <img src="/assets/Projects/Sanarte/4.webp" alt="Chart 3" className="w-full h-auto rounded-[20px] border border-white/5 object-cover" />
              </Reveal>
            </div>
          </div>
        </section>

        {/* Section 5: User Interviews */}
        <section id="user-interviews" className="flex flex-col gap-8 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#c5c5c5]">User Interviews</h2>
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-8 flex flex-col gap-4">
              <h3 className="font-semibold text-lg text-[#c5c5c5]">Interview Insights</h3>
              <p className="text-sm text-[#c5c5c5] opacity-75 leading-[160%]">
                I interviewed 5 participants (4 US-based, 1 Egypt-based) representing remote workers, team managers, and consultants. Major findings include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-[#c5c5c5] opacity-75 leading-[160%] pl-2">
                <li>Some team members find loud lyrics highly distracting. Instrumental beats are preferred.</li>
                <li>Reminders for simple breathing breaks improve work endurance.</li>
                <li>Shared playlists help virtual teams bond.</li>
                <li>Integrating features into Slack/Teams avoids dashboard fatigue.</li>
              </ul>
            </Reveal>

            {/* Interview script snippet */}
            <Reveal className="bg-[#141414]/50 border border-white/5 rounded-[24px] p-8">
              <h3 className="font-semibold text-md text-[#c5c5c5] mb-4">Introductory Script Used</h3>
              <p className="text-sm text-[#c5c5c5] opacity-60 italic leading-[160%]">
                "Hi, my name is Maher Fayad, and I am a Product Designer. Thank you for participating in this interview. The goal is to learn more about remote workplaces, to help design an app that enhances remote worker productivity and connection..."
              </p>
            </Reveal>
          </div>
        </section>

        {/* Section 6: Define & Personas */}
        <section id="define-personas" className="flex flex-col gap-8 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#c5c5c5]">Define & Personas</h2>
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal>
              <p className="text-sm text-[#c5c5c5] opacity-75 leading-[160%]">
                Using gathered insights, I mapped out the user journey maps and developed two distinct persona types to target onboarding structures.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Reveal delay={0.05}>
                <h4 className="font-semibold text-sm text-[rgba(197,197,197,0.4)] mb-2 uppercase">Persona 1</h4>
                <img src="/assets/Projects/Sanarte/persona-1.webp" alt="Persona 1" className="w-full h-auto rounded-[20px] border border-white/5 object-cover" />
              </Reveal>
              <Reveal delay={0.1}>
                <h4 className="font-semibold text-sm text-[rgba(197,197,197,0.4)] mb-2 uppercase">Persona 2</h4>
                <img src="/assets/Projects/Sanarte/persona-2.webp" alt="Persona 2" className="w-full h-auto rounded-[20px] border border-white/5 object-cover" />
              </Reveal>
            </div>

            <Reveal className="mt-4">
              <h4 className="font-semibold text-sm text-[rgba(197,197,197,0.4)] mb-2 uppercase">Journey Mapping</h4>
              <img src="/assets/Projects/Sanarte/journey-map.webp" alt="Journey Map" className="w-full h-auto rounded-[20px] border border-white/5 object-cover" />
            </Reveal>
          </div>
        </section>

        {/* Section 7: Wireframes */}
        <section id="wireframes" className="flex flex-col gap-8 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#c5c5c5]">Wireframes</h2>
          </Reveal>
          <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-6">
            <img src="/assets/Projects/Sanarte/WFs.webp" alt="Wireframes" className="w-full h-auto rounded-[16px] object-cover" />
          </Reveal>
        </section>

        {/* Section 8: Usability Testing */}
        <section id="usability-testing" className="flex flex-col gap-8 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#c5c5c5]">Usability Testing</h2>
          </Reveal>

          <Reveal className="bg-[#141414] border border-white/5 rounded-[24px] p-8">
            <p className="text-sm text-[#c5c5c5] opacity-75 leading-[160%] mb-6">
              We selected the 4 primary user tasks inside the prototype and measured completion metrics (clicks, attempts, success rates) across users.
            </p>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2">
                    <th className="px-6 py-4 font-bold text-xs uppercase text-[rgba(197,197,197,0.5)] tracking-wider">Task</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-[rgba(197,197,197,0.5)] tracking-wider">Clicks</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-[rgba(197,197,197,0.5)] tracking-wider">Attempts</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-[rgba(197,197,197,0.5)] tracking-wider">Success</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-[rgba(197,197,197,0.5)] tracking-wider">Avg Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/1">
                    <td className="px-6 py-4 text-[#c5c5c5] font-semibold">User Onboarding & Signup</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">2 Clicks</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">1 Attempt</td>
                    <td className="px-6 py-4 text-[#1CCECB] font-semibold">100%</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">5s</td>
                  </tr>
                  <tr className="hover:bg-white/1">
                    <td className="px-6 py-4 text-[#c5c5c5] font-semibold">Trigger Soundscape Session</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">1 Click</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">1 Attempt</td>
                    <td className="px-6 py-4 text-[#1CCECB] font-semibold">100%</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">3s</td>
                  </tr>
                  <tr className="hover:bg-white/1">
                    <td className="px-6 py-4 text-[#c5c5c5] font-semibold">Complete Conversational Survey</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">10 Clicks</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">1 Attempt</td>
                    <td className="px-6 py-4 text-[#1CCECB] font-semibold">100%</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">40s</td>
                  </tr>
                  <tr className="hover:bg-white/1">
                    <td className="px-6 py-4 text-[#c5c5c5] font-semibold">View Insights / Team Analytics</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">1 Click</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">1 Attempt</td>
                    <td className="px-6 py-4 text-[#1CCECB] font-semibold">100%</td>
                    <td className="px-6 py-4 text-[#c5c5c5] opacity-75">10s</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>

        {/* Section 9: Style Guide */}
        <section id="style-guide" className="flex flex-col gap-8 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#c5c5c5]">Style Guide</h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Reveal delay={0.05}>
              <img src="/assets/Projects/Sanarte/Color.webp" alt="Colors" className="w-full h-auto rounded-[20px] border border-white/5 object-cover" />
            </Reveal>
            <Reveal delay={0.1}>
              <img src="/assets/Projects/Sanarte/Color-Greyscale.webp" alt="Greyscales" className="w-full h-auto rounded-[20px] border border-white/5 object-cover" />
            </Reveal>
            <Reveal delay={0.15}>
              <img src="/assets/Projects/Sanarte/Color-Gradient.webp" alt="Gradients" className="w-full h-auto rounded-[20px] border border-white/5 object-cover" />
            </Reveal>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Reveal delay={0.05}>
              <img src="/assets/Projects/Sanarte/Typography.webp" alt="Typography Grid" className="w-full h-auto rounded-[20px] border border-white/5 object-cover" />
            </Reveal>
            <Reveal delay={0.1}>
              <img src="/assets/Projects/Sanarte/TypographyTest.webp" alt="Typography Spec" className="w-full h-auto rounded-[20px] border border-white/5 object-cover" />
            </Reveal>
          </div>
        </section>

        {/* Section 10: UI Design */}
        <section id="ui-design" className="flex flex-col gap-8 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-[#c5c5c5]">UI Design</h2>
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal delay={0.05}>
              <img src="/assets/Projects/Sanarte/ui1.webp" alt="UI Screen 1" className="w-full h-auto rounded-[24px] border border-white/5 object-cover" />
            </Reveal>
            <Reveal delay={0.1}>
              <img src="/assets/Projects/Sanarte/ui2.webp" alt="UI Screen 2" className="w-full h-auto rounded-[24px] border border-white/5 object-cover" />
            </Reveal>
            <Reveal delay={0.15}>
              <img src="/assets/Projects/Sanarte/ui3.webp" alt="UI Screen 3" className="w-full h-auto rounded-[24px] border border-white/5 object-cover" />
            </Reveal>
          </div>
        </section>
      </article>
    </div>
  );
}
