"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useHomeRevealGate } from "./HomeRevealGate";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: string;
  aboveFold?: boolean;
}

export default function Reveal({
  children,
  delay = 0,
  duration = 1.2,
  y = 30,
  className = "",
  style,
  as = "div",
  aboveFold = false,
}: RevealProps) {
  const homeRevealGate = useHomeRevealGate();

  // Create motion component based on 'as' prop dynamically (e.g. motion.div, motion.p)
  const MotionComp = (motion as any)[as] || motion.div;
  const initial = { opacity: 0, y: y };

  return (
    <MotionComp
      initial={initial}
      {...(aboveFold
        ? { animate: aboveFold && homeRevealGate ? { opacity: 1, y: 0 } : initial }
        : {
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.1, margin: "0px 0px -50px 0px" },
          })}
      transition={{ duration, delay, ease: [0.215, 0.61, 0.355, 1] }}
      className={className}
      style={style}
    >
      {children}
    </MotionComp>
  );
}
