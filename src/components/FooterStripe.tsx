"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { useMouseEffectsEnabled } from "@/hooks/useMouseEffectsEnabled";

export default function FooterStripe() {
  const mouseEffectsEnabled = useMouseEffectsEnabled();
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const mouseTarget = useMotionValue(0);
  const mouseSpring = useSpring(mouseTarget, {
    stiffness: 350,
    damping: 4,
    mass: 0.4,
  });

  const generatePath = (s: number, t: number, mouseVal: number) => {
    const points = [];
    const amplitude = 50 + 24 * (2.5 - Math.abs(s - 2.5));
    const freqMultiplier = 1 + 0.15 * s;
    const phaseShift = 0.8 * s;

    for (let pct = 0; pct <= 100; pct += 1) {
      const i = pct / 100;
      let envelope = 0;
      if (i >= 0.25 && i <= 0.75) {
        envelope = Math.sin(((i - 0.25) / 0.5) * Math.PI);
      }
      const centerPull = Math.sin(i * Math.PI);
      const y =
        250 +
        Math.sin(i * freqMultiplier * Math.PI * 2 + 1.5 * t + phaseShift) *
          amplitude *
          envelope +
        mouseVal *
          centerPull;
      points.push(`${pct},${y}`);
    }
    return `M ${points.join(" L ")}`;
  };

  useEffect(() => {
    let animationFrameId = 0;
    const startTime = performance.now();
    let totalPausedMs = 0;
    let pauseStartedAt: number | null = null;
    let isVisible = false;

    const loop = (now: number) => {
      const elapsedSeconds = (now - startTime - totalPausedMs) / 1000;
      const mouseVal = mouseEffectsEnabled ? mouseSpring.get() : 0;

      for (let s = 0; s < 6; s += 1) {
        const pathD = generatePath(s, elapsedSeconds, mouseVal);
        const ref = pathRefs.current[s];
        if (ref) {
          ref.setAttribute("d", pathD);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (pauseStartedAt !== null) {
        totalPausedMs += performance.now() - pauseStartedAt;
        pauseStartedAt = null;
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      if (pauseStartedAt === null) {
        pauseStartedAt = performance.now();
      }
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    };

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible && !isVisible) {
          isVisible = true;
          startLoop();
        } else if (!visible && isVisible) {
          isVisible = false;
          stopLoop();
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);

    const rect = el.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      isVisible = true;
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouseEffectsEnabled, mouseSpring]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const distY = e.clientY - centerY;
    const absDistY = Math.abs(distY);

    if (absDistY < 100) {
      // Pull strength decreases as cursor moves away from center line
      const target = -Math.sign(distY) * (1 - absDistY / 100) * 80;
      mouseTarget.set(target);
    } else {
      mouseTarget.set(0);
    }
  };

  const handleMouseLeave = () => {
    mouseTarget.set(0);
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-full${mouseEffectsEnabled ? " cursor-pointer" : ""}`}
      {...(mouseEffectsEnabled
        ? { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave }
        : {})}
    >
      <svg
        viewBox="0 0 100 500"
        preserveAspectRatio="none"
        className="w-full h-full block"
      >
        <defs>
          <linearGradient id="footer-stripe-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(25,25,25,1)" />
            <stop offset="12%" stopColor="rgba(25,25,25,1)" />
            <stop offset="32%" stopColor="rgba(27,103,232,1)" />
            <stop offset="50%" stopColor="rgba(28,206,203,1)" />
            <stop offset="69%" stopColor="rgba(146,127,174,1)" />
            <stop offset="88%" stopColor="rgba(25,25,25,1)" />
            <stop offset="100%" stopColor="rgba(25,25,25,1)" />
          </linearGradient>
        </defs>

        {Array.from({ length: 6 }).map((_, index) => (
          <path
            key={index}
            ref={(el) => {
              pathRefs.current[index] = el;
            }}
            d="M 0 250 L 100 250"
            fill="none"
            stroke="url(#footer-stripe-gradient)"
            strokeWidth={2}
            style={{ vectorEffect: "non-scaling-stroke" }}
            opacity={1}
          />
        ))}
      </svg>
    </div>
  );
}
