"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import ContactToast, { type ContactToastData } from "@/components/ContactToast";
import BookMeetingButton from "@/components/BookMeetingButton";
import emailjs from "@emailjs/browser";
import SiteHeader from "@/components/SiteHeader";
import AnimatedText from "@/components/AnimatedText";

type ContactToast = ContactToastData;

export default function ContactsPage() {

  // Clock state
  const [timeState, setTimeState] = useState({
    hours: "00",
    minutes: "00",
    colonVisible: true,
  });

  const [isAvailableNow, setIsAvailableNow] = useState(false);

  // Form states
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState({ name: false, email: false, message: false });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ContactToast | null>(null);
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });

  // Update Riyadh clock every second & update availability status
  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Riyadh",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const parts = formatter.formatToParts(new Date());
      const hh = parts.find((p) => p.type === "hour")?.value ?? "00";
      const mm = parts.find((p) => p.type === "minute")?.value ?? "00";

      const hourInt = parseInt(hh, 10);
      // Available from 05:00 PM (17:00) to 12:00 AM (00:00). So 17 <= hourInt < 24
      const active = hourInt >= 17 && hourInt < 24;

      setIsAvailableNow(active);

      setTimeState((prev) => ({
        hours: hh,
        minutes: mm,
        colonVisible: !prev.colonVisible,
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Auto-expand textarea height
  useEffect(() => {
    const textarea = messageRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [form.message]);

  const handleFocus = (field: keyof typeof focused) => {
    setFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: keyof typeof focused) => {
    setFocused((prev) => ({ ...prev, [field]: false }));
  };

  const handleChange = (field: keyof typeof form, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    const nextErrors = { name: "", email: "", message: "" };
    let hasErr = false;

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
      hasErr = true;
    }
    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
      hasErr = true;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = "Invalid email format";
      hasErr = true;
    }

    if (hasErr) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setToast(null);
    try {
      if (!formRef.current) throw new Error("Form not found");

      const result = await emailjs.sendForm(
        "service_0qkob2y",
        "template_mnzk4uc",
        formRef.current,
        "6Iz6j9YWRI_DaJ-s6"
      );

      if (result.status === 200) {
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "generate_lead", {
            event_category: "contact",
            event_label: "Contact Form Success",
          });
        }
        setToast({
          type: "success",
          message: "Message sent successfully! I'll reach back to you.",
        });
        setForm({ name: "", email: "", message: "" });
      } else {
        throw new Error("Failed to send message. Please try again.");
      }
    } catch (err: any) {
      console.error("Failed to send email:", err);
      const errMsg = err?.text || err?.message || "Failed to send message. Please try again.";
      setToast({ type: "error", message: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full px-5 max-sm:px-3 flex flex-col pb-[5rem]">
      {/* CSS Animations for Gradient Mesh */}
      <style>{`
        @keyframes pulseSlow {
          0% {
            transform: scale(1) translate(0px, 0px);
            opacity: 0.14;
          }
          50% {
            transform: scale(1.15) translate(15px, -15px);
            opacity: 0.22;
          }
          100% {
            transform: scale(0.9) translate(-10px, 10px);
            opacity: 0.1;
          }
        }
        @keyframes pulseSlowReverse {
          0% {
            transform: scale(0.9) translate(0px, 0px);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.1) translate(-15px, 10px);
            opacity: 0.18;
          }
          100% {
            transform: scale(1) translate(15px, -15px);
            opacity: 0.14;
          }
        }
        .pulse-slow-1 {
          animation: pulseSlow 12s ease-in-out infinite alternate;
        }
        .pulse-slow-2 {
          animation: pulseSlowReverse 12s ease-in-out infinite alternate;
        }
      `}</style>

      {/* Header bar */}
      <Reveal aboveFold as="header" className="w-full mt-5 relative z-10">
        <SiteHeader variant="static" />
      </Reveal>

      {/* 1. Page Title Hero */}
      <section className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-6 w-full items-start mt-[clamp(80px,9vw,130px)] max-sm:mt-20">
        {/* Side label */}
        <Reveal aboveFold className="col-span-1 max-sm:hidden sm:max-lg:hidden flex flex-col text-left self-start lg:row-start-1 [&>span]:block font-semibold text-sm tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none lg:max-dt:text-[clamp(9px,0.8vw+0.8px,11px)] dt:text-sm">
          <span>Get in</span>
          <span>Touch</span>
        </Reveal>

      </section>

      {/* 2. Unified Two-Column Dashboard Layout */}
      <section className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-24 items-stretch w-full mt-12 max-sm:mt-8">

        {/* Left Column: Direct Contact & Availability */}
        <div className="col-[2/6] max-sm:col-[1/5] sm:col-[1/3] lg:col-[2/6] flex flex-col gap-10 max-sm:gap-12">

          {/* Riyadh Clock Card */}
          <Reveal aboveFold delay={0.15} className="w-full">
            <div className="w-full aspect-[1.8/1] rounded-2xl border border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md relative overflow-hidden flex flex-col justify-between p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
              {/* Ambient Gradient Mesh Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div
                  className="absolute -top-[40%] -right-[20%] w-[90%] h-[90%] rounded-full bg-[#1B67E8] opacity-[0.16] blur-[70px] pulse-slow-1"
                />
                <div
                  className="absolute -bottom-[40%] -left-[20%] w-[90%] h-[90%] rounded-full bg-[#927FAE] opacity-[0.12] blur-[70px] pulse-slow-2"
                />
              </div>

              {/* Card Top: Details & Status Indicator */}
              <div className="flex justify-between items-start relative z-10 w-full">
                <div className="flex flex-col">
                  <span className="font-semibold text-[9px] tracking-widest uppercase text-[rgba(197,197,197,0.3)]">
                    LOCATION
                  </span>
                  <span className="font-medium text-[14px] leading-none tracking-[-0.02em] text-[#c5c5c5] mt-1.5">
                    Riyadh, Saudi Arabia
                  </span>
                  <span className="font-medium text-[10px] text-[rgba(197,197,197,0.4)] mt-1">
                    UTC/GMT +3 hours
                  </span>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/5 bg-[#141414]/40 backdrop-blur-md">
                  <span className={`w-1.5 h-1.5 rounded-full ${isAvailableNow ? "bg-[#1CCECB] animate-pulse" : "bg-[rgba(197,197,197,0.4)]"}`} />
                  <span className="font-semibold text-[8px] tracking-wider uppercase text-[#c5c5c5]">
                    {isAvailableNow ? "Active Now" : "Resting"}
                  </span>
                </div>
              </div>

              {/* Card Bottom: Clock Display */}
              <div className="flex items-baseline pointer-events-none mt-auto relative z-10 w-full select-none">
                <span className="font-medium text-[#c5c5c5] text-[72px] sm:text-[80px] md:text-[80px] lg:text-[90px] leading-none tracking-[-0.07em]">
                  {timeState.hours}
                </span>
                <span
                  className="font-medium text-[#c5c5c5] text-[72px] sm:text-[80px] md:text-[80px] lg:text-[90px] leading-none tracking-[-0.07em]"
                  style={{
                    opacity: timeState.colonVisible ? 1 : 0.2,
                    transition: "opacity 0.15s ease",
                  }}
                >
                  :
                </span>
                <span className="font-medium text-[#c5c5c5] text-[72px] sm:text-[80px] md:text-[80px] lg:text-[90px] leading-none tracking-[-0.07em]">
                  {timeState.minutes}
                </span>
                <span className="font-semibold text-[9px] tracking-widest uppercase text-[rgba(197,197,197,0.6)] ml-2.5 mb-2">
                  Time Now
                </span>
              </div>
            </div>
          </Reveal>

          {/* Direct Email */}
          <Reveal aboveFold delay={0.15} className="flex flex-col">
            <span className="block font-semibold text-xs tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] mb-2">
              SAY HELLO
            </span>
            <a
              href="mailto:Contact@maherfayad.com"
              className="font-medium text-[clamp(1.35rem,2vw,2rem)] leading-[110%] tracking-[-0.04em] text-[#c5c5c5] underline underline-offset-[8%] decoration-[8%] hover:opacity-70 break-all"
            >
              <AnimatedText text="Contact@maherfayad.com" className="projects-name-text" />
            </a>
          </Reveal>

          {/* Working Hours */}
          <Reveal aboveFold delay={0.25} className="flex flex-col">
            <span className="block font-semibold text-xs tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] mb-2">
              AVAILABLE FROM
            </span>
            <div className="flex items-center">
              <span className="font-semibold text-[2rem] leading-[100%] tracking-[-0.03em] text-[#c5c5c5]">
                05
              </span>
              <div className="ml-[0.25rem] flex flex-col justify-center">
                <span className="font-semibold text-[0.7rem] leading-[110%] tracking-[-0.03em] text-[#c5c5c5] opacity-35">
                  AM
                </span>
                <span className="font-semibold text-[0.7rem] leading-[110%] tracking-[-0.03em] text-[#c5c5c5]">
                  PM
                </span>
              </div>
              <span className="mx-[0.6rem] font-medium text-sm leading-none tracking-[-0.03em] text-[rgba(197,197,197,0.4)]">
                to
              </span>
              <span className="font-semibold text-[2rem] leading-[100%] tracking-[-0.03em] text-[#c5c5c5]">
                12
              </span>
              <div className="ml-[0.25rem] flex flex-col justify-center">
                <span className="font-semibold text-[0.7rem] leading-[110%] tracking-[-0.03em] text-[#c5c5c5]">
                  AM
                </span>
                <span className="font-semibold text-[0.7rem] leading-[110%] tracking-[-0.03em] text-[#c5c5c5] opacity-35">
                  PM
                </span>
              </div>
            </div>
            <p className="mt-2 font-semibold text-[11px] leading-[110%] tracking-[-0.03em] text-[#c5c5c5] opacity-50">
              Saturday to Thursday GMT+3
            </p>
            <div className="mt-4">
              <Magnetic range={60} strength={0.4}>
                <BookMeetingButton>BOOK A MEETING</BookMeetingButton>
              </Magnetic>
            </div>
          </Reveal>

        </div>

        {/* Right Column: Dynamic Form Section */}
        <div className="col-[7/13] max-sm:col-[1/5] sm:col-[3/5] lg:col-[7/13] flex flex-col justify-end w-full">
          <Reveal delay={0.15} className="flex flex-col mb-8">
            <span className="block font-semibold text-xs tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)]">
              SEND A MESSAGE
            </span>
            <h3 className="font-medium text-lg text-[#c5c5c5] mt-1.5 leading-none">
              Tell me about your project
            </h3>
          </Reveal>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-10 max-sm:gap-12 w-full"
          >
            {/* Name input */}
            <Reveal delay={0.2} className="relative w-full text-[clamp(1.2rem,1.6vw,2rem)]">
              <div className="relative w-full text-[clamp(1.2rem,1.6vw,2rem)]">
                <label
                  htmlFor="name"
                  className="absolute left-0 top-0 pointer-events-none font-medium tracking-[-0.03em] text-[#c5c5c5] leading-none opacity-40 origin-top-left"
                  style={{
                    transform: (focused.name || form.name)
                      ? "translateY(-0.2em) scale(0.65)"
                      : "translateY(0.711em) scale(1)",
                    transition: "transform 0.2s ease-in-out",
                    willChange: "transform",
                  }}
                >
                  What is your name?
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onFocus={() => handleFocus("name")}
                  onBlur={() => handleBlur("name")}
                  className="w-full bg-transparent border-none outline-none resize-none font-medium leading-[160%] tracking-[-0.03em] text-[#c5c5c5] pt-[0.711em] pb-[0.356em] text-[clamp(1.2rem,1.6vw,2rem)]"
                />
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#262626]" />
                <div
                  className="absolute bottom-0 left-0 w-full h-[2px] pointer-events-none origin-left"
                  style={{
                    transform: focused.name ? "scaleX(1)" : "scaleX(0)",
                    background: "linear-gradient(to right, #1B67E8, #1CCECB, #927FAE)",
                    transition: "transform 0.4s cubic-bezier(0.63, 0.19, 0.34, 0.95)",
                    willChange: "transform",
                  }}
                />
                {errors.name && (
                  <p className="absolute top-[calc(100%+0.375rem)] left-0 font-semibold text-[0.75rem] leading-none tracking-[-0.03em] text-[#E84040]">
                    {errors.name}
                  </p>
                )}
              </div>
            </Reveal>

            {/* Email input */}
            <Reveal delay={0.25} className="relative w-full text-[clamp(1.2rem,1.6vw,2rem)]">
              <div className="relative w-full text-[clamp(1.2rem,1.6vw,2rem)]">
                <label
                  htmlFor="email"
                  className="absolute left-0 top-0 pointer-events-none font-medium tracking-[-0.03em] text-[#c5c5c5] leading-none opacity-40 origin-top-left"
                  style={{
                    transform: (focused.email || form.email)
                      ? "translateY(-0.2em) scale(0.65)"
                      : "translateY(0.711em) scale(1)",
                    transition: "transform 0.2s ease-in-out",
                    willChange: "transform",
                  }}
                >
                  Your email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                  className="w-full bg-transparent border-none outline-none resize-none font-medium leading-[160%] tracking-[-0.03em] text-[#c5c5c5] pt-[0.711em] pb-[0.356em] text-[clamp(1.2rem,1.6vw,2rem)]"
                />
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#262626]" />
                <div
                  className="absolute bottom-0 left-0 w-full h-[2px] pointer-events-none origin-left"
                  style={{
                    transform: focused.email ? "scaleX(1)" : "scaleX(0)",
                    background: "linear-gradient(to right, #1B67E8, #1CCECB, #927FAE)",
                    transition: "transform 0.4s cubic-bezier(0.63, 0.19, 0.34, 0.95)",
                    willChange: "transform",
                  }}
                />
                {errors.email && (
                  <p className="absolute top-[calc(100%+0.375rem)] left-0 font-semibold text-[0.75rem] leading-none tracking-[-0.03em] text-[#E84040]">
                    {errors.email}
                  </p>
                )}
              </div>
            </Reveal>

            {/* Message input & Submit Button */}
            <Reveal delay={0.3} className="relative w-full text-[clamp(1.25rem,1.875vw,2.25rem)]">
              <div className="relative w-full text-[clamp(1.25rem,1.875vw,2.25rem)]">
                <label
                  htmlFor="message"
                  className="absolute left-0 top-0 pointer-events-none font-medium tracking-[-0.03em] text-[#c5c5c5] leading-none opacity-40 origin-top-left"
                  style={{
                    transform: (focused.message || form.message)
                      ? "translateY(-0.2em) scale(0.65)"
                      : "translateY(0.711em) scale(1)",
                    transition: "transform 0.2s ease-in-out",
                    willChange: "transform",
                  }}
                >
                  Tell me about your project
                </label>
                <textarea
                  ref={messageRef}
                  id="message"
                  name="message"
                  rows={1}
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onFocus={() => handleFocus("message")}
                  onBlur={() => handleBlur("message")}
                  className="w-full bg-transparent border-none outline-none resize-none font-medium leading-[160%] tracking-[-0.03em] text-[#c5c5c5] pt-[0.711em] pb-[0.356em] text-[clamp(1.2rem,1.6vw,2rem)] pr-[5.333em]"
                  style={{ overflow: "hidden", boxSizing: "border-box" }}
                />

                {/* Submit button inside form element */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="absolute bottom-[0.8rem] right-0 flex items-center gap-[0.75rem] group hover:opacity-70 transition-opacity duration-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer bg-transparent border-none p-0 text-inherit"
                >
                  <span className="font-medium text-[1.625rem] leading-none tracking-[-0.03em] text-[#c5c5c5] mb-[0.3rem]">
                    {submitting ? "Sending..." : "Send"}
                  </span>
                  <img
                    alt=""
                    src="/arcon.svg"
                    width="26"
                    height="26"
                    className="block mb-[0.3rem]"
                  />
                </button>

                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#262626]" />
                <div
                  className="absolute bottom-0 left-0 w-full h-[2px] pointer-events-none origin-left"
                  style={{
                    transform: focused.message ? "scaleX(1)" : "scaleX(0)",
                    background: "linear-gradient(to right, #1B67E8, #1CCECB, #927FAE)",
                    transition: "transform 0.4s cubic-bezier(0.63, 0.19, 0.34, 0.95)",
                    willChange: "transform",
                  }}
                />
              </div>
            </Reveal>
          </form>
        </div>

      </section>

      <AnimatePresence mode="wait">
        {toast && <ContactToast key={`${toast.type}-${toast.message}`} toast={toast} />}
      </AnimatePresence>
    </main>
  );
}
