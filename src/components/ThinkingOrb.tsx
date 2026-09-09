"use client";

import React from "react";
import {
  ThinkingOrb as BaseThinkingOrb,
  type OrbState,
  type OrbSize,
  type OrbTheme,
} from "thinking-orbs";

export type { OrbState, OrbSize, OrbTheme };

export interface ThinkingOrbProps {
  /**
   * The animation state:
   * - "searching": scan meridian sweeping across a dotted rotating globe
   * - "solving": scramble bands that click into place
   * - "working": particles flowing on tilted orbits (thought orb)
   * - "listening", "connecting", "weaving", "composing", "breathing", "shaping"
   */
  state?: OrbState;
  /**
   * Desired display size in pixels.
   * Internally maps to either the 20px preset (<= 20px) or 64px preset (> 20px)
   * and scales crisply with CSS transform.
   */
  size?: number;
  /** Override internal preset (20 or 64) */
  preset?: OrbSize;
  /** Dark mode (light dots) or light mode (dark dots) */
  theme?: OrbTheme;
  /** Speed multiplier (default tuned based on state) */
  speed?: number;
  /**
   * Color tint for the orb dots and ambient glow.
   * - "sky-gray": light gray dots with a subtle, very dim cool sky blue tone (default)
   * - "purple": light purple / lilac
   * - "white": original monochrome white dots
   */
  color?: "sky-gray" | "purple" | "white";
  /** Freeze animation */
  paused?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function ThinkingOrb({
  state = "searching",
  size = 20,
  preset: customPreset,
  theme = "dark",
  speed,
  color = "sky-gray",
  paused = false,
  className = "",
  style,
}: ThinkingOrbProps) {
  const reactId = React.useId();
  const filterId = `orb-tint-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const isSkyGray = color === "sky-gray";
  const isPurple = color === "purple";
  const hasTint = isSkyGray || isPurple;

  // Tuned speeds: thinking ("working") is lively (0.65), searching is calm (0.35), idle ("shaping") is 0.4
  const defaultSpeed =
    state === "working" ? 0.65 : state === "searching" ? 0.35 : 0.4;
  const effectiveSpeed = speed ?? defaultSpeed;
  // The engine bounds dots at ~76% radius of preset.
  // Using fillFactor (1.18) ensures the visible sphere spans the full size boundary,
  // making it look prominently sized and filling the space as shown in the reference design.
  const preset: OrbSize = customPreset ?? (size <= 20 ? 20 : 64);
  const fillFactor = 1.18;
  const scale = (size / preset) * fillFactor;

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        overflow: "visible",
        ...style,
      }}
    >
      {/* SVG filter definition for color tinting */}
      {hasTint && (
        <svg
          className="absolute w-0 h-0 pointer-events-none opacity-0"
          aria-hidden="true"
          style={{ position: "absolute", width: 0, height: 0 }}
        >
          <defs>
            <filter id={filterId} colorInterpolationFilters="sRGB">
              {isSkyGray ? (
                /* Light gray with the smallest, dim sky blue tone (#e3edfc) */
                <feColorMatrix
                  type="matrix"
                  values="
                    0.86 0 0 0 0.03
                    0.90 0 0 0 0.03
                    0.96 0 0 0 0.03
                    0    0 0 1 0
                  "
                />
              ) : (
                /* Light purple / lilac */
                <feColorMatrix
                  type="matrix"
                  values="
                    0.78 0 0 0 0.18
                    0.54 0 0 0 0.12
                    1.00 0 0 0 0.22
                    0    0 0 1 0
                  "
                />
              )}
            </filter>
          </defs>
        </svg>
      )}

      {/* Subtle dim ambient background shade / aura */}
      {hasTint && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-full"
          style={{
            background: isSkyGray
              ? "radial-gradient(circle, rgba(186, 230, 253, 0.09) 0%, rgba(125, 211, 252, 0.03) 60%, transparent 100%)"
              : "radial-gradient(circle, rgba(192, 132, 252, 0.25) 0%, rgba(168, 85, 247, 0.08) 60%, transparent 100%)",
            filter: "blur(4px)",
            transform: "scale(1.2)",
          }}
        />
      )}

      <div
        style={{
          width: preset,
          height: preset,
          transform: `scale(${scale})`,
          transformOrigin: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: hasTint
            ? isSkyGray
              ? `url(#${filterId}) drop-shadow(0 0 4px rgba(186, 230, 253, 0.20)) drop-shadow(0 0 1px rgba(224, 242, 254, 0.35))`
              : `url(#${filterId}) drop-shadow(0 0 6px rgba(192, 132, 252, 0.5)) drop-shadow(0 0 1.5px rgba(216, 180, 254, 0.75))`
            : undefined,
        }}
      >
        <BaseThinkingOrb
          state={state}
          size={preset}
          theme={theme}
          speed={effectiveSpeed}
          paused={paused}
        />
      </div>
    </div>
  );
}
