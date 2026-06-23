"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import AnimatedText from "@/components/AnimatedText";
import FooterStripe from "@/components/FooterStripe";

const CONFETTI_COLORS = ["#1CCECB", "#1B67E8", "#927FAE", "#E8E8E8", "#1CCECB"];

function FooterConfetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        dx: (Math.random() - 0.5) * 120,
        dy: -(Math.random() * 40 + 20),
        rotate: Math.random() * 360 - 180,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        w: 3 + Math.random() * 3,
        h: 2 + Math.random() * 2,
        delay: Math.random() * 0.05,
      })),
    []
  );

  return (
    <div className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 overflow-visible pointer-events-none">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-[1px]"
          style={{
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
            marginLeft: -p.w / 2,
            marginTop: -p.h / 2,
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            x: p.dx,
            y: p.dy,
            opacity: [0, 1, 0],
            scale: [0, 1, 0.3],
            rotate: p.rotate,
          }}
          transition={{ duration: 0.7, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Fallback copy failed: ", err);
    }
    document.body.removeChild(textArea);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const email = "Contact@maherfayad.com";
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Clipboard copy failed: ", err);
          fallbackCopyText(email);
        });
    } else {
      fallbackCopyText(email);
    }
  };

  return (
    <footer className="pb-10 max-sm:pb-28">
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
          <div className="relative inline-block mt-[30px] max-sm:mt-4 text-right">
            <a
              onClick={handleCopy}
              className="font-medium text-[38px] leading-[100%] tracking-[-0.06em] text-[#c5c5c5] underline decoration-[7%] underline-offset-[12.5%] hover:opacity-70 lg:max-dt:text-[clamp(24px,2.8vw,34px)] sm:max-dt:text-[clamp(20px,2.5vw,24px)] dt:text-[38px] max-sm:text-[clamp(24px,7vw,34px)] break-all cursor-pointer"
            >
              Contact@maherfayad.com
            </a>
            <AnimatePresence>
              {copied && (
                <>
                  <FooterConfetti />
                  <motion.span
                    initial={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                    exit={{ opacity: 0, y: -10, scale: 0.95, x: "-50%" }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    className="absolute bottom-full left-1/2 mb-3 px-2.5 py-1.5 text-[10px] font-bold text-white bg-black border border-white/10 rounded shadow-[0_4px_12px_rgba(0,0,0,0.5)] pointer-events-none whitespace-nowrap z-50 uppercase tracking-wider leading-none flex items-center gap-1.5"
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-3 w-3 shrink-0">
                      <path
                        d="M16.667 5.833 8.333 14.167 3.333 9.167"
                        stroke="#1CCECB"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Copied!</span>
                  </motion.span>
                </>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
