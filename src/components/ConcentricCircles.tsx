"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ConcentricCirclesProps {
  centerLabel?: ReactNode;
}

export default function ConcentricCircles({ centerLabel }: ConcentricCirclesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const coordX = useMotionValue(0);
  const coordY = useMotionValue(0);
  const [gyroActive, setGyroActive] = useState(false);

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

    let active = true;
    const clampCoord = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0; // -90 to 90 (left/right)
      const beta = e.beta ?? 0;   // -180 to 180 (front/back)
      const x = clampCoord(gamma / 35, -1, 1);
      const y = clampCoord(beta / 35, -1, 1);
      if (active) {
        coordX.set(x);
        coordY.set(y);
      }
    };

    const initGyro = () => {
      window.addEventListener("deviceorientation", handleOrientation, true);
      if (active) setGyroActive(true);
    };

    const DeviceOrientation = (window as any).DeviceOrientationEvent;
    if (DeviceOrientation && typeof DeviceOrientation.requestPermission === "function") {
      const requestGyro = async () => {
        try {
          const permission = await DeviceOrientation.requestPermission();
          if (permission === "granted") {
            initGyro();
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
    } else {
      initGyro();
    }

    return () => {
      active = false;
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [coordX, coordY]);

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full max-w-[482px] aspect-[482/600] flex justify-center items-center" style={{ perspective: 800 }}>
        <motion.div
          className="w-full h-full flex justify-center items-center relative max-sm:scale-[0.8] sm:scale-100 max-sm:-my-20"
          style={{ transformStyle: "preserve-3d", willChange: "transform", rotateX, rotateY }}
        >
          {/* Invisible sizing placeholder */}
          <div style={{ width: 482, height: 600, visibility: "hidden" }} />

          {/* Layer 0: Background glow (blurry) */}
          <motion.img
            src="/circle.svg"
            alt=""
            className="blur-[30px]"
            style={{ ...imageStyle, zIndex: "auto", transform: "translateZ(0px)", x: glowX, y: glowY }}
          />

          {/* Layer 1: Solid base circle */}
          <motion.img
            src="/circle.svg"
            alt=""
            style={{ ...imageStyle, zIndex: "auto", transform: "translateZ(0px)", x: baseX, y: baseY }}
          />

          {/* Layer 2: Ring with dots */}
          <motion.img
            src="/circle-dots.svg"
            alt=""
            style={{ ...imageStyle, zIndex: "auto", transform: "translateZ(150px)", x: dotsX, y: dotsY }}
          />

          {/* Layer 3: Foreground content (logo or custom label) */}
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
