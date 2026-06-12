"use client";

import Reveal from "@/components/Reveal";
import type { CaseFraming } from "@/data/projects";

const sideLabelClass =
  "flex flex-col text-left [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm";

const roleLeadClass =
  "max-sm:text-sm font-medium text-base leading-[120%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)] lg:max-dt:text-[clamp(14px,0.8vw+0.8px,18px)] sm:max-dt:text-[clamp(14px,2.133vw-3.84px,16px)] dt:text-sm";

const proseClass =
  "font-medium text-base max-sm:text-sm leading-[150%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)] lg:max-dt:text-[clamp(12px,0.8vw+0.8px,11px)] dt:text-md";

export default function CaseFramingSection({ framing }: { framing: CaseFraming }) {
  return (
    <section className="mt-10 max-sm:mt-8 relative">
      {/* Header band: mirrors About Maher top row */}
      <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-start">
        <Reveal className={`col-span-1 max-sm:hidden sm:max-lg:hidden ${sideLabelClass}`}>
          <span>Case</span>
          <span>Context</span>
        </Reveal>

        <Reveal delay={0.05} className="col-[3/7] max-sm:col-[1/5] sm:col-[1/4] lg:col-[3/7]">
          <p className={roleLeadClass}>{framing.role}</p>
        </Reveal>

        <Reveal delay={0.1} className={`col-[11/12] max-sm:hidden sm:max-lg:hidden ${sideLabelClass}`}>
          <span>Problem</span>
          <span>to product</span>
        </Reveal>
      </div>

      {/* Narrative body: staggered columns like About description */}
      <div className="grid grid-cols-4 max-sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 mt-8 max-sm:mt-6">
        <Reveal
          as="p"
          className={`col-span-4 max-sm:col-[1/5] sm:col-[2/5] lg:col-[4/9] ${proseClass}`}
        >
          <span className="max-sm:pl-0 pl-[calc((100%+20px)/4)] sm:pl-[calc((100%+20px)/3)] block">
            {framing.problem}
          </span>
        </Reveal>

        <Reveal
          delay={0.08}
          as="p"
          className={`col-span-4 max-sm:col-[1/5] sm:col-[3/5] lg:col-[5/10] mt-[30px] max-sm:mt-5 sm:mt-[10px] ${proseClass}`}
        >
          <span className="max-sm:pl-0 pl-[calc((100%+20px)/4)] sm:pl-[calc((100%+20px)/3)] ml-[25%] max-sm:ml-0 block">
            {framing.approach}
          </span>
        </Reveal>

        {framing.outcome && (
          <Reveal
            delay={0.14}
            as="p"
            className={`col-span-4 max-sm:col-[1/5] sm:col-[3/5] lg:col-[6/11] mt-[24px] max-sm:mt-4 sm:mt-2 ${proseClass} text-[#c5c5c5] opacity-60`}
          >
            <span className="max-sm:pl-0 pl-[calc((100%+20px)/4)] sm:pl-[calc((100%+20px)/3)] ml-[18%] max-sm:ml-0 block">
              {framing.outcome}
            </span>
          </Reveal>
        )}
      </div>
    </section>
  );
}
