"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import { MOUSE_EFFECTS_MIN_WIDTH } from "@/hooks/useMouseEffectsEnabled";

function ParallaxMockupsStatic() {
  return (
    <Reveal>
      <section className="relative w-full overflow-hidden bg-black z-0 mt-[60px] max-sm:!mt-[clamp(6rem,4vw+4rem,3rem)] sm:mt-[140px] min-[1024px]:max-[1399px]:!-mt-[-10px] 2xl:mt-[calc(260px-8vw)] min-[1920px]:max-[2000px]:!-mt-[calc(110px-8vw)] min-[1024px]:mt-[max(20px,calc(400px-22vw))] min-[1536px]:mt-[max(10px,calc(30px-8vw))] h-[300px] sm:h-[45vw] md:h-[500px] lg:h-[730px]">
        <Reveal className="absolute inset-0 z-0 overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 bg-black pointer-events-none" />
          <div className="absolute inset-0 z-[1] w-full h-[120%] top-[-10%]">
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute mt-[-10%] md:mt-0 left-[-80%] md:left-[-25%] bg-[#1146F2] blur-[180px] w-[1537px] md:w-[1809px] h-[1444px] rounded-full opacity-60" />
              <div className="absolute right-[-80%] md:right-[-10%] bg-[#873AE3] blur-[150px] w-[1710px] h-[1367px] rounded-full opacity-60" />
              <div className="absolute ml-[-90%] md:ml-[-50%] lg:ml-[-32%] mt-[10%] md:mt-[7%] bg-[#070707] blur-[142px] w-[1502px] md:w-[2774px] h-[1174px] md:h-[1444px] rounded-full opacity-90" />
            </div>
          </div>
        </Reveal>

        <div className="absolute inset-0 flex justify-center items-end pointer-events-none">
          <div className="relative w-full max-w-[1200px] h-full flex justify-center items-end">
            <div
              className="absolute left-1/2 z-[1] float-back-phone-anim"
              style={{ bottom: "clamp(-100px, -15vw, -60px)", width: "fit-content" }}
            >
              <img
                alt="Back Phone"
                className="w-[180px] max-sm:w-[160px] md:w-[320px] lg:w-[480px] h-auto block"
                src="/back-phone.webp"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div
              className="absolute left-1/2 z-[5] float-top-phone-anim"
              style={{ bottom: "clamp(-60px, -10vw, -30px)", width: "fit-content" }}
            >
              <img
                alt="Top Phone"
                className="w-[180px] max-sm:w-[160px] md:w-[320px] lg:w-[480px] h-auto block"
                src="/top-phone.webp"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
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
        className="relative w-full overflow-hidden bg-black z-0 mt-[60px] max-sm:!mt-[clamp(6rem,4vw+4rem,3rem)] sm:mt-[140px] min-[1024px]:max-[1399px]:!-mt-[-10px] 2xl:mt-[calc(260px-8vw)] min-[1920px]:max-[2000px]:!-mt-[calc(110px-8vw)] min-[1024px]:mt-[max(20px,calc(400px-22vw))] min-[1536px]:mt-[max(10px,calc(30px-8vw))] h-[300px] sm:h-[45vw] md:h-[500px] lg:h-[730px]"
      >
        <Reveal className="absolute inset-0 z-0 overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 bg-black pointer-events-none" />
          <motion.div className="absolute inset-0 z-[1] w-full h-[120%] top-[-10%]" style={{ y: bgY }}>
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute mt-[-10%] md:mt-0 left-[-80%] md:left-[-25%] bg-[#1146F2] blur-[180px] w-[1537px] md:w-[1809px] h-[1444px] rounded-full opacity-60" />
              <div className="absolute right-[-80%] md:right-[-10%] bg-[#873AE3] blur-[150px] w-[1710px] h-[1367px] rounded-full opacity-60" />
              <div className="absolute ml-[-90%] md:ml-[-50%] lg:ml-[-32%] mt-[10%] md:mt-[7%] bg-[#070707] blur-[142px] w-[1502px] md:w-[2774px] h-[1174px] md:h-[1444px] rounded-full opacity-90" />
            </div>
          </motion.div>
        </Reveal>

        <div className="absolute inset-0 flex justify-center items-end pointer-events-none">
          <div className="relative w-full max-w-[1200px] h-full flex justify-center items-end">
            <div
              className="absolute left-1/2 z-[1] float-back-phone-anim"
              style={{ bottom: "clamp(-100px, -15vw, -60px)", width: "fit-content" }}
            >
              <img
                alt="Back Phone"
                className="w-[180px] max-sm:w-[160px] md:w-[320px] lg:w-[480px] h-auto block"
                src="/back-phone.webp"
                loading="lazy"
              />
            </div>
            <div
              className="absolute left-1/2 z-[5] float-top-phone-anim"
              style={{ bottom: "clamp(-60px, -10vw, -30px)", width: "fit-content" }}
            >
              <img
                alt="Top Phone"
                className="w-[180px] max-sm:w-[160px] md:w-[320px] lg:w-[480px] h-auto block"
                src="/top-phone.webp"
                loading="lazy"
              />
            </div>
          </div>
        </div>
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
