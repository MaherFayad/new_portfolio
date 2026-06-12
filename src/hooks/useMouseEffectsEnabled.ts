"use client";

import { useEffect, useState } from "react";

export const MOUSE_EFFECTS_MIN_WIDTH = 1100;

export function useMouseEffectsEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${MOUSE_EFFECTS_MIN_WIDTH}px)`);
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return enabled;
}
