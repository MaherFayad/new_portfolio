"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";
import ScrollBoundsGuard from "./ScrollBoundsGuard";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const LenisWrapper = ReactLenis as any;
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
        syncTouch: true,
        infinite: false,
      }}
    >
      <ScrollBoundsGuard />
      {children}
    </LenisWrapper>
  );
}
