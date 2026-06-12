"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { useLenis } from "lenis/react";
import SmoothScroll from "@/components/SmoothScroll";
import { HomeRevealGateProvider } from "@/components/HomeRevealGate";
import { PageTransitionProvider } from "@/components/PageTransition";

const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: false,
  loading: () => <div className="loader bg-black" aria-hidden="true" />,
});

function PreloaderScrollReset({
  pageActive,
  preloaderActive,
}: {
  pageActive: boolean;
  preloaderActive: boolean;
}) {
  const lenis = useLenis();
  const didInitialScrollReset = useRef(false);

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

  // Reset scroll once when the page first reveals — not again when preloader unmounts or Lenis mounts.
  useEffect(() => {
    if (pageActive && !didInitialScrollReset.current) {
      didInitialScrollReset.current = true;
      scrollPageToTop();
    }
  }, [pageActive, scrollPageToTop]);

  useEffect(() => {
    if (!lenis) return;

    if (preloaderActive && !pageActive) {
      lenis.stop();
    } else if (pageActive) {
      lenis.start();
    }
  }, [preloaderActive, pageActive, lenis]);

  return null;
}

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Preloader runs on the first load of any page
  const [preloaderActive, setPreloaderActive] = useState(true);
  const [pageActive, setPageActive] = useState(false);
  const prevPathRef = useRef(pathname);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderActive(false);
  }, []);

  const handlePreloaderStartExit = useCallback(() => {
    setPageActive(true);
  }, []);

  useEffect(() => {
    void import("@/components/Preloader");
  }, []);

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
            onComplete={handlePreloaderComplete}
            onStartExit={handlePreloaderStartExit}
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
