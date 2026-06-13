"use client";

import Link from "next/link";
import Glitch from "@/components/Glitch";
import Magnetic from "@/components/Magnetic";

interface SiteHeaderProps {
  variant?: "static" | "sticky";
}

export default function SiteHeader({ variant = "static" }: SiteHeaderProps) {
  const isSticky = variant === "sticky";

  const containerClass = isSticky
    ? "flex items-center min-h-8 w-full relative backdrop-blur-md py-3 border-b border-white/5 rounded-b-xl"
    : "flex items-center min-h-8 w-full relative";

  return (
    <div className={containerClass}>

      {/* Logo — always left */}
      <div className="shrink-0">
        <Glitch>
          <Link href="/" tabIndex={isSticky ? -1 : undefined}>
            <img
              alt="Maher Fayad"
              src="/assets/logo.svg"
              width="115"
              height="32"
              className="w-[100px] max-sm:w-[88px] h-8 block"
            />
          </Link>
        </Glitch>
      </div>

      {/* Nav — far right on mobile (ml-auto), absolutely centered on desktop via CSS */}
      <nav
        aria-label="Primary"
        className="flex items-center gap-5 lg:gap-8 ml-auto lg:ml-0 site-nav-desktop-center pointer-events-auto"
      >
        <Magnetic range={40} strength={0.4}>
          <Link
            href="/about"
            className="font-semibold text-sm uppercase text-[#c5c5c5] underline underline-offset-4 hover:opacity-70"
            tabIndex={isSticky ? -1 : undefined}
          >
            ABOUT
          </Link>
        </Magnetic>
        <Magnetic range={40} strength={0.4}>
          <Link
            href="/contacts"
            className="font-semibold text-sm uppercase text-[#c5c5c5] underline underline-offset-4 hover:opacity-70"
            tabIndex={isSticky ? -1 : undefined}
          >
            CONTACTS
          </Link>
        </Magnetic>
      </nav>

      {/* Right labels — desktop only */}
      <div className="hidden lg:flex items-center gap-5 shrink-0 ml-auto">
        <div className="flex flex-col text-right">
          <span className="block font-semibold text-[clamp(11px,0.533vw+5.54px,14px)] tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none">
            MAHER
          </span>
          <span className="block font-semibold text-[clamp(11px,0.533vw+5.54px,14px)] tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none">
            FAYAD
          </span>
        </div>
        <div className="flex flex-col text-left">
          <span className="block font-semibold text-[clamp(11px,0.533vw+5.54px,14px)] tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none">
            PRODUCT
          </span>
          <span className="block font-semibold text-[clamp(11px,0.533vw+5.54px,14px)] tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none">
            DESIGNER
          </span>
        </div>
      </div>

    </div>
  );
}
