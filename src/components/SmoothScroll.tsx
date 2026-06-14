"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode, useEffect, useState } from "react";
import ScrollBoundsGuard from "./ScrollBoundsGuard";
import LenisScrollRecovery from "./LenisScrollRecovery";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const LenisWrapper = ReactLenis as any;
  const [smoothScrollEnabled, setSmoothScrollEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1200px)");
    const update = () => setSmoothScrollEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!smoothScrollEnabled) {
    return <>{children}</>;
  }

  return (
    <LenisWrapper
      root
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        infinite: false,
      }}
    >
      <ScrollBoundsGuard />
      <LenisScrollRecovery />
      {children}
    </LenisWrapper>
  );
}
