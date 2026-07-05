"use client";

import Reveal from "@/components/Reveal";
import type { MiniCase } from "@/data/projects";

const labelClass =
  "font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none";

const proseClass =
  "font-medium text-base max-sm:text-sm leading-[150%] tracking-[-0.03em] text-[#c5c5c5] opacity-70";

const rowClass =
  "grid grid-cols-1 lg:grid-cols-12 gap-5 max-sm:gap-3 py-10 max-sm:py-6 border-b border-white/10 items-start";

export default function MiniCaseStudy({ miniCase }: { miniCase: MiniCase }) {
  return (
    <section className="w-full mb-5">
      <div className="border-t border-white/10">
        <Reveal>
          <div className={rowClass}>
            <span className={`lg:col-[1/3] ${labelClass}`}>Context</span>
            <p className={`lg:col-[3/11] ${proseClass}`}>{miniCase.context}</p>
          </div>
        </Reveal>

        <Reveal delay={0.04}>
          <div className={rowClass}>
            <span className={`lg:col-[1/3] ${labelClass}`}>What I did</span>
            <p className={`lg:col-[3/11] ${proseClass}`}>{miniCase.contribution}</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className={rowClass}>
            <span className={`lg:col-[1/3] ${labelClass}`}>Key decisions</span>
            <ul className="lg:col-[3/11] flex flex-col gap-3">
              {miniCase.decisions.map((decision, idx) => (
                <li key={idx} className={proseClass}>
                  {decision}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className={rowClass}>
            <span className={`lg:col-[1/3] ${labelClass}`}>Result</span>
            <p className="lg:col-[3/11] font-medium text-base max-sm:text-sm leading-[150%] tracking-[-0.03em] text-[#c5c5c5]">
              {miniCase.result}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
