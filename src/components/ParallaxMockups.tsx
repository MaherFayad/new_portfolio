"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import { MOUSE_EFFECTS_MIN_WIDTH } from "@/hooks/useMouseEffectsEnabled";

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
