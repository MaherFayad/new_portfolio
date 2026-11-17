"use client";

import { useEffect, useRef } from "react";
import { useHomeRevealGate } from "@/components/HomeRevealGate";

// Pixel Maher treats the home headline as his level. Once the preloader hands over he plays a
// short scripted intro, then settles into a calm presenter:
//   1. drops out of the empty band onto "Senior Product Designer" (the line gives under him)
//   2. runs the line collecting coins; each coin flies into the stats and counts them up
//   3. jumps onto the tilted word "Designer" and stomps it level
//   4. waves while the Contact ring completes a lap
// Afterwards he turns to whatever hero content is hovered (Contact, stats, Ask Maher) and jumps
// when clicked. He never chases the cursor.
//
// The canvas is absolutely positioned and pointer-transparent, so the hero layout is untouched,
// and everything the intro changes (stat text, word tilt) is restored to the server-rendered
// values. Motion stops 5 s after the last visitor input (WCAG 2.2 SC 2.2.2) and is replaced by a
// still pose under prefers-reduced-motion (SC 2.3.3). The sprite is decorative: aria-hidden.

const SHEET = "/runner/assets/hero-home.webp";
const COIN = "/runner/assets/coin.webp";
const MAP = "/runner/assets/hero.json";

type Frame = [sx: number, sy: number, w: number, h: number, anchorX: number];
type HeroMap = { frames: Record<string, Frame>; anims: Record<string, string[]> };
type Cue = "contact" | "stats" | "chat" | null;
type Phase = "wait" | "drop" | "run" | "leap" | "cheer" | "idle";
type Coin = { x: number; y: number; taken: boolean };

const STAND_H = 187; // sheet px of a standing frame
const COIN_CELL = 108; // coin strip: 4 cells of 108 x 109
const AWAKE_MS = 5000; // keep animating this long after the last input
const FLOURISHES = ["wave", "thinking", "waiting", "review"] as const;
const TILT = "translateY(-0.16em) rotate(-5deg)";

export default function HeroCharacter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealed = useHomeRevealGate();
  const assets = useRef<Promise<[HTMLImageElement, HTMLImageElement, HeroMap]> | null>(null);

  // load during the preloader so the intro can start the moment the page is revealed
  useEffect(() => {
    assets.current = Promise.all([
      loadImage(SHEET),
      loadImage(COIN),
      fetch(MAP).then((r) => r.json() as Promise<HeroMap>),
    ]);
    assets.current.catch(() => {});
  }, []);

  useEffect(() => {
    if (!revealed || !assets.current) return;
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    const h1 = section?.querySelector("h1");
    const line = h1?.querySelector("span");
    const word = h1?.querySelector<HTMLElement>("[data-hero-word]");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !h1 || !line || !word || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hovers = window.matchMedia("(hover: hover) and (pointer: fine)");
    const stats = Array.from(section.querySelectorAll<HTMLElement>("[data-hero-stat]"));
    const statText = stats.map((el) => el.textContent ?? "");
    const ring = section.querySelector<SVGCircleElement>("[data-hero-cue='contact'] .showreel-ring-arc circle");

    let disposed = false;
    let raf = 0;
    let timer = 0;
    let sheet: HTMLImageElement, coinImg: HTMLImageElement, map: HeroMap;
    let ready = false;

    // layout, in CSS px relative to the canvas (ground line = canvas bottom)
    let W = 0, H = 0, charH = 0, k = 1, dpr = 1;
    let startX = 0, leapX = 0, restX = 0, runSpeed = 0, leapVy = 0;
    // actor
    let phase: Phase = "wait";
    let x = 0, y = 0, vy = 0, facing = 1;
    let grounded = true, landT = 0, squash = 0, alpha = 0;
    let cue: Cue = null, cueAt = 0;
    let clock = 0, last = 0, lastInput = 0, phaseAt = 0, idleAt = 0;
    let coins: Coin[] = [];
    let taken = 0;
    let tilted = false, counting = false, wrapped = false;

    const measure = () => {
      const fontSize = parseFloat(getComputedStyle(h1).fontSize) || 48;
      charH = Math.max(92, Math.min(176, fontSize * 2.7));
      k = charH / 78; // same world scale the runner game uses
      W = h1.offsetWidth;
      H = Math.round(charH * 2.3);
      // feet rest on the cap height of the first line (Inter: caps start ~0.137em below the line box)
      const ground = Math.round(fontSize * 0.137);
      canvas.style.left = `${h1.offsetLeft}px`;
      canvas.style.top = `${h1.offsetTop - H + ground}px`;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);

      const box = h1.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(line);
      const text = range.getBoundingClientRect();
      const target = word.getBoundingClientRect();
      const textLeft = text.left - box.left;
      startX = textLeft + charH * 0.3;
      // at widths where "Designer" wraps to its own line he stops at the end of the first line instead
      wrapped = target.top > text.top + fontSize * 0.5;
      if (wrapped) {
        const firstLine = Array.from(range.getClientRects()).filter((r) => r.top < text.top + fontSize * 0.5);
        const right = Math.max(...firstLine.map((r) => r.right));
        restX = Math.max(startX + charH, right - box.left - charH * 0.3);
      } else {
        restX = clamp(target.left - box.left + target.width / 2, startX, W - charH * 0.3);
      }

      // the leap onto "Designer": same gravity as the game, sized to the character
      leapVy = 560 * k;
      const up = leapVy / (2600 * k);
      const apex = (leapVy * leapVy) / (2 * 2600 * k);
      const airtime = up + Math.sqrt((2 * apex) / (3600 * k));
      runSpeed = Math.max(260, (restX - startX) / 1.9);
      leapX = restX - runSpeed * airtime;

      // three coins along the run at chest height, two more on the arc of the leap
      const at = (f: number) => startX + (leapX - startX) * f;
      const arc = (f: number) => {
        const t = airtime * f;
        const h = t < up ? leapVy * t - 1300 * k * t * t : apex - 1800 * k * (t - up) * (t - up);
        return { x: leapX + runSpeed * t, y: h + charH * 0.55 };
      };
      const prev = coins;
      coins = [
        { x: at(0.3), y: charH * 0.55 },
        { x: at(0.58), y: charH * 0.55 },
        { x: at(0.86), y: charH * 0.55 },
        arc(0.34),
        arc(0.6),
      ].map((c, i) => ({ ...c, taken: prev[i]?.taken ?? false }));

      if (phase === "wait") x = startX;
      else if (phase === "idle" || phase === "cheer") x = restX;
    };

    const frameName = (): string => {
      const an = map.anims;
      const loop = (name: string, fps: number, t = clock) => an[name][Math.floor(t * fps) % an[name].length];
      if (!grounded) return vy > 300 * k ? an.jump[1] : vy > -250 * k ? an.jump[2] : an.jump[3];
      if (landT > 0) return an.jump[4];
      if (phase === "run") return loop("runA", 13);
      if (phase === "cheer") return loop("wave", 8, clock - phaseAt);
      const ct = clock - cueAt;
      if (cue === "chat") {
        if (ct < 0.35) return an.look[0];
        if (ct < 1.1) return an.look[1];
        return Math.sin((ct - 1.1) * 6.5) > 0.3 ? an.look[2] : an.look[1];
      }
      if (cue === "contact") return loop("wave", 8, ct);
      if (cue === "stats") return loop("waiting", 6, ct);
      // idle: breathe, with a short flourish every seven seconds
      const since = clock - idleAt;
      const cyc = since % 7;
      if (since > 3 && cyc < 1.5) {
        const name = FLOURISHES[Math.floor(since / 7) % FLOURISHES.length];
        return loop(name, name === "wave" ? 8 : 6, cyc);
      }
      return loop("idle", 3);
    };

    const draw = (name: string) => {
      const [sx, sy, w, h, ax] = map.frames[name];
      const s = charH / STAND_H;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      if (phase !== "idle" && phase !== "wait") {
        const size = charH * 0.2;
        const cell = Math.floor(clock * 10) % 4;
        ctx.globalAlpha = Math.min(1, (clock - 0.1) * 4);
        for (const c of coins) {
          if (c.taken) continue;
          const bob = Math.sin(clock * 4 + c.x * 0.02) * charH * 0.02;
          ctx.drawImage(coinImg, cell * COIN_CELL, 0, COIN_CELL, 109, c.x - size / 2, H - c.y - size / 2 + bob, size, size * (109 / COIN_CELL));
        }
      }
      ctx.globalAlpha = alpha;
      ctx.translate(x, H - y);
      ctx.scale(facing * (1 + squash * 0.6), 1 - squash);
      ctx.drawImage(sheet, sx, sy, w, h, -ax * s, -h * s, w * s, h * s);
    };

    // the line he lands on gives a little, like a platform
    const dip = (el: Element, px = 3) => {
      el.animate(
        [{ transform: "translateY(0)" }, { transform: `translateY(${px}px)`, offset: 0.3 }, { transform: "translateY(0)" }],
        { duration: 320, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
      );
    };
    const pop = (el: Element) => {
      el.animate([{ transform: "scale(1)" }, { transform: "scale(1.18)", offset: 0.35 }, { transform: "scale(1)" }], {
        duration: 260,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      });
    };

    // a picked-up coin leaves the canvas as a DOM sprite and arcs into a stat, which ticks on arrival
    const flyCoin = (from: Coin, statIdx: number, value: string) => {
      const stat = stats[statIdx];
      if (!stat) return;
      const size = charH * 0.2;
      const c = canvas.getBoundingClientRect();
      const s = section.getBoundingClientRect();
      const t = stat.getBoundingClientRect();
      const x0 = c.left - s.left + from.x - size / 2, y0 = c.top - s.top + H - from.y - size / 2;
      const x1 = t.left - s.left + t.width / 2 - size / 2, y1 = t.top - s.top + t.height / 2 - size / 2;
      const el = document.createElement("span");
      el.setAttribute("aria-hidden", "true");
      el.style.cssText = `position:absolute;left:0;top:0;width:${size}px;height:${size}px;pointer-events:none;z-index:2;background:url(${COIN}) 0 0 / 400% 100% no-repeat;will-change:transform`;
      section.appendChild(el);
      const lift = Math.min(120, Math.abs(x1 - x0) * 0.18 + 30);
      const fly = el.animate(
        [
          { transform: `translate(${x0}px, ${y0}px) scale(1)` },
          { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - lift}px) scale(1.1)`, offset: 0.5 },
          { transform: `translate(${x1}px, ${y1}px) scale(0.5)`, opacity: 0.9 },
        ],
        { duration: 620, easing: "cubic-bezier(0.45, 0, 0.3, 1)", fill: "forwards" }
      );
      fly.onfinish = () => {
        el.remove();
        if (disposed) return;
        if (counting) stat.textContent = value;
        pop(stat);
      };
    };

    const collect = (c: Coin) => {
      c.taken = true;
      taken++;
      // five coins: projects climb 10+ .. 50+, years climb 1+ .. 4+ (from the second coin)
      flyCoin(c, 0, taken >= coins.length ? statText[0] : `${taken * 10}+`);
      if (taken > 1) flyCoin(c, 1, taken >= coins.length ? statText[1] : `${taken - 1}+`);
    };

    const land = () => {
      y = 0; vy = 0; grounded = true; landT = 0.14; squash = 0.16;
      if (phase === "drop") {
        dip(line);
        setPhase("run");
      } else if (phase === "leap") {
        // stomp "Designer" level, then take a bow
        x = restX;
        if (tilted) {
          tilted = false;
          word.style.transform = "";
          word.animate(
            [{ transform: TILT }, { transform: "translateY(0.07em) rotate(0.8deg)", offset: 0.45 }, { transform: "none" }],
            { duration: 420, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
          );
        } else dip(wrapped ? line : word, 4);
        setPhase("cheer");
        facing = -1;
        if (ring) {
          ring.style.strokeDashoffset = "0";
          timer = window.setTimeout(() => (ring.style.strokeDashoffset = ""), 1000);
        }
      } else dip(line);
    };
    const setPhase = (next: Phase) => {
      phase = next;
      phaseAt = clock;
      if (next === "idle") { idleAt = clock; facing = 1; restore(); }
    };
    // put back anything the intro changed, exactly as it was server-rendered
    const restore = () => {
      if (counting) stats.forEach((el, i) => (el.textContent = statText[i]));
      counting = false;
      if (tilted) word.style.transform = "";
      tilted = false;
      word.style.transformOrigin = "";
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      clock += dt;
      alpha = Math.min(1, alpha + dt * 5);

      if (!grounded) {
        vy -= (vy > 0 ? 2600 : 3600) * k * dt;
        y += vy * dt;
        if (phase === "leap") x += runSpeed * dt;
        if (y <= 0) land();
      } else {
        landT = Math.max(0, landT - dt);
        if (phase === "run" && landT === 0) {
          x += runSpeed * dt;
          if (x >= leapX) { phase = "leap"; grounded = false; vy = leapVy; }
        } else if (phase === "cheer" && clock - phaseAt > 1.6) {
          setPhase("idle");
        } else if (phase === "idle") {
          if (cue === "contact") facing = -1;
          else if (cue) facing = 1;
        }
      }
      if (phase === "run" || phase === "leap") {
        for (const c of coins) if (!c.taken && x >= c.x - charH * 0.12) collect(c);
      }
      squash = Math.max(0, squash - dt * 1.2);

      draw(frameName());

      if (phase !== "idle" || !grounded || landT > 0 || now - lastInput < AWAKE_MS) schedule();
    };
    const schedule = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!ready || reduced || phase === "wait") return;
      const asleep = !raf;
      lastInput = performance.now();
      if (asleep) {
        last = lastInput;
        if (!cue) idleAt = clock; // resume on a breath, not mid-flourish
        schedule();
      }
    };
    const visible = () => {
      const r = canvas.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };

    const setCue = (next: Cue) => {
      if (next === cue) return;
      cue = next;
      cueAt = clock;
      if (!next) { idleAt = clock; facing = 1; }
    };
    const cueOf = (t: EventTarget | null): Cue => {
      const el = t instanceof Element ? t : null;
      if (el?.closest("[data-ai-chat]")) return "chat";
      return (el?.closest<HTMLElement>("[data-hero-cue]")?.dataset.heroCue as Cue) ?? null;
    };
    const onOver = (e: PointerEvent) => {
      if (!hovers.matches || !visible()) return;
      const next = cueOf(e.target);
      if (next !== cue) { setCue(next); wake(); }
    };
    const onDown = (e: PointerEvent) => {
      if (phase !== "idle" || !visible()) return;
      const r = canvas.getBoundingClientRect();
      const px = e.clientX - r.left, py = r.bottom - e.clientY;
      if (Math.abs(px - x) < charH * 0.3 && py > 0 && py < charH && grounded) {
        grounded = false; vy = leapVy * 0.9; squash = 0;
      }
      wake();
    };
    const onFocusIn = (e: FocusEvent) => { if (cueOf(e.target) === "chat") { setCue("chat"); wake(); } };
    const onFocusOut = (e: FocusEvent) => { if (cueOf(e.target) === "chat") { setCue(null); wake(); } };
    const onScroll = () => { if (visible()) wake(); };

    const ro = new ResizeObserver(() => {
      if (!ready) return;
      measure();
      if (!raf && phase !== "wait") draw(frameName());
    });

    // The headline is still fading in at this point, so the tilt and the zeroed stats are set
    // before they can be seen. If the art arrives late, the intro runs without touching either.
    const revealedAt = performance.now();
    Promise.all([assets.current, document.fonts.ready])
      .then(([[img, coin, json]]) => {
        if (disposed) return;
        sheet = img; coinImg = coin; map = json;
        ready = true;
        measure();
        ro.observe(h1);
        if (reduced) {
          phase = "idle"; x = restX; alpha = 1;
          draw(json.anims.idle[0]);
          return;
        }
        if (performance.now() - revealedAt < 250) {
          if (!wrapped) {
            tilted = true;
            word.style.transformOrigin = "0 100%";
            word.style.transform = TILT;
          }
          counting = stats.length === 2;
          if (counting) stats.forEach((el) => (el.textContent = "0+"));
        }
        // let the headline finish rising, then drop in from the band above
        timer = window.setTimeout(() => {
          if (disposed) return;
          phase = "drop";
          x = startX; y = H - charH; vy = 0; grounded = false; alpha = 0;
          last = lastInput = performance.now();
          schedule();
        }, 800);
        document.addEventListener("pointerover", onOver, { passive: true });
        window.addEventListener("pointerdown", onDown, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("focusin", onFocusIn);
        document.addEventListener("focusout", onFocusOut);
      })
      .catch(() => {});

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      ro.disconnect();
      restore();
      if (ring) ring.style.strokeDashoffset = "";
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [revealed]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute left-0 top-0 pointer-events-none select-none" />;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
