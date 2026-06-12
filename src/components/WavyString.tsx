"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { useMouseEffectsEnabled } from "@/hooks/useMouseEffectsEnabled";

interface WavyStringProps {
  className?: string;
  icon?: string;
  alt?: string;
}

function WavyStringIcon() {
  return (
    <svg
      width="24"
      height="14.3"
      viewBox="0 0 116 69"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 block opacity-40 hover:opacity-100 transition-opacity duration-200"
    >
      <rect width="20" height="69" fill="#C5C5C5" />
      <rect x="24" width="20" height="55" fill="#C5C5C5" />
      <rect x="48" width="20" height="69" fill="#C5C5C5" />
      <rect x="72" width="20" height="69" fill="#C5C5C5" />
      <rect x="96" width="20" height="20" fill="#C5C5C5" />
      <rect x="96" y="24" width="20" height="20" fill="#C5C5C5" />
    </svg>
  );
}

function WavyStringStatic({ className = "" }: WavyStringProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <WavyStringIcon />
      <div className="flex-1 relative h-[200px]">
        <svg
          className="w-full h-[200px] absolute top-0 left-0"
          preserveAspectRatio="none"
          viewBox="0 0 100 200"
          aria-hidden="true"
        >
          <path
            d="M 0 100 Q 50 100 100 100"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}

function WavyStringInteractive({ className = "" }: WavyStringProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const widthRef = useRef(100);
  const isVisibleRef = useRef(false);
  const [width, setWidth] = useState(0);

  const displacement = useMotionValue(0);
  const springDisplacement = useSpring(displacement, {
    stiffness: 350,
    damping: 2,
    mass: 0.15,
  });

  const updatePath = useCallback((latest: number) => {
    const w = widthRef.current || 100;
    pathRef.current?.setAttribute("d", `M 0 100 Q ${w / 2} ${100 + latest} ${w} 100`);
  }, []);

  const updateWidth = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.getBoundingClientRect().width;
    widthRef.current = w;
    setWidth(w);
    updatePath(0);
  }, [updatePath]);

  useEffect(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [updateWidth]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(el);

    const unsubscribe = springDisplacement.on("change", (latest) => {
      if (isVisibleRef.current) {
        updatePath(latest);
      }
    });

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [springDisplacement, updatePath]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const centerY = rect.height / 2;
    const offset = mouseY - centerY;
    const absOffset = Math.abs(offset);

    if (absOffset < 60) {
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
      <WavyStringIcon />
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
            ref={pathRef}
            d={`M 0 100 Q ${w / 2} 100 ${w} 100`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}

export default function WavyString(props: WavyStringProps) {
  const mouseEffectsEnabled = useMouseEffectsEnabled();

  if (!mouseEffectsEnabled) {
    return <WavyStringStatic {...props} />;
  }

  return <WavyStringInteractive {...props} />;
}
