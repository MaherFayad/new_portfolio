"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import ChatProjectCard from "./ChatProjectCard";
import ChatPluginCard from "./ChatPluginCard";
import ChatCertificateCard, { CERTIFICATES } from "./ChatCertificateCard";
import ChatExperienceTimeline from "./ChatExperienceTimeline";
import BookMeetingButton from "./BookMeetingButton";
import { PROJECTS } from "@/data/projects";
import { PLUGINS } from "@/data/plugins";
import MobileHorizontalScroll from "./MobileHorizontalScroll";

// Free-tier models occasionally hallucinate a slug or malform a tag. Validate every
// card tag against these whitelists before rendering so a bad slug is stripped instead
// of showing a broken card or leaking raw bracket text into the chat.
const PROJECT_SLUGS = PROJECTS.map((p) => p.slug);
const PLUGIN_SLUGS = PLUGINS.map((p) => p.slug);
const CERTIFICATE_SLUGS = CERTIFICATES.map((c) => c.slug);

const VALID_PROJECT_SLUGS = new Set(PROJECT_SLUGS);
const VALID_PLUGIN_SLUGS = new Set(PLUGIN_SLUGS);
const VALID_CERTIFICATE_SLUGS = new Set(CERTIFICATE_SLUGS);

// Case/punctuation-insensitive form ("al-rajhi-bank-payroll" and "AlrajhiBankPayroll" both
// collapse to "alrajhibankpayroll") so near-miss separators or casing still resolve.
const normalizeSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

// Every slug that owns a card, normalized, for recognising a bare "[slug]" bracket.
const ALL_CARD_SLUGS = new Set(
  [...PROJECT_SLUGS, ...PLUGIN_SLUGS, ...CERTIFICATE_SLUGS].map(normalizeSlug),
);

const buildNormalizedMap = (slugs: string[]) => {
  const map = new Map<string, string>();
  for (const slug of slugs) map.set(normalizeSlug(slug), slug);
  return map;
};

const PROJECT_SLUGS_NORMALIZED = buildNormalizedMap(PROJECT_SLUGS);
const PLUGIN_SLUGS_NORMALIZED = buildNormalizedMap(PLUGIN_SLUGS);
const CERTIFICATE_SLUGS_NORMALIZED = buildNormalizedMap(CERTIFICATE_SLUGS);

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Resolves a model-provided slug against a whitelist: exact match, then normalized
// (case/punctuation-insensitive) match, then a capped edit-distance match as a last resort
// for typos. Returns null if nothing is close enough, so the tag is stripped rather than
// rendering the wrong card.
// `allowFuzzy` is off for untagged `[slug]` brackets: there the bracket content is only a
// guess at being a card, so an edit-distance match would happily turn prose like "[nft]"
// into the "lfg" card. Explicit `[ProjectCard: ...]` tags keep the typo tolerance.
const resolveSlug = (
  rawSlug: string,
  validSlugs: Set<string>,
  normalizedMap: Map<string, string>,
  allowFuzzy = true,
): string | null => {
  if (validSlugs.has(rawSlug)) return rawSlug;

  const normalized = normalizeSlug(rawSlug);
  const normalizedMatch = normalizedMap.get(normalized);
  if (normalizedMatch) return normalizedMatch;

  if (!allowFuzzy) return null;

  // Flat cap, not scaled by slug length: real model typos (a dropped hyphen, a swapped
  // letter, truncation) land at distance 1-3 regardless of how long the slug is. Also
  // require the winner to clearly beat the runner-up — an ambiguous near-tie (e.g. this
  // project set's own "pexlp" vs "pelxp") should strip the tag rather than coin-flip it.
  const MAX_TYPO_DISTANCE = 2;
  let best: string | null = null;
  let bestDistance = Infinity;
  let secondBestDistance = Infinity;
  for (const [candidateNormalized, candidateSlug] of normalizedMap) {
    const distance = levenshtein(normalized, candidateNormalized);
    if (distance < bestDistance) {
      secondBestDistance = bestDistance;
      bestDistance = distance;
      best = candidateSlug;
    } else if (distance < secondBestDistance) {
      secondBestDistance = distance;
    }
  }
  if (!best || bestDistance > MAX_TYPO_DISTANCE) return null;
  if (secondBestDistance - bestDistance < 2) return null;

  // Logged (not sent anywhere) so a model that consistently mangles one slug shows up in
  // the browser console — the real fix is tightening the prompt, not leaning on this fallback.
  console.debug(`[chat] fuzzy-resolved card slug "${rawSlug}" -> "${best}" (distance ${bestDistance})`);
  return best;
};

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

const SUGGESTED_PROMPTS: { label: string; icon: React.ReactNode; cannedResponse?: string }[] = [
  {
    label: "Show me some of his work",
    // Deterministic gallery: skips the LLM and renders these four case studies directly.
    cannedResponse:
      "Here's a quick look at some of his work, spanning fintech, healthcare, consumer, and developer tools: [ProjectCard: alrajhi-bank-payroll][ProjectCard: sanarte][ProjectCard: lfg][ProjectCard: deployo]",
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
    cannedResponse:
      "Maher's work has driven measurable, outcome-first results for both enterprise clients and startups:\n\n• **Al Rajhi Bank**: Part of the team that redesigned the payroll and e-business platforms, contributing to a +47% boost in digital account openings and +81% in transaction volumes.\n• **Theradome**: Relaunched their e-commerce funnel, driving a +32% increase in sales conversion.\n• **LFG App**: Simplified onboarding, leading to a 28% drop in sign-up abandonment.\n\n[ProjectCard: alrajhi-bank-payroll][ProjectCard: lfg]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    label: "Is he available for new opportunities?",
    cannedResponse:
      "Maher is currently open to new freelance opportunities. Reach out at Contact@maherfayad.com or book a 30-minute call through the link below. [BookMeetingButton]",
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



// Human-readable description of the page the user is currently viewing, sent with each
// chat request so the agent can say "you're already here" instead of handing back a link.
// Only the raw pathname is sent to the backend; the backend maps it to the
// descriptive sentence itself from a fixed whitelist so client-controlled text
// never gets interpolated directly into the LLM system prompt.
function getCurrentPagePath(): string {
  if (typeof window === "undefined") return "/";
  return window.location.pathname;
}

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
    text: "Maher has published four Figma plugins. [PluginCard: primitive-semantic-colors-generator][PluginCard: numeric-tokens-generator][PluginCard: swap-all-variables][PluginCard: missing-variable-finder]",
  },
  mixed: {
    thoughts: ["Compiling a mixed recommendation..."],
    text: "Here's a project and a tool that pair well together. [ProjectCard: alrajhi-bank-payroll][PluginCard: numeric-tokens-generator]",
  },
  booking: {
    thoughts: ["Preparing contact details..."],
    text: "You can reach Maher directly via email (Contact@maherfayad.com) or book time on his calendar. [BookMeetingButton]",
  },
  timeline: {
    thoughts: ["Pulling up his career history...", "Building the timeline..."],
    text: "Here's a snapshot of Maher's career so far, most recent first: [ExperienceTimeline]",
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

// Silly, throwaway placeholder lines shown while the agent is "thinking" — purely for fun,
// swapped in on top of the real (meaningful) status/thoughts pipeline below.
const FUNNY_THINKING_MESSAGES: string[] = [
  "Spelunking through a cave system for clues...",
  "Battling a dragon guarding the answer...",
  "Bribing a wizard for portfolio secrets...",
  "Consulting the ancient scrolls of Figma...",
  "Riding a unicorn to the nearest data center...",
  "Negotiating with a sphinx for the riddle's answer...",
  "Digging through a goblin's treasure hoard...",
  "Asking a fortune teller very nicely...",
  "Untangling a ball of yarn the size of a planet...",
  "Racing a cheetah to the finish line of knowledge...",
  "Bartering with pirates for the treasure map...",
  "Climbing Mount Everest for better wifi signal...",
  "Deciphering hieroglyphics in a pyramid...",
  "Outsmarting a riddle-loving troll under a bridge...",
  "Summoning a genie for three wishes (used one already)...",
  "Sailing across the seven seas of the internet...",
  "Wrestling an octopus for the last puzzle piece...",
  "Chasing a runaway thought through a labyrinth...",
  "Interrogating a very stubborn parrot...",
  "Taming a wild database with a lasso...",
  "Sneaking past a sleeping giant for the answer key...",
  "Trading secrets with a talking raven...",
  "Excavating an ancient server room...",
  "Solving a Rubik's Cube blindfolded for fun...",
  "Outrunning an avalanche of ideas...",
  "Consulting a crystal ball (it's a bit foggy)...",
  "Herding cats toward the correct answer...",
  "Building a rocket ship to reach the cloud faster...",
  "Playing chess with a very smug owl...",
  "Mining for gold nuggets of wisdom...",
  "Escaping a maze of endless browser tabs...",
  "Asking the office plant for its opinion...",
  "Charming a snake to reveal the secret...",
  "Fixing a time machine to fetch the answer sooner...",
  "Decoding a message in a bottle...",
  "Balancing on a tightrope over a pit of bugs...",
  "Petting a dragon until it shares its hoard...",
  "Negotiating a truce with a grumpy printer...",
  "Flying a paper airplane to the archives...",
  "Whispering to the rubber duck for guidance...",
];

const MOCK_HELP_TEXT = `Mock test commands (dev only, no tokens used):
/mock project — single project card
/mock projects — multiple project cards (horizontal scroll)
/mock plugin — single Figma plugin card
/mock plugins — multiple plugin cards (horizontal scroll)
/mock mixed — project + plugin card together
/mock booking — booking button
/mock timeline — experience timeline card
/mock long — long response (scroll test)
/mock thinking — long live-thinking sequence
/mock error — simulated network error
/mock ratelimit — simulated 429 rate limit`;

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.7,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.08,
      staggerDirection: -1,
      when: "afterChildren"
    }
  }
};

const nestedStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren"
    }
  }
};

const messageListContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.5,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
      when: "afterChildren"
    }
  }
};

const springItem = {
  hidden: { y: -24, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
      mass: 0.8,
    }
  },
  exit: {
    y: -24,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut" as const
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
  funnyText?: string;
}

function ThoughtAccordion({ thoughts, status, isLive = false, funnyText }: ThoughtAccordionProps) {
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

  // Single line, no spinner, text fades in and out (pulse). The gag rotator (funnyText) takes
  // priority over the real scripted status/thoughts — it's just for fun while the user waits.
  const activeText = funnyText
    ? funnyText
    : formattedThoughts.length > 0
      ? formattedThoughts[formattedThoughts.length - 1]
      : displayStatus;

  return (
    <div className="flex items-center gap-2.5 w-full my-2 text-left">
      <AnimatePresence mode="wait">
        <motion.span
          key={activeText}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="text-xs text-white/40 font-semibold tracking-wide"
        >
          {activeText}
        </motion.span>
      </AnimatePresence>
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
  //.
  return parts.map((part, idx) => {
    if (part.toLowerCase() === "contact@maherfayad.com") {
      return <EmailCopyButton key={idx} email={part} />;
    }
    return part;
  });
};

// Model output is untrusted (prompt injection, or a rogue free-tier model), so any
// [text](url) it emits is scheme-checked before being rendered as a real <a href>.
const isSafeUrl = (url: string) =>
  /^https?:\/\//i.test(url) || /^mailto:/i.test(url) || (url.startsWith("/") && !url.startsWith("//"));

// While a message is still streaming in, a card/button tag may arrive partway through
// (e.g. "[ProjectCard: alr"). Trim any trailing unclosed "[...]" so it doesn't flash as
// raw bracket text before the closing "]" streams in.
const stripTrailingUnclosedTag = (text: string) => {
  const lastOpen = text.lastIndexOf("[");
  if (lastOpen === -1 || text.indexOf("]", lastOpen) !== -1) return text;
  return text.slice(0, lastOpen);
};

const parseMarkdown = (text: string, onLinkClick?: () => void) => {
  // 1. Split by link pattern [text](url)
  const linkRegex = /(\[.*?\]\(.*?\))/g;
  const parts = text.split(linkRegex);

  const result: React.ReactNode[] = [];

  parts.forEach((part, idx) => {
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      // Extract text and url
      const closeBracketIdx = part.indexOf("](");
      const linkText = part.slice(1, closeBracketIdx);
      const linkUrl = part.slice(closeBracketIdx + 2, -1);

      if (!isSafeUrl(linkUrl)) {
        result.push(linkText);
        return;
      }

      // Check if it is an external link (like linkedin or Cal)
      const isExternal = linkUrl.startsWith("http") || linkUrl.startsWith("www");

      result.push(
        <a
          key={`link-${idx}`}
          href={linkUrl}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          onClick={() => {
            if (!isExternal && onLinkClick) {
              onLinkClick();
            }
          }}
          className="text-white underline hover:text-[#c5c5c5] transition-colors font-semibold"
        >
          {linkText}
        </a>
      );
    } else {
      // 2. Split by bold pattern **text**
      const boldRegex = /(\*\*.*?\*\*)/g;
      const subParts = part.split(boldRegex);

      subParts.forEach((subPart, subIdx) => {
        if (subPart.startsWith("**") && subPart.endsWith("**")) {
          const boldText = subPart.slice(2, -2);
          result.push(
            <strong key={`bold-${idx}-${subIdx}`} className="font-bold text-white">
              {boldText}
            </strong>
          );
        } else {
          // 3. Split by italic pattern *text*
          const italicRegex = /(\*.*?\*)/g;
          const italicParts = subPart.split(italicRegex);

          italicParts.forEach((italicPart, italicIdx) => {
            if (italicPart.startsWith("*") && italicPart.endsWith("*")) {
              const italicText = italicPart.slice(1, -1);
              result.push(
                <em key={`italic-${idx}-${subIdx}-${italicIdx}`} className="italic font-bold text-white">
                  {italicText}
                </em>
              );
            } else {
              // 4. Split by site path pattern /about, /work, /contacts, /projects/<slug>
              const pathRegex = /(\/projects\/[a-z0-9-]+|\/(?:about|work|contacts)\b)/gi;
              const pathParts = italicPart.split(pathRegex);

              pathParts.forEach((pathPart, pathIdx) => {
                if (pathPart.match(/^\/projects\/[a-z0-9-]+$|^\/(about|work|contacts)$/i)) {
                  result.push(
                    <Link
                      key={`path-${idx}-${subIdx}-${italicIdx}-${pathIdx}`}
                      href={pathPart.toLowerCase()}
                      onClick={onLinkClick}
                      className="text-white underline hover:text-[#c5c5c5] transition-colors font-semibold"
                    >
                      {pathPart}
                    </Link>
                  );
                } else {
                  // 5. Parse emails
                  const emailParsed = parseEmail(pathPart);
                  if (Array.isArray(emailParsed)) {
                    result.push(...emailParsed);
                  } else {
                    result.push(emailParsed);
                  }
                }
              });
            }
          });
        }
      });
    }
  });

  return result;
};

// parseMarkdown only handles inline runs (bold/italic/links/etc.) inside a single line — a
// "* item" or "- item" line was previously left as literal text with the marker character
// still attached. This groups consecutive bullet lines into a real <ul><li> list and
// non-bullet lines into paragraphs, running each line's inline content through parseMarkdown.
const renderTextBlock = (text: string, onLinkClick?: () => void) => {
  const lines = text.split("\n");
  const blocks: Array<{ type: "list"; items: string[] } | { type: "para"; lines: string[] }> = [];

  for (const line of lines) {
    const bulletMatch = line.match(/^\s*[*\-•]\s+(.*)$/);
    const last = blocks[blocks.length - 1];
    if (bulletMatch) {
      if (last && last.type === "list") {
        last.items.push(bulletMatch[1]);
      } else {
        blocks.push({ type: "list", items: [bulletMatch[1]] });
      }
    } else if (last && last.type === "para") {
      last.lines.push(line);
    } else {
      blocks.push({ type: "para", lines: [line] });
    }
  }

  return blocks.map((block, idx) => {
    if (block.type === "list") {
      return (
        <ul key={idx} className="list-disc pl-5 space-y-1 my-1">
          {block.items.map((item, itemIdx) => (
            <li key={itemIdx}>{parseMarkdown(item, onLinkClick)}</li>
          ))}
        </ul>
      );
    }
    const paraText = block.lines.join("\n").trim();
    if (!paraText) return null;
    return (
      <p key={idx} className="whitespace-pre-wrap">
        {parseMarkdown(paraText, onLinkClick)}
      </p>
    );
  });
};

function ChatHorizontalScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;

    const isScrollable = el.scrollWidth > el.clientWidth;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10 && isScrollable);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    const timer = setTimeout(updateArrows, 200);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
      clearTimeout(timer);
    };
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 240; // Roughly the width of one card + gap
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/scroll w-full">
      {/* Left Arrow Button */}
      {showLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 hidden lg:flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-[#151515]/80 text-white/70 hover:text-white hover:bg-[#202020] hover:scale-105 transition-all cursor-pointer shadow-md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Scroll Container */}
      <MobileHorizontalScroll ref={scrollRef} className="-mx-1 px-1">
        {children}
      </MobileHorizontalScroll>

      {/* Right Arrow Button */}
      {showRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 hidden lg:flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-[#151515]/80 text-white/70 hover:text-white hover:bg-[#202020] hover:scale-105 transition-all cursor-pointer shadow-md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function ChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [queuedMessage, setQueuedMessage] = useState<string | null>(null);
  const [currentThoughts, setCurrentThoughts] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState("");
  const [funnyThinking, setFunnyThinking] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  // Screen-reader announcement for completed assistant replies only (real, canned, or
  // error). Deliberately not wired to streamingText — announcing every incoming token
  // would be unusable with a screen reader.
  const [announcement, setAnnouncement] = useState("");
  const announceReply = (text: string) => setAnnouncement(text.replace(/\[[^\]]*\]/g, "").trim());

  useEffect(() => {
    if (typeof window !== "undefined") {
      let id = sessionStorage.getItem("maher_chat_session_id");
      if (!id) {
        id = typeof crypto !== "undefined" && crypto.randomUUID 
          ? crypto.randomUUID() 
          : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem("maher_chat_session_id", id);
      }
      setSessionId(id);
    }
  }, []);

  const [keyboardInset, setKeyboardInset] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const contentColumnRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerFormRef = useRef<HTMLFormElement>(null);
  const triggerReturnFocusRef = useRef<HTMLElement | null>(null);

  const handleOpen = () => {
    setIsOpen(true);
    setIsContentVisible(true);
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "chat_open", {
        event_category: "chat",
      });
    }
  };

  const handleClose = () => {
    setIsContentVisible(false);
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "chat_close", {
        event_category: "chat",
      });
    }
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  // Basic focus trap while the dialog is open. The input pill (triggerFormRef) is a DOM
  // sibling of the overlay, not a child of it — it stays mounted the whole time so it can
  // morph in place — so the trap has to span both refs or keyboard users get locked out of
  // the input itself. On close, focus returns to whatever had it before opening (WCAG 2.4.3),
  // not hardcoded to the pill, since the chat could gain other entry points later.
  useEffect(() => {
    if (!isOpen) return;
    triggerReturnFocusRef.current = document.activeElement as HTMLElement;

    const getFocusables = () => {
      const sel = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
      return [
        ...(dialogRef.current?.querySelectorAll<HTMLElement>(sel) ?? []),
        ...(triggerFormRef.current?.querySelectorAll<HTMLElement>(sel) ?? []),
      ].filter((el) => el.offsetParent !== null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = getFocusables();
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement;

      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!dialogRef.current?.contains(active) && !triggerFormRef.current?.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerReturnFocusRef.current?.focus();
    };
  }, [isOpen]);

  // Dismiss the chat when the user clicks well clear of the content column (the empty
  // side gutters). A generous horizontal margin is required so clicks near the
  // conversation, cards, or buttons never close it by accident.
  const SAFE_DISMISS_MARGIN = 160;
  const handleOutsideClick = (e: React.MouseEvent) => {
    const column = contentColumnRef.current;
    if (!column) return;
    // Don't dismiss if the user was selecting text and released in the gutter
    if (window.getSelection()?.toString()) return;
    const rect = column.getBoundingClientRect();
    const clickedFarLeft = e.clientX < rect.left - SAFE_DISMISS_MARGIN;
    const clickedFarRight = e.clientX > rect.right + SAFE_DISMISS_MARGIN;
    if (clickedFarLeft || clickedFarRight) {
      handleClose();
    }
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

  // Silly "thinking" placeholder rotator — shuffles through FUNNY_THINKING_MESSAGES every 2s
  // while the agent is typing (mocked or real, doesn't matter), purely for fun. Stops once
  // actual content starts streaming in.
  useEffect(() => {
    if (!isTyping || streamingText) {
      setFunnyThinking("");
      return;
    }

    const pickRandom = (previous: string) => {
      if (FUNNY_THINKING_MESSAGES.length <= 1) return FUNNY_THINKING_MESSAGES[0] ?? "";
      let next = previous;
      while (next === previous) {
        next = FUNNY_THINKING_MESSAGES[Math.floor(Math.random() * FUNNY_THINKING_MESSAGES.length)];
      }
      return next;
    };

    setFunnyThinking((prev) => pickRandom(prev));
    const interval = setInterval(() => {
      setFunnyThinking((prev) => pickRandom(prev));
    }, 2000);

    return () => clearInterval(interval);
  }, [isTyping, streamingText]);

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

  // Every reply — mocked or real — waits at least this long before the final content is
  // revealed, so the funny thinking rotator always gets a beat to be seen (never flashes by).
  const MIN_THINKING_MS = 2000;
  const ensureMinThinking = async (startedAt: number) => {
    const elapsed = Date.now() - startedAt;
    if (elapsed < MIN_THINKING_MS) {
      await new Promise((resolve) => setTimeout(resolve, MIN_THINKING_MS - elapsed));
    }
  };

  // Dev-only: simulate SSE responses locally so UI states can be tested without
  // hitting the backend or spending LLM tokens. Trigger with "/mock <key>".
  const handleMockMessage = async (text: string) => {
    const key = text.slice("/mock".length).trim().toLowerCase();
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const thinkingStart = Date.now();

    setInputValue("");
    setIsTyping(true);
    setStreamingText("");
    setCurrentThoughts([]);
    setCurrentStatus("Connecting to representative board...");
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      if (key === "error") {
        await delay(500);
        await ensureMinThinking(thinkingStart);
        throw new Error("Failed to communicate with representative server.");
      }
      if (key === "ratelimit" || key === "rate-limit" || key === "429") {
        await delay(500);
        await ensureMinThinking(thinkingStart);
        const rateLimitMsg = "I'm receiving a high volume of queries at the moment. While I take a brief breath, feel free to review some of my projects below, reach out directly at Contact@maherfayad.com, or book a call on my calendar. [ProjectCard: alrajhi-bank-payroll][ProjectCard: lfg][BookMeetingButton]";
        setMessages((prev) => [...prev, { role: "assistant", content: rateLimitMsg }]);
        announceReply(rateLimitMsg);
        return;
      }

      const scenario = MOCK_SCENARIOS[key];
      if (!scenario) {
        await delay(300);
        await ensureMinThinking(thinkingStart);
        setMessages((prev) => [...prev, { role: "assistant", content: MOCK_HELP_TEXT }]);
        announceReply(MOCK_HELP_TEXT);
        return;
      }

      for (const thought of scenario.thoughts) {
        setCurrentStatus(thought);
        setCurrentThoughts((prev) => [...prev, thought]);
        await delay(400);
      }

      await ensureMinThinking(thinkingStart);

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
      announceReply(scenario.text);
    } catch (err: any) {
      const errorMsg = err.message || "An unexpected error occurred. Please try again.";
      announceReply(errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMsg,
          status: "Error",
        },
      ]);
    } finally {
      setIsTyping(false);
      setCurrentStatus("");
      setCurrentThoughts([]);
    }
  };

  // Suggested prompts may carry a deterministic canned response (no LLM call). We still
  // play a brief "thinking" beat so it feels like the live agent rather than an instant dump.
  const handleSuggestedPrompt = async (prompt: { label: string; cannedResponse?: string }) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "chat_suggested_prompt_click", {
        event_category: "chat",
        event_label: prompt.label,
      });
    }
    if (!prompt.cannedResponse) {
      handleSendMessage(prompt.label);
      return;
    }
    if (isTyping) return;

    const thinkingStart = Date.now();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: prompt.label }]);
    setIsTyping(true);
    setStreamingText("");
    setCurrentThoughts([]);
    setCurrentStatus("Pulling together a few highlights...");

    await ensureMinThinking(thinkingStart);

    setMessages((prev) => [...prev, { role: "assistant", content: prompt.cannedResponse! }]);
    announceReply(prompt.cannedResponse!);
    setIsTyping(false);
    setCurrentStatus("");
    setCurrentThoughts([]);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "chat_message_sent", {
        event_category: "chat",
      });
    }

    if (process.env.NODE_ENV !== "production" && text.trim().toLowerCase().startsWith("/mock")) {
      await handleMockMessage(text.trim());
      return;
    }

    // Reset input
    const thinkingStart = Date.now();
    setInputValue("");
    setIsTyping(true);
    setStreamingText("");
    setCurrentThoughts([]);
    setCurrentStatus("Connecting to representative board...");

    // 1. Append User Message
    const updatedMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(updatedMessages);

    // 2. Format Chat History from PRIOR turns only (the current question is sent as `prompt`).
    // Sent as a structured {role, content} array (not a parsed string) so multiline,
    // bulleted assistant replies survive intact. We strip widget tags ([ProjectCard: ...],
    // [BookMeetingButton], etc.) since they are UI noise the model does not need, and cap
    // to the most recent turns to stay lean.
    // The bare-slug pass matters beyond tidiness: feeding "[lfg]" back as history teaches
    // the model that the prefix-less form is acceptable, which is how the malformed tags
    // spread across a conversation in the first place.
    const sanitizeForHistory = (content: string) =>
      content
        .replace(/\[(?:ProjectCard|PluginCard|CertificateCard):[^\]]*\]/g, "")
        .replace(/\[(?:BookMeetingButton|ExperienceTimeline)\]/g, "")
        .replace(/\[\s*([a-z0-9][a-z0-9 _-]{1,60}?)\s*\](?!\()/gi, (whole, slug: string) =>
          ALL_CARD_SLUGS.has(normalizeSlug(slug)) ? "" : whole,
        )
        .replace(/[ \t]+/g, " ")
        .trim();

    const chatHistory = messages
      .slice(-8)
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: sanitizeForHistory(msg.content),
      }))
      .filter((turn) => turn.content.length > 0);

    try {
      // 3. Make POST SSE stream request
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: text,
          history: chatHistory,
          page: getCurrentPagePath(),
          session_id: sessionId,
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
      let hasShownFirstResult = false;

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
              if (!hasShownFirstResult) {
                hasShownFirstResult = true;
                await ensureMinThinking(thinkingStart);
              }
              assistantText += data.replace(/\\n/g, "\n");
              setStreamingText(assistantText);
            } else if (currentEvent === "error") {
              throw new Error(data.trim());
            }
          }
        }
      }

      // 4. Append Assistant Final Response
      const finalReply = assistantText || "Hmm, I came back empty-handed. Try rephrasing?";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: finalReply,
          thoughts: thoughtsList,
        },
      ]);
      announceReply(finalReply);
    } catch (err: any) {
      const errText = (err.message || "").toLowerCase();
      const isRateLimitOrConnectionError =
        errText.includes("rate limit") ||
        errText.includes("failed to communicate") ||
        errText.includes("fetch") ||
        errText.includes("network");

      const fallbackMsg = isRateLimitOrConnectionError
        ? "I'm receiving a high volume of queries at the moment. While I take a brief breath, feel free to review some of my projects below, reach out directly at Contact@maherfayad.com, or book a call on my calendar. [ProjectCard: alrajhi-bank-payroll][ProjectCard: lfg][BookMeetingButton]"
        : (err.message || "An unexpected error occurred. Please try again.");

      await ensureMinThinking(thinkingStart);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallbackMsg,
          status: isRateLimitOrConnectionError ? undefined : "Error",
        },
      ]);
      announceReply(fallbackMsg);
    } finally {
      setIsTyping(false);
      setCurrentStatus("");
      setCurrentThoughts([]);
    }
  };

  // Helper to parse project tags [ProjectCard: slug], plugin tags [PluginCard: slug], certificate tags [CertificateCard: slug], and booking buttons [BookMeetingButton]
  const renderMessageContent = (text: string) => {
    // Tolerate case and whitespace variance around the tag name/colon (free models aren't
    // perfectly consistent), but every slug is validated against a whitelist below — an
    // unknown slug is stripped rather than shown as a broken card or raw bracket text.
    // The final alternative catches the bare `[alrajhi-bank-payroll]` form: free models
    // routinely drop the "ProjectCard:" prefix and emit just the slug, which used to fall
    // through and render as literal bracket text. The negative lookahead leaves markdown
    // links like `[LinkedIn](https://...)` alone, and the slug still has to match a known
    // card exactly (no fuzzy matching) or it is left as plain text.
    const regex = /\[\s*(ProjectCard|PluginCard|CertificateCard)\s*:\s*([^\]]+?)\s*\]|\[\s*(ExperienceTimeline|BookMeetingButton)\s*\]|\[\s*([a-z0-9][a-z0-9 _-]{1,60}?)\s*\](?!\()/gi;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const textBefore = text.substring(lastIndex, match.index);
      // Whitespace between two cards is noise and gets dropped, but whitespace between two
      // text runs is a real word gap: keep it when the previous part was also text, so an
      // unresolved bracket mid-sentence doesn't silently eat the space around it.
      const previousPart = parts[parts.length - 1];
      if (textBefore.trim() || (textBefore && previousPart?.type === "text")) {
        parts.push({ type: "text", content: textBefore });
      }

      if (match[3] !== undefined) {
        const standalone = match[3].toLowerCase();
        if (standalone === "bookmeetingbutton") {
          parts.push({ type: "booking" });
        } else if (standalone === "experiencetimeline") {
          parts.push({ type: "timeline" });
        }
      } else if (match[4] !== undefined) {
        // Untagged bracket: try each whitelist in turn, and if none owns the slug put the
        // original text back verbatim so genuine prose in brackets survives untouched.
        const bare = match[4].trim();
        const project = resolveSlug(bare, VALID_PROJECT_SLUGS, PROJECT_SLUGS_NORMALIZED, false);
        const plugin = project ? null : resolveSlug(bare, VALID_PLUGIN_SLUGS, PLUGIN_SLUGS_NORMALIZED, false);
        const certificate = project || plugin ? null : resolveSlug(bare, VALID_CERTIFICATE_SLUGS, CERTIFICATE_SLUGS_NORMALIZED, false);

        if (project) parts.push({ type: "card", slug: project });
        else if (plugin) parts.push({ type: "plugin", slug: plugin });
        else if (certificate) parts.push({ type: "certificate", slug: certificate });
        else parts.push({ type: "text", content: match[0] });
      } else {
        const tagType = match[1].toLowerCase();
        const rawSlug = match[2].trim();
        if (tagType === "projectcard") {
          const slug = resolveSlug(rawSlug, VALID_PROJECT_SLUGS, PROJECT_SLUGS_NORMALIZED);
          if (slug) parts.push({ type: "card", slug });
        } else if (tagType === "plugincard") {
          const slug = resolveSlug(rawSlug, VALID_PLUGIN_SLUGS, PLUGIN_SLUGS_NORMALIZED);
          if (slug) parts.push({ type: "plugin", slug });
        } else if (tagType === "certificatecard") {
          const slug = resolveSlug(rawSlug, VALID_CERTIFICATE_SLUGS, CERTIFICATE_SLUGS_NORMALIZED);
          if (slug) parts.push({ type: "certificate", slug });
        }
        // else: nothing close enough in the whitelist — silently drop the tag
      }
      lastIndex = regex.lastIndex;
    }

    const textAfter = text.substring(lastIndex);
    if (textAfter.trim()) {
      parts.push({ type: "text", content: textAfter });
    }

    if (parts.length === 0) {
      return (
        <div className="text-sm leading-relaxed text-[#c5c5c5] font-medium flex flex-col gap-1">
          {renderTextBlock(text, handleClose)}
        </div>
      );
    }

    // Group consecutive project/plugin/certificate cards so multiple recommendations scroll horizontally
    const groupedParts: Array<{ type: string; content?: string; slugs?: string[] }> = [];
    for (const part of parts) {
      if ((part.type === "card" || part.type === "plugin" || part.type === "certificate") && part.slug) {
        const groupType = part.type === "plugin"
          ? "pluginGroup"
          : part.type === "certificate"
          ? "certificateGroup"
          : "cardGroup";
        const last = groupedParts[groupedParts.length - 1];
        if (last && last.type === groupType) {
          last.slugs!.push(part.slug);
        } else {
          groupedParts.push({ type: groupType, slugs: [part.slug] });
        }
      } else {
        // Re-join consecutive text runs. Each entry renders as its own block in a
        // flex-col, so a sentence containing an unrecognised bracket must come back
        // together here or it would stack as separate gapped lines.
        const last = groupedParts[groupedParts.length - 1];
        if (part.type === "text" && last?.type === "text") {
          last.content = (last.content ?? "") + (part.content ?? "");
        } else {
          groupedParts.push(part);
        }
      }
    }

    return (
      <div className="flex flex-col gap-2">
        {groupedParts.map((part, idx) => {
          if ((part.type === "cardGroup" || part.type === "pluginGroup" || part.type === "certificateGroup") && part.slugs) {
            const CardComponent = part.type === "pluginGroup"
              ? ChatPluginCard
              : part.type === "certificateGroup"
              ? ChatCertificateCard
              : ChatProjectCard;
            if (part.slugs.length === 1) {
              return <CardComponent key={idx} slug={part.slugs[0]} onNavigate={handleClose} />;
            }
            return (
              <ChatHorizontalScroll key={idx}>
                {part.slugs.map((slug, slugIdx) => (
                  <CardComponent key={`${slug}-${slugIdx}`} slug={slug} onNavigate={handleClose} compact />
                ))}
              </ChatHorizontalScroll>
            );
          }
          if (part.type === "timeline") {
            return <ChatExperienceTimeline key={idx} />;
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
            <div key={idx} className="text-sm leading-relaxed text-[#c5c5c5] font-medium flex flex-col gap-1">
              {renderTextBlock(part.content || "", handleClose)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <MotionConfig reducedMotion="user">
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

      {/* Screen-reader-only announcement for completed assistant replies (see announceReply) */}
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>

      {/* 1. Fullscreen Chat Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-overlay"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Ask Maher chat"
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

                        {/* Messages Scroll Area - spans full width for scrollbar on the far-right.
                            Clicking far out in the side gutters dismisses the chat. */}
                        <div
                          ref={chatContainerRef}
                          onClick={handleOutsideClick}
                          tabIndex={0}
                          aria-label="Conversation"
                          className="flex-1 overflow-y-auto chat-scroll-container w-full"
                        >
                          {/* Inner Centered Container - anchored to bottom, grows upward */}
                          <div
                            ref={contentColumnRef}
                            className={`max-w-3xl mx-auto w-full px-6 md:px-12 pt-24 md:pt-28 pb-36 flex flex-col min-h-full ${messages.length === 0 ? "justify-center" : "justify-end"
                              }`}
                          >

                            {messages.length === 0 ? (
                              <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                className="relative flex flex-col justify-center items-start gap-6 px-4 max-w-3xl mx-auto text-left w-full"
                              >
                                <motion.div
                                  variants={springItem}
                                  className="relative z-10 w-16 h-16"
                                >
                                  <img
                                    src="/assets/Maher-cropped.png"
                                    alt="Maher Fayad"
                                    className="avatar-photo relative z-10 w-full h-full object-contain"
                                    style={{ transform: "scaleX(-1)" }}
                                  />
                                  {/* AI sparkle badge anchored to the avatar */}
                                  <span className="absolute z-20 -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#0a0a0b] border border-white/10 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                                    <AIIcon className="w-3.5 h-3.5" />
                                  </span>
                                </motion.div>

                                <motion.div variants={springItem} className="relative z-10 flex flex-col items-start gap-2">
                                  <h4 className="text-2xl md:text-[28px] font-bold text-white tracking-tight leading-[1.15]">
                                    Ask me anything about Maher
                                  </h4>
                                  <p className="text-[14px] text-white/50 leading-relaxed max-w-md">
                                    His case studies, design process, the results he's driven, or how to work with him. I'll answer in seconds.
                                  </p>
                                </motion.div>

                                {/* Suggested prompt rows: a tap-to-ask launcher (grid layout for side-by-side cards) */}
                                <div
                                  className="relative z-10 w-full mt-2 grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                  {SUGGESTED_PROMPTS.map((prompt, index) => (
                                    <motion.button
                                      key={index}
                                      variants={springItem}
                                      onClick={() => handleSuggestedPrompt(prompt)}
                                      whileHover={{ y: -4 }}
                                      whileTap={{ scale: 0.98 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 26 }}
                                      className="group/prompt relative flex flex-row md:flex-col items-center md:items-start justify-start md:justify-between gap-3.5 md:gap-6 w-full text-left rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 md:p-5 hover:border-white/20 hover:bg-white/[0.05] transition-colors duration-300 cursor-pointer overflow-hidden shadow-sm min-h-[56px] md:min-h-[150px]"
                                    >
                                      {/* Brand-tinted glow that blooms from the icon on hover */}
                                      <span className="pointer-events-none absolute -left-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[radial-gradient(closest-side,rgba(77,171,91,0.2),rgba(61,87,193,0.12)_45%,transparent_75%)] opacity-0 blur-md group-hover/prompt:opacity-100 transition-opacity duration-300" />

                                      <span className="relative flex-shrink-0 text-white/50 group-hover/prompt:text-white transition-colors duration-300">
                                        <span className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 block">{prompt.icon}</span>
                                      </span>

                                      <div className="relative flex-1 md:w-full flex flex-row items-center md:items-end justify-between gap-2">
                                        <span className="text-[12.5px] md:text-[13.5px] font-normal text-white/50 group-hover/prompt:text-white transition-colors duration-300 leading-snug">
                                          {prompt.label}
                                        </span>
                                        <svg
                                          className="relative w-4 h-4 md:w-4.5 md:h-4.5 flex-shrink-0 text-white/35 opacity-0 translate-y-1 group-hover/prompt:opacity-100 group-hover/prompt:translate-y-0 group-hover/prompt:text-white/80 transition-all duration-300"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                          strokeWidth="2.5"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                      </div>
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div
                                variants={messageListContainer}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                className="flex flex-col gap-8 w-full"
                              >
                                {messages.map((msg, index) => {
                                  if (msg.role === "user") {
                                    return (
                                      <motion.div
                                        key={index}
                                        variants={springItem}
                                        className="flex flex-col gap-1.5 max-w-[85%] self-end items-end w-full"
                                      >
                                        <div className="px-4 py-3.5 text-left bg-white/[0.06] border border-white/[0.08] text-[#e2e2e2] rounded-2xl rounded-tr-md text-sm font-medium leading-relaxed">
                                          {msg.content}
                                        </div>
                                      </motion.div>
                                    );
                                  } else {
                                    return (
                                      <motion.div
                                        key={index}
                                        variants={springItem}
                                        className="flex items-start gap-4 w-full self-start max-w-full my-4"
                                      >
                                        {/* AI Icon */}
                                        <AIIcon className="w-8 h-8 mt-1" />
                                        {/* Message content - Containerless */}
                                        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                                          <div className="text-left text-[#e2e2e2] leading-relaxed text-sm mt-2">
                                            {renderMessageContent(msg.content)}
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  }
                                })}
                              </motion.div>
                            )}

                            {/* SSE Live Streaming thoughts console */}
                            {isTyping && (
                              <div className="flex items-start gap-4 w-full mt-6">
                                {/* AI Icon */}
                                <AIIcon className="w-8 h-8 mt-1" pulse />

                                {/* ChatGPT-style thinking block + streaming text */}
                                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                  {(currentThoughts.length > 0 || currentStatus || funnyThinking) && (
                                    <ThoughtAccordion
                                      thoughts={currentThoughts}
                                      status={currentStatus}
                                      funnyText={funnyThinking}
                                      isLive={true}
                                    />
                                  )}
                                  {streamingText && (
                                    <div className="text-left text-[#e2e2e2] leading-relaxed text-sm mt-2">
                                      {renderMessageContent(stripTrailingUnclosedTag(streamingText))}
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
        ref={triggerFormRef}
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
        aria-label={isOpen ? undefined : "Open Ask Maher"}
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
          width: isOpen ? "min(672px, calc(100vw - 3rem))" : "170px",
          height: isOpen ? "56px" : "48px",
          bottom: (isOpen ? 32 : 24) + keyboardInset,
          backgroundColor: isOpen
            ? isInputFocused
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(255, 255, 255, 0.05)"
            : "rgba(255, 255, 255, 0.08)",
          borderColor: isOpen
            ? "rgba(255, 255, 255, 0)"
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
              <span className="text-xs font-semibold tracking-wider uppercase whitespace-nowrap">Ask Maher</span>
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
    </MotionConfig>
  );
}
