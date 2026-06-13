"use client";

import { useEffect, useLayoutEffect, useState, useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useLenis } from "lenis/react";

interface CardData {
  title: string;
  image: string;
  mobileImage: string;
  popupImage: string;
  subtitle: string;
  paragraph: string;
  points: string[];
}

interface SliderPopupProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardData | null;
}

const CLOSE_MS = 700;
const REVEAL_EASING = "cubic-bezier(0.215, 0.61, 0.355, 1)";
const MOBILE_BREAKPOINT = "(max-width: 1023px)";

export default function SliderPopup({ isOpen, onClose, card }: SliderPopupProps) {
  const lenis = useLenis();
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [active, setActive] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const enterFrameRef = useRef(0);

  const cardRef = useRef<CardData | null>(null);
  if (card) {
    cardRef.current = card;
  }
  const currentCard = card || cardRef.current;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_BREAKPOINT);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      isFirstRender.current = false;
      setActive(false);
      setShouldRender(true);
      return;
    }

    if (isFirstRender.current) return;
    setActive(false);

    const timer = setTimeout(() => {
      setShouldRender(false);
    }, CLOSE_MS);
    return () => clearTimeout(timer);
  }, [isOpen, mounted]);

  useLayoutEffect(() => {
    if (!shouldRender || !isOpen) return;

    const backdrop = backdropRef.current;
    const drawer = drawerRef.current;
    backdrop?.getBoundingClientRect();
    drawer?.getBoundingClientRect();

    let innerFrame = 0;
    enterFrameRef.current = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        setActive(true);
        closeBtnRef.current?.focus();
      });
    });

    return () => {
      cancelAnimationFrame(enterFrameRef.current);
      cancelAnimationFrame(innerFrame);
    };
  }, [shouldRender, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      document.documentElement.classList.remove("slider-popup-open");
      lenis?.start();
      return;
    }

    document.documentElement.classList.add("slider-popup-open");
    lenis?.stop();

    return () => {
      document.documentElement.classList.remove("slider-popup-open");
      lenis?.start();
    };
  }, [isOpen, lenis]);

  useEffect(() => {
    if (!isOpen || !currentCard?.popupImage) return;

    const img = new window.Image();
    img.src = currentCard.popupImage;

    if (img.complete) {
      setImgLoaded(true);
      return;
    }

    setImgLoaded(false);
    img.onload = () => setImgLoaded(true);
    img.onerror = () => setImgLoaded(true);
  }, [isOpen, currentCard?.popupImage]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => onClose();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  if (!mounted || !shouldRender || !currentCard) return null;

  const desktopRevealStyle = (delay: string): CSSProperties => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.6s ${REVEAL_EASING} ${delay}, transform 0.6s ${REVEAL_EASING} ${delay}`,
  });

  const desktopListItemStyle = (idx: number): CSSProperties => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.5s ${REVEAL_EASING} ${0.5 + 0.05 * idx}s, transform 0.5s ${REVEAL_EASING} ${0.5 + 0.05 * idx}s`,
  });

  const activeClass = active ? "is-active" : "";

  return createPortal(
    <>
      <div
        ref={backdropRef}
        className={`slider-popup-backdrop fixed inset-0 z-[100] cursor-pointer bg-black/60 ${activeClass}`}
        onClick={onClose}
        role="button"
        tabIndex={0}
        aria-label="Close popup"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClose();
          }
        }}
      />

      <div
        ref={drawerRef}
        className={`slider-popup-drawer fixed top-0 right-0 z-[101] flex h-dvh w-[600px] max-w-full flex-col overflow-hidden bg-black ${activeClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="slider-popup-title"
      >
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[#111]" />
          {imgLoaded && (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
              style={{ backgroundImage: `url(${currentCard.popupImage})` }}
            />
          )}
        </div>

        <button
          ref={closeBtnRef}
          type="button"
          aria-label="Close popup"
          className="absolute top-6 right-6 z-20 flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-[background,border-color] duration-300 hover:border-white/25 hover:bg-white/15"
          onClick={onClose}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div
          className="slider-popup-scroll relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden lenis-clean"
          data-lenis-prevent
        >
          <div className="flex w-full flex-col p-10 max-sm:p-5 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
            <h2
              id="slider-popup-title"
              className="mb-4 pr-14 font-medium text-[32px] leading-[100%] tracking-[-0.06em] text-white max-sm:text-[38px] sm:text-[42px] lg:text-[48px]"
              style={isMobile ? undefined : desktopRevealStyle("0.3s")}
            >
              {currentCard.title}
            </h2>

            <p
              className="mb-6 pt-5 font-medium leading-[120%] tracking-[-0.03em] text-white max-sm:text-base sm:text-[20px] lg:text-[24px]"
              style={isMobile ? undefined : desktopRevealStyle("0.4s")}
            >
              {currentCard.subtitle}
            </p>

            <p
              className="mb-10 font-normal text-sm leading-[125%] tracking-[-0.02em] text-white/60"
              style={isMobile ? undefined : desktopRevealStyle("0.45s")}
            >
              {currentCard.paragraph}
            </p>

            <ul className="mb-12 flex list-none flex-col gap-0 p-0 m-0">
              {currentCard.points.map((pt, idx) => (
                <li key={idx} style={isMobile ? undefined : desktopListItemStyle(idx)}>
                  <span className="font-medium text-4xl leading-[100%] tracking-[-0.02em] text-white">
                    {pt}
                  </span>
                </li>
              ))}
            </ul>

            <div
              className="mt-4 flex flex-col gap-3 sm:flex-row lg:mt-auto"
              style={isMobile ? undefined : desktopRevealStyle("0.85s")}
            >
              <Link
                href="/contacts"
                onClick={onClose}
                className="group relative z-1 flex h-[72px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[17px] bg-white text-black no-underline transition-all duration-300 hover:animate-[rotate_0.7s_ease-in-out_both] sm:w-[243px] lg:w-[203px] [&>span]:pointer-events-none [&>span]:group-hover:animate-[storm_0.7s_ease-in-out_both] [&>span]:group-hover:[animation-delay:0.06s]"
              >
                <span className="font-bold text-sm tracking-[-0.02em]">Get in touch</span>
              </Link>

              <a
                href="https://www.linkedin.com/in/maherfayad/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative z-1 flex h-[72px] w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[17px] border border-white/12 bg-white/15 text-white no-underline transition-all duration-300 hover:animate-[rotate_0.7s_ease-in-out_both] sm:w-[203px] [&>span]:pointer-events-none [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:group-hover:animate-[storm_0.7s_ease-in-out_both] [&>span]:group-hover:[animation-delay:0.06s]"
              >
                <span className="font-bold text-sm tracking-[-0.02em]">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
