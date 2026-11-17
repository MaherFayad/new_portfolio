"use client";

import { useEffect, useRef } from "react";
import { useHomeRevealGate } from "@/components/HomeRevealGate";
import { FRAMES, SHEET_H, SHEET_W, WRIST } from "@/components/hero/frames";

// Maher treats the home headline as his level. Once the preloader hands over he plays a
// short scripted intro, then settles into a calm presenter:
//   1. drops out of the empty band onto "Senior Product Designer" (the line gives under him)
//   2. runs the line collecting coins; each coin flies into the stats and counts them up
//   3. jumps onto the tilted word "Designer" and stomps it level
//   4. hops down to the far end of "accelerate" and waves while the Contact ring completes a lap
// Afterwards he reacts to whatever hero content is hovered (waves at Contact, presents the stats,
// thinks at Ask Maher) and jumps when clicked. He never chases the cursor.
//
// The art is a vector sheet traced from the runner's pixel art (scripts/build-hero-vector.py), so
// it keeps his likeness but stays sharp at any size; it is rasterised once at the exact size
// needed. Running and jumping play its frames. Standing poses do not: each is ONE still frame
// moved in code (slow breathing, a wave that swings only the hand at the wrist). Poses switch
// cleanly with a small settle, and when he goes to rest the motion eases out instead of freezing.
//
// The canvas is absolutely positioned and pointer-transparent, so the hero layout is untouched,
// and everything the intro changes (stat text, word tilt) is restored to the server-rendered
// values. Motion stops 5 s after the last visitor input (WCAG 2.2 SC 2.2.2) and is replaced by a
// still pose under prefers-reduced-motion (SC 2.3.3). He is decorative: aria-hidden.

const SHEET = "/hero/maher.svg";

type Cue = "contact" | "stats" | "chat" | null;
type Phase = "wait" | "drop" | "run" | "leap" | "stomp" | "hop" | "cheer" | "idle";
type Pose = "idle" | "wave" | "present" | "think";
type Coin = { x: number; y: number; taken: boolean };

const STAND_H = 187; // sheet units of a standing frame
const AWAKE_MS = 5000; // keep animating this long after the last input
const TILT = "translateY(-0.16em) rotate(-5deg)";

// One still frame per standing pose (anchored on his legs, see the build script).
const POSES: Record<Pose, string> = { idle: "idle_0", wave: "wave_body", present: "waiting_2", think: "thinking_1" };
const RUN = Array.from({ length: 8 }, (_, i) => `runA_${i}`);
const COIN = "/runner/assets/coin.webp"; // the runner's own pixel-art coin: a strip of 4 cells
const COIN_CELL = 108; // each cell is 108 x 109

export default function HeroCharacter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealed = useHomeRevealGate();
  const assets = useRef<Promise<[HTMLImageElement, HTMLImageElement]> | null>(null);

  // load during the preloader so the intro can start the moment the page is revealed
  useEffect(() => {
    assets.current = Promise.all([loadImage(SHEET), loadImage(COIN)]);
    assets.current.catch(() => {});
  }, []);

  useEffect(() => {
    if (!revealed || !assets.current) return;
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    const h1 = section?.querySelector("h1");
    const line = h1?.querySelector("span");
    const word = h1?.querySelector<HTMLElement>("[data-hero-word]");
    const perchWord = h1?.querySelector<HTMLElement>("[data-hero-perch]");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !h1 || !line || !word || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hovers = window.matchMedia("(hover: hover) and (pointer: fine)");
    const phone = window.matchMedia("(max-width: 639px)");
    const stats = Array.from(section.querySelectorAll<HTMLElement>("[data-hero-stat]"));
    const statText = stats.map((el) => el.textContent ?? "");
    const ring = section.querySelector<SVGCircleElement>("[data-hero-cue='contact'] .showreel-ring-arc circle");

    let disposed = false;
    let raf = 0;
    let timer = 0;
    let art: HTMLImageElement, coinImg: HTMLImageElement;
    // the vector sheet rasterised at exactly the size he is drawn (R = bitmap px per sheet unit)
    const bitmap = document.createElement("canvas");
    let R = 0;
    let ready = false;

    // layout, in CSS px relative to the canvas. y is height above the first line; `base` is that
    // line's position in the canvas, and the perch on "accelerate" sits `perchDrop` below it.
    let CW = 0, H = 0, base = 0, charH = 0, k = 1, dpr = 1;
    let startX = 0, leapX = 0, restX = 0, runSpeed = 0, leapVy = 0;
    let perch = false, perchX = 0, perchDrop = 0, hopVx = 0;
    // actor
    let phase: Phase = "wait";
    let x = 0, y = 0, vy = 0, floor = 0;
    let grounded = true, landT = 0, squash = 0, alpha = 0;
    let cue: Cue = null;
    // the standing pose on screen, which way it faces, when it appeared, and when a change began
    let pose: Pose = "idle", poseFacing = 1, poseAt = -10, swapAt = -1;
    let press = 0; // how far he is pressed down, 0..~0.07 (anticipation, then a springy settle)
    let jumpQueued = false;
    let energy = 1; // 1 while awake, eases to 0 before he holds still, so nothing stops mid-motion
    let clock = 0, last = 0, lastInput = 0, phaseAt = 0;
    let coins: Coin[] = [];
    let taken = 0;
    let tilted = false, counting = false, wrapped = false;

    const measure = () => {
      const fontSize = parseFloat(getComputedStyle(h1).fontSize) || 48;
      charH = Math.max(92, Math.min(176, fontSize * 2.7));
      k = charH / 78; // same world scale the runner game uses
      // feet rest on the cap height of a line (Inter: caps start ~0.137em below the line box)
      const ground = Math.round(fontSize * 0.137);

      // measure the headline as it is laid out, not with the intro's tilt on "Designer"
      if (tilted) word.style.transform = "";
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
        restX = clamp(target.left - box.left + target.width / 2, startX, h1.offsetWidth - charH * 0.3);
      }

      // The perch: the far end of "accelerate", when it sits on the line right under the first one
      // and sticks out past it far enough for him to stand clear of "Designer".
      // (phones keep him on "Designer")
      perch = false;
      const p = perchWord?.getBoundingClientRect();
      const lineBelow = p && p.top > text.top + fontSize * 0.5 && p.top < text.top + fontSize * 1.5;
      if (p && lineBelow && !wrapped && !phone.matches) {
        const px = p.right - charH * 0.2;
        if (text.right < px - charH * 0.2) {
          perch = true;
          perchX = px - box.left;
          perchDrop = p.top - text.top;
        }
      }

      if (tilted) word.style.transform = TILT;

      const extra = perch ? perchDrop : 0;
      H = Math.round(charH * 2.3 + extra);
      base = H - extra;
      CW = Math.ceil(Math.max(h1.offsetWidth, perch ? perchX + charH * 0.5 : 0));
      canvas.style.left = `${h1.offsetLeft}px`;
      canvas.style.top = `${h1.offsetTop - base + ground}px`;
      canvas.style.width = `${CW}px`;
      canvas.style.height = `${H}px`;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(CW * dpr);
      canvas.height = Math.round(H * dpr);
      const wantR = (charH / STAND_H) * dpr * 1.04;
      if (Math.abs(wantR - R) > 0.01) {
        R = wantR;
        bitmap.width = Math.ceil(SHEET_W * R);
        bitmap.height = Math.ceil(SHEET_H * R);
        bitmap.getContext("2d")?.drawImage(art, 0, 0, bitmap.width, bitmap.height);
      }

      // the leap onto "Designer": same gravity as the game, sized to the character
      leapVy = 560 * k;
      const up = leapVy / (2600 * k);
      const apex = (leapVy * leapVy) / (2 * 2600 * k);
      const airtime = up + Math.sqrt((2 * apex) / (3600 * k));
      runSpeed = Math.max(260, (restX - startX) / 1.9);
      leapX = restX - runSpeed * airtime;
      // the hop down to the perch lands one line lower
      hopVx = perch ? (perchX - restX) / (up + Math.sqrt((2 * (apex + perchDrop)) / (3600 * k))) : 0;

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
      else if (phase === "idle" || phase === "cheer") {
        x = perch ? perchX : restX;
        floor = perch ? -perchDrop : 0;
        if (grounded) y = floor;
      }
    };

    // --- drawing -----------------------------------------------------------------------------
    const begin = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, CW, H);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };
    const place = (stretch: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.translate(x, base - y);
      ctx.scale(poseFacing * (1 + squash * 0.6) * (1 + press * 0.6), (1 - squash) * (1 - press) * stretch);
    };
    const blit = (name: string, s: number) => {
      const [sx, sy, w, h, ax] = FRAMES[name];
      ctx.drawImage(bitmap, sx * R, sy * R, w * R, h * R, -ax * s, -h * s, w * s, h * s);
    };
    // a moving frame (run, jump, land) straight from the sheet
    const drawFrame = (name: string) => {
      place(1);
      ctx.globalAlpha = alpha;
      blit(name, charH / STAND_H);
    };
    // a standing pose: one still frame, breathing, drawn at one height so the head never bobs
    const drawPose = (which: Pose) => {
      const [, , , h, ax] = FRAMES[POSES[which]];
      const s = charH / h;
      place(1 + Math.sin(clock * 1.9) * 0.008 * energy);
      ctx.globalAlpha = alpha;
      blit(POSES[which], s);
      if (which !== "wave") return;
      // only the hand moves: it swings up from his side as the pose arrives, then waves at the wrist
      const px = (WRIST.x - ax) * s, py = (WRIST.y - h) * s;
      const t = clock - poseAt;
      ctx.translate(px, py);
      ctx.rotate(-1.1 * Math.exp(-t * 8) + Math.sin(t * 9) * 0.2 * (1 - Math.exp(-t * 4)) * energy);
      ctx.translate(-px, -py);
      blit("wave_hand", s);
    };
    const drawCoins = () => {
      if (phase === "idle" || phase === "wait" || taken >= coins.length) return;
      const size = charH * 0.2;
      const cell = Math.floor(clock * 10) % 4;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = Math.min(1, (clock - 0.1) * 4);
      for (const c of coins) {
        if (c.taken) continue;
        const bob = Math.sin(clock * 4 + c.x * 0.02) * charH * 0.02;
        ctx.drawImage(coinImg, cell * COIN_CELL, 0, COIN_CELL, 109, c.x - size / 2, base - c.y - size / 2 + bob, size, size * (109 / COIN_CELL));
      }
    };
    const movingFrame = (): string | null => {
      if (!grounded) return vy > 300 * k ? "jump_1" : vy > -250 * k ? "jump_2" : "jump_3";
      if (landT > 0) return "jump_4";
      if (phase === "run") return RUN[Math.floor(clock * 13) % RUN.length];
      return null;
    };
    const wantedPose = (): Pose =>
      phase === "cheer" ? "wave" : cue === "chat" ? "think" : cue === "contact" ? "wave" : cue === "stats" ? "present" : "idle";
    const wantedFacing = () => (phase === "idle" && cue === "contact" ? -1 : 1);
    // Changing pose is a three-beat move, not a cut and not a blend (a blend ghosts):
    //   1. anticipation: he presses down slightly in the old pose (0.1 s)
    //   2. the pose changes at the lowest point, where the eye expects a change
    //   3. settle: he springs up a touch past full height and comes to rest (about 0.3 s)
    const SWAP = 0.1;
    const render = () => {
      begin();
      drawCoins();
      const moving = movingFrame();
      if (moving) {
        // jumps and landings carry their own squash; the pose under them changes unseen
        pose = wantedPose(); poseFacing = 1; poseAt = clock; swapAt = -1; press = 0;
        return drawFrame(moving);
      }
      const next = wantedPose(), nextFacing = wantedFacing();
      const changing = next !== pose || nextFacing !== poseFacing;
      if (changing && swapAt < 0) swapAt = clock;
      if (!changing) swapAt = -1;
      if (swapAt >= 0 && clock - swapAt >= SWAP) {
        pose = next; poseFacing = nextFacing; poseAt = clock; swapAt = -1;
      }
      if (swapAt >= 0) {
        const p = (clock - swapAt) / SWAP;
        press = 0.07 * p * p;
      } else {
        const t = clock - poseAt;
        press = t < 0.6 ? 0.07 * Math.exp(-t * 11) * Math.cos(t * 20) : 0;
      }
      drawPose(pose);
    };

    // --- effects on the page content -----------------------------------------------------------
    // the text he lands on gives a little, like a platform
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
      const x0 = c.left - s.left + from.x - size / 2, y0 = c.top - s.top + base - from.y - size / 2;
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
    // put back anything the intro changed, exactly as it was server-rendered
    const restore = () => {
      if (counting) stats.forEach((el, i) => (el.textContent = statText[i]));
      counting = false;
      if (tilted) word.style.transform = "";
      tilted = false;
      word.style.transformOrigin = "";
    };

    // --- the script ------------------------------------------------------------------------------
    const setPhase = (next: Phase) => {
      phase = next;
      phaseAt = clock;
      if (next === "cheer" && ring) {
        ring.style.strokeDashoffset = "0";
        timer = window.setTimeout(() => (ring.style.strokeDashoffset = ""), 1000);
      }
      if (next === "idle") restore();
    };
    const land = () => {
      y = floor; vy = 0; grounded = true; landT = 0.14; squash = 0.16;
      if (phase === "drop") {
        dip(line);
        setPhase("run");
      } else if (phase === "leap") {
        // stomp "Designer" level
        x = restX;
        if (tilted) {
          tilted = false;
          word.style.transform = "";
          word.animate(
            [{ transform: TILT }, { transform: "translateY(0.07em) rotate(0.8deg)", offset: 0.45 }, { transform: "none" }],
            { duration: 420, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
          );
        } else dip(wrapped ? line : word, 4);
        setPhase(perch ? "stomp" : "cheer");
        if (perch) landT = 0.26; // stay crouched, then spring straight into the hop
      } else if (phase === "hop") {
        x = perchX;
        if (perchWord) dip(perchWord, 4);
        setPhase("cheer");
      } else if (perch && perchWord) dip(perchWord);
      else dip(wrapped ? line : word);
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
        if (phase === "hop") x += hopVx * dt;
        if (y <= floor && vy < 0) land();
      } else {
        landT = Math.max(0, landT - dt);
        if (phase === "run" && landT === 0) {
          x += runSpeed * dt;
          if (x >= leapX) { phase = "leap"; grounded = false; vy = leapVy; }
        } else if (phase === "stomp" && landT === 0) {
          // off the end of the first line, down onto "accelerate"
          phase = "hop"; grounded = false; vy = leapVy; floor = -perchDrop;
        } else if (phase === "cheer" && clock - phaseAt > 1.7) {
          setPhase("idle");
        } else if (jumpQueued && landT === 0) {
          // the click-jump: a short crouch first, then the spring
          jumpQueued = false; grounded = false; vy = leapVy * 0.9;
        }
      }
      if (phase === "run" || phase === "leap") {
        for (const c of coins) if (!c.taken && x >= c.x - charH * 0.12) collect(c);
      }
      squash = Math.max(0, squash - dt * 1.2);

      // ease the breathing and the wave in and out, then hold still
      const awake = phase !== "idle" || !grounded || landT > 0 || now - lastInput < AWAKE_MS;
      energy += ((awake ? 1 : 0) - energy) * Math.min(1, dt * 4);
      if (!awake && energy < 0.01) energy = 0;

      render();

      if (awake || energy > 0) schedule();
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
        schedule();
      }
    };
    const visible = () => {
      const r = canvas.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };

    const cueOf = (t: EventTarget | null): Cue => {
      const el = t instanceof Element ? t : null;
      if (el?.closest("[data-ai-chat]")) return "chat";
      return (el?.closest<HTMLElement>("[data-hero-cue]")?.dataset.heroCue as Cue) ?? null;
    };
    const onOver = (e: PointerEvent) => {
      if (!hovers.matches || !visible()) return;
      const next = cueOf(e.target);
      if (next !== cue) { cue = next; wake(); }
    };
    const onDown = (e: PointerEvent) => {
      if (phase !== "idle" || !visible()) return;
      const r = canvas.getBoundingClientRect();
      const px = e.clientX - r.left, py = r.top + base - floor - e.clientY; // height above his feet
      if (Math.abs(px - x) < charH * 0.3 && py > 0 && py < charH && grounded) {
        jumpQueued = true; landT = 0.1; // wind up in the crouch, then tick() launches him
      }
      wake();
    };
    const onFocusIn = (e: FocusEvent) => { if (cueOf(e.target) === "chat") { cue = "chat"; wake(); } };
    const onFocusOut = (e: FocusEvent) => { if (cueOf(e.target) === "chat") { cue = null; wake(); } };
    const onScroll = () => { if (visible()) wake(); };

    const ro = new ResizeObserver(() => {
      if (!ready) return;
      measure();
      if (!raf && phase !== "wait") render();
    });

    // The headline is still fading in at this point, so the tilt and the zeroed stats are set
    // before they can be seen. If the art arrives late, the intro runs without touching either.
    const revealedAt = performance.now();
    Promise.all([assets.current, document.fonts.ready])
      .then(([[img, coin]]) => {
        if (disposed) return;
        art = img; coinImg = coin;
        ready = true;
        measure();
        ro.observe(h1);
        if (reduced) {
          phase = "idle"; alpha = 1; energy = 0;
          measure(); // places him on his final spot
          render();
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
          x = startX; y = base - charH; vy = 0; floor = 0; grounded = false; alpha = 0;
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
