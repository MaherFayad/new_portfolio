"use client";

import { useEffect, useState, useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

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

export default function SliderPopup({ isOpen, onClose, card }: SliderPopupProps) {
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [active, setActive] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);

  // Retain card details during the exit transition animation
  const cardRef = useRef<CardData | null>(null);
  if (card) {
    cardRef.current = card;
  }
  const currentCard = card || cardRef.current;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const update = () => setAnimationsEnabled(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Sync state with open/close transition
  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      isFirstRender.current = false;
      setShouldRender(true);

      if (animationsEnabled) {
        const timer = setTimeout(() => {
          setActive(true);
          closeBtnRef.current?.focus();
        }, 20);
        return () => clearTimeout(timer);
      }

      setActive(true);
      closeBtnRef.current?.focus();
      return;
    }

    if (isFirstRender.current) return;
    setActive(false);

    if (animationsEnabled) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 700);
      return () => clearTimeout(timer);
    }

    setShouldRender(false);
  }, [isOpen, mounted, animationsEnabled]);

  // Load popup background image
  useEffect(() => {
    if (!isOpen || !currentCard?.popupImage) return;
    setImgLoaded(false);
    const img = new window.Image();
    img.src = currentCard.popupImage;
    img.onload = () => setImgLoaded(true);
    img.onerror = () => setImgLoaded(true);
  }, [isOpen, currentCard?.popupImage]);

  // Escape key listener to close popup
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

  // Resize listener to close on window resize
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => onClose();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  if (!mounted || !shouldRender || !currentCard) return null;

  const backdropStyle: CSSProperties = animationsEnabled
    ? {
        opacity: active ? 1 : 0,
        transition: "opacity 0.4s cubic-bezier(0.76, 0, 0.24, 1)",
      }
    : { opacity: 1 };

  const drawerStyle: CSSProperties = animationsEnabled
    ? {
        transform: active ? "translateX(0%)" : "translateX(100%)",
        borderTopLeftRadius: active ? "0% 0%" : "50% 100%",
        borderBottomLeftRadius: active ? "0% 0%" : "50% 100%",
        transition:
          "transform 0.7s cubic-bezier(0.76, 0, 0.24, 1), border-radius 0.7s cubic-bezier(0.76, 0, 0.24, 1)",
      }
    : {
        transform: "translateX(0%)",
        borderTopLeftRadius: "0% 0%",
        borderBottomLeftRadius: "0% 0%",
      };

  const revealStyle = (delay: string): CSSProperties =>
    animationsEnabled
      ? {
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(20px)",
          transition: `opacity 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) ${delay}, transform 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) ${delay}`,
        }
      : { opacity: 1, transform: "translateY(0)" };

  const listItemStyle = (idx: number): CSSProperties =>
    animationsEnabled
      ? {
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(20px)",
          transition: `opacity 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) ${0.5 + 0.05 * idx}s, transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) ${0.5 + 0.05 * idx}s`,
        }
      : { opacity: 1, transform: "translateY(0)" };

  return createPortal(
    <>
      {/* Background Overlay Backdrop */}
      <div
        className="fixed inset-0 z-[100] cursor-pointer bg-black/60"
        style={{
          ...backdropStyle,
          pointerEvents: isOpen ? "auto" : "none",
        }}
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

      {/* Slider Drawer Sheet */}
      <div
        className="slider-popup-drawer fixed top-0 right-0 h-screen z-[101] w-[600px] max-w-full flex flex-col overflow-y-auto overflow-x-hidden bg-black"
        style={{
          ...drawerStyle,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="slider-popup-title"
      >
        {/* Background Visual Wrapper */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[#111]" />
          {imgLoaded && (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
              style={{ backgroundImage: `url(${currentCard.popupImage})` }}
            />
          )}
        </div>

        {/* Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          aria-label="Close popup"
          className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-white/8 border border-white/12 rounded-full text-white cursor-pointer transition-[background,border-color] duration-300 hover:bg-white/15 hover:border-white/25"
          onClick={onClose}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Content Container */}
        <div className="relative z-1 flex flex-col p-10 max-sm:p-5 w-full min-h-full">
          
          <h2
            id="slider-popup-title"
            className="font-medium text-[32px] max-sm:text-[38px] sm:text-[42px] lg:text-[48px] leading-[100%] tracking-[-0.06em] text-white mb-4"
            style={revealStyle("0.3s")}
          >
            {currentCard.title}
          </h2>

          <p
            className="font-medium max-sm:text-base sm:text-[20px] lg:text-[24px] leading-[120%] tracking-[-0.03em] text-white mb-6 pt-5"
            style={revealStyle("0.4s")}
          >
            {currentCard.subtitle}
          </p>

          <p
            className="font-normal text-sm leading-[125%] tracking-[-0.02em] text-white/60 mb-10"
            style={revealStyle("0.45s")}
          >
            {currentCard.paragraph}
          </p>

          {/* Points list */}
          <ul className="list-none p-0 m-0 mb-12 flex flex-col gap-0">
            {currentCard.points.map((pt, idx) => (
              <li
                key={idx}
                style={listItemStyle(idx)}
              >
                <span className="font-medium text-4xl leading-[100%] tracking-[-0.02em] text-white">
                  {pt}
                </span>
              </li>
            ))}
          </ul>

          {/* Footer Action Buttons */}
          <div
            className="flex gap-3 mt-auto"
            style={revealStyle("0.85s")}
          >
            <Link
              href="/contacts"
              onClick={onClose}
              className="group w-[203px] max-sm:w-full max-sm:max-w-[200px] sm:w-[243px] lg:w-[203px] h-[72px] rounded-[17px] bg-white text-black no-underline cursor-pointer flex items-center justify-center relative overflow-hidden transition-all duration-300 z-1 hover:animate-[rotate_0.7s_ease-in-out_both] [&>span]:pointer-events-none [&>span]:group-hover:animate-[storm_0.7s_ease-in-out_both] [&>span]:group-hover:[animation-delay:0.06s]"
            >
              <span className="font-bold text-sm tracking-[-0.02em]">Get in touch</span>
            </Link>

            <a
              href="https://www.linkedin.com/in/maherfayad/"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-[203px] h-[72px] rounded-[17px] bg-white/15 border border-white/12 text-white no-underline cursor-pointer flex items-center justify-center gap-2 relative overflow-hidden transition-all duration-300 z-1 hover:animate-[rotate_0.7s_ease-in-out_both] [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:pointer-events-none [&>span]:group-hover:animate-[storm_0.7s_ease-in-out_both] [&>span]:group-hover:[animation-delay:0.06s]"
            >
              <span className="font-bold text-sm tracking-[-0.02em]">LinkedIn</span>
            </a>
          </div>

        </div>
      </div>
    </>
    , document.body
  );
}
