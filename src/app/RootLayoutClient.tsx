"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useLenis } from "lenis/react";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import { HomeRevealGateProvider } from "@/components/HomeRevealGate";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Preloader only runs on the very first load of the homepage
  const [preloaderActive, setPreloaderActive] = useState(isHome);
  const [pageActive, setPageActive] = useState(!isHome);
  const prevPathRef = useRef(pathname);

  const lenis = useLenis();

  useEffect(() => {
    const prev = prevPathRef.current;
    if (prev !== pathname) {
      prevPathRef.current = pathname;
      if (isHome && prev !== "/" && prev !== "") {
        setPreloaderActive(false);
        setPageActive(true);
      } else if (!isHome) {
        setPreloaderActive(false);
        setPageActive(true);
      }
    }
  }, [pathname, isHome]);

  // Handle locking scroll while preloader runs
  useEffect(() => {
    if (lenis) {
      if (preloaderActive && !pageActive) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [preloaderActive, pageActive, lenis]);

  const showPreloader = isHome && preloaderActive;
  const showPage = pageActive || (isHome && preloaderActive && !pageActive);
  const gateValue = !isHome || pageActive;

  return (
    <SmoothScroll>
      <HomeRevealGateProvider value={gateValue}>
        {showPreloader && (
          <Preloader
            onComplete={() => setPreloaderActive(false)}
            onStartExit={() => setPageActive(true)}
          />
        )}
        {showPage && (
          <div
            className="relative z-0"
            style={
              isHome && !pageActive
                ? { opacity: 0, pointerEvents: "none" }
                : {
                    animation: "page-fade-in 0.8s cubic-bezier(0.76, 0, 0.24, 1) forwards",
                    willChange: "opacity",
                    pointerEvents: "auto",
                  }
            }
          >
            {children}
          </div>
        )}
      </HomeRevealGateProvider>
    </SmoothScroll>
  );
}
