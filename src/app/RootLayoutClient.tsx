"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { HomeRevealGateProvider } from "@/components/HomeRevealGate";
import SiteHeader from "@/components/SiteHeader";
import { PageTransitionProvider } from "@/components/PageTransition";
import { initCalEmbed } from "@/components/BookMeetingButton";
import ChatAgent from "@/components/ChatAgent";

const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: false,
  loading: () => <div className="loader bg-black" aria-hidden="true" />,
});

function PreloaderScrollReset({
  pageActive,
}: {
  pageActive: boolean;
}) {
  const didInitialScrollReset = useRef(false);

  const scrollPageToTop = useCallback(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (typeof history !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // Reset scroll once when the page first reveals
  useEffect(() => {
    if (pageActive && !didInitialScrollReset.current) {
      didInitialScrollReset.current = true;
      scrollPageToTop();
    }
  }, [pageActive, scrollPageToTop]);

  return null;
}

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Preloader runs on the first load of any page
  const [preloaderActive, setPreloaderActive] = useState(true);
  const [pageActive, setPageActive] = useState(false);
  const prevPathRef = useRef(pathname);

  const [stickyActive, setStickyActive] = useState(false);
  const stickyActiveRef = useRef(false);

  // Show/hide fixed sticky header on scroll up
  useEffect(() => {
    let lastScroll = 0;
    let ticking = false;
    const threshold = 180;

    const updateSticky = () => {
      ticking = false;
      const currentScroll = window.scrollY;
      const nextSticky = currentScroll > threshold && currentScroll < lastScroll;
      if (nextSticky !== stickyActiveRef.current) {
        stickyActiveRef.current = nextSticky;
        setStickyActive(nextSticky);
      }
      lastScroll = currentScroll;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateSticky);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset sticky header active state on path changes
  useEffect(() => {
    setStickyActive(false);
    stickyActiveRef.current = false;
  }, [pathname]);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderActive(false);
  }, []);

  const handlePreloaderStartExit = useCallback(() => {
    setPageActive(true);
  }, []);

  useEffect(() => {
    void import("@/components/Preloader");
  }, []);

  // Preload the Cal.com embed script app-wide so the "Book a meeting" button
  // is ready to open even when reaching /contacts via client-side navigation.
  useEffect(() => {
    void initCalEmbed();
  }, []);

  useEffect(() => {
    prevPathRef.current = pathname;
  }, [pathname]);

  // Global click & submit listeners for Google Analytics tracking
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest("a, button, [role='button'], input[type='submit']");
      if (!clickable) return;

      const isLink = clickable.tagName.toLowerCase() === "a";
      const isButton =
        clickable.tagName.toLowerCase() === "button" ||
        clickable.getAttribute("role") === "button" ||
        clickable.getAttribute("type") === "submit";
      const text =
        clickable.textContent?.trim() ||
        clickable.getAttribute("aria-label") ||
        (clickable as HTMLInputElement).value ||
        "";
      const href = clickable.getAttribute("href");

      // We use (window as any).gtag to call Google Analytics
      const gtag = (window as any).gtag;
      if (!gtag) return;

      if (isLink && href) {
        const isExternal = href.startsWith("http") && !href.includes(window.location.hostname);
        const isEmail = href.startsWith("mailto:");
        const isProject = href.includes("/projects/");
        const isCV =
          href.toLowerCase().includes("cv") ||
          href.toLowerCase().includes("resume") ||
          href.toLowerCase().endsWith(".pdf");

        if (isCV) {
          gtag("event", "view_cv", {
            event_category: "engagement",
            event_label: text || href,
          });
        } else if (isEmail) {
          gtag("event", "email_click", {
            event_category: "contact",
            event_label: href,
          });
        } else if (isProject) {
          const projectSlug = href.split("/projects/")[1] || href;
          gtag("event", "project_click", {
            event_category: "portfolio",
            event_label: projectSlug,
          });
        } else if (isExternal) {
          gtag("event", "outbound_click", {
            event_category: "outbound",
            event_label: href,
          });
        } else {
          gtag("event", "navigation_click", {
            event_category: "navigation",
            event_label: href,
            link_text: text,
          });
        }
      } else if (isButton) {
        const isBookMeeting = text.toLowerCase().includes("book") || text.toLowerCase().includes("meeting");
        const isFormSubmit = clickable.getAttribute("type") === "submit";

        if (isBookMeeting) {
          gtag("event", "book_meeting_click", {
            event_category: "engagement",
            event_label: text,
          });
        } else {
          gtag("event", "button_click", {
            event_category: "interaction",
            event_label: text || "unlabeled_button",
            is_form_submit: isFormSubmit,
          });
        }
      }
    };

    const handleGlobalSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      const formId = form.id || form.getAttribute("name") || "unnamed_form";
      const gtag = (window as any).gtag;
      if (gtag) {
        gtag("event", "form_submission_attempt", {
          event_category: "form",
          event_label: formId,
        });
      }
    };

    document.addEventListener("click", handleGlobalClick);
    document.addEventListener("submit", handleGlobalSubmit);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
      document.removeEventListener("submit", handleGlobalSubmit);
    };
  }, []);

  // Lock scroll while preloader is active, but unlock once the page starts revealing
  useEffect(() => {
    if (preloaderActive && !pageActive) {
      document.documentElement.classList.add("preloader-active");
    } else {
      document.documentElement.classList.remove("preloader-active");
      if (typeof window !== "undefined") {
        window.focus();
        document.body.focus();
      }
    }
    return () => {
      document.documentElement.classList.remove("preloader-active");
    };
  }, [preloaderActive, pageActive]);

  const showPreloader = preloaderActive;
  const showPage = true; // Always mount page and transition provider for page-to-page transitions
  const gateValue = pageActive; // Reveal components wait for the preloader to complete

  return (
    <>
      <PreloaderScrollReset pageActive={pageActive} />
      <HomeRevealGateProvider value={gateValue}>
        {showPreloader && (
          <Preloader
            onComplete={handlePreloaderComplete}
            onStartExit={handlePreloaderStartExit}
          />
        )}
        {showPage && (
          <PageTransitionProvider>
            {/* Sticky Header (Scroll Triggered) */}
            <div
              aria-hidden={!stickyActive}
              className={`fixed top-0 left-0 right-0 z-50 pt-5 transition-transform duration-500 ease-in-out pointer-events-none ${
                stickyActive ? "translate-y-0" : "-translate-y-[calc(100%+100px)]"
              }`}
            >
              <div className="pointer-events-auto w-full px-[20px] max-sm:px-[12px] md:px-[20px] lg:px-[20px]">
                <SiteHeader variant="sticky" />
              </div>
            </div>

            <div
              className="relative z-0"
              style={
                !pageActive
                  ? { opacity: 0, pointerEvents: "none" }
                  : {
                      animation: "page-fade-in 0.8s cubic-bezier(0.76, 0, 0.24, 1) forwards",
                      willChange: "opacity",
                      pointerEvents: "auto",
                    }
              }
            >
              {children}
            </div>
            {pageActive && <ChatAgent />}
          </PageTransitionProvider>
        )}
      </HomeRevealGateProvider>
    </>
  );
}
