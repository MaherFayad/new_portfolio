"use client";

import { motion } from "framer-motion";

interface TimelineEntry {
  position: string;
  company: string;
  time: string;
  points: string[];
  current?: boolean;
}

// Curated professional timeline shown inline in the chat. Mirrors the About page TIMELINE,
// trimmed to the headline roles and two highlights each so it stays scannable in a message.
const EXPERIENCE: TimelineEntry[] = [
  {
    position: "Senior Product Designer",
    company: "Almosafer",
    time: "2025 - Present",
    current: true,
    points: [
      "Designing for the GCC's leading travel platform across Arabic and English experiences.",
      "Driving design-system work and analytics-informed funnel improvements across booking journeys.",
    ],
  },
  {
    position: "Sr. User Experience Designer",
    company: "AZMX · Al Rajhi Bank",
    time: "Dec. 2023 - 2025",
    points: [
      "Delivered 41 revamps and enhancements to Al Rajhi e-business platforms.",
      "Helped lift online account openings by 47% and e-business transactions by 81%.",
    ],
  },
  {
    position: "Product Designer",
    company: "Contact Financial Holding",
    time: "Dec. 2022 - Nov. 2023",
    points: [
      "Owned the design lifecycle from ideation to implementation for core financial products.",
      "Shipped Contact Now and Contact Brokerage apps with research-driven flows.",
    ],
  },
  {
    position: "UI/UX Designer",
    company: "GameIT",
    time: "Jun. 2022 - Dec. 2022",
    points: [
      "Refined website experiences for usability, engagement, and customer satisfaction.",
      "Partnered with the game team to optimize accessibility of game interfaces.",
    ],
  },
  {
    position: "UX Intern Designer",
    company: "Algoriza",
    time: "Mar. 2022 - Jun. 2022",
    points: [
      "Learned UX processes, user interviews, and target-customer mapping end to end.",
    ],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, x: -14 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 150, damping: 18, mass: 0.7 },
  },
};

export default function ChatExperienceTimeline() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="my-4 w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6"
    >
      {/* Timeline rail + entries */}
      <div className="relative">
        {/* Vertical connecting line */}
        <span
          aria-hidden="true"
          className="absolute left-[6px] top-2 bottom-3 w-px bg-gradient-to-b from-white/70 via-white/15 to-transparent"
        />

        <div className="flex flex-col gap-6">
          {EXPERIENCE.map((entry) => (
            <motion.div key={entry.company + entry.position} variants={item} className="relative pl-7">
              {/* Node on the rail */}
              <span className="absolute left-0 top-[3px] flex h-[13px] w-[13px] items-center justify-center">
                {entry.current ? (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                    <span className="relative inline-flex h-[13px] w-[13px] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
                  </>
                ) : (
                  <span className="inline-flex h-[13px] w-[13px] rounded-full border-2 border-white/25 bg-[#0a0a0b]" />
                )}
              </span>

              {/* Role + company */}
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h4 className="text-sm font-semibold leading-tight text-white">{entry.position}</h4>
                <span className="text-xs font-medium text-white/55">{entry.company}</span>
              </div>

              {/* Period */}
              <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-white/35">
                {entry.time}
              </span>

              {/* Highlights */}
              <ul className="mt-2 flex flex-col gap-1.5">
                {entry.points.map((point, j) => (
                  <li key={j} className="flex gap-2 text-[12.5px] leading-relaxed text-[#b9b9b9]">
                    <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-white/25" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
