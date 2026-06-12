"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

interface ConcentricCirclesProps {
  centerLabel?: ReactNode;
}

export default function ConcentricCircles({ centerLabel }: ConcentricCirclesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [gyroActive, setGyroActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;

    let active = true;
    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0; // -90 to 90 (left/right)
      const beta = e.beta ?? 0;   // -180 to 180 (front/back)
      const x = clamp(gamma / 35, -1, 1);
      const y = clamp(beta / 35, -1, 1);
      if (active) {
        setCoords({ x, y });
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
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024 && gyroActive) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 1024 && gyroActive) return;
    setCoords({ x: 0, y: 0 });
  };

  const rotateX = -19 * coords.y;
  const rotateY = 19 * coords.x;

  const springTransition = {
    type: "spring" as const,
    stiffness: 180,
    damping: 12,
  };

  const imageStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    margin: "auto",
    display: "block",
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
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          animate={{ rotateX, rotateY }}
          transition={springTransition}
        >
          {/* Invisible sizing placeholder */}
          <div style={{ width: 482, height: 600, visibility: "hidden" }} />

          {/* Layer 0: Background glow (blurry) */}
          <motion.img
            src="/circle.svg"
            alt=""
            className="blur-[30px]"
            style={{ ...imageStyle, zIndex: "auto", transform: "translateZ(0px)" }}
            animate={{ x: 6 * coords.x, y: 6 * coords.y }}
            transition={springTransition}
          />

          {/* Layer 1: Solid base circle */}
          <motion.img
            src="/circle.svg"
            alt=""
            style={{ ...imageStyle, zIndex: "auto", transform: "translateZ(0px)" }}
            animate={{ x: 12 * coords.x, y: 12 * coords.y }}
            transition={springTransition}
          />

          {/* Layer 2: Ring with dots */}
          <motion.img
            src="/circle-dots.svg"
            alt=""
            style={{ ...imageStyle, zIndex: "auto", transform: "translateZ(150px)" }}
            animate={{ x: 25 * coords.x, y: 25 * coords.y }}
            transition={springTransition}
          />

          {/* Layer 3: Foreground content (logo or custom label) */}
          {centerLabel ? (
            <motion.div
              className="absolute inset-0 flex items-center justify-center font-black text-[clamp(72px,14vw,128px)] leading-none tracking-[-0.06em] text-[#c5c5c5] select-none pointer-events-none"
              style={{
                zIndex: "auto",
                transform: "translateZ(310px)",
              }}
              animate={{ x: 44 * coords.x, y: 44 * coords.y }}
              transition={springTransition}
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
              style={{ ...imageStyle, zIndex: "auto", transform: "translateZ(310px)", width: 296, height: 199 }}
              animate={{ x: 44 * coords.x, y: 44 * coords.y }}
              transition={springTransition}
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
