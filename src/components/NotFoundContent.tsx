"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import ConcentricCircles from "@/components/ConcentricCircles";
import Magnetic from "@/components/Magnetic";
import SiteHeader from "@/components/SiteHeader";

export default function NotFoundContent() {
  return (
    <main className="min-h-screen w-full px-5 max-sm:px-3 overflow-x-clip flex flex-col pb-10">
      <header className="w-full mt-5 relative z-10">
        <SiteHeader variant="static" />
      </header>

      <section className="relative flex-1 flex flex-col justify-center mt-16 max-sm:mt-10">
        <div className="grid grid-cols-12 max-sm:grid-cols-1 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-start">
          <Reveal
            aboveFold
            className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left [&>span]:block block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.62)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm"
          >
            <span>Page</span>
            <span>Not Found</span>
          </Reveal>
        </div>

        <Reveal duration={1.5} y={50} style={{ perspective: 800, marginTop: -100 }}>
          <ConcentricCircles centerLabel="404" />
        </Reveal>

        <div className="grid grid-cols-4 max-sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 max-sm:mt-10">
          <Reveal
            aboveFold
            as="h1"
            className="col-span-4 max-sm:col-start-2 max-sm:col-span-3 sm:col-[2/5] lg:col-[8/12] font-medium text-[clamp(26px,1.923vw-0.92px,36px)] leading-[100%] tracking-[-0.03em] text-[#c5c5c5] max-sm:text-[clamp(18px,5vw,22px)] lg:max-dt:text-[clamp(18px,2.133vw-3.84px,26px)] dt:text-[clamp(26px,1.923vw-0.92px,36px)]"
          >
            <span className="max-sm:pl-0 pl-[calc((100%+20px)/4)] sm:pl-[calc((100%+20px)/3)] block">
              This page doesn&apos;t exist
            </span>
            or may have been moved elsewhere
          </Reveal>

          <Reveal
            aboveFold
            delay={0.1}
            as="p"
            className="col-span-4 max-sm:col-start-2 max-sm:col-span-3 sm:col-[3/5] lg:col-[9/12] mt-[30px] max-sm:mt-4 max-sm:text-sm sm:mt-[10px] font-medium text-base leading-[120%] tracking-[-0.03em] text-[rgba(197,197,197,0.62)] text-[clamp(16px,0.8vw+0.8px,16px)] lg:max-dt:text-[clamp(12px,0.8vw+0.8px,11px)] dt:text-md"
          >
            The link you followed might be broken, outdated, or the page was removed.
            Head back to the homepage to explore projects, case studies, and ways to get in touch.
          </Reveal>

          <Reveal aboveFold delay={0.2} className="col-span-4 max-sm:col-start-2 max-sm:col-span-3 sm:col-[3/5] lg:col-[9/12] mt-8 max-sm:mt-6">
            <Magnetic range={60} strength={0.4}>
              <Link
                href="/"
                className="font-semibold text-sm uppercase text-[#c5c5c5] underline underline-offset-4 hover:opacity-70"
              >
                GO BACK HOME ↗
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
