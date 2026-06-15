"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import ChatProjectCard from "./ChatProjectCard";
import ChatPluginCard from "./ChatPluginCard";
import BookMeetingButton from "./BookMeetingButton";
import MobileHorizontalScroll from "./MobileHorizontalScroll";

const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false }
);

// Sparkle shape traced from Scene.lottie (shared by all three stars)
const AI_ICON_SPARKLE_PATH =
  "M-6.69,-85.362 C-4.604,-91.546 4.141,-91.546 6.227,-85.362 C6.227,-85.362 22.991,-35.658 22.991,-35.658 C24.148,-32.227 26.622,-29.398 29.868,-27.793 C29.868,-27.793 73.74,-6.11 73.74,-6.11 C78.802,-3.609 78.802,3.609 73.74,6.111 C73.74,6.111 29.868,27.794 29.868,27.794 C26.622,29.398 24.148,32.227 22.991,35.658 C22.991,35.658 6.227,85.362 6.227,85.362 C4.141,91.546 -4.604,91.546 -6.69,85.362 C-6.69,85.362 -23.454,35.658 -23.454,35.658 C-24.611,32.227 -27.085,29.398 -30.331,27.794 C-30.331,27.794 -74.204,6.111 -74.204,6.111 C-79.265,3.609 -79.265,-3.609 -74.204,-6.11 C-74.204,-6.11 -30.331,-27.793 -30.331,-27.793 C-27.085,-29.398 -24.611,-32.227 -23.454,-35.658 C-23.454,-35.658 -6.69,-85.362 -6.69,-85.362Z";

// Position/scale/gradient for each star, frozen at frame 75 of Scene.lottie (the resting pose)
const AI_ICON_STARS = [
  {
    transform: "translate(238.352 195.931) scale(0.579) translate(1 0)",
    opacity: 0.7,
    stops: [
      { offset: 0.119, color: "#3D57C1" },
      { offset: 0.715, color: "#4DAB5B" },
    ],
    x1: -222.183, y1: 4.04, x2: 93.267, y2: 235.649,
  },
  {
    transform: "translate(228.853 333.306) scale(0.68) translate(1 0)",
    opacity: 0.7,
    stops: [
      { offset: 0, color: "#4EAB5B" },
      { offset: 1, color: "#3D57BF" },
    ],
    x1: 52.717, y1: 60.3, x2: -36.486, y2: -38.996,
  },
  {
    transform: "translate(326.565 296.913) scale(0.82) translate(1 0)",
    opacity: 1,
    stops: [
      { offset: 0.259, color: "#3D57C1" },
      { offset: 0.982, color: "#4DAB5B" },
    ],
    x1: 0, y1: 0, x2: 132.752, y2: 111.796,
  },
];

interface Message {
  role: "user" | "assistant";
  content: string;
  thoughts?: string[];
  status?: string;
}

const BACKEND_URL = "https://maherfayad-portfolio.hf.space";

const SUGGESTED_PROMPTS: { label: string; icon: React.ReactNode }[] = [
  {
    label: "Show me his strongest case study",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    label: "What results has he driven for clients?",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    label: "Is he available for new opportunities?",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];



const PLACEHOLDER_PREFIX = "Ask me ";

const PLACEHOLDER_EXAMPLES = [
  "about his Al Rajhi Bank project",
  "what his design process looks like",
  "what results he's driven for clients",
  "if he's available for new work",
  "what design systems he's built",
  "to show his strongest case study",
];

// Dev-only mock scenarios for exercising chat UI states without spending LLM tokens.
// Usage: type "/mock <key>" in the chat input (e.g. "/mock projects").
const MOCK_SCENARIOS: Record<string, { thoughts: string[]; text: string }> = {
  project: {
    thoughts: ["Looking up project details...", "Found a strong match..."],
    text: "Here's a project that highlights his fintech work for Al Rajhi Bank. [ProjectCard: alrajhi-bank-payroll]",
  },
  projects: {
    thoughts: ["Scanning portfolio...", "Selecting highlights..."],
    text: "Here are a few projects worth a look. [ProjectCard: alrajhi-bank-payroll][ProjectCard: lfg][ProjectCard: sanarte]",
  },
  plugin: {
    thoughts: ["Checking design system tools..."],
    text: "He also published a Figma plugin for token generation. [PluginCard: numeric-tokens-generator]",
  },
  plugins: {
    thoughts: ["Listing Figma plugins..."],
    text: "Maher has published a couple of Figma plugins. [PluginCard: primitive-semantic-colors-generator][PluginCard: numeric-tokens-generator]",
  },
  mixed: {
    thoughts: ["Compiling a mixed recommendation..."],
    text: "Here's a project and a tool that pair well together. [ProjectCard: alrajhi-bank-payroll][PluginCard: numeric-tokens-generator]",
  },
  booking: {
    thoughts: ["Preparing contact details..."],
    text: "You can reach Maher directly via email (Contact@maherfayad.com) or book time on his calendar. [BookMeetingButton]",
  },
  long: {
    thoughts: ["Compiling a detailed answer..."],
    text: "Maher's approach to product design starts with discovery: understanding user pain points through research, analytics, and stakeholder interviews. From there he maps the problem space, sketches multiple directions, and validates early concepts with lightweight prototypes. For the Al Rajhi Bank Payroll project, this meant restructuring a dense enterprise workflow into a guided, step-by-step experience that reduced processing time and support tickets. For consumer apps like LFG, the focus shifted to onboarding clarity and motion design that reinforced trust. Across both, the throughline is outcome-first design: every screen, component, and interaction is justified by a measurable improvement, whether that's conversion, task completion, or satisfaction scores. [ProjectCard: alrajhi-bank-payroll]",
  },
  thinking: {
    thoughts: [
      "Connecting to representative board...",
      "Analyzing query context...",
      "Retrieving biography details...",
      "Cross-referencing project outcomes...",
      "Drafting representative response...",
    ],
    text: "Thanks for waiting! That was a longer thinking sequence to test the live status console.",
  },
};

const MOCK_HELP_TEXT = `Mock test commands (dev only, no tokens used):
/mock project — single project card
/mock projects — multiple project cards (horizontal scroll)
/mock plugin — single Figma plugin card
/mock plugins — multiple plugin cards (horizontal scroll)
/mock mixed — project + plugin card together
/mock booking — booking button
/mock long — long response (scroll test)
/mock thinking — long live-thinking sequence
/mock error — simulated network error
/mock ratelimit — simulated 429 rate limit`;

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

const springItem = {
  hidden: { y: 24, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 12,
      mass: 0.8,
    }
  }
};

const chatLayoutTransition = {
  type: "spring" as const,
  stiffness: 140,
  damping: 18,
  mass: 0.8,
};

function formatThoughtText(text: string): string {
  let cleaned = text.replace(/^[>\-\*\•\s]+/, '').trim();
  if (!cleaned) return "";

  // Check if it's entirely uppercase (ignoring numbers & punctuation)
  const isAllUppercase = cleaned === cleaned.toUpperCase() && /[a-zA-Z]/.test(cleaned);
  if (isAllUppercase) {
    cleaned = cleaned.toLowerCase();
  }

  // Capitalize first letter
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

interface ThoughtAccordionProps {
  thoughts: string[];
  status?: string;
  isLive?: boolean;
}

function ThoughtAccordion({ thoughts, status, isLive = false }: ThoughtAccordionProps) {
  // If not live, do not show the thinking process anymore
  if (!isLive) {
    return null;
  }

  const displayStatus = status
    ? formatThoughtText(status)
    : "Thinking...";

  // Filter out empty thoughts and format them
  const formattedThoughts = thoughts
    .map(t => formatThoughtText(t))
    .filter(t => t.length > 0);

  // Single line, no spinner, text fades in and out (pulse)
  const activeText = formattedThoughts.length > 0
    ? formattedThoughts[formattedThoughts.length - 1]
    : displayStatus;

  return (
    <div className="flex items-center gap-2.5 w-full my-2 text-left">
      <span className="text-xs text-white/40 font-semibold tracking-wide animate-pulse">
        {activeText}
      </span>
    </div>
  );
}

interface AIIconProps {
  className?: string;
  pulse?: boolean;
}

function AIIcon({ className = "w-8 h-8", pulse = false }: AIIconProps) {
  const dotLottieRef = useRef<any>(null);

  useEffect(() => {
    const player = dotLottieRef.current;
    if (!player) return;

    const syncPlayback = () => {
      if (pulse) {
        player.play();
      } else {
        player.pause();
        player.setFrame(75);
      }
    };

    player.addEventListener("load", syncPlayback);
    player.addEventListener("ready", syncPlayback);

    syncPlayback();

    return () => {
      player.removeEventListener("load", syncPlayback);
      player.removeEventListener("ready", syncPlayback);
    };
  }, [pulse]);

  return (
    <div className={`relative flex-shrink-0 overflow-hidden ${className}`}>
      <div
        className="w-full h-full"
        style={{ transformOrigin: "55.36% 52.52%", transform: "scale(1.75)" }}
      >
        <DotLottieReact
          src="/lottie/ai-orb.lottie"
          loop
          autoplay={pulse}
          dotLottieRefCallback={(dotLottie) => {
            dotLottieRef.current = dotLottie;
            if (dotLottie) {
              if (pulse) {
                dotLottie.play();
              } else {
                dotLottie.pause();
                dotLottie.setFrame(75);
              }
            }
          }}
          className="block w-full h-full"
        />
      </div>
    </div>
  );
}

interface EmailCopyButtonProps {
  email: string;
}

function EmailCopyButton({ email }: EmailCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className="relative inline-flex items-center group mx-1">
      <motion.button
        type="button"
        onClick={handleCopy}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white hover:bg-white/[0.08] hover:border-white/30 text-[13px] md:text-sm font-semibold cursor-pointer transition-all duration-200 shadow-sm"
        title="Click to copy email address"
      >
        <span>{email}</span>
        <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </motion.button>
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: -34, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -4, scale: 0.95, x: "-50%" }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="absolute left-1/2 px-2.5 py-1.5 text-[10px] font-bold text-black bg-white rounded shadow-[0_4px_12px_rgba(0,0,0,0.5)] pointer-events-none whitespace-nowrap z-50 uppercase tracking-wider"
          >
            Copied!
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

const parseEmail = (text: string) => {
  const emailRegex = /(Contact@maherfayad\.com)/gi;
  const parts = text.split(emailRegex);

  if (parts.length === 1) {
    return text;
  }

  return parts.map((part, idx) => {
    if (part.toLowerCase() === "contact@maherfayad.com") {
      return <EmailCopyButton key={idx} email={part} />;
    }
    return part;
  });
};

export default function ChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [queuedMessage, setQueuedMessage] = useState<string | null>(null);
  const [currentThoughts, setCurrentThoughts] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [keyboardInset, setKeyboardInset] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setIsOpen(true);
    setIsContentVisible(true);
  };

  const handleClose = () => {
    setIsContentVisible(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  // Auto-scroll on new messages or when chat becomes visible
  useEffect(() => {
    if (isContentVisible) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, currentThoughts, currentStatus, isContentVisible]);

  // Lock body scroll while the chat is open. This also prevents iOS Safari from
  // scrolling the whole page (and the "fixed" overlay with it) when the on-screen
  // keyboard focuses the input, which otherwise reveals page content behind the chat.
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const { style } = document.body;
    const prevPosition = style.position;
    const prevTop = style.top;
    const prevLeft = style.left;
    const prevRight = style.right;
    const prevWidth = style.width;

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";

    return () => {
      style.position = prevPosition;
      style.top = prevTop;
      style.left = prevLeft;
      style.right = prevRight;
      style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Send a queued message (typed while the agent was still replying) once it's done
  useEffect(() => {
    if (!isTyping && queuedMessage) {
      const msg = queuedMessage;
      setQueuedMessage(null);
      handleSendMessage(msg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping, queuedMessage]);

  // Escape key closes chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Track mobile keyboard height via visualViewport so the input pill and
  // close button stay anchored to the visible area instead of behind the keyboard
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardInset(inset);
    };

    vv.addEventListener("resize", handleResize);
    vv.addEventListener("scroll", handleResize);
    handleResize();

    return () => {
      vv.removeEventListener("resize", handleResize);
      vv.removeEventListener("scroll", handleResize);
    };
  }, []);

  // Typewriter animation cycling through example prompts in the input placeholder
  useEffect(() => {
    if (!isOpen || isInputFocused || inputValue) return;

    let exampleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = PLACEHOLDER_EXAMPLES[exampleIndex];

      if (!isDeleting) {
        charIndex++;
        setPlaceholderText(current.slice(0, charIndex));
        if (charIndex === current.length) {
          isDeleting = true;
          timeoutId = setTimeout(tick, 1800);
          return;
        }
        timeoutId = setTimeout(tick, 45);
      } else {
        charIndex--;
        setPlaceholderText(current.slice(0, charIndex));
        if (charIndex === 0) {
          isDeleting = false;
          exampleIndex = (exampleIndex + 1) % PLACEHOLDER_EXAMPLES.length;
          timeoutId = setTimeout(tick, 400);
          return;
        }
        timeoutId = setTimeout(tick, 25);
      }
    };

    timeoutId = setTimeout(tick, 400);
    return () => clearTimeout(timeoutId);
  }, [isOpen, isInputFocused, inputValue]);

  // Lock scroll in full screen mode
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("slider-popup-open");
    } else {
      document.documentElement.classList.remove("slider-popup-open");
    }
    return () => {
      document.documentElement.classList.remove("slider-popup-open");
    };
  }, [isOpen]);

  // Dev-only: simulate SSE responses locally so UI states can be tested without
  // hitting the backend or spending LLM tokens. Trigger with "/mock <key>".
  const handleMockMessage = async (text: string) => {
    const key = text.slice("/mock".length).trim().toLowerCase();
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    setInputValue("");
    setIsTyping(true);
    setStreamingText("");
    setCurrentThoughts([]);
    setCurrentStatus("Connecting to representative board...");
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      if (key === "error") {
        await delay(500);
        throw new Error("Failed to communicate with representative server.");
      }
      if (key === "ratelimit" || key === "rate-limit" || key === "429") {
        await delay(500);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm receiving a high volume of queries at the moment. Let's stay in touch! You can email me directly at Contact@maherfayad.com or book a slot on my calendar. [BookMeetingButton]",
          },
        ]);
        return;
      }

      const scenario = MOCK_SCENARIOS[key];
      if (!scenario) {
        await delay(300);
        setMessages((prev) => [...prev, { role: "assistant", content: MOCK_HELP_TEXT }]);
        return;
      }

      for (const thought of scenario.thoughts) {
        setCurrentStatus(thought);
        setCurrentThoughts((prev) => [...prev, thought]);
        await delay(400);
      }

      const words = scenario.text.split(" ");
      let assembled = "";
      for (const word of words) {
        assembled += (assembled ? " " : "") + word;
        setStreamingText(assembled);
        await delay(35);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: scenario.text, thoughts: scenario.thoughts },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: err.message || "An unexpected error occurred. Please try again.",
          status: "Error",
        },
      ]);
    } finally {
      setIsTyping(false);
      setCurrentStatus("");
      setCurrentThoughts([]);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    if (process.env.NODE_ENV !== "production" && text.trim().toLowerCase().startsWith("/mock")) {
      await handleMockMessage(text.trim());
      return;
    }

    // Reset input
    setInputValue("");
    setIsTyping(true);
    setStreamingText("");
    setCurrentThoughts([]);
    setCurrentStatus("Connecting to representative board...");

    // 1. Append User Message
    const updatedMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(updatedMessages);

    // 2. Format Chat History
    const historyText = updatedMessages
      .map((msg) => `${msg.role === "user" ? "User" : "Representative"}: ${msg.content}`)
      .join("\n");

    try {
      // 3. Make POST SSE stream request
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: text,
          history: historyText,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment before sending another message.");
        }
        throw new Error("Failed to communicate with representative server.");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Unable to read streaming response.");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      let thoughtsList: string[] = [];

      // Read SSE stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last partial line in buffer
        buffer = lines.pop() || "";

        let currentEvent = "";

        for (let line of lines) {
          if (line.endsWith("\r")) {
            line = line.slice(0, -1);
          }
          if (!line) continue;

          if (line.startsWith("event:")) {
            currentEvent = line.slice(line.indexOf(":") + 1).trim();
          } else if (line.startsWith("data:")) {
            let data = line.slice(line.indexOf(":") + 1);
            if (data.startsWith(" ")) {
              data = data.slice(1);
            }

            if (currentEvent === "status") {
              setCurrentStatus(data.trim());
            } else if (currentEvent === "thought") {
              thoughtsList = [...thoughtsList, data.trim()];
              setCurrentThoughts(thoughtsList);
            } else if (currentEvent === "result") {
              assistantText += data;
              setStreamingText(assistantText);
            } else if (currentEvent === "error") {
              throw new Error(data.trim());
            }
          }
        }
      }

      // 4. Append Assistant Final Response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantText || "Response drafted successfully.",
          thoughts: thoughtsList,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: err.message || "An unexpected error occurred. Please try again.",
          status: "Error",
        },
      ]);
    } finally {
      setIsTyping(false);
      setCurrentStatus("");
      setCurrentThoughts([]);
    }
  };

  // Helper to parse project tags [ProjectCard: slug], plugin tags [PluginCard: slug], and booking buttons [BookMeetingButton]
  const renderMessageContent = (text: string) => {
    // Match [ProjectCard: slug], [PluginCard: slug], or [BookMeetingButton]
    const regex = /\[(ProjectCard:\s*(.+?)|PluginCard:\s*(.+?)|BookMeetingButton)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const textBefore = text.substring(lastIndex, match.index);
      if (textBefore.trim()) {
        parts.push({ type: "text", content: textBefore });
      }

      const tagContent = match[1];
      if (tagContent === "BookMeetingButton") {
        parts.push({ type: "booking" });
      } else if (match[3] !== undefined) {
        // It's a PluginCard: slug
        const slug = match[3].trim();
        parts.push({ type: "plugin", slug });
      } else {
        // It's a ProjectCard: slug
        const slug = match[2].trim();
        parts.push({ type: "card", slug });
      }
      lastIndex = regex.lastIndex;
    }

    const textAfter = text.substring(lastIndex);
    if (textAfter.trim()) {
      parts.push({ type: "text", content: textAfter });
    }

    if (parts.length === 0) {
      return <p className="text-sm leading-relaxed text-[#c5c5c5] font-medium whitespace-pre-wrap">{parseEmail(text)}</p>;
    }

    // Group consecutive project/plugin cards so multiple recommendations scroll horizontally
    const groupedParts: Array<{ type: string; content?: string; slugs?: string[] }> = [];
    for (const part of parts) {
      if ((part.type === "card" || part.type === "plugin") && part.slug) {
        const groupType = part.type === "plugin" ? "pluginGroup" : "cardGroup";
        const last = groupedParts[groupedParts.length - 1];
        if (last && last.type === groupType) {
          last.slugs!.push(part.slug);
        } else {
          groupedParts.push({ type: groupType, slugs: [part.slug] });
        }
      } else {
        groupedParts.push(part);
      }
    }

    return (
      <div className="flex flex-col gap-2">
        {groupedParts.map((part, idx) => {
          if ((part.type === "cardGroup" || part.type === "pluginGroup") && part.slugs) {
            const CardComponent = part.type === "pluginGroup" ? ChatPluginCard : ChatProjectCard;
            if (part.slugs.length === 1) {
              return <CardComponent key={idx} slug={part.slugs[0]} onNavigate={handleClose} />;
            }
            return (
              <MobileHorizontalScroll key={idx} className="-mx-1 px-1">
                {part.slugs.map((slug) => (
                  <CardComponent key={slug} slug={slug} onNavigate={handleClose} compact />
                ))}
              </MobileHorizontalScroll>
            );
          }
          if (part.type === "booking") {
            return (
              <div key={idx} className="mt-4">
                <BookMeetingButton
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black hover:bg-[#c5c5c5] text-xs font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer border-0"
                >
                  Book a meeting
                </BookMeetingButton>
              </div>
            );
          }
          return (
            <p key={idx} className="text-sm leading-relaxed text-[#c5c5c5] font-medium whitespace-pre-wrap">
              {parseEmail(part.content || "")}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes gemini-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gemini-gradient {
          background-size: 200% auto;
          animation: gemini-gradient 3s linear infinite;
        }
        .chat-scroll-container::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0);
          border-radius: 9999px;
          transition: background 0.3s;
        }
        .chat-scroll-container:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
        }
        .chat-scroll-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.16);
        }
        .chat-scroll-container {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
          transition: scrollbar-color 0.3s;
        }
        .chat-scroll-container:hover {
          scrollbar-color: rgba(255, 255, 255, 0.08) transparent;
        }
        /* Ambient aurora behind the chat canvas so the surface reads as lit, not dead-flat */
        @keyframes chat-aurora-drift {
          0%, 100% { transform: translate(-50%, 0) scale(1); opacity: 0.55; }
          50% { transform: translate(-50%, -5%) scale(1.07); opacity: 0.85; }
        }
        .chat-aurora {
          position: absolute;
          top: -22%;
          left: 50%;
          width: min(880px, 130vw);
          height: 560px;
          transform: translate(-50%, 0);
          background:
            radial-gradient(38% 50% at 40% 42%, rgba(56, 189, 248, 0.11), transparent 72%),
            radial-gradient(36% 46% at 63% 56%, rgba(192, 132, 252, 0.09), transparent 74%),
            radial-gradient(30% 40% at 52% 64%, rgba(251, 146, 60, 0.06), transparent 76%);
          filter: blur(40px);
          pointer-events: none;
          animation: chat-aurora-drift 16s ease-in-out infinite;
        }
        /* One-shot light sheen sweeping across the trigger pill on hover */
        @keyframes chat-pill-sheen-sweep {
          0% { transform: translateX(-130%) skewX(-14deg); }
          100% { transform: translateX(260%) skewX(-14deg); }
        }
        .chat-pill-sheen {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 38%;
          background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.16), transparent);
          opacity: 0;
          transform: translateX(-130%) skewX(-14deg);
          pointer-events: none;
        }
        .group:hover .chat-pill-sheen {
          opacity: 1;
          animation: chat-pill-sheen-sweep 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          .chat-aurora { animation: none; }
        }
      ` }} />

      {/* 1. Fullscreen Chat Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-overlay"
            className="fixed inset-0 z-50 overflow-hidden flex flex-col"
          >
            {/* Frosted-glass backdrop: the page behind shows through, softly blurred */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#050505]/72 backdrop-blur-2xl"
              style={{ WebkitBackdropFilter: "blur(28px)" }}
            />

            {/* Chat Fullscreen Container */}
            <div className="relative w-screen h-screen flex flex-col overflow-hidden">


              {/* Delayed contents fade-in wrapper to prevent child distortion during morphing */}
              <AnimatePresence>
                {isContentVisible && (
                  <motion.div
                    key="chat-contents-delayed"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      type: "tween",
                      delay: isContentVisible ? 0.5 : 0,
                      duration: 0.3,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 flex flex-col z-10"
                  >
                    {/* Ambient aurora so the dark canvas reads as lit, not flat black */}
                    <div className="chat-aurora z-0" />
                    {/* Gradient Overlays for smooth text clipping at top and bottom */}
                    <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#050505]/90 via-[#050505]/50 to-transparent pointer-events-none z-20" />
                    <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent pointer-events-none z-20" />
                    {/* Close Button in Top-Right Corner */}
                    <motion.button
                      onClick={handleClose}
                      aria-label="Close Chat"
                      className="fixed top-6 right-8 w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/55 hover:text-white hover:border-white/25 hover:bg-white/[0.06] bg-white/[0.03] backdrop-blur-md cursor-pointer z-[60] font-semibold transition-colors duration-200"
                      whileHover={{ scale: 1.06, rotate: 90 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </motion.button>

                    {/* Split Pane Layout */}
                    <div className="flex-1 flex overflow-hidden w-full h-full justify-center">

                      {/* Right/Main Chat Pane (Centered) */}
                      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">

                        {/* Messages Scroll Area - spans full width for scrollbar on the far-right */}
                        <div
                          ref={chatContainerRef}
                          className="flex-1 overflow-y-auto chat-scroll-container w-full"
                        >
                          {/* Inner Centered Container - anchored to bottom, grows upward */}
                          <div
                            className={`max-w-3xl mx-auto w-full px-6 md:px-12 pt-24 md:pt-28 pb-36 flex flex-col min-h-full ${messages.length === 0 ? "justify-center" : "justify-end"
                              }`}
                          >

                            {messages.length === 0 ? (
                              /* Centered Welcome State with stagger container animation */
                              <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="show"
                                className="relative flex flex-col justify-center items-center gap-7 px-4 max-w-md mx-auto text-center"
                              >
                                <motion.div
                                  variants={springItem}
                                  className="relative z-10 w-20 h-20"
                                >
                                  <img
                                    src="/assets/Maher-cropped.png"
                                    alt="Maher Fayad"
                                    className="avatar-photo relative z-10 w-full h-full object-contain"
                                    style={{ transform: "scaleX(-1)" }}
                                  />
                                  {/* AI sparkle badge anchored to the avatar */}
                                  <span className="absolute z-20 -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-[#0a0a0b] border border-white/10 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                                    <AIIcon className="w-4 h-4" />
                                  </span>
                                </motion.div>

                                <motion.div variants={springItem} className="relative z-10 flex flex-col items-center gap-3">
                                  <h4 className="text-2xl md:text-[27px] font-semibold text-white tracking-tight leading-[1.15]">
                                    Ask me anything about Maher
                                  </h4>
                                  <p className="text-sm text-white/45 leading-relaxed max-w-sm">
                                    His case studies, design process, the results he's driven, or how to work with him. I'll answer in seconds.
                                  </p>
                                </motion.div>

                                {/* Suggested prompt rows: a tap-to-ask launcher */}
                                <motion.div
                                  variants={staggerContainer}
                                  className="relative z-10 w-full mt-1 flex flex-col gap-2"
                                >
                                  {SUGGESTED_PROMPTS.map((prompt, index) => (
                                    <motion.button
                                      key={index}
                                      variants={springItem}
                                      onClick={() => handleSendMessage(prompt.label)}
                                      whileHover={{ y: -2 }}
                                      whileTap={{ scale: 0.98 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 26 }}
                                      className="group/prompt relative flex items-center gap-3 w-full text-left rounded-xl border border-white/[0.07] bg-white/[0.02] pl-2.5 pr-3.5 py-2.5 hover:border-white/20 hover:bg-white/[0.05] transition-colors duration-300 cursor-pointer overflow-hidden"
                                    >
                                      {/* Brand-tinted glow that blooms from the icon on hover */}
                                      <span className="pointer-events-none absolute -left-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[radial-gradient(closest-side,rgba(77,171,91,0.28),rgba(61,87,193,0.18)_45%,transparent_75%)] opacity-0 blur-md group-hover/prompt:opacity-100 transition-opacity duration-300" />
                                      <span className="relative flex-shrink-0 grid place-items-center w-9 h-9 rounded-lg border border-white/[0.06] bg-white/[0.03] text-white/40 group-hover/prompt:text-white group-hover/prompt:border-white/15 group-hover/prompt:bg-white/[0.07] transition-colors duration-300">
                                        <span className="w-4 h-4">{prompt.icon}</span>
                                      </span>
                                      <span className="relative flex-1 text-[13px] font-medium text-[#c5c5c5] group-hover/prompt:text-white transition-colors duration-300">
                                        {prompt.label}
                                      </span>
                                      <svg
                                        className="relative w-4 h-4 flex-shrink-0 text-white/30 opacity-0 -translate-x-1.5 group-hover/prompt:opacity-100 group-hover/prompt:translate-x-0 group-hover/prompt:text-white/70 transition-all duration-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                      </svg>
                                    </motion.button>
                                  ))}
                                </motion.div>
                              </motion.div>
                            ) : (
                              <div className="flex flex-col gap-8">
                                {messages.map((msg, index) => {
                                  if (msg.role === "user") {
                                    return (
                                      <div key={index} className="flex flex-col gap-1.5 max-w-[85%] self-end items-end">
                                        <div className="px-4 py-3.5 text-left bg-white/[0.05] text-[#e2e2e2] rounded-2xl rounded-tr-md shadow-[0_4px_16px_rgba(0,0,0,0.25)] text-sm font-medium leading-relaxed">
                                          {msg.content}
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div key={index} className="flex items-start gap-4 w-full self-start max-w-full my-4">
                                        {/* AI Icon */}
                                        <AIIcon className="w-8 h-8 mt-1" />
                                        {/* Message content - Containerless */}
                                        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                                          <div className="text-left text-[#e2e2e2] leading-relaxed text-sm mt-2">
                                            {renderMessageContent(msg.content)}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                })}
                              </div>
                            )}

                            {/* SSE Live Streaming thoughts console */}
                            {isTyping && (
                              <div className="flex items-start gap-4 w-full mt-6">
                                {/* AI Icon */}
                                <AIIcon className="w-8 h-8 mt-1" pulse />

                                {/* ChatGPT-style thinking block + streaming text */}
                                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                  {(currentThoughts.length > 0 || currentStatus) && (
                                    <ThoughtAccordion
                                      thoughts={currentThoughts}
                                      status={currentStatus}
                                      isLive={true}
                                    />
                                  )}
                                  {streamingText && (
                                    <div className="text-left text-[#e2e2e2] leading-relaxed text-sm mt-2">
                                      {renderMessageContent(streamingText)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* Queued message preview - sent automatically once the agent finishes */}
                            {queuedMessage && (
                              <div className="flex flex-col gap-1.5 max-w-[85%] self-end items-end mt-4 opacity-50">
                                <div className="px-4 py-3.5 text-left bg-white/[0.04] text-[#e2e2e2] rounded-2xl rounded-tr-none shadow-sm text-sm font-medium leading-relaxed">
                                  {queuedMessage}
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold pr-1">
                                  Queued
                                </span>
                              </div>
                            )}

                            {/* Spacing element to separate messages from the input box */}
                            <div className="h-16" />
                            <div ref={messagesEndRef} />
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Unified Input/Trigger Pill (Always mounted, morphs width directly without transform scale!) */}
      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isOpen) return;
          if (isTyping) {
            if (inputValue.trim()) {
              setQueuedMessage(inputValue.trim());
              setInputValue("");
            }
            return;
          }
          handleSendMessage(inputValue);
        }}
        onClick={() => {
          if (!isOpen) handleOpen();
        }}
        role={isOpen ? undefined : "button"}
        tabIndex={isOpen ? undefined : 0}
        aria-label={isOpen ? undefined : "Open Maher's Agent"}
        onKeyDown={(e) => {
          if (!isOpen && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleOpen();
          }
        }}
        style={{ borderRadius: "9999px", WebkitBackdropFilter: "blur(20px)" }}
        initial={{ y: 120, opacity: 0, bottom: 24 }}
        animate={{
          y: 0,
          opacity: 1,
          width: isOpen ? "min(672px, calc(100vw - 3rem))" : "190px",
          height: isOpen ? "56px" : "48px",
          bottom: (isOpen ? 32 : 24) + keyboardInset,
          backgroundColor: isOpen
            ? isInputFocused
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(255, 255, 255, 0.05)"
            : "rgba(255, 255, 255, 0.08)",
          borderColor: isOpen
            ? isInputFocused
              ? "rgba(255, 255, 255, 0.40)"
              : "rgba(255, 255, 255, 0.15)"
            : "rgba(255, 255, 255, 0.10)",
          boxShadow: isOpen
            ? isInputFocused
              ? "0 0 0 1px rgba(255, 255, 255, 0.06), 0 0 28px rgba(99, 102, 241, 0.18), 0 0 60px rgba(56, 189, 248, 0.08), 0 12px 40px rgba(0, 0, 0, 0.55)"
              : "0 10px 36px rgba(0, 0, 0, 0.5)"
            : "0 12px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 30px rgba(99, 102, 241, 0.14), 0 0 64px rgba(56, 189, 248, 0.06)",
          backdropFilter: isOpen ? "blur(24px)" : "blur(14px)",
        }}
        transition={chatLayoutTransition}
        className="group fixed bottom-6 left-1/2 -translate-x-1/2 z-55 flex items-center border cursor-pointer text-white overflow-hidden"
        whileHover={isOpen ? undefined : { scale: 1.05 }}
        whileTap={isOpen ? undefined : { scale: 0.95 }}
      >
        {!isOpen && <span className="chat-pill-sheen" aria-hidden="true" />}
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="trigger-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.15 } }}
              exit={{ opacity: 0, y: 15, transition: { delay: 0, duration: 0.12 } }}
              className="relative flex items-center gap-2.5 whitespace-nowrap pl-6 pr-6"
            >
              <AIIcon className="w-6 h-6" pulse />
              <span className="text-xs font-semibold tracking-wider uppercase whitespace-nowrap">Maher's Agent</span>
            </motion.div>
          ) : (
            <motion.div
              key="input-content"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isContentVisible ? 1 : 0,
                transition: {
                  delay: isContentVisible ? 0.25 : 0.3,
                  duration: 0.2
                }
              }}
              exit={{
                opacity: 0,
                transition: {
                  delay: 0,
                  duration: 0.12
                }
              }}
              className="relative w-full flex items-center"
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <AIIcon className="w-6 h-6" pulse={isTyping} />
              </span>
              <input
                type="text"
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder={
                  isTyping
                    ? queuedMessage
                      ? "Message queued, will send when ready..."
                      : "Agent is replying, you can keep typing..."
                    : `${PLACEHOLDER_PREFIX}${placeholderText}`
                }
                className="w-full bg-transparent pl-12 pr-14 py-4 text-sm text-white placeholder-white/45 outline-none rounded-full disabled:opacity-50"
              />
              <motion.button
                type="submit"
                disabled={!inputValue.trim()}
                whileHover={inputValue.trim() ? { scale: 1.08 } : undefined}
                whileTap={inputValue.trim() ? { scale: 0.92 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-[#eaeaea] text-black w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-30 disabled:scale-100 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.08)]"
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </>
  );
}
