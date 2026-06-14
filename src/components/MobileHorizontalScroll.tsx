"use client";

import { forwardRef, ReactNode } from "react";

interface MobileHorizontalScrollProps {
  children: ReactNode;
  className?: string;
  /** Width of the leading spacer inserted before the first card (e.g. "20px" or "1.25rem") */
  leadingSpace?: string;
}

const MobileHorizontalScroll = forwardRef<HTMLDivElement, MobileHorizontalScrollProps>(
  function MobileHorizontalScroll({ children, className = "", leadingSpace }, ref) {
    return (
      <div
        ref={ref}
        className={`overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory [touch-action:pan-x_pan-y] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        <div className="flex gap-4 w-max pb-2">
          {/* Leading spacer — padding-left on the outer scroll container is unreliable */}
          {leadingSpace && (
            <div className="shrink-0" style={{ width: leadingSpace }} aria-hidden="true" />
          )}
          {children}
          {/* Trailing spacer so last card doesn't sit flush against edge */}
          <div className="shrink-0 w-5" aria-hidden="true" />
        </div>
      </div>
    );
  }
);

export default MobileHorizontalScroll;
