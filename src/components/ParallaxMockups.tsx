"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import { MOUSE_EFFECTS_MIN_WIDTH } from "@/hooks/useMouseEffectsEnabled";
import { useHomeRevealGate } from "./HomeRevealGate";

function InteractiveDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const gateActive = useHomeRevealGate();

  useEffect(() => {
    if (!gateActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    const startTime = Date.now();

    const resizeCanvas = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const horizontalSpacing = 18;
    const verticalSpacing = 25;

    const render = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, width, height);

      // Draw a solid black background on the canvas
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Switch to destination-out to cut transparent holes in the black mask
      ctx.globalCompositeOperation = "destination-out";

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const hoverRadius = 100;
      const elapsed = Date.now() - startTime;

      const cols = Math.floor(width / horizontalSpacing) + 2;
      const rows = Math.floor(height / verticalSpacing) + 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * horizontalSpacing;
          const y = r * verticalSpacing;

          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Vertical staggered entrance delay (80ms per row index)
          const delay = r * 80;
          const duration = 400;
          let introScale = 0;

          if (elapsed > delay) {
            const progress = Math.min((elapsed - delay) / duration, 1);
            // Smooth ease out
            introScale = Math.sin(progress * Math.PI / 2);
          }

          // Base size is uniform from top to bottom (no verticalFactor tapering)
          const defaultWidth = 14 * introScale;
          let wSize = defaultWidth;

          if (dist < hoverRadius) {
            const influence = (hoverRadius - dist) / hoverRadius;
            const easeInfluence = Math.pow(influence, 1.5);
            // Holes become bigger when mouse is on top, letting more color shine through
            wSize = defaultWidth + 4.5 * easeInfluence * introScale;
          }

          // Checkerboard alternating height: even columns/rows are 2x height, odd are 1x height
          const isEven = (c + r) % 2 === 0;
          const hSize = isEven ? wSize * 2 : wSize;
          ctx.fillRect(x - wSize / 2, y - hSize / 2, wSize, hSize);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gateActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
    />
  );
}

function ParallaxMockupsStatic() {
  return (
    <Reveal>
      <section className="relative w-full overflow-hidden bg-black z-0 mt-[60px] max-sm:!mt-[clamp(6rem,4vw+4rem,3rem)] sm:mt-[140px] min-[1024px]:max-[1399px]:!-mt-[-10px] 2xl:mt-[calc(260px-8vw)] min-[1920px]:max-[2000px]:!-mt-[calc(110px-8vw)] min-[1024px]:mt-[max(20px,calc(400px-22vw))] min-[1536px]:mt-[max(10px,calc(30px-8vw))] h-[120px] sm:h-[18vw] md:h-[200px] lg:h-[240px]">
        <Reveal className="absolute inset-0 z-0 overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 bg-black pointer-events-none" />
          <div className="absolute inset-0 z-[1] w-full h-[120%] top-[-10%]">
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute mt-[-10%] md:mt-0 left-[-30%] md:left-[-25%] bg-[#1146F2] blur-[100px] md:blur-[180px] w-[600px] md:w-[1809px] h-[600px] md:h-[1444px] rounded-full opacity-60" />
              <div className="absolute right-[-30%] md:right-[-10%] top-0 bg-[#873AE3] blur-[100px] md:blur-[150px] w-[600px] md:w-[1710px] h-[600px] md:h-[1367px] rounded-full opacity-60" />
              <div className="absolute left-[-20%] md:ml-[-50%] lg:ml-[-32%] mt-[10%] md:mt-[7%] bg-[#070707] blur-[80px] md:blur-[142px] w-[800px] md:w-[2774px] h-[600px] md:h-[1444px] rounded-full opacity-90" />
            </div>
          </div>
        </Reveal>

        {/* Bottom fade-out gradient to blend into projects section */}
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none z-[2]" />
        <InteractiveDots />
      </section>
    </Reveal>
  );
}

function ParallaxMockupsInteractive() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <Reveal>
      <section
        ref={parallaxRef}
        className="relative w-full overflow-hidden bg-black z-0 mt-[60px] max-sm:!mt-[clamp(6rem,4vw+4rem,3rem)] sm:mt-[140px] min-[1024px]:max-[1399px]:!-mt-[-10px] 2xl:mt-[calc(260px-8vw)] min-[1920px]:max-[2000px]:!-mt-[calc(110px-8vw)] min-[1024px]:mt-[max(20px,calc(400px-22vw))] min-[1536px]:mt-[max(10px,calc(30px-8vw))] h-[120px] sm:h-[18vw] md:h-[200px] lg:h-[240px]"
      >
        <Reveal className="absolute inset-0 z-0 overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 bg-black pointer-events-none" />
          <motion.div className="absolute inset-0 z-[1] w-full h-[120%] top-[-10%]" style={{ y: bgY }}>
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute mt-[-10%] md:mt-0 left-[-30%] md:left-[-25%] bg-[#1146F2] blur-[100px] md:blur-[180px] w-[600px] md:w-[1809px] h-[600px] md:h-[1444px] rounded-full opacity-60" />
              <div className="absolute right-[-30%] md:right-[-10%] top-0 bg-[#873AE3] blur-[100px] md:blur-[150px] w-[600px] md:w-[1710px] h-[600px] md:h-[1367px] rounded-full opacity-60" />
              <div className="absolute left-[-20%] md:ml-[-50%] lg:ml-[-32%] mt-[10%] md:mt-[7%] bg-[#070707] blur-[80px] md:blur-[142px] w-[800px] md:w-[2774px] h-[600px] md:h-[1444px] rounded-full opacity-90" />
            </div>
          </motion.div>
        </Reveal>

        {/* Bottom fade-out gradient to blend into projects section */}
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none z-[2]" />
        <InteractiveDots />
      </section>
    </Reveal>
  );
}

export default function ParallaxMockups() {
  const [parallaxEnabled, setParallaxEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${MOUSE_EFFECTS_MIN_WIDTH}px)`);
    const update = () => setParallaxEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return parallaxEnabled ? <ParallaxMockupsInteractive /> : <ParallaxMockupsStatic />;
}
