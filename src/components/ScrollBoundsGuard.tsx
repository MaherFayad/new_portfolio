"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";

const BOUND_EPSILON = 2;

function getNativeMaxScroll() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function clampNativeScroll() {
  const max = getNativeMaxScroll();
  const y = window.scrollY;
  if (y > max + BOUND_EPSILON) {
    window.scrollTo(0, max);
  } else if (y < -BOUND_EPSILON) {
    window.scrollTo(0, 0);
  }
}

function clampLenisScroll(lenis: Lenis) {
  if (lenis.isStopped) return;

  const max = lenis.limit;
  if (!Number.isFinite(max)) return;

  const scroll = lenis.scroll;
  if (scroll > max + BOUND_EPSILON) {
    lenis.scrollTo(max, { immediate: true });
  } else if (scroll < -BOUND_EPSILON) {
    lenis.scrollTo(0, { immediate: true });
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
        if (lenis) {
          clampLenisScroll(lenis);
        } else {
          clampNativeScroll();
        }
      });
    };

    const handleResize = () => {
      lenis?.resize();
      scheduleClamp();
    };

    scheduleClamp();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            handleResize();
          })
        : null;

    resizeObserver?.observe(document.documentElement);
    resizeObserver?.observe(document.body);

    if (lenis) {
      lenis.on("scroll", scheduleClamp);
    }

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scrollend", scheduleClamp, { passive: true });
    window.visualViewport?.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("scroll", scheduleClamp);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      resizeObserver?.disconnect();
      lenis?.off("scroll", scheduleClamp);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scrollend", scheduleClamp);
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", scheduleClamp);
    };
  }, [lenis]);

  return null;
}
