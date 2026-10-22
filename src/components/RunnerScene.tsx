"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useHomeRevealGate } from "@/components/HomeRevealGate";

// Maher Runner: the pixel-art endless runner served as static ES modules from /public/runner.
// The scene dissolves into the page (masked edges), fades in once its art has loaded, and
// Maher looks down whenever the Ask Maher pill ([data-ai-chat]) is hovered or focused.

export type RunnerGame = {
  start: () => void;
  destroy: () => void;
  canvas?: HTMLCanvasElement;
};

const RUNNER_EMBED = "/runner/embed.js";

// Match the controls under the scene to the site's dark UI.
const THEME = {
  "--runner-ink": "#e2e2e2",
  "--runner-ink-2": "rgba(197,197,197,0.72)",
  "--runner-panel": "rgba(255,255,255,0.06)",
  "--runner-line": "rgba(255,255,255,0.14)",
  "--runner-focus": "#ffffff",
  "--runner-font": "var(--font-inter), sans-serif",
} as CSSProperties;

export default function RunnerScene({ onReady }: { onReady?: (game: RunnerGame) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  // wait for the site preloader to hand over, so the scene's fade-in is actually seen
  const revealed = useHomeRevealGate();

  useEffect(() => {
    if (!revealed) return;
    let game: RunnerGame | null = null;
    let cancelled = false;
    ensureStylesheet("/runner/embed.css");
    import(/* webpackIgnore: true */ RUNNER_EMBED)
      .then(async (m) => {
        if (cancelled || !ref.current) return;
        const g: RunnerGame = await m.mountRunner(ref.current);
        if (cancelled) return g.destroy();
        game = g;
        onReady?.(g);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      game?.destroy();
    };
    // onReady is read once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  return (
    <div style={THEME}>
      <div ref={ref} />
    </div>
  );
}

function ensureStylesheet(href: string) {
  if (document.querySelector(`link[data-runner-css="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.runnerCss = href;
  document.head.appendChild(link);
}
