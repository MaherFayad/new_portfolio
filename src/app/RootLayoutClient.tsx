"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { HomeRevealGateProvider } from "@/components/HomeRevealGate";
import { PageTransitionProvider } from "@/components/PageTransition";
import { initCalEmbed } from "@/components/BookMeetingButton";

const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: false,
  loading: () => <div className="loader bg-black" aria-hidden="true" />,
});

function PreloaderScrollReset({
  pageActive,
}: {
  pageActive: boolean;
}) {
  const didInitialScrollReset = useRef(false);

  const scrollPageToTop = useCallback(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (typeof history !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // Reset scroll once when the page first reveals
  useEffect(() => {
    if (pageActive && !didInitialScrollReset.current) {
      didInitialScrollReset.current = true;
      scrollPageToTop();
    }
  }, [pageActive, scrollPageToTop]);

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

  // Preload the Cal.com embed script app-wide so the "Book a meeting" button
  // is ready to open even when reaching /contacts via client-side navigation.
  useEffect(() => {
    void initCalEmbed();
  }, []);

  useEffect(() => {
    prevPathRef.current = pathname;
  }, [pathname]);

  // Lock scroll while preloader is active, but unlock once the page starts revealing
  useEffect(() => {
    if (preloaderActive && !pageActive) {
      document.documentElement.classList.add("preloader-active");
    } else {
      document.documentElement.classList.remove("preloader-active");
      if (typeof window !== "undefined") {
        window.focus();
        document.body.focus();
      }
    }
    return () => {
      document.documentElement.classList.remove("preloader-active");
    };
  }, [preloaderActive, pageActive]);

  const showPreloader = preloaderActive;
  const showPage = true; // Always mount page and transition provider for page-to-page transitions
  const gateValue = pageActive; // Reveal components wait for the preloader to complete

  return (
    <>
      <PreloaderScrollReset pageActive={pageActive} />
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
    </>
  );
}
