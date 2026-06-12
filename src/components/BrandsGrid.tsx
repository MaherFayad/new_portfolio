"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import { useMouseEffectsEnabled } from "@/hooks/useMouseEffectsEnabled";

interface Brand {
  name: string;
  image: string;
  link: string;
  maxHeight?: string;
}

const BRANDS: Brand[] = [
  {
    name: "LFG",
    image: "/assets/Logos/LFG.png",
    link: "https://cryptowrex.com/",
  },
  {
    name: "AlRajhi Bank",
    image: "/assets/Logos/Rajhi.png",
    link: "https://www.alrajhibank.com.sa/en/",
  },
  {
    name: "AZMX",
    image: "/assets/Logos/AZMX-new.svg",
    link: "https://azmx.sa/en/",
    maxHeight: "20px",
  },
  {
    name: "Almosafer",
    image: "/assets/Logos/almosafer.svg",
    link: "https://www.almosafer.com/",
    maxHeight: "22px",
  },
  {
    name: "Al Rajhi Capital",
    image: "/assets/Logos/alrajhi-capital.png",
    link: "https://www.alrajhi-capital.com/",
  },
  {
    name: "Emkan",
    image: "/assets/Logos/emkan.svg",
    link: "https://emkanfinance.com.sa/",
    maxHeight: "24px",
  },
  {
    name: "neoleap",
    image: "/assets/Logos/neoleap.png",
    link: "https://www.neoleap.com.sa/",
  },
  {
    name: "Theradome",
    image: "/assets/Logos/theradome.png",
    link: "https://theradome.com/",
  },
  {
    name: "Mit-olins",
    image: "/assets/Logos/Mit-olin.png",
    link: "https://www.miltolinfoundation.org/",
  },
  {
    name: "Contact",
    image: "/assets/Logos/Contact.png",
    link: "https://contact.eg/",
  },
  {
    name: "Konica Minolta",
    image: "/assets/Logos/konica-minolta.png",
    link: "https://www.konicaminolta.us/",
  },
  {
    name: "IterationX",
    image: "/assets/Logos/iterationX.png",
    link: "https://www.iterationx.com/",
  },
  {
    name: "Solidity Law",
    image: "/assets/Logos/Solidity-Law.png",
    link: "https://www.soliditylaw.com/",
  },
  {
    name: "GameIt",
    image: "/assets/Logos/gameit-logo-large.png",
    link: "https://gameit.ai/",
  },
  {
    name: "Solidity Studios",
    image: "/assets/Logos/Solidity-Studios.png",
    link: "https://www.soliditylabs.com/",
  },
  {
    name: "Supersight",
    image: "/assets/Logos/supersight.png",
    link: "https://supersight.xyz/",
  },
  {
    name: "Pelxp",
    image: "/assets/Logos/pexlp.png",
    link: "https://pelxp.com/",
  },
  {
    name: "Deployo",
    image: "/assets/Logos/Deployo.png",
    link: "https://www.deployo.ai/",
  },
  {
    name: "Versal",
    image: "/assets/Logos/versal.png",
    link: "https://www.versal.money/",
  },
  {
    name: "Sacred Stacks",
    image: "/assets/Logos/sacred.png",
    link: "https://www.sacredstacks.com/",
  },
];

function getGlowColor(name: string) {
  switch (name) {
    case "LFG": return "rgba(0, 255, 128, 0.12)";
    case "AlRajhi Bank": return "rgba(0, 102, 204, 0.12)";
    case "AZMX": return "rgba(29, 220, 211, 0.12)";
    case "Theradome": return "rgba(186, 85, 211, 0.12)";
    case "Mit-olins": return "rgba(255, 69, 0, 0.12)";
    case "Contact": return "rgba(255, 40, 40, 0.12)";
    case "Konica Minolta": return "rgba(0, 191, 255, 0.12)";
    case "IterationX": return "rgba(255, 20, 147, 0.12)";
    case "Solidity Law": return "rgba(218, 165, 32, 0.12)";
    case "GameIt": return "rgba(138, 43, 226, 0.12)";
    case "Solidity Studios": return "rgba(255, 140, 0, 0.12)";
    case "Supersight": return "rgba(0, 255, 255, 0.12)";
    default: return "rgba(255, 255, 255, 0.06)";
  }
}

function BrandCardStatic({ brand }: { brand: Brand }) {
  return (
    <a
      href={brand.link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block bg-white/[0.01] backdrop-blur-[6px] border border-white/5 rounded-[16px] p-6 flex items-center justify-center h-[96px] overflow-hidden transition-colors duration-300 hover:border-white/10 hover:bg-white/[0.03]"
    >
      <img
        src={brand.image}
        alt={brand.name}
        className="w-auto max-w-[85%] object-contain pointer-events-none opacity-45 brightness-0 invert"
        style={{ maxHeight: brand.maxHeight || "38px" }}
      />
    </a>
  );
}

function BrandCardInteractive({ brand }: { brand: Brand }) {
  const [hovered, setHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 12 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);
  const scale = useSpring(hovered ? 1.05 : 1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);

    setGlowPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  const glowColor = getGlowColor(brand.name);

  return (
    <motion.a
      ref={cardRef}
      href={brand.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      className="relative block bg-white/[0.01] backdrop-blur-[6px] border border-white/5 rounded-[16px] p-6 flex items-center justify-center h-[96px] cursor-pointer overflow-hidden transition-colors duration-300 hover:border-white/10 hover:bg-white/[0.03]"
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle 100px at ${glowPos.x}px ${glowPos.y}px, ${glowColor}, transparent)`,
        }}
      />

      <div
        className="absolute inset-0 border border-white/10 rounded-[16px] pointer-events-none transition-opacity duration-300"
        style={{ opacity: hovered ? 0.3 : 0 }}
      />

      <img
        src={brand.image}
        alt={brand.name}
        className="w-auto max-w-[85%] object-contain pointer-events-none"
        style={{
          maxHeight: brand.maxHeight || "38px",
          transform: hovered ? "translateZ(20px)" : "translateZ(0px)",
          opacity: hovered ? 1 : 0.45,
          filter: hovered ? "brightness(1) invert(0)" : "brightness(0) invert(1)",
          transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s, filter 0.4s",
        }}
      />
    </motion.a>
  );
}

function BrandCard({
  brand,
  mouseEffectsEnabled,
}: {
  brand: Brand;
  mouseEffectsEnabled: boolean;
}) {
  return mouseEffectsEnabled ? (
    <BrandCardInteractive brand={brand} />
  ) : (
    <BrandCardStatic brand={brand} />
  );
}

export default function BrandsGrid() {
  const mouseEffectsEnabled = useMouseEffectsEnabled();

  return (
    <section className="relative w-full py-10">
      <div className="grid grid-cols-12 max-sm:grid-cols-1 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 items-start">

        {/* Left-aligned vertical column header matching page style */}
        <Reveal className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left [&>span]:block block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>Clients &</span>
          <span>Partners</span>
        </Reveal>

        {/* Right content column */}
        <div className="col-span-10 lg:col-[3/13] sm:col-[1/5] max-sm:col-span-1 flex flex-col gap-10">
          <Reveal>
            <h2 className="font-medium text-[clamp(28px,2.5vw,48px)] leading-[110%] tracking-[-0.04em] text-[#c5c5c5]">
              Worked with these amazing brands
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center" style={{ perspective: 1000 }}>
            {BRANDS.map((brand, idx) => (
              <Reveal key={brand.name} delay={idx * 0.04}>
                <BrandCard brand={brand} mouseEffectsEnabled={mouseEffectsEnabled} />
              </Reveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
