"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

interface WavyStringProps {
  className?: string;
  icon?: string;
  alt?: string;
}

export default function WavyString({ className = "", icon = "/ins.svg", alt = "Instagram" }: WavyStringProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [pathD, setPathD] = useState("M 0 100 Q 50 100 100 100");

  const displacement = useMotionValue(0);
  const springDisplacement = useSpring(displacement, {
    stiffness: 350,
    damping: 2,
    mass: 0.15,
  });

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.getBoundingClientRect().width);
    }
  }, []);

  // Listen for resize to update the width of the interactive SVG divider
  useEffect(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [updateWidth]);

  useEffect(() => {
    const w = width || 100;
    setPathD(`M 0 100 Q ${w / 2} 100 ${w} 100`);

    return springDisplacement.on("change", (latest) => {
      setPathD(`M 0 100 Q ${w / 2} ${100 + latest} ${w} 100`);
    });
  }, [springDisplacement, width]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const centerY = rect.height / 2;
    const offset = mouseY - centerY;
    const absOffset = Math.abs(offset);

    if (absOffset < 60) {
      // Linear falloff of amplitude based on distance from string center line
      const target = -Math.sign(offset) * (1 - absOffset / 60) * 60;
      displacement.set(target);
    } else {
      displacement.set(0);
    }
  };

  const handleMouseLeave = () => {
    displacement.set(0);
  };

  const w = width || 100;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="24"
        height="14.3"
        viewBox="0 0 116 69"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 block opacity-40 hover:opacity-100 transition-opacity duration-200"
      >
        <rect width="20" height="69" fill="#C5C5C5"/>
        <rect x="24" width="20" height="55" fill="#C5C5C5"/>
        <rect x="48" width="20" height="69" fill="#C5C5C5"/>
        <rect x="72" width="20" height="69" fill="#C5C5C5"/>
        <rect x="96" width="20" height="20" fill="#C5C5C5"/>
        <rect x="96" y="24" width="20" height="20" fill="#C5C5C5"/>
      </svg>
      <div
        ref={containerRef}
        className="flex-1 relative h-[200px] cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          className="w-full h-[200px] absolute top-0 left-0"
          preserveAspectRatio="none"
          viewBox={`0 0 ${w} 200`}
        >
          <path
            d={pathD}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}
