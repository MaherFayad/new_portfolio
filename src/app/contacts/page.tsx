"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Reveal from "@/components/Reveal";
import AnimatedText from "@/components/AnimatedText";
import Glitch from "@/components/Glitch";
import Magnetic from "@/components/Magnetic";
import emailjs from "@emailjs/browser";

export default function ContactsPage() {
  const router = useRouter();

  // Clock state
  const [timeState, setTimeState] = useState({
    hours: "00",
    minutes: "00",
    colonVisible: true,
  });

  // Form states
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState({ name: false, email: false, message: false });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Update Riyadh clock every second
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
    setSubmitError(null);
    try {
      if (!formRef.current) throw new Error("Form not found");

      const result = await emailjs.sendForm(
        "service_0qkob2y",
        "template_mnzk4uc",
        formRef.current,
        "6Iz6j9YWRI_DaJ-s6"
      );

      if (result.status === 200) {
        setSuccess(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error("Failed to send message. Please try again.");
      }
    } catch (err: any) {
      console.error("Failed to send email:", err);
      const errMsg = err?.text || err?.message || "Failed to send message. Please try again.";
      setSubmitError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full px-5 max-sm:px-3 flex flex-col pb-[4.5rem]">

      {/* Header bar */}
      <header className="w-full mt-5 relative z-10">
        <div className="grid grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-5 w-full h-8 items-end">
          <div className="col-span-1 lg:col-span-3">
            <Glitch>
              <Link href="/">
                <img
                  alt="Maher Fayad"
                  src="/assets/logo.svg"
                  width="115"
                  height="32"
                  className="w-[115px] h-8"
                />
              </Link>
            </Glitch>
          </div>
          <nav aria-label="Primary" className="col-start-2 lg:col-start-5 lg:col-span-4 max-sm:col-start-3 self-end flex justify-center gap-8 pointer-events-auto">
            <Magnetic range={40} strength={0.4}>
              <Link href="/about" className="font-semibold text-sm uppercase text-[#c5c5c5] underline underline-offset-4 hover:opacity-70">
                ABOUT
              </Link>
            </Magnetic>
            <Magnetic range={40} strength={0.4}>
              <Link href="/contacts" className="font-semibold text-sm uppercase text-[#c5c5c5] underline underline-offset-4 hover:opacity-70">
                CONTACTS
              </Link>
            </Magnetic>
          </nav>
          <div className="col-start-3 lg:col-start-11 max-sm:hidden flex flex-col text-right self-end">
            <span className="block font-semibold text-[clamp(11px,0.533vw+5.54px,14px)] tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none">
              Maher
            </span>
            <span className="block font-semibold text-[clamp(11px,0.533vw+5.54px,14px)] tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none">
              Fayad
            </span>
          </div>
          <div className="col-start-4 lg:col-start-12 max-sm:hidden flex flex-col text-left self-end">
            <span className="block font-semibold text-[clamp(11px,0.533vw+5.54px,14px)] tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none">
              Product
            </span>
            <span className="block font-semibold text-[clamp(11px,0.533vw+5.54px,14px)] tracking-[-0.03em] uppercase text-[rgba(197,197,197,0.4)] leading-none">
              Designer
            </span>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-3 sm:gap-5 md:gap-5 lg:gap-5 mt-[5rem] max-sm:mt-8 items-start">

        {/* Left Column: Office Hours */}
        <div
          className="col-[2/4] max-sm:col-[1/3] sm:col-[1/3] md:col-[1/3] lg:col-[2/6] flex flex-col"
          style={{ animation: "fade-up 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s both" }}
        >
          <p className="font-medium text-sm leading-[120%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)] !text-[1em]">
            Available from
          </p>
          <div className="mt-[3.125rem] max-sm:mt-[1.5rem] flex items-center">
            <span className="font-semibold text-[2rem] leading-[120%] tracking-[-0.03em] text-[#c5c5c5]">
              05
            </span>
            <div className="ml-[0.25rem] flex flex-col justify-center">
              <span className="font-semibold text-[0.75rem] leading-[117%] tracking-[-0.03em] text-[#c5c5c5] opacity-35">
                AM
              </span>
              <span className="font-semibold text-[0.75rem] leading-[117%] tracking-[-0.03em] text-[#c5c5c5]">
                PM
              </span>
            </div>
            <span className="mx-[0.625rem] font-medium text-sm leading-[120%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)]">
              to
            </span>
            <span className="font-semibold text-[2rem] leading-[120%] tracking-[-0.03em] text-[#c5c5c5]">
              12
            </span>
            <div className="ml-[0.25rem] flex flex-col justify-center">
              <span className="font-semibold text-[0.75rem] leading-[117%] tracking-[-0.03em] text-[#c5c5c5]">
                AM
              </span>
              <span className="font-semibold text-[0.75rem] leading-[117%] tracking-[-0.03em] text-[#c5c5c5] opacity-35">
                PM
              </span>
            </div>
          </div>
          <p className="mt-[0.625rem] font-semibold text-[0.75rem] leading-[117%] tracking-[-0.03em] text-[#c5c5c5] opacity-50">
            Saturday to Thursday GMT+3
          </p>
        </div>

        {/* Right Column: Parallax Riyadh Clock Widget */}
        <div
          className="col-[8/12] max-sm:col-[2/5] sm:col-[3/5] md:col-[3/5] lg:col-[8/12]"
          style={{ animation: "fade-up 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0.3s both" }}
        >
          <div className="grid grid-cols-4 gap-5 items-start">
            <img
              alt="card"
              src="/cardbg.svg"
              width="455"
              height="254"
              className="col-[2/5] row-start-1 w-full h-auto block"
              loading="lazy"
            />

            {/* Clock Overlay */}
            <div className="col-[1/5] row-start-1 flex items-baseline self-start pointer-events-none mt-[60px] sm:mt-[100px] md:mt-[150px] lg:mt-[200px]">
              <span className="font-medium text-[#c5c5c5] text-[60px] sm:text-[100px] md:text-[120px] lg:text-[150px] leading-none tracking-[-0.07em]">
                {timeState.hours}
              </span>
              <span
                className="font-medium text-[#c5c5c5] text-[60px] sm:text-[100px] md:text-[120px] lg:text-[150px] leading-none tracking-[-0.07em]"
                style={{
                  opacity: timeState.colonVisible ? 1 : 0.2,
                  transition: "opacity 0.15s ease",
                }}
              >
                :
              </span>
              <span className="font-medium text-[#c5c5c5] text-[60px] sm:text-[100px] md:text-[120px] lg:text-[150px] leading-none tracking-[-0.07em]">
                {timeState.minutes}
              </span>
            </div>

            <div className="col-[2/3] max-sm:col-[2/5] lg:col-[2/4] row-start-2 flex flex-col mt-[2rem]">
              <span className="font-medium text-[1.625rem] leading-[100%] tracking-[-0.03em] text-[#c5c5c5] opacity-70">
                Saudi Arabia
              </span>
              <p className="mt-[0.75rem] font-medium text-sm leading-[120%] tracking-[-0.03em] text-[rgba(197,197,197,0.4)] max-sm:whitespace-nowrap">
                Riyadh UTC/GMT
                <br />
                +3 hours
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Form Input Section */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-auto pt-[3.125rem] max-sm:pt-8 grid grid-cols-12 max-sm:grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-12 gap-5 max-sm:gap-4 sm:gap-5 md:gap-5 lg:gap-5 gap-y-0 items-end"
      >

        {/* Name input */}
        <div
          className="col-[2/7] max-sm:col-[1/5] sm:col-[1/3] md:col-[1/3] lg:col-[2/7] relative"
          style={{ animation: "fade-up 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) 0.4s both" }}
        >
          <div className="relative w-full text-[clamp(1.25rem,1.875vw,2.25rem)]">
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
              className="w-full bg-transparent border-none outline-none resize-none font-medium leading-[160%] tracking-[-0.03em] text-[#c5c5c5] pt-[0.711em] pb-[0.356em] text-[clamp(1.25rem,1.875vw,2.25rem)]"
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
        </div>

        {/* Email input */}
        <div
          className="col-[7/12] max-sm:col-[1/5] sm:col-[3/5] md:col-[3/5] lg:col-[7/12] relative"
          style={{ animation: "fade-up 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) 0.5s both" }}
        >
          <div className="relative w-full text-[clamp(1.25rem,1.875vw,2.25rem)]">
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
              className="w-full bg-transparent border-none outline-none resize-none font-medium leading-[160%] tracking-[-0.03em] text-[#c5c5c5] pt-[0.711em] pb-[0.356em] text-[clamp(1.25rem,1.875vw,2.25rem)]"
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
        </div>

        {/* Message input & Submit Button */}
        <div
          className="col-[2/12] max-sm:col-[1/5] sm:col-[1/5] md:col-[1/5] lg:col-[2/12] mt-[1.56rem] relative"
          style={{ animation: "fade-up 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) 0.6s both" }}
        >
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
              Tell us about your project
            </label>
            <textarea
              id="message"
              name="message"
              rows={1}
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              onFocus={() => handleFocus("message")}
              onBlur={() => handleBlur("message")}
              className="w-full bg-transparent border-none outline-none resize-none font-medium leading-[160%] tracking-[-0.03em] text-[#c5c5c5] pt-[0.711em] pb-[0.356em] text-[clamp(1.25rem,1.875vw,2.25rem)] pb-0 pr-[5.333em]"
              style={{ overflow: "hidden", boxSizing: "border-box" }}
            />

            {/* Submit button inside form element */}
            <button
              type="submit"
              disabled={submitting}
              className="absolute bottom-[0.8rem] right-0 flex items-center gap-[0.75rem] group hover:opacity-70 transition-opacity duration-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
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
          {success && (
            <p className="absolute top-[calc(100%+0.375rem)] left-0 font-semibold text-[0.75rem] leading-none tracking-[-0.03em] text-[#1CCECB]">
              Message sent successfully! We will get back to you soon.
            </p>
          )}
          {submitError && (
            <p className="absolute top-[calc(100%+0.375rem)] left-0 font-semibold text-[0.75rem] leading-none tracking-[-0.03em] text-[#E84040]">
              {submitError}
            </p>
          )}
        </div>

      </form>

    </main>
  );
}
