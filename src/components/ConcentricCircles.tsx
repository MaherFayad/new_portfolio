"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMouseEffectsEnabled } from "@/hooks/useMouseEffectsEnabled";

interface ConcentricCirclesProps {
  centerLabel?: ReactNode;
}

export default function ConcentricCircles({ centerLabel }: ConcentricCirclesProps) {
  const mouseEffectsEnabled = useMouseEffectsEnabled();
  const containerRef = useRef<HTMLDivElement>(null);
  const coordX = useMotionValue(0);
  const coordY = useMotionValue(0);
  const [gyroActive, setGyroActive] = useState(false);
  const isVisibleRef = useRef(false);
  const orientationHandlerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);
  const rafRef = useRef(0);
  const pendingRef = useRef({ x: 0, y: 0 });

  const springConfig = {
    stiffness: 180,
    damping: 12,
  };

  const springX = useSpring(coordX, springConfig);
  const springY = useSpring(coordY, springConfig);

  const rotateX = useTransform(springY, (y) => -19 * y);
  const rotateY = useTransform(springX, (x) => 19 * x);
  const glowX = useTransform(springX, (x) => 6 * x);
  const glowY = useTransform(springY, (y) => 6 * y);
  const baseX = useTransform(springX, (x) => 12 * x);
  const baseY = useTransform(springY, (y) => 12 * y);
  const dotsX = useTransform(springX, (x) => 25 * x);
  const dotsY = useTransform(springY, (y) => 25 * y);
  const foregroundX = useTransform(springX, (x) => 44 * x);
  const foregroundY = useTransform(springY, (y) => 44 * y);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;

    const container = containerRef.current;
    if (!container) return;

    let gyroListening = false;

    const clampCoord = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

    const applyPending = () => {
      rafRef.current = 0;
      if (!isVisibleRef.current) return;
      coordX.set(pendingRef.current.x);
      coordY.set(pendingRef.current.y);
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!isVisibleRef.current) return;
      const gamma = e.gamma ?? 0;
      const beta = e.beta ?? 0;
      pendingRef.current = {
        x: clampCoord(gamma / 35, -1, 1),
        y: clampCoord(beta / 35, -1, 1),
      };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(applyPending);
      }
    };

    orientationHandlerRef.current = handleOrientation;

    const startGyro = () => {
      if (gyroListening) return;
      window.addEventListener("deviceorientation", handleOrientation, true);
      gyroListening = true;
      setGyroActive(true);
    };

    const stopGyro = () => {
      if (!gyroListening) return;
      window.removeEventListener("deviceorientation", handleOrientation, true);
      gyroListening = false;
      setGyroActive(false);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      coordX.set(0);
      coordY.set(0);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        isVisibleRef.current = visible;
        if (visible) {
          startGyro();
        } else {
          stopGyro();
        }
      },
      { threshold: 0.05, rootMargin: "80px 0px" }
    );
    observer.observe(container);

    const initGyroPermission = () => {
      const DeviceOrientation = (window as Window & { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent;
      if (DeviceOrientation && typeof DeviceOrientation.requestPermission === "function") {
        const requestGyro = async () => {
          try {
            const permission = await DeviceOrientation.requestPermission!();
            if (permission === "granted" && isVisibleRef.current) {
              startGyro();
            }
          } catch (err) {
            console.error("Gyro permission error:", err);
          } finally {
            window.removeEventListener("touchstart", requestGyro);
            window.removeEventListener("pointerdown", requestGyro);
          }
        };

        window.addEventListener("touchstart", requestGyro, { once: true });
        window.addEventListener("pointerdown", requestGyro, { once: true });
      } else if (isVisibleRef.current) {
        startGyro();
      }
    };

    initGyroPermission();

    return () => {
      observer.disconnect();
      stopGyro();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [coordX, coordY]);

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseEffectsEnabled) return;
    if (window.innerWidth < 1024 && gyroActive) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = clamp(((e.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
    const y = clamp(((e.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
    coordX.set(x);
    coordY.set(y);
  };

  const handleMouseLeave = () => {
    if (!mouseEffectsEnabled) return;
    if (window.innerWidth < 1024 && gyroActive) return;
    coordX.set(0);
    coordY.set(0);
  };

  const imageStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    margin: "auto",
    display: "block",
  };

  const foregroundLayerStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    margin: "auto",
    zIndex: "auto",
    transform: "translateZ(310px)",
    width: 296,
    height: 199,
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full flex justify-center items-center"
      {...(mouseEffectsEnabled
        ? { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave }
        : {})}
    >
      <div className="relative w-full max-w-[482px] aspect-[482/600] flex justify-center items-center" style={{ perspective: 800 }}>
        <motion.div
          className="w-full h-full flex justify-center items-center relative max-sm:scale-[0.8] sm:scale-100 max-sm:-my-20"
          style={{ transformStyle: "preserve-3d", willChange: "transform", rotateX, rotateY }}
        >
          <div style={{ width: 482, height: 600, visibility: "hidden" }} />

          <motion.img
            src="/circle.svg"
            alt=""
            className="blur-[30px]"
            style={{ ...imageStyle, zIndex: "auto", transform: "translateZ(0px)", x: glowX, y: glowY }}
          />

          <motion.img
            src="/circle.svg"
            alt=""
            style={{ ...imageStyle, zIndex: "auto", transform: "translateZ(0px)", x: baseX, y: baseY }}
          />

          <motion.img
            src="/circle-dots.svg"
            alt=""
            style={{ ...imageStyle, zIndex: "auto", transform: "translateZ(150px)", x: dotsX, y: dotsY }}
          />

          {centerLabel ? (
            <motion.div
              className="flex items-center justify-center font-black text-[clamp(72px,14vw,128px)] leading-none tracking-[-0.06em] text-[#c5c5c5] select-none pointer-events-none"
              style={{ ...foregroundLayerStyle, display: "flex", x: foregroundX, y: foregroundY }}
            >
              {centerLabel}
            </motion.div>
          ) : (
            <motion.svg
              width={296}
              height={199}
              viewBox="0 0 296 199"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ ...foregroundLayerStyle, display: "block", x: foregroundX, y: foregroundY }}
            >
              <g transform="translate(90, 65)">
                <rect width="20" height="69" fill="#C5C5C5"/>
                <rect x="24" width="20" height="55" fill="#C5C5C5"/>
                <rect x="48" width="20" height="69" fill="#C5C5C5"/>
                <rect x="72" width="20" height="69" fill="#C5C5C5"/>
                <rect x="96" width="20" height="20" fill="#C5C5C5"/>
                <rect x="96" y="24" width="20" height="20" fill="#C5C5C5"/>
              </g>
            </motion.svg>
          )}
        </motion.div>
      </div>
    </div>
  );
}
