"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import AnimatedText from "@/components/AnimatedText";
import FooterStripe from "@/components/FooterStripe";

export default function Footer() {
  return (
    <footer className="pb-10">
      {/* Footer Top Section (Logo, Labels, and CTA) */}
      <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 mt-10 items-start">
        {/* Left side logo and labels */}
        <div className="col-[1/4] sm:col-[1/3] lg:col-[1/4] flex flex-col gap-6 max-sm:hidden">
          <Reveal className="block w-[219px] h-[55px]">
            <Link href="/">
              <img alt="Maher Fayad" src="/assets/logo.svg" width="200" height="55" className="w-auto h-[40px]" />
            </Link>
          </Reveal>

          <div className="flex gap-5 mt-2">
            <Reveal className="flex flex-col text-right">
              <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
                Maher
              </span>
              <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
                Fayad
              </span>
            </Reveal>
            <Reveal className="flex flex-col text-left">
              <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm !text-[#c5c5c5]">
                Product
              </span>
              <span className="block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm !text-[#c5c5c5]">
                Designer
              </span>
            </Reveal>
          </div>
        </div>

        {/* Right side CTA text */}
        <Reveal className="col-[5/13] sm:col-[1/5] lg:col-[5/13] max-sm:col-[1/5] flex flex-col items-end text-right max-sm:mt-4">
          <Link href="/contacts" className="font-medium text-[64px] leading-[100%] tracking-[-0.06em] text-[#c5c5c5] no-underline block max-sm:text-[clamp(36px,8vw,34px)] lg:max-dt:text-[clamp(44px,5.333vw-10.61px,64px)] md:max-dt:text-[clamp(32px,5.333vw-10.61px,54px)] sm:max-lg:text-[clamp(26px,6.25vw,28px)] dt:text-[64px] text-right">
            <span className="block">
              <AnimatedText text="I am ready" className="projects-name-text" />
            </span>
            <AnimatedText text="to discuss your project" className="projects-name-text" />
          </Link>
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

        <Reveal className="col-[8/13] sm:col-[1/5] lg:col-[8/13] max-sm:col-[1/5] max-sm:row-start-2 sm:row-start-2 max-sm:mt-10 flex flex-col items-end text-right">
          <a
            href="mailto:Contact@maherfayad.com"
            className="mt-[30px] max-sm:mt-4 max-sm:text-[20px] font-medium text-[38px] leading-[100%] tracking-[-0.06em] text-[#c5c5c5] underline decoration-[7%] underline-offset-[12.5%] hover:opacity-70 lg:max-dt:text-[clamp(24px,2.8vw,34px)] sm:max-dt:text-[clamp(20px,2.5vw,24px)] dt:text-[38px] break-all text-right"
          >
            Contact@maherfayad.com
          </a>
        </Reveal>
      </div>
    </footer>
  );
}
