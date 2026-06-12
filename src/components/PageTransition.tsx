"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { HomeRevealGateProvider, useHomeRevealGate } from "./HomeRevealGate";

type TransitionStatus = "idle" | "entering" | "exiting";

interface PageTransitionContextProps {
  status: TransitionStatus;
  navigate: (href: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextProps | null>(null);

export const useTransitionRouter = () => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    const router = useRouter();
    return {
      push: (href: string) => router.push(href),
    };
  }
  return {
    push: (href: string) => context.navigate(href),
  };
};

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<TransitionStatus>("idle");
  const [revealActive, setRevealActive] = useState(true);
  const pendingHrefRef = useRef<string | null>(null);
  const prevPathnameRef = useRef(pathname);
  const enterCompletedRef = useRef(false);
  const routeChangedRef = useRef(false);
  const lenis = useLenis();

  // Gate content reveal until 300ms after transition clears
  useEffect(() => {
    if (status !== "idle") {
      setRevealActive(false);
    } else {
      const timer = setTimeout(() => {
        setRevealActive(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Trigger transition programmatically
  const navigate = (href: string) => {
    if (href === pathname) return;
    pendingHrefRef.current = href;
    setStatus("entering");
  };

  // Intercept all local link clicks globally
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Handle external links, target="_blank", anchors, downloads, and protocol links
      const targetAttr = anchor.getAttribute("target");
      const isExternal =
        href.startsWith("http") ||
        href.startsWith("//") ||
        targetAttr === "_blank" ||
        anchor.hasAttribute("download") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:");
      const isModifiedEvent = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

      if (isExternal || isModifiedEvent) {
        return;
      }

      // Intercept local internal routing
      e.preventDefault();
      navigate(href);
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, [pathname]);

  // Handle entering phase logic (pushing route at 300ms, completing enter at 550ms)
  useEffect(() => {
    if (status === "entering") {
      enterCompletedRef.current = false;
      routeChangedRef.current = false;

      // Push the router when screen is fully covered (300ms)
      const pushTimer = setTimeout(() => {
        if (pendingHrefRef.current) {
          router.push(pendingHrefRef.current);
        }
      }, 300);

      // Mark enter animation as complete after 550ms
      const enterTimer = setTimeout(() => {
        enterCompletedRef.current = true;
        if (routeChangedRef.current) {
          setStatus("exiting");
        }
      }, 550);

      return () => {
        clearTimeout(pushTimer);
        clearTimeout(enterTimer);
      };
    }
  }, [status, router]);

  // When route changes (pathname updates), check if we can exit
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      routeChangedRef.current = true;

      // Scroll to top instantly on page navigation
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }

      // If enter animation has already completed, start exiting immediately.
      // Otherwise, the enter timer will trigger the exiting phase once it finishes.
      if (enterCompletedRef.current) {
        setStatus("exiting");
      }
    }
  }, [pathname, lenis]);

  // Handle setting status back to idle when exit animation completes
  useEffect(() => {
    if (status === "exiting") {
      pendingHrefRef.current = null;
      const timer = setTimeout(() => {
        setStatus("idle");
      }, 550); // matching our faster 550ms exit animation
      return () => clearTimeout(timer);
    }
  }, [status]);

  const totalTracks = 18;
  const barsPerTrack = 12;

  const blockVariants = {
    initial: {
      scaleY: 0,
      originY: 0,
    },
    enter: (i: { track: number; block: number }) => ({
      scaleY: 1,
      transition: {
        duration: 0.28,
        ease: [0.76, 0, 0.24, 1] as const,
        delay: (i.track * 0.01) + (i.block * 0.008),
      },
    }),
    exit: (i: { track: number; block: number }) => ({
      scaleY: 0,
      originY: 1,
      transition: {
        duration: 0.28,
        ease: [0.76, 0, 0.24, 1] as const,
        delay: ((totalTracks - 1 - i.track) * 0.01) + ((barsPerTrack - 1 - i.block) * 0.008),
      },
    }),
  };

  const parentGate = useHomeRevealGate();
  const revealValue = parentGate && revealActive;

  return (
    <PageTransitionContext.Provider value={{ status, navigate }}>
      <HomeRevealGateProvider value={revealValue}>
        {children}
      </HomeRevealGateProvider>
      <AnimatePresence>
        {status !== "idle" && (
          <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none">
            {/* Opaque background to hide page swaps */}
            <motion.div
              className="absolute inset-0 bg-black pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: status === "entering" ? 1 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {/* Diagonal Grid Container of grey lines */}
            <div
              className="absolute w-[180vw] h-[180vh] top-[-40vh] left-[-40vw] pointer-events-none flex gap-5 justify-between"
              style={{
                transform: "rotate(-35deg)",
              }}
            >
              {Array.from({ length: totalTracks }).map((_, trackIdx) => (
                <div
                  key={trackIdx}
                  className="flex-1 flex flex-col gap-5 h-full"
                  style={{
                    transform: `translateY(${(trackIdx % 2) * 85}px)`,
                  }}
                >
                  {Array.from({ length: barsPerTrack }).map((_, barIdx) => {
                    const factor = ((trackIdx + barIdx) % 2 === 0) ? 1 : 2;
                    return (
                      <motion.div
                        key={barIdx}
                        className="w-full bg-[#121212] rounded-xs shrink-0"
                        style={{
                          height: `calc(${factor} * (180vh - 11 * 20px) / 18)`,
                        }}
                        custom={{ track: trackIdx, block: barIdx }}
                        variants={blockVariants}
                        initial="initial"
                        animate={status === "entering" ? "enter" : "exit"}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}
