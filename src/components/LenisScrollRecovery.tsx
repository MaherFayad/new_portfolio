"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

function isScrollLockActive() {
  return document.documentElement.classList.contains("slider-popup-open");
}

export default function LenisScrollRecovery() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const recover = () => {
      if (isScrollLockActive()) return;
      if (lenis.isStopped) {
        lenis.start();
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (isScrollLockActive()) return;
      if (lenis.isStopped && event.deltaY !== 0) {
        lenis.start();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
      if (scrollKeys.includes(event.key)) {
        recover();
      }
    };

    recover();

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", recover, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", recover);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lenis]);

  return null;
}
