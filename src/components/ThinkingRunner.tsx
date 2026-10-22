"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Mini Maher Runner shown while the agent is thinking. It plays itself; tapping it (or focusing
// it and pressing Space) hands control to the visitor until they stop for a few seconds.
const RUNNER_MINI = "/runner/mini.js";

export default function ThinkingRunner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stop: (() => void) | null = null;
    let cancelled = false;
    import(/* webpackIgnore: true */ RUNNER_MINI)
      .then(async (m) => {
        if (cancelled || !ref.current) return;
        const s: () => void = await m.mountThinkingRunner(ref.current, { label: "" });
        if (cancelled) s();
        else stop = s;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[440px] mt-1"
    >
      <div
        ref={ref}
        className="[&_canvas]:block [&_canvas]:w-full [&_canvas]:h-[76px] [&_canvas]:rounded-xl [&_canvas]:bg-[#0b0a0d] [&_canvas]:cursor-pointer [&_canvas]:touch-none [&_canvas]:outline-none [&_canvas:focus-visible]:ring-2 [&_canvas:focus-visible]:ring-white/60"
      />
      <p className="mt-1.5 text-xs text-white/40 font-semibold tracking-wide motion-reduce:hidden">
        Tap the game to jump while you wait
      </p>
    </motion.div>
  );
}
