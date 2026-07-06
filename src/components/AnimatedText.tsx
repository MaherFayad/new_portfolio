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
      {chars.map((char, index) => {
        const displayChar = char === " " ? "\u00A0" : char;
        return (
          <span key={index} className="inline-block relative overflow-hidden pb-[0.2em] -mb-[0.2em]">
            <span className="inline-block relative">
              {/* Decorative duplicate: rendered via CSS content, not a real text node, so it
                  isn't announced by screen readers, isn't selectable/copyable, and isn't indexed. */}
              <span
                aria-hidden="true"
                data-char={displayChar}
                className="inline-block absolute left-0 top-0 pointer-events-none select-none transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] before:content-[attr(data-char)]"
                style={{
                  transform: isHovered ? "translateY(0)" : "translateY(-110%)",
                  transitionDelay: `${0.01 * index}s`,
                }}
              />
              <span
                className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  transform: isHovered ? "translateY(110%)" : "translateY(0)",
                  transitionDelay: `${0.01 * index}s`,
                }}
              >
                {displayChar}
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
