"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Image from "next/image";

interface PreloaderProps {
  onComplete: () => void;
  onStartExit: () => void;
}

export default function Preloader({ onComplete, onStartExit }: PreloaderProps) {
  const [exiting, setExiting] = useState(false);
  const progress = useMotionValue(0);
  const roundedProgress = useTransform(progress, (latest) => Math.round(latest));

  useEffect(() => {
    // Animate progress count from 0 to 100 in 3 seconds
    const countAnimation = animate(progress, 100, {
      duration: 3.0,
      ease: [0.76, 0, 0.24, 1],
    });

    // Timeout triggers to match original Next.js transition states
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 2200);

    const startExitTimer = setTimeout(() => {
      onStartExit?.();
    }, 2800);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 3400);

    return () => {
      countAnimation.stop();
      clearTimeout(exitTimer);
      clearTimeout(startExitTimer);
      clearTimeout(completeTimer);
    };
  }, [progress, onComplete, onStartExit]);

  // Read percentage as string for rendering
  const [progressVal, setProgressVal] = useState(0);
  useEffect(() => {
    return roundedProgress.on("change", (val) => setProgressVal(val));
  }, [roundedProgress]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
      style={{ pointerEvents: exiting ? "none" : "auto" }}
    >
      <div className="h-full px-5 max-sm:px-3 relative">
        <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 h-full max-w-[1920px] mx-auto">

          {/* Bottom Left Text */}
          <motion.div
            className="col-start-5 col-span-4 max-sm:pb-20 lg:col-[5/8] sm:col-[1/5] md:col-[1/5] max-sm:col-[1/4] flex items-end justify-start pb-[140px]"
            initial={{ opacity: 0, x: -20 }}
            animate={exiting ? { opacity: 0, x: -60 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: exiting ? 0 : 0.3 }}
          >
            <div className="flex flex-col font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] [&_span]:block leading-none">
              <div className="text-left">
                <span>Making high-</span>
                <span>quality projects</span>
              </div>
              <div className="text-right mt-1">
                <span>since</span>
                <span>2022</span>
              </div>
            </div>
          </motion.div>

          {/* Center concentric spinners */}
          <div className="col-span-12 flex items-center justify-center absolute inset-0 pointer-events-none">
            <div className="relative w-[362px] h-[362px]">

              {/* Inner ring */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={exiting ? { opacity: 0, scale: 3, filter: "blur(40px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: exiting ? 0 : 0.05 }}
              >
                <div className="absolute inset-0 flex items-center justify-center will-change-transform animate-[preloader-spin-cw_1.2s_ease-in-out_infinite]">
                  <img src="/preloader/circle.svg" alt="" width={197} height={197} className="w-[197px] h-[197px]" />
                </div>
              </motion.div>

              {/* Middle ring */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={exiting ? { opacity: 0, scale: 3, filter: "blur(40px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: exiting ? 0 : 0.12 }}
              >
                <div className="absolute inset-0 flex items-center justify-center will-change-transform animate-[preloader-spin-ccw_20s_linear_infinite]">
                  <img src="/preloader/circle2.svg" alt="" width={268} height={268} className="w-[268px] h-[268px]" />
                </div>
              </motion.div>

              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={exiting ? { opacity: 0, scale: 3, filter: "blur(40px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: exiting ? 0 : 0.19 }}
              >
                <div className="absolute inset-0 flex items-center justify-center will-change-transform animate-[preloader-spin-cw_40s_linear_infinite]">
                  <img src="/preloader/circle3.svg" alt="" width={362} height={362} className="w-[362px] h-[362px]" />
                </div>
              </motion.div>

              {/* Center progress counter */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-[#c5c5c5] text-[1.25rem] font-bold tracking-tight"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={exiting ? { opacity: 0, scale: 3, filter: "blur(40px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: exiting ? 0 : 0.25 }}
                >
                  <span>{progressVal}</span>%
                </motion.div>
              </div>

            </div>
          </div>

          {/* Top Right Logo */}
          <motion.div
            className="col-start-8 col-span-1 max-sm:pt-20 flex items-start justify-start pt-40 sm:col-[10/13] md:col-[10/13] lg:col-[8/9]"
            initial={{ opacity: 0, x: 20 }}
            animate={exiting ? { opacity: 0, x: 60 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: exiting ? 0 : 0.3 }}
          >
            <img src="/assets/logo.svg" alt="Maher Fayad" width={195} height={54} className="w-auto h-auto max-w-[150px] max-sm:max-w-[120px]" />
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
