"use client";

import { useState } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  externalHover?: boolean;
}

export default function AnimatedText({ text, className = "", externalHover }: AnimatedTextProps) {
  const [hovered, setHovered] = useState(false);
  const isHovered = externalHover !== undefined ? externalHover : hovered;
  const chars = text.split("");

  return (
    <div
      className={`inline-flex ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {chars.map((char, index) => (
        <span key={index} className="inline-block relative overflow-hidden">
          <span className="inline-block relative">
            <span
              className="inline-block absolute left-0 top-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                transform: isHovered ? "translateY(0)" : "translateY(-110%)",
                transitionDelay: `${0.01 * index}s`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
            <span
              className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                transform: isHovered ? "translateY(110%)" : "translateY(0)",
                transitionDelay: `${0.01 * index}s`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
