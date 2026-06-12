"use client";

import { ReactNode } from "react";

interface MobileHorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export default function MobileHorizontalScroll({
  children,
  className = "",
}: MobileHorizontalScrollProps) {
  return (
    <div
      data-lenis-prevent
      className={`overflow-x-auto overscroll-x-contain snap-x snap-mandatory [touch-action:pan-x_pan-y] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      <div className="flex gap-5 w-max pb-2">{children}</div>
    </div>
  );
}
