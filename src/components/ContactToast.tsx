"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

export type ContactToastData = {
  type: "success" | "error";
  message: string;
};

type ToastPhase = "ball" | "expand" | "text" | "icon";

const riseSpring = {
  type: "spring" as const,
  stiffness: 160,
  damping: 22,
  mass: 1.5,
};

const expandSpring = {
  type: "spring" as const,
  stiffness: 190,
  damping: 26,
  mass: 1.1,
};

const textReveal = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};

const iconSpring = {
  type: "spring" as const,
  stiffness: 520,
  damping: 20,
  mass: 0.7,
};

const CONFETTI_COLORS = ["#1CCECB", "#1B67E8", "#927FAE", "#E8E8E8", "#1CCECB"];

function ToastCheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0">
      <path
        d="M16.667 5.833 8.333 14.167 3.333 9.167"
        stroke="#1CCECB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ToastErrorIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0">
      <path
        d="M10 6.667v4.166M10 13.75h.008"
        stroke="#E84040"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="7.5" stroke="#E84040" strokeWidth="2" />
    </svg>
  );
}

function ToastConfetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        dx: (Math.random() - 0.5) * 88,
        dy: -(Math.random() * 48 + 14),
        rotate: Math.random() * 480 - 240,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        w: 3 + Math.random() * 4,
        h: 2 + Math.random() * 3,
        delay: Math.random() * 0.08,
      })),
    []
  );

  return (
    <div className="absolute left-2.5 top-1/2 z-10 -translate-y-1/2 overflow-visible pointer-events-none">
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
            scale: [0, 1.1, 0.35],
            rotate: p.rotate,
          }}
          transition={{ duration: 0.8, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function ContactToast({ toast }: { toast: ContactToastData }) {
  const [phase, setPhase] = useState<ToastPhase>("ball");
  const measureRef = useRef<HTMLDivElement>(null);
  const [targetWidth, setTargetWidth] = useState(52);
  const isSuccess = toast.type === "success";
  const showContent = phase === "text" || phase === "icon";
  const showIcon = phase === "icon";

  useLayoutEffect(() => {
    if (!measureRef.current) return;
    setTargetWidth(measureRef.current.offsetWidth);
  }, [toast.message, toast.type]);

  useEffect(() => {
    setPhase("ball");
    const expandTimer = window.setTimeout(() => setPhase("expand"), 520);
    const textTimer = window.setTimeout(() => setPhase("text"), 980);
    const iconTimer = window.setTimeout(() => setPhase("icon"), 1380);

    return () => {
      window.clearTimeout(expandTimer);
      window.clearTimeout(textTimer);
      window.clearTimeout(iconTimer);
    };
  }, [toast.message, toast.type]);

  const expanded = phase !== "ball";
  const shellWide = phase === "expand" || showContent;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 sm:bottom-8 sm:right-8 sm:left-auto sm:translate-x-0 z-50 pointer-events-none"
      initial={{ y: 96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 44, opacity: 0, scale: 0.94 }}
      transition={riseSpring}
    >
      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed -left-[9999px] top-0 flex min-h-[52px] max-w-[min(92vw,28rem)] items-center px-5 py-4"
      >
        <div className="flex min-h-[20px] items-center pl-8">
          <div className="h-5 w-5 shrink-0" />
          <p className="font-semibold text-sm leading-[140%] tracking-[-0.03em] text-[#c5c5c5]">
            {toast.message}
          </p>
        </div>
      </div>

      <motion.div
        className={`relative overflow-hidden bg-[#141414]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-md min-h-[52px] ${
          shellWide ? "px-5 py-4" : "p-0"
        }`}
        initial={false}
        animate={{
          width: shellWide ? targetWidth : 52,
          borderRadius: expanded ? 16 : 26,
        }}
        transition={{
          width: expandSpring,
          borderRadius: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        {showIcon && isSuccess && <ToastConfetti />}

        {showContent && (
          <div className="relative flex min-h-[20px] w-fit max-w-[min(92vw,28rem)] items-center pl-8">
            <div className="absolute left-0 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center">
              {showIcon && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={iconSpring}
                >
                  {isSuccess ? <ToastCheckIcon /> : <ToastErrorIcon />}
                </motion.div>
              )}
            </div>

            <div className="overflow-hidden">
              <motion.p
                className="font-semibold text-sm leading-[140%] tracking-[-0.03em] text-[#c5c5c5]"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={textReveal}
                style={{ willChange: "transform, opacity" }}
              >
                {toast.message}
              </motion.p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
