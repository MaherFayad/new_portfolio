"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { useMouseEffectsEnabled } from "@/hooks/useMouseEffectsEnabled";

const getLineStyle = (s: number) => {
  // Thick glowing lines
  if (s % 4 === 0) {
    return {
      strokeWidth: 2.2,
      opacity: 0.95,
      strokeDasharray: undefined,
      filter: "url(#neon-glow)",
    };
  }
  // Fine dashed particle traces
  if (s % 4 === 1) {
    return {
      strokeWidth: 0.85,
      opacity: 0.5,
      strokeDasharray: "4 8",
      filter: undefined,
    };
  }
  // Smooth thin lines
  if (s % 4 === 2) {
    return {
      strokeWidth: 1.25,
      opacity: 0.75,
      strokeDasharray: undefined,
      filter: undefined,
    };
  }
  // Glowing dotted paths
  return {
    strokeWidth: 1.0,
    opacity: 0.65,
    strokeDasharray: "1 5",
    filter: "url(#neon-glow)",
  };
};

export default function FooterStripe() {
  const mouseEffectsEnabled = useMouseEffectsEnabled();
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  // Vertical displacement spring
  const mouseTarget = useMotionValue(0);
  const mouseSpring = useSpring(mouseTarget, {
    stiffness: 350,
    damping: 4,
    mass: 0.4,
  });

  // Dynamic pinch X coordinate spring
  const pinchXTarget = useMotionValue(0.65);
  const pinchXSpring = useSpring(pinchXTarget, {
    stiffness: 220,
    damping: 24,
  });

  const generatePath = (s: number, t: number, mouseVal: number, currentPinchX: number) => {
    const points = [];
    const scaledS = (s / 11) * 5;

    const freqMultiplier = 1.0 + 0.12 * scaledS;
    const phaseShift = 0.6 * scaledS;
    const amplitude = 230 + 25 * (2.5 - Math.abs(scaledS - 2.5));

    for (let pct = 0; pct <= 100; pct += 1) {
      const i = pct / 100;

      let envelope = 0;
      let centerPull = 0;

      // Calculate envelope relative to the dynamic pinch point
      if (i <= currentPinchX) {
        envelope = Math.sin(((currentPinchX - i) / currentPinchX) * Math.PI / 2);
        centerPull = Math.sin((i / currentPinchX) * Math.PI / 2);
      } else {
        envelope = Math.sin(((i - currentPinchX) / (1 - currentPinchX)) * Math.PI / 2);
        centerPull = Math.sin(((1 - i) / (1 - currentPinchX)) * Math.PI / 2);
      }

      // Multi-harmonic organic vibration
      const mainWave = Math.sin(i * freqMultiplier * Math.PI * 2 + 1.6 * t + phaseShift);
      const harmonicWave = Math.sin(i * freqMultiplier * 3.5 * Math.PI * 2 - 2.8 * t + phaseShift * 2.0) * 0.12;
      const microRipple = Math.sin(i * 12.0 * Math.PI + 6.0 * t) * 0.02;

      const y =
        250 +
        (mainWave + harmonicWave + microRipple) *
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
      const currentPinchX = mouseEffectsEnabled ? pinchXSpring.get() : 0.65;

      for (let s = 0; s < 12; s += 1) {
        const pathD = generatePath(s, elapsedSeconds, mouseVal, currentPinchX);
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
  }, [mouseEffectsEnabled, mouseSpring, pinchXSpring]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const distY = e.clientY - centerY;
    const absDistY = Math.abs(distY);

    // Calculate mouse percentage across container width
    const pctX = (e.clientX - rect.left) / rect.width;

    if (absDistY < 180) {
      const target = -Math.sign(distY) * (1 - absDistY / 180) * 100;
      mouseTarget.set(target);
      pinchXTarget.set(pctX);
    } else {
      mouseTarget.set(0);
      pinchXTarget.set(0.65);
    }
  };

  const handleMouseLeave = () => {
    mouseTarget.set(0);
    pinchXTarget.set(0.65);
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
          {/* Smooth, premium gradient fading seamlessly into dark backgrounds */}
          <linearGradient id="footer-stripe-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0, 0, 0, 0)" />
            <stop offset="15%" stopColor="rgba(27, 103, 232, 0.15)" />
            <stop offset="35%" stopColor="rgba(27, 103, 232, 0.95)" />
            <stop offset="50%" stopColor="rgba(28, 206, 203, 0.95)" />
            <stop offset="65%" stopColor="rgba(146, 127, 174, 0.95)" />
            <stop offset="85%" stopColor="rgba(146, 127, 174, 0.15)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </linearGradient>
          {/* Neon Glow Filter */}
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {Array.from({ length: 12 }).map((_, index) => {
          const style = getLineStyle(index);
          return (
            <path
              key={index}
              ref={(el) => {
                pathRefs.current[index] = el;
              }}
              d="M 0 250 L 100 250"
              fill="none"
              stroke="url(#footer-stripe-gradient)"
              strokeWidth={style.strokeWidth}
              strokeDasharray={style.strokeDasharray}
              style={{
                vectorEffect: "non-scaling-stroke",
                filter: style.filter,
              }}
              opacity={style.opacity}
            />
          );
        })}
      </svg>
    </div>
  );
}
