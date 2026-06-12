"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

function getNativeMaxScroll() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function clampNativeScroll() {
  const max = getNativeMaxScroll();
  const y = window.scrollY;
  if (y > max) {
    window.scrollTo(0, max);
  } else if (y < 0) {
    window.scrollTo(0, 0);
  }
}

export default function ScrollBoundsGuard() {
  const lenis = useLenis();

  useEffect(() => {
    let rafId = 0;

    const scheduleClamp = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        clampNativeScroll();

        if (lenis) {
          const max = lenis.limit;
          if (typeof max === "number" && Number.isFinite(max)) {
            if (lenis.scroll > max) {
              lenis.scrollTo(max, { immediate: true });
            } else if (lenis.scroll < 0) {
              lenis.scrollTo(0, { immediate: true });
            }
          }
        }
      });
    };

    const handleResize = () => {
      lenis?.resize();
      scheduleClamp();
    };

    scheduleClamp();

    if (lenis) {
      lenis.on("scroll", scheduleClamp);
    }

    window.addEventListener("scroll", scheduleClamp, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scrollend", scheduleClamp, { passive: true });
    window.visualViewport?.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("scroll", scheduleClamp);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      lenis?.off("scroll", scheduleClamp);
      window.removeEventListener("scroll", scheduleClamp);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scrollend", scheduleClamp);
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", scheduleClamp);
    };
  }, [lenis]);

  return null;
}
