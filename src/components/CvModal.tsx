"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  driveUrl: string;
}

const CLOSE_MS = 300;
const EASING = "cubic-bezier(0.215, 0.61, 0.355, 1)";

function toPreviewUrl(driveUrl: string) {
  const match = driveUrl.match(/\/d\/([^/]+)/);
  const fileId = match?.[1];
  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : driveUrl;
}

export default function CvModal({ isOpen, onClose, driveUrl }: CvModalProps) {
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [active, setActive] = useState(false);
  const isFirstRender = useRef(true);
  const enterFrameRef = useRef(0);

  useEffect(() => {
    setMounted(true);
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

    const timer = setTimeout(() => setShouldRender(false), CLOSE_MS);
    return () => clearTimeout(timer);
  }, [isOpen, mounted]);

  useLayoutEffect(() => {
    if (!shouldRender || !isOpen) return;

    let innerFrame = 0;
    enterFrameRef.current = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => setActive(true));
    });

    return () => {
      cancelAnimationFrame(enterFrameRef.current);
      cancelAnimationFrame(innerFrame);
    };
  }, [shouldRender, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!mounted || !shouldRender) return null;

  const backdropStyle: CSSProperties = {
    opacity: active ? 1 : 0,
    transition: `opacity ${CLOSE_MS}ms ${EASING}`,
  };

  const panelStyle: CSSProperties = {
    opacity: active ? 1 : 0,
    transform: active ? "scale(1) translateY(0)" : "scale(0.96) translateY(12px)",
    transition: `opacity ${CLOSE_MS}ms ${EASING}, transform ${CLOSE_MS}ms ${EASING}`,
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm max-sm:p-3"
      style={backdropStyle}
      onClick={onClose}
      role="button"
      tabIndex={0}
      aria-label="Close CV preview"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClose();
        }
      }}
    >
      <div
        className="relative flex h-[85vh] w-full max-w-[900px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
        style={panelStyle}
        role="dialog"
        aria-modal="true"
        aria-label="CV preview"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <span className="font-semibold text-xs uppercase tracking-[-0.03em] text-[rgba(197,197,197,0.62)]">
            Maher Fayad — CV
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Close CV preview"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-colors duration-300 hover:bg-white/15"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <iframe
          src={toPreviewUrl(driveUrl)}
          title="Maher Fayad CV preview"
          className="h-full w-full flex-1 border-0"
          allow="autoplay"
        />
      </div>
    </div>,
    document.body
  );
}
