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
// Afterwards the headline is his playground. While the visitor is active he keeps himself busy from
// a weighted, non-repeating pool: strolls along the first line, hops between it and "accelerate",
// flips, a little dance, a double take, a coin run, or "Designer" pops up crooked again and he goes
// and stomps it. The visitor can join in:
//   - hover Contact / the stats / Ask Maher: he waves, presents, thinks
//   - bring the pointer up to him: hello; swipe past him fast: he jumps
//   - click him: a trick, a different one each time
//   - drag him, at any time, even mid-intro: he is picked up by the scruff of the neck (the cursor
//     pinches his collar), kicks, then hangs limp and swings. Let go or thrown, he falls: a
//     superhero landing, then his knees remind him; or now and then he lands in the gap between two
//     words and has to wriggle out. Dropped during the intro, he goes back for the coins.
//   - pass the pointer over his face: he ducks. Under his feet: he jumps. Come at him: sometimes he
//     says hello, sometimes he legs it.
//   - click the headline: he runs (or hops) to that spot
// He never chases the cursor.
//
// What makes it read as one body rather than a strip of frames: the run eases in and its frames
// follow the ground covered, he leans into it, jumps stretch with speed, landings are a damped
// spring, and feet raise dust.
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
// the intro runs wait..cheer; after it he is "idle" (standing), "walk" (running to a spot),
// "fly" (in the air towards a spot) or "drag" (held by the pointer)
type Phase = "wait" | "drop" | "run" | "leap" | "stomp" | "hop" | "cheer" | "idle" | "walk" | "fly" | "drag";
// what he does after the intro is a queue of small steps
type Step =
  | { kind: "run"; x: number }
  | { kind: "jump"; x: number; plat: 0 | 1 } // leap to a spot; plat 0 is the first line, 1 is "accelerate"
  | { kind: "hop"; power: number; flip: number } // on the spot; flip = whole turns, signed
  | { kind: "pose"; pose: Pose; dur: number; facing?: number }
  | { kind: "face"; dir: number }
  | { kind: "wait"; dur: number }
  | { kind: "tilt" } // "Designer" pops up crooked
  | { kind: "loot"; xs: number[] } // coins appear along the first line
  | { kind: "resume" }; // pick the intro's run back up
type Pose = "idle" | "wave" | "present" | "think";
type Coin = { x: number; y: number; taken: boolean };
// dust kicked up by his feet and the sparkle of a collected coin, in the same units as x / y
type Puff = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; gold: boolean; sweat?: boolean };

const STAND_H = 187; // sheet units of a standing frame
const AWAKE_MS = 5000; // keep animating this long after the last input
const TILT = "translateY(-0.16em) rotate(-5deg)";

// One still frame per standing pose (anchored on his legs, see the build script).
const POSES: Record<Pose, string> = { idle: "idle_0", wave: "wave_body", present: "waiting_2", think: "thinking_1" };
const RUN = Array.from({ length: 8 }, (_, i) => `runA_${i}`);
const RUN_FPS = 9;
const COIN = "/runner/assets/coin.webp"; // the runner's own pixel-art coin: a strip of 4 cells
const COIN_CELL = 108; // each cell is 108 x 109

// Where his eyes are in each standing frame (sheet units: centre x, centre y, radius x, radius y,
// tilt), read off the traced sheet. A blink paints a closed lid over them for a few frames.
const EYES: Record<Pose, [number, number, number, number, number][]> = {
  idle: [[45, 46.6, 6.4, 3.1, 0], [61.6, 46.7, 6.2, 2.9, 0]],
  wave: [[55.3, 51.4, 7.2, 3, 0], [74.9, 51.5, 5.6, 3.1, 0]],
  present: [[44.1, 48.8, 6.6, 3.5, -0.35], [61.4, 44.3, 5, 3.5, -0.35]],
  think: [[48.8, 49.3, 6.6, 2.9, 0.1], [64.3, 50.5, 3.2, 2.2, 0.1]],
};
const SKIN = "#efc894", LASH = "#54514e"; // from the sheet's palette
const BLINK = 0.13; // seconds an eye stays shut

// The pointer over him is a hand ready to pinch; holding him, it pinches. The hotspot is the pinch
// point, which is exactly where his collar is drawn.
const hand = (closed: boolean) => {
  // index finger and thumb coming down from a palm at the top right, meeting (or not) at the tip
  const paths = `<path d='M20 8L${closed ? "8 22" : "5 17"}'/><path d='M27 15L${closed ? "10 25" : "14 28"}'/><path d='M21 7q5 -3 7 2t-1 7'/>`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><g fill='none' stroke-linecap='round' stroke-linejoin='round'><g stroke='%23111' stroke-width='8'>${paths}</g><g stroke='%23fff' stroke-width='4.6'>${paths}</g></g></svg>`;
  return `url("data:image/svg+xml,${svg}") ${closed ? "8 25" : "9 23"}, ${closed ? "grabbing" : "grab"}`;
};
const HAND_OPEN = hand(false), HAND_PINCH = hand(true);
// the back of his collar in a frame: [x, height above his feet], sheet units
const gripOf = (name: string): [number, number] => (name === "failed_1" ? [16, 116] : [FRAMES[name][4] - 20, 118]);

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
    // The canvas reaches past the headline to the page edges and up to the top of the page, so he
    // is never clipped while carried or thrown. x = 0 is still the headline's left edge.
    let padL = 0, padR = 0;
    let startX = 0, leapX = 0, restX = 0, lineEndX = 0, lineH = 48, runSpeed = 0, leapVy = 0;
    let perch = false, perchX = 0, perchDrop = 0, hopVx = 0;
    // actor
    let phase: Phase = "wait";
    let x = 0, y = 0, vy = 0, floor = 0;
    let grounded = true, landT = 0, squash = 0, alpha = 0;
    let cue: Cue = null;
    // the standing pose on screen, which way it faces, when it appeared, and when a change began
    let pose: Pose = "idle", poseFacing = 1, poseAt = -10, swapAt = -1;
    let press = 0; // how far he is pressed down, 0..~0.07 (anticipation, then a springy settle)
    // free roaming after the intro
    let plat: 0 | 1 = 0; // which line he is on
    let face = 1, stayFacing = 1; // direction of travel, and the way he stands once stopped
    let plan: Step[] = [], step: Step | null = null, stepAt = 0, busy = false, lastAct = "";
    let pending: (() => void) | null = null; // a launch waiting for the crouch to finish
    let targetX = 0, vx = 0, landX = 0, spin = 0, spinRate = 0;
    let loot: (Coin & { born: number })[] = [];
    // being held by the pointer: he hangs from the grip point by his collar and swings
    let armed: { x: number; y: number } | null = null;
    let gripX = 0, gripY = 0, prevGX = 0, prevGY = 0, gvx = 0, gvy = 0, prevGvx = 0;
    let theta = 0, omega = 0, flailUntil = 0;
    let lastStartle = 0, tricks = 0;
    // what happens after a fall, and other short bits of slapstick that take over his body
    let introDone = false;
    let gag: "hero" | "stuck" | "duck" | null = null, gagAt = 0;
    let dropped = false, peakY = 0, stickAt: { x: number; left: number } | null = null, popping = false, flipping = false;
    // the words of the first line and the spaces between them; `wedge` is the gap he is stuck in
    let words: HTMLElement[] = [];
    let gaps: { x: number; left: number }[] = []; // centre of the space, and how many words sit left of it
    let wedge = -1, wedgeX = 0, spread = 0, slipAt = -10;
    let rings: { x: number; y: number; age: number }[] = [];
    // the pointer around him
    let overFace = false, wasUnder = false, wasApproach = false, lastDuck = 0, lastUnder = 0, lastFlee = 0, hurry = false;
    let energy = 1; // 1 while awake, eases to 0 before he holds still, so nothing stops mid-motion
    let clock = 0, last = 0, lastInput = 0, phaseAt = 0;
    let coins: Coin[] = [];
    let puffs: Puff[] = [];
    // motion that makes him read as one body instead of a row of frames
    let runT = 0, runDist = 0, runFrame = -1; // the run eases in, and its frames follow the ground covered
    let lean = 0, air = 0; // forward lean (radians) and the stretch of a jump, both eased
    let landAt = -10, landPow = 0; // a landing is a damped spring, not a linear decay
    // signs of life while he stands: blinks, the odd unprompted gesture, a hello when the pointer comes close
    let blinkAt = 2, act: Pose | null = null, actUntil = 0, nextActAt = 0;
    let near = false, nearFacing = 1, lastMove = 0, lastMoveX = 0;
    let taken = 0;
    let tilted = false, counting = false, wrapped = false;

    const measure = () => {
      const fontSize = parseFloat(getComputedStyle(h1).fontSize) || 48;
      lineH = fontSize;
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
      // how far along the first line he can walk
      lineEndX = wrapped ? restX : Math.max(restX, Math.min(target.right - box.left - charH * 0.22, h1.offsetWidth - charH * 0.3));

      words = Array.from(line.querySelectorAll<HTMLElement>("[data-hero-w]"));
      gaps = [];
      for (let i = 0; i + 1 < words.length; i++) {
        const a = words[i].getBoundingClientRect(), b = words[i + 1].getBoundingClientRect();
        if (Math.abs(a.top - b.top) > fontSize * 0.5 || a.top > text.top + fontSize * 0.5) continue; // same, first line
        const gx = (a.right + b.left) / 2 - box.left;
        if (gx > startX && gx < lineEndX + charH * 0.3) gaps.push({ x: gx, left: i + 1 });
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
      // room above the first line: all the way to the top of the page
      // (measured from the section, which is never transformed; the headline is while it fades in)
      const lineTop = section.getBoundingClientRect().top + window.scrollY + h1.offsetTop + ground;
      base = Math.round(Math.max(charH * 2.3, lineTop));
      H = base + extra;
      CW = Math.ceil(Math.max(h1.offsetWidth, perch ? perchX + charH * 0.5 : 0));
      padL = Math.max(0, Math.floor(box.left + window.scrollX));
      padR = Math.max(0, Math.floor(document.documentElement.clientWidth - (box.left + window.scrollX + CW)));
      canvas.style.left = `${h1.offsetLeft - padL}px`;
      canvas.style.top = `${h1.offsetTop - base + ground}px`;
      canvas.style.width = `${padL + CW + padR}px`;
      canvas.style.height = `${H}px`;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round((padL + CW + padR) * dpr);
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
      else if (phase === "cheer") {
        x = perch ? perchX : restX;
        floor = perch ? -perchDrop : 0;
        if (grounded) y = floor;
      } else if (phase === "idle" || phase === "walk") {
        // keep him where he was, on whatever the new layout still offers
        if (plat === 1 && !perch) plat = 0;
        x = plat ? perchX : clamp(x, startX, lineEndX);
        targetX = clamp(targetX, startX, lineEndX);
        floor = plat ? -perchDrop : 0;
        if (grounded) y = floor;
      }
    };

    // --- drawing -----------------------------------------------------------------------------
    const begin = () => {
      ctx.setTransform(dpr, 0, 0, dpr, padL * dpr, 0);
      ctx.clearRect(-padL, 0, padL + CW + padR, H);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };
    const place = (stretch: number, widen = 1) => {
      ctx.setTransform(dpr, 0, 0, dpr, padL * dpr, 0);
      ctx.translate(x, base - y);
      if (spin) {
        // a somersault turns about his middle, not his feet
        ctx.translate(0, -charH * 0.5);
        ctx.rotate(spin);
        ctx.translate(0, charH * 0.5);
      }
      ctx.rotate(lean * poseFacing);
      ctx.scale(
        poseFacing * (1 + squash * 0.6) * (1 + press * 0.6) * (1 - air * 0.5) * widen,
        (1 - squash) * (1 - press) * (1 + air) * stretch
      );
    };
    const blit = (name: string, s: number) => {
      const [sx, sy, w, h, ax] = FRAMES[name];
      ctx.drawImage(bitmap, sx * R, sy * R, w * R, h * R, -ax * s, -h * s, w * s, h * s);
    };
    // a moving frame (run, jump, land) straight from the sheet
    const drawFrame = (name: string) => {
      // wedged between two words: everything below the top of the letters is out of sight
      const wedged = gag === "stuck" || (popping && y < 0);
      if (wedged) {
        // he shows above the letters, and in the space the two words have been forced apart
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, padL * dpr, 0);
        ctx.beginPath();
        ctx.rect(-padL, 0, padL + CW + padR, base + 1);
        const half = lineH * 0.125 + spread;
        ctx.rect(wedgeX - half, base, half * 2, lineH * 1.1);
        ctx.clip();
      }
      place(1);
      const sore = gag === "hero" && clock - gagAt > 0.64 && clock - gagAt < 1.8;
      if (sore) ctx.translate(Math.sin(clock * 60) * charH * 0.006, 0); // he trembles
      ctx.globalAlpha = alpha;
      blit(name, charH / STAND_H);
      if (wedged) ctx.restore();
      if (gag === "stuck") drawTemper();
      if (sore) {
        // pain, the comic-strip way: a few red dashes pulsing off his knee
        ctx.setTransform(dpr, 0, 0, dpr, padL * dpr, 0);
        const cx = x + face * charH * 0.2, cy = base - y - charH * 0.2;
        ctx.strokeStyle = "#ff5a4f";
        ctx.lineWidth = charH * 0.016;
        ctx.lineCap = "round";
        ctx.globalAlpha = 0.55 + 0.45 * Math.sin(clock * 18);
        for (const a of [-0.85, -0.25, 0.35]) {
          const ux = Math.cos(a) * face, uy = Math.sin(a);
          ctx.beginPath();
          ctx.moveTo(cx + ux * charH * 0.07, cy + uy * charH * 0.07);
          ctx.lineTo(cx + ux * charH * 0.14, cy + uy * charH * 0.14);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
    };
    // What being stuck does to his mood, the comic-strip way: a silent "..." while it sinks in, then
    // a throbbing vein by his temple for as long as he is in there.
    const drawTemper = () => {
      const t = clock - gagAt;
      ctx.setTransform(dpr, 0, 0, dpr, padL * dpr, 0);
      const top = base - y - charH * 1.02;
      if (t > 0.3 && t < 1.15) {
        ctx.fillStyle = "#c5c5c5";
        for (let i = 0; i < 3; i++) {
          const a = clamp((t - 0.3 - i * 0.2) * 8, 0, 1) * clamp((1.15 - t) * 8, 0, 1);
          ctx.globalAlpha = a;
          ctx.beginPath();
          ctx.arc(x + (i - 1) * charH * 0.075, top - charH * 0.06 - a * charH * 0.02, charH * 0.022, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (t > 1.0) {
        const beat = 1 + 0.18 * Math.sin(t * 14);
        const r = charH * 0.075 * beat * clamp((t - 1.0) * 6, 0, 1);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "#ff5a4f";
        ctx.lineWidth = charH * 0.026;
        ctx.lineCap = "round";
        const cx = x + charH * 0.3, cy = top + charH * 0.08;
        for (let q = 0; q < 4; q++) {
          // four little arcs bowing in towards the centre
          const a = q * (Math.PI / 2) + Math.PI / 4;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(a) * r * 1.5, cy + Math.sin(a) * r * 1.5, r, a + Math.PI - 1, a + Math.PI + 1);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };
    // Carried: he hangs from the pointer by the back of his collar and swings from that point.
    // Freshly grabbed or shaken he kicks; left hanging he goes limp.
    const carryFrame = () => (clock < flailUntil ? RUN[Math.floor(clock * 15) % RUN.length] : "failed_1");
    const drawCarried = () => {
      const name = carryFrame();
      const [sx, sy, w, h] = FRAMES[name];
      const [gx, gh] = gripOf(name);
      const s = charH / STAND_H;
      ctx.setTransform(dpr, 0, 0, dpr, padL * dpr, 0);
      ctx.translate(gripX, base - gripY);
      ctx.rotate(-theta);
      ctx.scale(face, 1);
      ctx.globalAlpha = alpha;
      ctx.drawImage(bitmap, sx * R, sy * R, w * R, h * R, -gx * s, -gh * s, w * s, h * s);
    };
    // a standing pose: one still frame, breathing, drawn at one height so the head never bobs
    const drawPose = (which: Pose) => {
      const [, , , h, ax] = FRAMES[POSES[which]];
      const s = charH / h;
      // breathing: the chest rises and widens a touch, feet planted
      const breath = Math.sin(clock * 1.9) * energy;
      place(1 + breath * 0.011, 1 + breath * 0.004);
      ctx.globalAlpha = alpha;
      blit(POSES[which], s);
      if (clock >= blinkAt && clock < blinkAt + BLINK) {
        for (const [ex, ey, rx, ry, rot] of EYES[which]) {
          const cx = (ex - ax) * s, cy = (ey - h) * s;
          ctx.fillStyle = SKIN;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx * s, ry * s, rot, 0, Math.PI * 2);
          ctx.fill();
          // the closed eye: one lash line along the lower lid
          ctx.strokeStyle = LASH;
          ctx.lineWidth = 1.3 * s;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.ellipse(cx, cy - ry * s * 0.15, rx * s * 0.72, ry * s * 0.7, rot, Math.PI * 0.12, Math.PI * 0.88);
          ctx.stroke();
        }
      }
      if (which !== "wave") return;
      // only the hand moves: it swings up from his side as the pose arrives, then waves at the wrist
      const px = (WRIST.x - ax) * s, py = (WRIST.y - h) * s;
      const t = clock - poseAt;
      ctx.translate(px, py);
      ctx.rotate(-1.1 * Math.exp(-t * 8) + Math.sin(t * 9) * 0.2 * (1 - Math.exp(-t * 4)) * energy);
      ctx.translate(-px, -py);
      blit("wave_hand", s);
    };
    const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
    // dust at his feet: `dir` -1 / 1 throws it to one side, 0 to both
    const dust = (n: number, dir = 0, power = 1) => {
      for (let i = 0; i < n; i++) {
        const side = dir || (i % 2 ? 1 : -1);
        puffs.push({
          x: x + side * charH * rand(0.04, 0.12), y: y + charH * 0.02,
          vx: side * charH * rand(0.35, 0.9) * power, vy: charH * rand(0.05, 0.3) * power,
          age: 0, life: rand(0.32, 0.5), size: charH * rand(0.018, 0.034), gold: false,
        });
      }
    };
    const sparkle = (c: Coin) => {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + rand(0, 0.6);
        puffs.push({
          x: c.x, y: c.y, vx: Math.cos(a) * charH * rand(0.5, 0.9), vy: Math.sin(a) * charH * rand(0.5, 0.9),
          age: 0, life: rand(0.28, 0.42), size: charH * rand(0.016, 0.026), gold: true,
        });
      }
    };
    const drawPuffs = () => {
      ctx.setTransform(dpr, 0, 0, dpr, padL * dpr, 0);
      for (const p of puffs) {
        const f = p.age / p.life;
        if (p.sweat) {
          ctx.globalAlpha = (1 - f) * alpha;
          ctx.fillStyle = "#9fd4ff";
          ctx.beginPath();
          ctx.arc(p.x, base - p.y, p.size * (1 - f * 0.4), 0, Math.PI * 2);
          ctx.fill();
        } else if (p.gold) {
          // square, like the pixel-art coin it came from
          const sz = p.size * (1 - f * 0.6);
          ctx.globalAlpha = (1 - f) * alpha;
          ctx.fillStyle = "#ffcf3f";
          ctx.fillRect(p.x - sz / 2, base - p.y - sz / 2, sz, sz);
        } else {
          ctx.globalAlpha = (1 - f) * (1 - f) * 0.32 * alpha;
          ctx.fillStyle = "#c5c5c5";
          ctx.beginPath();
          ctx.arc(p.x, base - p.y, p.size * (0.7 + f * 1.1), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // the shock of a hard landing spreads along the line
      for (const r of rings) {
        const f = r.age / 0.42;
        const rx = charH * (0.2 + 0.9 * f * (2 - f));
        ctx.globalAlpha = (1 - f) * 0.5 * alpha;
        ctx.strokeStyle = "#c5c5c5";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(r.x, base - r.y, rx, rx * 0.16, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    const drawCoins = () => {
      if (introDone || phase === "wait" || taken >= coins.length) return;
      const size = charH * 0.2;
      const cell = Math.floor(clock * 10) % 4;
      ctx.setTransform(dpr, 0, 0, dpr, padL * dpr, 0);
      ctx.globalAlpha = Math.min(1, (clock - 0.1) * 4);
      for (const c of coins) {
        if (c.taken) continue;
        const bob = Math.sin(clock * 4 + c.x * 0.02) * charH * 0.02;
        ctx.drawImage(coinImg, cell * COIN_CELL, 0, COIN_CELL, 109, c.x - size / 2, base - c.y - size / 2 + bob, size, size * (109 / COIN_CELL));
      }
    };
    const drawLoot = () => {
      if (!loot.length) return;
      const size = charH * 0.2;
      const cell = Math.floor(clock * 10) % 4;
      ctx.setTransform(dpr, 0, 0, dpr, padL * dpr, 0);
      for (const c of loot) {
        if (c.taken) continue;
        const t = Math.min(1, (clock - c.born) * 5);
        const pop = size * (0.4 + 0.6 * t * (2 - t)); // they pop into existence
        const bob = Math.sin(clock * 4 + c.x * 0.02) * charH * 0.02;
        ctx.globalAlpha = t * alpha;
        ctx.drawImage(coinImg, cell * COIN_CELL, 0, COIN_CELL, 109, c.x - pop / 2, base - c.y - pop / 2 + bob, pop, pop * (109 / COIN_CELL));
      }
      ctx.globalAlpha = 1;
    };
    const movingFrame = (): string | null => {
      if (gag === "hero") {
        // fists down in a crouch, then onto his knees, a long second there, and back up
        const t = clock - gagAt;
        return t < 0.5 ? "jump_0" : t < 0.64 ? "failed_2" : t < 1.8 ? "failed_3" : t < 1.94 ? "failed_2" : "failed_1";
      }
      if (gag === "duck") return "duck_0";
      if (gag === "stuck") {
        // not amused: a flat stare while it sinks in, a glare, then eyes screwed shut for each heave
        const t = clock - gagAt;
        return t < 0.08 ? "jump_3" : t < 1.0 ? "review_2" : t < PUSH1 ? "thinking_1" : t < SLIP ? "thinking_3" : t < PUSH2 ? "thinking_2" : "thinking_3";
      }
      if (popping) return "thinking_2"; // still scowling on his way out of the gap
      if (!grounded) return flipping ? "jump_2" : vy > 300 * k ? "jump_1" : vy > -250 * k ? "jump_2" : "jump_3";
      if (landT > 0) return "jump_4";
      // the runner game plays this cycle at 9 frames a second at its starting pace; faster than
      // that and his legs spin quicker than he covers ground
      // ...so the frame follows the ground he has covered, not the clock: no sliding feet while he
      // gets up to speed
      if (phase === "run" || phase === "walk") return RUN[Math.floor((runDist * RUN_FPS) / runSpeed) % RUN.length];
      return null;
    };
    const wantedPose = (): Pose =>
      phase === "cheer" ? "wave"
        : cue === "chat" ? "think"
        : cue === "contact" ? "wave"
        : cue === "stats" ? "present"
        : near ? "wave"
        : act && clock < actUntil ? act
        : "idle";
    const wantedFacing = () =>
      phase !== "idle" ? 1 : cue === "contact" ? -1 : cue ? 1 : near ? nearFacing : stayFacing;
    // Changing pose is a three-beat move, not a cut and not a blend (a blend ghosts):
    //   1. anticipation: he presses down slightly in the old pose (0.1 s)
    //   2. the pose changes at the lowest point, where the eye expects a change
    //   3. settle: he springs up a touch past full height and comes to rest (about 0.3 s)
    const SWAP = 0.1;
    // being stuck, in seconds from the landing: first heave, the slip back, second heave, out
    const PUSH1 = 1.3, SLIP = 1.95, PUSH2 = 2.5, OUT = 3.3;
    const render = () => {
      begin();
      drawPuffs();
      drawCoins();
      drawLoot();
      if (phase === "drag") {
        pose = "idle"; poseFacing = face; poseAt = clock; swapAt = -1; press = 0;
        return drawCarried();
      }
      const moving = movingFrame();
      if (moving) {
        // jumps and landings carry their own squash; the pose under them changes unseen
        pose = wantedPose(); poseFacing = face; poseAt = clock; swapAt = -1; press = 0;
        return drawFrame(moving);
      }
      const next = wantedPose(), nextFacing = wantedFacing();
      const changing = next !== pose || nextFacing !== poseFacing;
      if (changing && swapAt < 0) swapAt = clock;
      if (!changing) swapAt = -1;
      if (swapAt >= 0 && clock - swapAt >= SWAP) {
        pose = next; poseFacing = nextFacing; poseAt = clock; swapAt = -1;
        // people blink as they turn to something new
        if (clock > blinkAt + BLINK && Math.random() < 0.6) blinkAt = clock + 0.04;
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
      const x0 = c.left - s.left + padL + from.x - size / 2, y0 = c.top - s.top + base - from.y - size / 2;
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
      sparkle(c);
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
      if (next === "run") { runT = 0; runDist = 0; runFrame = -1; }
      if (next === "idle") {
        restore();
        introDone = true;
        busy = false; plan = []; step = null;
        nextActAt = clock + rand(3, 5);
      }
    };
    // "Designer" is knocked level (stomped, or it gives up on its own)
    const level = () => {
      if (!tilted) return;
      tilted = false;
      word.style.transform = "";
      word.animate(
        [{ transform: TILT }, { transform: "translateY(0.07em) rotate(0.8deg)", offset: 0.45 }, { transform: "none" }],
        { duration: 420, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
      );
    };
    const tiltWord = () => {
      if (tilted || wrapped) return;
      tilted = true;
      word.style.transformOrigin = "0 100%";
      word.style.transform = TILT;
      word.animate(
        [{ transform: "none" }, { transform: "translateY(-0.22em) rotate(-7deg)", offset: 0.55 }, { transform: TILT }],
        { duration: 380, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
      );
    };

    // --- free roaming -----------------------------------------------------------------------------
    const free = () => phase === "idle" || phase === "walk" || phase === "fly" || phase === "drag";
    const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];
    // Leave the ground for (tx, line): the arc clears the higher of the two lines, same gravity as
    // the intro. `flips` whole somersaults are fitted into the airtime.
    const launch = (tx: number, to: 0 | 1, power = 1, flips = 0) => {
      const gU = 2600 * k, gD = 3600 * k;
      const y1 = to ? -perchDrop : 0;
      const top = Math.max(y, y1) + 45 * k * power;
      vy = Math.sqrt(2 * gU * (top - y));
      const T = vy / gU + Math.sqrt((2 * (top - y1)) / gD);
      vx = (tx - x) / T;
      if (Math.abs(tx - x) > 1) face = tx > x ? 1 : -1;
      floor = y1; plat = to; landX = tx;
      spin = 0; spinRate = (flips * face * Math.PI * 2) / T;
      flipping = flips !== 0;
      grounded = false; phase = "fly";
      dust(3, -face);
    };
    // steps that take him from where he is to a spot on either line
    const route = (tx: number, to: 0 | 1): Step[] => {
      if (to === plat) return to ? [] : [{ kind: "run", x: tx }];
      if (to === 1) return [{ kind: "run", x: restX }, { kind: "jump", x: perchX, plat: 1 }];
      return [{ kind: "jump", x: restX, plat: 0 }, { kind: "run", x: tx }];
    };
    const nextStep = () => {
      step = plan.shift() ?? null;
      stepAt = clock;
      if (!step) return;
      busy = true;
      const s = step;
      if (s.kind === "run") {
        if (Math.abs(s.x - x) < 2) { step = null; return; }
        targetX = s.x; runT = 0; runFrame = -1; phase = "walk";
      } else if (s.kind === "jump") {
        landT = 0.09; pending = () => launch(s.x, s.plat);
      } else if (s.kind === "hop") {
        landT = 0.1; pending = () => launch(x, plat, s.power, s.flip);
      } else if (s.kind === "pose") {
        act = s.pose; actUntil = clock + s.dur;
        if (s.facing) stayFacing = s.facing;
      } else if (s.kind === "face") stayFacing = s.dir;
      else if (s.kind === "resume") {
        step = null; plan = []; face = 1; stayFacing = 1;
        setPhase("run");
      } else if (s.kind === "tilt") tiltWord();
      else if (s.kind === "loot") loot = s.xs.map((cx) => ({ x: cx, y: charH * 0.55, taken: false, born: clock }));
    };
    const stepTime = (s: Step) =>
      s.kind === "pose" || s.kind === "wait" ? s.dur : s.kind === "face" ? 0.4 : s.kind === "tilt" ? 0.5 : s.kind === "loot" ? 0.3 : Infinity;
    // replace whatever he was doing (he finishes a jump first)
    const command = (steps: Step[]) => {
      if (!introDone || gag === "hero" || gag === "stuck") return;
      gag = null;
      plan = steps; busy = true; act = null; pending = null;
      if (phase === "walk") phase = "idle";
      if (phase !== "fly") step = null;
    };
    const GESTURES: Pose[] = ["wave", "present", "think"];
    // a somersault needs air: higher for one turn, higher still for two
    const flipHop = (turns: number): Step => ({ kind: "hop", power: Math.abs(turns) > 1 ? 2 : 1.5, flip: turns });
    // Unprompted: something from the pool, weighted, never the same thing twice running.
    const improvise = () => {
      const here = plat ? restX : x; // where he will be once on the first line
      const span = lineEndX - startX;
      const home = perch ? plat === 1 : Math.abs(x - restX) < 4;
      const options: [string, number][] = [
        ["gesture", 2.6], ["hop", 1], ["flip", 1.6], ["stroll", 3.2], ["take", 1], ["dance", 1.1],
        ["coins", span > charH * 2.2 ? 1.7 : 0],
        ["word", !wrapped && !tilted && (plat === 1 || Math.abs(x - restX) > charH * 0.8) ? 1.3 : 0],
        ["perch", perch && plat === 0 ? 1.4 : 0],
        ["home", home ? 0 : 0.8],
      ];
      const pool = options.filter(([name, w]) => w > 0 && name !== lastAct);
      let r = Math.random() * pool.reduce((sum, [, w]) => sum + w, 0);
      const name = (pool.find(([, w]) => (r -= w) < 0) ?? pool[0])[0];
      lastAct = name;
      const f = stayFacing;
      if (name === "gesture") plan = [{ kind: "pose", pose: pick(GESTURES), dur: rand(1.2, 1.8), facing: pick([-1, 1, 1]) }];
      else if (name === "hop") plan = [{ kind: "hop", power: rand(0.6, 1), flip: 0 }];
      else if (name === "flip") plan = [flipHop(pick([1, -1, 1, 2]))];
      else if (name === "take") plan = [{ kind: "face", dir: -f }, { kind: "wait", dur: rand(0.3, 0.7) }, { kind: "face", dir: f }];
      else if (name === "dance")
        plan = [{ kind: "hop", power: 0.5, flip: 0 }, { kind: "face", dir: -f }, { kind: "hop", power: 0.5, flip: 0 }, { kind: "face", dir: f }, flipHop(1)];
      else if (name === "perch") plan = route(perchX, 1);
      else if (name === "home") plan = perch ? route(perchX, 1) : route(restX, 0);
      else if (name === "word")
        plan = [{ kind: "tilt" }, { kind: "pose", pose: "think", dur: 0.8, facing: plat === 1 || restX < x ? -1 : 1 }, { kind: "jump", x: restX, plat: 0 }, { kind: "pose", pose: "wave", dur: 1 }];
      else if (name === "coins") {
        const dest = here - startX > lineEndX - here ? startX : lineEndX;
        const xs = [0.3, 0.55, 0.8].map((t) => here + (dest - here) * t);
        plan = [{ kind: "loot", xs }, ...route(dest, 0), { kind: "pose", pose: "wave", dur: 1.2, facing: dest < here ? 1 : -1 }];
      } else {
        // a stroll: somewhere else on the first line, sometimes with a gesture on arrival
        let tx = startX + Math.random() * span;
        for (let i = 0; i < 6 && Math.abs(tx - here) < charH * 0.9; i++) tx = startX + Math.random() * span;
        plan = route(tx, 0);
        if (Math.random() < 0.5) plan.push({ kind: "pose", pose: pick(GESTURES), dur: rand(1, 1.5), facing: pick([-1, 1]) });
      }
      busy = true;
    };
    // a click on him: a different trick each time, and every third one throws coins
    const trick = () => {
      tricks++;
      const flip = pick([0, 1, -1, 1, 2]);
      command([flip ? flipHop(flip) : { kind: "hop", power: 1, flip: 0 }]);
      if (tricks % 3 === 0) sparkle({ x, y: y + charH * 0.6, taken: true });
    };

    // A fall from the visitor's hand ends one of two ways.
    const heroLanding = () => {
      gag = "hero"; gagAt = clock; landT = 0;
      landPow = 0.22;
      dust(8, 0, 1.3);
      rings.push({ x, y: y + charH * 0.02, age: 0 });
      dip(plat ? perchWord ?? line : line, 8);
    };
    // Wedged between two words. The words are really moved: everything left of him is pushed left,
    // everything right of him right, and the two he is between lean away from him.
    const pry = () => {
      const lean = (spread / (lineH * 0.2)) * 1.6;
      words.forEach((el, i) => {
        const side = i < wedge ? -1 : 1;
        const next = i === wedge - 1 || i === wedge; // the two words touching him
        el.style.transformOrigin = side < 0 ? "100% 100%" : "0 100%";
        el.style.transform = `translateX(${(side * spread).toFixed(2)}px)${next ? ` rotate(${(side * lean).toFixed(2)}deg)` : ""}`;
      });
    };
    // the words spring shut again
    const unpry = () => {
      if (wedge < 0) return;
      words.forEach((el, i) => {
        const side = i < wedge ? -1 : 1;
        const from = el.style.transform;
        el.style.transform = "";
        el.animate(
          [{ transform: from }, { transform: `translateX(${-side * 2.5}px)`, offset: 0.4 }, { transform: `translateX(${side}px)`, offset: 0.7 }, { transform: "none" }],
          { duration: 420, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
        );
        if (el !== word) el.style.transformOrigin = "";
      });
      wedge = -1; spread = 0;
    };
    const getStuck = (g: { x: number; left: number }) => {
      if (tilted) level();
      gag = "stuck"; gagAt = clock; landT = 0; slipAt = -10;
      wedge = g.left; wedgeX = g.x;
      dust(8, 0, 1.2);
    };
    const sweat = (n: number) => {
      for (let i = 0; i < n; i++) {
        const side = Math.random() < 0.5 ? -1 : 1;
        puffs.push({
          x: x + side * charH * rand(0.12, 0.2), y: y + charH * rand(0.8, 0.95),
          vx: side * charH * rand(0.4, 0.9), vy: charH * rand(0.5, 0.9),
          age: 0, life: rand(0.35, 0.5), size: charH * rand(0.014, 0.022), gold: false, sweat: true,
        });
      }
    };
    // Dropped before the intro was over    // Dropped before the intro was over: back to the first coin still waiting (or the run-up to the
    // leap if "Designer" is all that is left), then the script carries on as written.
    const resumeIntro = () => {
      const waiting = coins.slice(0, 3).filter((c) => !c.taken).map((c) => c.x - charH * 0.35);
      const from = Math.max(startX, Math.min(leapX - charH * 0.4, ...waiting));
      plan = x > from + 2 ? [{ kind: "run", x: from }, { kind: "resume" }] : [{ kind: "resume" }];
      busy = true;
    };
    // the pointer came at him and he would rather not: off along the line, or out of reach
    const flee = (from: number) => {
      const dir = from > 0 ? -1 : 1;
      hurry = true;
      if (plat === 0) {
        const tx = clamp(x + dir * charH * rand(2, 3.6), startX, lineEndX);
        if (Math.abs(tx - x) > charH * 0.8) command([{ kind: "run", x: tx }]);
        else if (perch && dir > 0) command(route(perchX, 1));
        else command([flipHop(dir)]); // cornered: over the top
      } else if (dir < 0) command(route(clamp(restX - charH * rand(1, 2.6), startX, lineEndX), 0));
      else command([flipHop(1)]);
    };

    const land = () => {
      // harder landings squash more and raise more dust
      const impact = clamp(-vy / (leapVy * 1.25), 0.5, 1.2);
      y = floor; vy = 0; grounded = true; landT = 0.14;
      landAt = clock; landPow = 0.15 * impact;
      dust(6, 0, impact);
      if (phase === "fly") {
        const moved = Math.abs(vx) > 1;
        const wasPopping = popping;
        x = landX; vx = 0; spin = 0; spinRate = 0; flipping = false; popping = false; hurry = false;
        phase = "idle"; step = null;
        if (moved) stayFacing = Math.random() < 0.65 ? 1 : face;
        if (dropped) {
          dropped = false;
          stayFacing = 1;
          if (stickAt !== null) getStuck(stickAt);
          else if (peakY - floor > charH * 0.45) heroLanding();
          stickAt = null;
        }
        if (gag === "stuck") {
          /* the words are busy being pushed apart */
        } else if (tilted && plat === 0 && Math.abs(x - restX) < charH * 0.5) level();
        else dip(plat ? perchWord ?? line : !wrapped && Math.abs(x - restX) < charH * 0.6 ? word : line, 4);
        if (wasPopping && introDone) {
          // out: he turns round and gives the gap a long look
          plan = [{ kind: "pose", pose: "think", dur: 1.1, facing: wedgeX < x ? -1 : 1 }];
          busy = true;
        }
      } else if (phase === "drop") {
        dip(line);
        setPhase("run");
      } else if (phase === "leap") {
        // stomp "Designer" level
        x = restX; plat = 0;
        if (tilted) level();
        else dip(wrapped ? line : word, 4);
        setPhase(perch ? "stomp" : "cheer");
        if (perch) landT = 0.26; // stay crouched, then spring straight into the hop
      } else if (phase === "hop") {
        x = perchX; plat = 1;
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

      if (phase === "drag") {
        // Held by the collar: a pendulum hanging from the pointer. Moving the hand sideways swings
        // him the other way; gravity and a little damping bring him back to hanging straight.
        const step = Math.max(dt, 0.004);
        gvx += ((gripX - prevGX) / step - gvx) * 0.35;
        gvy += ((gripY - prevGY) / step - gvy) * 0.35;
        prevGX = gripX; prevGY = gripY;
        const acc = clamp((gvx - prevGvx) / step, -9000, 9000);
        prevGvx = gvx;
        omega += (-70 * Math.sin(theta) - (acc / (charH * 0.5)) * Math.cos(theta) * 0.55 - 3.4 * omega) * dt;
        theta = clamp(theta + omega * dt, -1.35, 1.35);
        if (Math.hypot(gvx, gvy) > 650) flailUntil = clock + 0.45; // shaken: the legs go again
        // where his feet are, for the coins and for when he is let go
        const name = carryFrame();
        const [gx, gh] = gripOf(name);
        x = gripX + (FRAMES[name][4] - gx) * (charH / STAND_H) * face;
        y = gripY - gh * (charH / STAND_H);
      } else if (!grounded) {
        vy -= (vy > 0 ? 2600 : 3600) * k * dt;
        y += vy * dt;
        if (phase === "leap") x += runSpeed * dt;
        if (phase === "hop") x += hopVx * dt;
        if (phase === "fly") { x += vx * dt; spin += spinRate * dt; }
        if (dropped) peakY = Math.max(peakY, y);
        if (y <= floor && vy < 0) land();
      } else {
        landT = Math.max(0, landT - dt);
        if (gag) {
          const t = clock - gagAt;
          if (gag === "hero") {
            if (t > 2.08) gag = null;
          } else if (gag === "duck") {
            if ((t > 0.55 && !overFace) || t > 2.2) gag = null;
          } else {
            // Wedged up to the waist. He drops in with a thud that shoves the words apart, takes
            // it in, heaves himself half out and slips back, then heaves again and comes free.
            const deep = charH * 0.36, S = lineH * 0.2;
            const ease = (v: number) => { const c = clamp(v, 0, 1); return c * c * (3 - 2 * c); };
            const heave = t < PUSH1 ? 0 : t < SLIP ? 0.14 * ease((t - PUSH1) / (SLIP - PUSH1)) : t < PUSH2 ? 0 : 0.2 * ease((t - PUSH2) / (OUT - PUSH2));
            if (t >= SLIP && slipAt < 0) {
              // lost his grip: back down with a bump
              slipAt = clock;
              dust(4, 0, 0.7);
            }
            const sinceSlip = clock - slipAt;
            const thud = Math.exp(-t * 9) * Math.cos(t * 26) * 0.35 + (slipAt > 0 ? Math.exp(-sinceSlip * 10) * Math.cos(sinceSlip * 30) * 0.3 : 0);
            y = -deep * Math.min(1, t / 0.09) - deep * 0.12 * Math.exp(-t * 10) * Math.sin(t * 28) + charH * heave
              - (slipAt > 0 ? deep * 0.1 * Math.exp(-sinceSlip * 12) * Math.sin(sinceSlip * 30) : 0);
            spread = S * (1 - Math.exp(-t * 25)) * (1 + thud) + S * heave * 1.6;
            pry();
            const straining = (t > PUSH1 && t < SLIP) || t > PUSH2;
            if (straining && Math.random() < dt * 9) sweat(1);
            if (t > OUT) {
              gag = null; popping = true;
              unpry();
              // up and out, onto the word beside the gap
              const side = Math.random() < 0.5 ? -1 : 1;
              launch(clamp(wedgeX + side * charH * 0.5, startX, lineEndX), 0, 1.25);
              dust(6, 0, 1.2);
            }
          }
        } else if (pending && landT === 0) {
          const go = pending;
          pending = null;
          go();
        } else if (phase === "walk" && landT === 0) {
          // to a spot on his line: push off, then ease in to a stop
          const d = targetX - x;
          face = d < 0 ? -1 : 1;
          runT += dt;
          const e = Math.min(1, runT / 0.22);
          const speed = Math.min(runSpeed * (hurry ? 1.3 : 0.85) * (0.3 + 0.7 * e * (2 - e)), Math.abs(d) * 7 + charH * 0.3);
          const move = Math.min(Math.abs(d), speed * dt);
          x += face * move;
          runDist += move;
          const f = Math.floor((runDist * RUN_FPS) / runSpeed) % RUN.length;
          if (f !== runFrame) {
            if (runFrame < 0) dust(3, -face);
            else if (f % 4 === 1) dust(1, -face, 0.6);
            runFrame = f;
          }
          if (Math.abs(targetX - x) < 0.5) {
            x = targetX;
            dust(2, face, 0.5); // the skid
            phase = "idle"; step = null; hurry = false;
            stayFacing = Math.random() < 0.6 ? 1 : face;
          }
        } else if (phase === "idle") {
          if (step) {
            if (clock - stepAt >= stepTime(step)) step = null;
          } else if (plan.length) nextStep();
          else if (busy) {
            // done: tidy up, then leave a gap before the next idea
            busy = false;
            loot = [];
            if (!introDone) resumeIntro();
            else {
              if (tilted) level();
              nextActAt = clock + rand(2.5, 6.5);
            }
          } else if (introDone && !cue && !near && !act && clock > nextActAt && now - lastInput < AWAKE_MS) improvise();
        } else if (phase === "run" && landT === 0) {
          // push off: a quarter of a second to reach full pace
          runT += dt;
          const e = Math.min(1, runT / 0.26);
          const speed = runSpeed * (0.3 + 0.7 * e * (2 - e));
          x += speed * dt;
          runDist += speed * dt;
          const f = Math.floor((runDist * RUN_FPS) / runSpeed) % RUN.length;
          if (f !== runFrame) {
            if (runFrame < 0) dust(3, -1); // the first stride kicks back
            else if (f % 4 === 1) dust(1, -1, 0.6); // each footfall
            runFrame = f;
          }
          if (x >= leapX) { phase = "leap"; grounded = false; vy = leapVy; dust(3, -1); }
        } else if (phase === "stomp" && landT === 0) {
          // off the end of the first line, down onto "accelerate"
          phase = "hop"; grounded = false; vy = leapVy; floor = -perchDrop; dust(3, -1);
        } else if (phase === "cheer" && clock - phaseAt > 1.7) {
          setPhase("idle");
        }
        if (act && clock >= actUntil) act = null;
      }
      // coins he put there himself: picked up on the way past, and a stat gives a little jump
      for (const c of loot) {
        if (c.taken || Math.abs(x - c.x) > charH * 0.14 || y > charH * 0.5 || plat !== 0) continue;
        c.taken = true;
        sparkle(c);
        if (stats.length) pop(pick(stats));
      }
      // the intro's coins: his by passing through them, on foot, in the air or in the visitor's hand
      if (!introDone && phase !== "wait") {
        for (const c of coins) {
          if (!c.taken && Math.abs(x - c.x) < charH * 0.16 && Math.abs(y + charH * 0.55 - c.y) < charH * 0.6) collect(c);
        }
      }
      for (const r of rings) r.age += dt;
      if (rings.length) rings = rings.filter((r) => r.age < 0.42);
      // landing: squash, spring a little past full height, settle
      const sinceLand = clock - landAt;
      squash = sinceLand < 0.7 ? landPow * Math.exp(-sinceLand * 8) * Math.cos(sinceLand * 17) : 0;
      // he leans into a run, tips forward going up and back coming down, and stretches with speed
      const running = (phase === "run" || phase === "walk") && grounded && landT === 0;
      const stuckT = clock - gagAt;
      const wantLean = gag === "stuck"
        ? ((stuckT > PUSH1 && stuckT < SLIP) || stuckT > PUSH2 ? Math.sin(stuckT * 22) * 0.07 : 0) // shaking with the effort
        : running ? 0.055
        : !grounded ? clamp(vy / leapVy, -1, 1) * -0.05 + (phase === "leap" || phase === "hop" || vx ? 0.03 : 0)
        : 0;
      lean += (wantLean - lean) * Math.min(1, dt * 12);
      air += ((grounded ? 0 : clamp(Math.abs(vy) / leapVy, 0, 1) * 0.06) - air) * Math.min(1, dt * 14);

      for (const p of puffs) {
        p.age += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 1 - Math.min(1, dt * (p.gold || p.sweat ? 4 : 6));
        p.vy = p.gold || p.sweat ? p.vy - charH * 2.2 * dt : p.vy * (1 - Math.min(1, dt * 5));
      }
      if (puffs.length) puffs = puffs.filter((p) => p.age < p.life);
      if (clock >= blinkAt + BLINK) blinkAt = clock + (Math.random() < 0.18 ? 0.16 : rand(2.2, 5.5));

      // ease the breathing and the wave in and out, then hold still
      const awake = phase !== "idle" || !grounded || landT > 0 || puffs.length > 0 || rings.length > 0 || act !== null || busy || gag !== null || now - lastInput < AWAKE_MS;
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
    // pointer position in his world: x along the headline, height above the first line
    const world = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { px: e.clientX - r.left - padL, py: r.top + base - e.clientY };
    };
    const onHim = (px: number, py: number, pad = 0) =>
      Math.abs(px - x) < charH * (0.3 + pad) && py - y > -charH * pad && py - y < charH * (1 + pad);
    // "grab": a hand ready to pinch, over him. "grabbing": pinching, wherever the pointer goes.
    const grabCursor = (v: "" | "grab" | "grabbing") => {
      section.style.cursor = v === "grab" ? HAND_OPEN : v === "grabbing" ? HAND_PINCH : "";
      document.documentElement.style.cursor = v === "grabbing" ? HAND_PINCH : "";
    };

    // Pointer movement keeps him awake. Coming right up to him gets a hello (he turns to the side
    // the pointer arrived from, once, and does not follow it); swiping past him fast makes him jump;
    // with the button held on him, it carries him.
    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      const { px, py } = world(e);
      if (armed && e.pointerType === "mouse" && phase !== "drag" && phase !== "wait" && Math.hypot(e.clientX - armed.x, e.clientY - armed.y) > 5) {
        // picked up by the collar, whatever he was doing (the intro included)
        plan = []; step = null; pending = null; act = null; busy = true;
        gag = null; popping = false; flipping = false; hurry = false;
        unpry(); // pulled out of the gap, if that is where he was
        phase = "drag"; grounded = false; vy = 0; vx = 0; spin = 0; spinRate = 0; landT = 0;
        gripX = prevGX = px; gripY = prevGY = py;
        gvx = gvy = prevGvx = 0; theta = 0; omega = 0;
        flailUntil = clock + 0.7;
        near = false;
        grabCursor("grabbing");
        wake();
      }
      if (phase === "drag") {
        gripX = clamp(px, 8 - padL, CW + padR - 8);
        const lowest = introDone && perch && gripX > lineEndX + charH * 0.2 ? -perchDrop : 0;
        gripY = clamp(py, lowest + charH * 0.64, base - 6);
        lastInput = performance.now();
        return;
      }
      if (!hovers.matches || e.timeStamp - lastMove < 50) return;
      const speed = Math.abs(e.clientX - lastMoveX) / Math.max(1, e.timeStamp - lastMove); // px per ms
      lastMove = e.timeStamp; lastMoveX = e.clientX;
      if (!visible()) return;
      const hover = phase !== "wait" && onHim(px, py, 0.12);
      const close = hover && phase === "idle" && grounded && !gag;
      if (close && !near) nearFacing = px < x - charH * 0.12 ? -1 : 1;
      if (hover !== (section.style.cursor !== "")) grabCursor(hover ? "grab" : "");
      near = close;

      // the pointer around him, once the intro is over and he is standing about
      const calm = introDone && phase === "idle" && grounded && !busy && (!gag || gag === "duck");
      const dx = px - x, dy = py - y;
      const face_ = calm && Math.abs(dx) < charH * 0.27 && dy > charH * 0.56 && dy < charH * 1.04;
      const under = calm && Math.abs(dx) < charH * 0.42 && dy < -charH * 0.03 && dy > -charH * 0.5;
      const approach = calm && Math.abs(dx) < charH * 1.15 && dy > -charH * 0.2 && dy < charH * 1.3;
      const t = e.timeStamp;
      if (approach && !wasApproach && !hover && t - lastFlee > 3000 && Math.random() < 0.35) {
        lastFlee = t;
        flee(dx);
      } else if (face_ && !overFace && t - lastDuck > 900) {
        lastDuck = t;
        gag = "duck"; gagAt = clock; // a hand across the face: down he goes
      } else if (under && !wasUnder && t - lastUnder > 1200) {
        lastUnder = t;
        command([{ kind: "hop", power: 0.9, flip: 0 }]); // something under his feet
      } else if (close && speed > 1.4 && t - lastStartle > 2500) {
        lastStartle = t;
        command([{ kind: "hop", power: 0.8, flip: 0 }]);
      }
      overFace = face_; wasUnder = under; wasApproach = approach;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (reduced || phase === "wait" || !visible() || e.button > 0) return;
      const { px, py } = world(e);
      if (phase !== "drag" && onHim(px, py, 0.12)) {
        armed = { x: e.clientX, y: e.clientY };
      } else if (hovers.matches && phase !== "drag") {
        // a click on the headline sends him there
        const box = h1.getBoundingClientRect();
        const row = Math.floor((e.clientY - box.top) / lineH);
        const inside = e.clientX > box.left && e.clientX < box.left + CW;
        if (inside && row === 0 && px < lineEndX + charH * 0.4) command(route(clamp(px, startX, lineEndX), 0));
        else if (inside && perch && row === 1 && px > lineEndX) command(route(perchX, 1));
      }
      wake();
    };
    const onUp = () => {
      if (phase === "drag") {
        // Let go, or thrown: he falls to a line he can stand on, tumbling if thrown hard. During
        // the intro that is always the first line, where the coins are.
        const gU = 2600 * k, gD = 3600 * k;
        const reach = x + clamp(gvx, -1400, 1400) * 0.18;
        const to: 0 | 1 = introDone && perch && reach > lineEndX + charH * 0.35 ? 1 : 0;
        let tx = to ? perchX : clamp(reach, startX, lineEndX);
        stickAt = null;
        if (to === 0 && gaps.length && Math.random() < 0.35) {
          // now and then he comes down in the gap between two words
          const gap = gaps.reduce((best, g) => (Math.abs(g.x - tx) < Math.abs(best.x - tx) ? g : best));
          if (Math.abs(gap.x - tx) < charH * 1.3) { tx = gap.x; stickAt = gap; }
        }
        const y1 = to ? -perchDrop : 0;
        y = Math.max(y, y1 + 1);
        vy = clamp(gvy, -leapVy, leapVy * 0.9);
        const T = Math.max(
          0.14,
          vy > 0
            ? vy / gU + Math.sqrt((2 * (y + (vy * vy) / (2 * gU) - y1)) / gD)
            : (vy + Math.sqrt(vy * vy + 2 * gD * (y - y1))) / gD
        );
        vx = (tx - x) / T;
        if (Math.abs(gvx) > 120) face = gvx > 0 ? 1 : -1;
        floor = y1; plat = to; landX = tx;
        // he leaves the hand at the angle he was swinging at, and is upright again by the ground
        flipping = Math.abs(gvx) > 500 && T > 0.35;
        spin = -theta;
        spinRate = ((flipping ? face * Math.PI * 2 : 0) - spin) / T;
        theta = 0; omega = 0;
        dropped = true; peakY = y;
        phase = "fly";
        near = false;
        grabCursor("");
      } else if (armed && introDone && free() && grounded && !gag) trick();
      armed = null;
      wake();
    };
    const onCancel = () => { armed = null; if (phase === "drag") onUp(); };
    // holding the button on him must not start selecting the headline under the pointer
    const onSelect = (e: Event) => { if (armed || phase === "drag") e.preventDefault(); };
    const onFocusIn = (e: FocusEvent) => { if (cueOf(e.target) === "chat") { cue = "chat"; wake(); } };
    const onFocusOut = (e: FocusEvent) => { if (cueOf(e.target) === "chat") { cue = null; wake(); } };
    const onScroll = () => {
      if (!visible()) return;
      // now and then a scroll makes him jump
      const now = performance.now();
      if (introDone && phase === "idle" && grounded && !busy && !gag && !reduced && now - lastStartle > 5000 && Math.random() < 0.4) {
        lastStartle = now;
        command([{ kind: "hop", power: 0.7, flip: 0 }]);
      }
      wake();
    };

    const ro = new ResizeObserver(() => {
      if (!ready || gag === "stuck") return; // the words are out of place; measure once he is out
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
          x = startX; y = charH * 1.3; vy = 0; floor = 0; grounded = false; alpha = 0;
          last = lastInput = performance.now();
          schedule();
        }, 800);
        document.addEventListener("pointerover", onOver, { passive: true });
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onDown, { passive: true });
        window.addEventListener("pointerup", onUp, { passive: true });
        window.addEventListener("pointercancel", onCancel, { passive: true });
        document.addEventListener("selectstart", onSelect);
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
      words.forEach((el) => { el.style.transform = ""; if (el !== word) el.style.transformOrigin = ""; });
      if (ring) ring.style.strokeDashoffset = "";
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      document.removeEventListener("selectstart", onSelect);
      section.style.cursor = "";
      document.documentElement.style.cursor = "";
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [revealed]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute left-0 top-0 z-20 pointer-events-none select-none" />;
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
