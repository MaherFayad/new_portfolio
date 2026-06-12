"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import MobileHorizontalScroll from "./MobileHorizontalScroll";

export interface WhatIDoService {
  id: string;
  title: string;
  mobileImage: string;
  label: string;
}

interface WhatIDoMobileCarouselProps {
  services: WhatIDoService[];
  onSelect: (index: number) => void;
}

export default function WhatIDoMobileCarousel({
  services,
  onSelect,
}: WhatIDoMobileCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px", threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="lg:hidden">
      {!ready ? (
        <div className="-mx-3 px-3 flex gap-5 overflow-hidden" aria-hidden="true">
          {services.map((serv) => (
            <div
              key={`placeholder-${serv.id}`}
              className="shrink-0 bg-white/[0.04] border border-white/5"
              style={{ width: "min(calc(100vw - 24px), 455px)", height: 420 }}
            />
          ))}
        </div>
      ) : (
        <MobileHorizontalScroll className="-mx-3 px-3">
          {services.map((serv, index) => (
            <div
              key={serv.id}
              className="shrink-0 snap-center overflow-hidden"
              style={{ width: "min(calc(100vw - 24px), 455px)" }}
            >
              <button
                type="button"
                aria-label={serv.label}
                className="group rounded-none flex flex-col items-center relative overflow-hidden w-full h-[420px] cursor-pointer border-0 bg-transparent p-0 text-left"
                onClick={() => onSelect(index)}
              >
                <Image
                  src={serv.mobileImage}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) min(calc(100vw - 24px), 455px), 0px"
                  className="object-cover -z-10"
                  priority={index < 2}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
                <img
                  alt=""
                  className="mt-[43px] relative z-1 select-none pointer-events-none w-auto h-auto max-w-[4rem]"
                  src="/ar.svg"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <h3 className="mt-[22px] font-medium text-[clamp(29px,8vw,40px)] leading-[100%] tracking-[-0.06em] text-white relative z-1 pointer-events-none px-4 text-center">
                  {serv.title}
                </h3>
              </button>
            </div>
          ))}
        </MobileHorizontalScroll>
      )}
    </div>
  );
}
