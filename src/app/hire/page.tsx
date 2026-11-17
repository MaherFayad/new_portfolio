"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import AnimatedText from "@/components/AnimatedText";
import WavyString from "@/components/WavyString";
import Footer from "@/components/Footer";
import Magnetic from "@/components/Magnetic";
import SiteHeader from "@/components/SiteHeader";
import BookMeetingButton from "@/components/BookMeetingButton";
import { HIRE_FAQ, HIRE_FIT, HIRE_STEPS, PROFILE, SERVICES_OFFERED } from "@/data/profile";

const GRID = "grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3";
const LABEL = "col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-end [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm";
const H2 = "col-[3/9] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/9] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] leading-[80%] tracking-[-0.06em] text-[#c5c5c5] max-sm:text-[clamp(28px,8vw,36px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)]";
const ROW = `${GRID} py-10 max-sm:py-6 border-b border-white/10 items-start`;
const REF = "col-[3/4] max-sm:col-[1/5] sm:col-[1/2] lg:col-[3/4] font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)]";
const NAME = "col-[4/8] max-sm:col-[1/5] sm:col-[2/5] lg:col-[4/8] font-medium text-[clamp(24px,1.8vw,32px)] max-sm:text-[20px] leading-[110%] tracking-[-0.04em] text-[#c5c5c5]";
const BODY = "col-[8/12] max-sm:col-[1/5] sm:col-[1/5] lg:col-[8/12] font-medium text-sm text-[#c5c5c5] opacity-70 leading-[150%] max-sm:mt-2";
const CTA = "font-semibold text-sm uppercase text-[#c5c5c5] underline underline-offset-4 hover:opacity-70";

function SectionHead({ label, title }: { label: [string, string]; title: string }) {
  return (
    <Reveal className={GRID}>
      <span className={LABEL}>
        <span>{label[0]}</span>
        <span>{label[1]}</span>
      </span>
      <h2 className={H2}>{title}</h2>
    </Reveal>
  );
}

function Rows({ items }: { items: { ref: string; name: string; description: string; proof?: string }[] }) {
  return (
    <div className="mt-[50px] max-sm:mt-6 border-t border-white/10">
      {items.map((item, idx) => (
        <Reveal key={item.name} delay={idx * 0.04}>
          <div className={ROW}>
            <span className={REF}>{item.ref}</span>
            <h3 className={NAME}>
              <AnimatedText text={item.name} className="projects-name-text" />
            </h3>
            <div className={BODY}>
              <p>{item.description}</p>
              {item.proof && <p className="mt-3">{item.proof}</p>}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export default function HirePage() {
  return (
    <main className="min-h-screen w-full px-5 max-sm:px-3 overflow-x-clip flex flex-col pb-0">
      <Reveal aboveFold as="header" className="w-full mt-5 relative z-10">
        <SiteHeader variant="static" />
      </Reveal>

      {/* Hero: title, one line of framing, two actions */}
      <section className={`${GRID} w-full items-start mt-[clamp(120px,16vw,220px)] max-sm:mt-20`}>
        <Reveal aboveFold className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-start lg:row-start-1 [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>Hire</span>
          <span>Me</span>
        </Reveal>

        <Reveal aboveFold as="h1" className="col-[3/10] max-sm:col-[1/5] max-sm:row-start-1 sm:col-[1/5] sm:row-start-1 lg:col-[3/10] lg:row-start-1 text-[#c5c5c5] font-medium text-[clamp(46px,3.462vw-2.46px,64px)] max-sm:text-[clamp(28px,8vw,40px)] sm:text-[clamp(40px,4.688vw,56px)] lg:max-dt:text-[clamp(32px,3.733vw-6.22px,46px)] dt:text-[clamp(46px,3.462vw-2.46px,64px)] leading-[100%] tracking-[-0.06em] self-start min-w-0">
          <span className="block pl-[calc((100%+20px)/7)] lg:max-dt:pl-[calc((100%+20px)/7)] sm:max-lg:pl-[calc((100%+20px)/4)] max-sm:pl-0">
            Hire a Senior Product Designer
          </span>
          in Riyadh for banking, fintech, and travel products
        </Reveal>

        <Reveal aboveFold delay={0.15} className="col-[3/10] max-sm:col-[1/5] max-sm:row-start-2 sm:col-[1/5] sm:row-start-2 lg:col-[3/10] lg:row-start-2 mt-8 max-sm:mt-6 flex items-center gap-6">
          <Magnetic range={60} strength={0.4}>
            <BookMeetingButton />
          </Magnetic>
          <Magnetic range={60} strength={0.4}>
            <Link href="/contacts" className={CTA}>
              Send a brief
            </Link>
          </Magnetic>
        </Reveal>

        <Reveal aboveFold delay={0.2} as="p" className="col-[3/10] max-sm:col-[1/5] max-sm:row-start-3 sm:col-[1/5] sm:row-start-3 lg:col-[3/10] lg:row-start-3 mt-6 font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)]">
          {PROFILE.availability}
        </Reveal>
      </section>

      <WavyString className="mt-20" />

      <section className="mt-16">
        <SectionHead label={["Good", "Fit"]} title="Who I work with" />
        <Rows items={HIRE_FIT} />
      </section>

      <WavyString className="mt-20" />

      <section className="mt-16">
        <SectionHead label={["What", "I do"]} title="Services" />
        <Rows items={SERVICES_OFFERED} />
      </section>

      <WavyString className="mt-20" />

      <section className="mt-16">
        <SectionHead label={["Next", "Steps"]} title="How to brief me" />
        <Rows items={HIRE_STEPS} />
      </section>

      <WavyString className="mt-20" />

      {/* Questions are shown in full, not collapsed: the same text is in the FAQ structured data */}
      <section className="mt-16">
        <SectionHead label={["Quick", "Answers"]} title="FAQ" />
        <div className="mt-[50px] max-sm:mt-6 border-t border-white/10">
          {HIRE_FAQ.map((qa, idx) => (
            <Reveal key={qa.question} delay={idx * 0.04}>
              <div className={ROW}>
                <h3 className="col-[3/8] max-sm:col-[1/5] sm:col-[1/5] lg:col-[3/8] font-medium text-[clamp(24px,1.8vw,32px)] max-sm:text-[20px] leading-[110%] tracking-[-0.04em] text-[#c5c5c5]">
                  {qa.question}
                </h3>
                <p className={BODY}>{qa.answer}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <WavyString className="mt-20" />
      <Footer />
    </main>
  );
}
