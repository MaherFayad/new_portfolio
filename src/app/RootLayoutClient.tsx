"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { useLenis } from "lenis/react";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import { HomeRevealGateProvider } from "@/components/HomeRevealGate";
import { PageTransitionProvider } from "@/components/PageTransition";

function PreloaderScrollReset({
  pageActive,
  preloaderActive,
}: {
  pageActive: boolean;
  preloaderActive: boolean;
}) {
  const lenis = useLenis();

  const scrollPageToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [lenis]);

  useEffect(() => {
    if (typeof history !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (pageActive) {
      scrollPageToTop();
    }
  }, [pageActive, scrollPageToTop]);

  useEffect(() => {
    if (!preloaderActive) {
      scrollPageToTop();
    }
  }, [preloaderActive, scrollPageToTop]);

  useEffect(() => {
    if (!lenis) return;

    if (preloaderActive && !pageActive) {
      lenis.stop();
    } else {
      lenis.start();
      if (pageActive) {
        scrollPageToTop();
      }
    }
  }, [preloaderActive, pageActive, lenis, scrollPageToTop]);

  return null;
}

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Preloader runs on the first load of any page
  const [preloaderActive, setPreloaderActive] = useState(true);
  const [pageActive, setPageActive] = useState(false);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    prevPathRef.current = pathname;
  }, [pathname]);

  const showPreloader = preloaderActive;
  const showPage = true; // Always mount page and transition provider for page-to-page transitions
  const gateValue = pageActive; // Reveal components wait for the preloader to complete

  return (
    <SmoothScroll>
      <PreloaderScrollReset pageActive={pageActive} preloaderActive={preloaderActive} />
      <HomeRevealGateProvider value={gateValue}>
        {showPreloader && (
          <Preloader
            onComplete={() => setPreloaderActive(false)}
            onStartExit={() => setPageActive(true)}
          />
        )}
        {showPage && (
          <PageTransitionProvider>
            <div
              className="relative z-0"
              style={
                !pageActive
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
          </PageTransitionProvider>
        )}
      </HomeRevealGateProvider>
    </SmoothScroll>
  );
}
