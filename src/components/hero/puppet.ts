// Vector Maher: a jointed puppet drawn with canvas paths, so every pose and every move between
// poses is computed, not flipped between pictures. Units are "puppet units": he is ~187 tall, the
// origin is the ground under his hips, x grows to his left (viewer's right), y grows downwards.
//
// A pose is a set of joint angles in radians. For limbs, 0 points straight down and positive
// swings towards +x; the second angle of a limb is relative to the first (elbow, knee).

export type Hand = "pocket" | "fist" | "open" | "point";
export type Pose = {
  lean: number; // torso rotation about the hips
  head: number; // head tilt, relative to the torso
  armL: [number, number]; // viewer-left arm: shoulder, elbow
  armR: [number, number];
  legL: [number, number]; // viewer-left leg: hip, knee
  legR: [number, number];
  handL: Hand;
  handR: Hand;
  smile: number; // 0 closed mouth .. 1 full grin
};

export const POSES = {
  idle: { lean: 0, head: 0, armL: [-0.36, 0.86], armR: [0.36, -0.86], legL: [-0.05, 0], legR: [0.05, 0], handL: "pocket", handR: "pocket", smile: 1 },
  wave: { lean: -0.02, head: -0.04, armL: [-1.5, -1.8], armR: [0.36, -0.86], legL: [-0.05, 0], legR: [0.05, 0], handL: "open", handR: "pocket", smile: 1 },
  present: { lean: 0.03, head: 0.05, armL: [-0.36, 0.86], armR: [0.5, 1.5], legL: [-0.05, 0], legR: [0.05, 0], handL: "pocket", handR: "open", smile: 1 },
  look: { lean: 0.16, head: 0.24, armL: [-0.4, 0.9], armR: [0.3, 0.2], legL: [-0.07, 0], legR: [0.07, 0], handL: "pocket", handR: "point", smile: 1 },
  rise: { lean: 0, head: -0.08, armL: [-2.0, -0.95], armR: [2.0, 0.95], legL: [-0.5, 1.25], legR: [0.75, -1.5], handL: "fist", handR: "fist", smile: 1 },
  fall: { lean: 0.02, head: 0.04, armL: [-1.5, -0.7], armR: [1.5, 0.7], legL: [-0.25, 0.5], legR: [0.4, -0.7], handL: "fist", handR: "fist", smile: 1 },
  crouch: { lean: 0.05, head: 0.05, armL: [-0.7, 0.4], armR: [0.7, -0.4], legL: [-0.55, 1.1], legR: [0.55, -1.1], handL: "fist", handR: "fist", smile: 1 },
} satisfies Record<string, Pose>;
export type PoseName = keyof typeof POSES;

/** One stride of the run cycle (phase in radians). */
export function runPose(phase: number): Pose {
  const leg = (p: number): [number, number] => [Math.sin(p) * 0.95, -(0.25 + (0.5 - 0.5 * Math.cos(p - 0.9)) * 1.5)];
  const arm = (p: number): [number, number] => [Math.sin(p) * 0.9, 1.35 + Math.sin(p) * 0.25];
  return { lean: 0.14, head: -0.06, armL: arm(phase), armR: arm(phase + Math.PI), legL: leg(phase + Math.PI), legR: leg(phase), handL: "fist", handR: "fist", smile: 1 };
}

export function clonePose(p: Pose): Pose {
  return { ...p, armL: [...p.armL], armR: [...p.armR], legL: [...p.legL], legR: [...p.legR] };
}

/** Move `cur` a fraction `t` of the way to `to` (joint angles ease; hands switch at once). */
export function easePose(cur: Pose, to: Pose, t: number) {
  const mix = (a: number, b: number) => a + (b - a) * t;
  cur.lean = mix(cur.lean, to.lean);
  cur.head = mix(cur.head, to.head);
  cur.smile = mix(cur.smile, to.smile);
  for (const key of ["armL", "armR", "legL", "legR"] as const) {
    cur[key][0] = mix(cur[key][0], to[key][0]);
    cur[key][1] = mix(cur[key][1], to[key][1]);
  }
  cur.handL = to.handL;
  cur.handR = to.handR;
}

// --- anatomy -------------------------------------------------------------------------------------
const HIP = 47; // standing hip height
const THIGH = 21, SHIN = 19, SHOE = 7;
const HIP_X = 10;
const SHOULDER_X = 21.5, SHOULDER_Y = -36; // relative to the hips, in the torso's frame
const UPPER = 18, FORE = 16;
const NECK_Y = -41;

const INK = "#0d0d10";
const SUIT = "#3a3a3f", SUIT_DARK = "#2a2a2e", SUIT_LIGHT = "#4a4a50";
const TROUSER = "#333338";
const SKIN = "#f3caa0", SKIN_SHADE = "#e2b287";
const HAIR = "#29292d", HAIR_LIGHT = "#36363b";
const SHIRT = "#f4f4f1", TIE = "#4b7bd3", TIE_DARK = "#3861b3";
const LINE = 2.3;

export type DrawOptions = {
  /** 0..1 eyes closed (blink) */
  blink?: number;
  /** extra forearm swing on the viewer-left arm, for the wave */
  waveL?: number;
  /** vertical stretch of the torso and head, for breathing (1 = none) */
  breath?: number;
  /** when false he is in the air: no foot planting */
  grounded?: boolean;
};

/**
 * Draws the puppet with its feet on y = 0 at x = 0. The caller sets the transform (position,
 * scale, mirroring). Returns nothing; all state is in `pose`.
 */
export function drawPuppet(ctx: CanvasRenderingContext2D, pose: Pose, opts: DrawOptions = {}) {
  const { blink = 0, waveL = 0, breath = 1, grounded = true } = opts;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // legs first, to find how high the hips sit with these knees (feet stay planted)
  const legs = ([[-1, pose.legL], [1, pose.legR]] as const).map(([side, [hip, knee]]) => {
    const kx = side * HIP_X + Math.sin(hip) * THIGH, ky = Math.cos(hip) * THIGH;
    const ax = kx + Math.sin(hip + knee) * SHIN, ay = ky + Math.cos(hip + knee) * SHIN;
    return { side, kx, ky, ax, ay };
  });
  const reach = Math.max(...legs.map((l) => l.ay)) + SHOE;
  const hipY = grounded ? -reach : -HIP;

  ctx.save();
  ctx.translate(0, hipY);

  const limb = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, w: number, fill: string) => {
    const path = new Path2D();
    path.moveTo(x0, y0); path.lineTo(x1, y1); path.lineTo(x2, y2);
    ctx.strokeStyle = INK; ctx.lineWidth = w + LINE * 2; ctx.stroke(path);
    ctx.strokeStyle = fill; ctx.lineWidth = w; ctx.stroke(path);
  };
  const shape = (path: Path2D, fill: string, line = LINE) => {
    ctx.fillStyle = fill; ctx.fill(path);
    if (line) { ctx.strokeStyle = INK; ctx.lineWidth = line; ctx.stroke(path); }
  };

  const arm = (side: -1 | 1, angles: [number, number], hand: Hand, swing: number) => {
    const sx = side * SHOULDER_X, sy = SHOULDER_Y;
    const a = angles[0], b = angles[0] + angles[1] + swing;
    const ex = sx + Math.sin(a) * UPPER, ey = sy + Math.cos(a) * UPPER;
    const wx = ex + Math.sin(b) * FORE, wy = ey + Math.cos(b) * FORE;
    limb(sx, sy, ex, ey, wx, wy, 12.5, SUIT);
    if (hand === "pocket") {
      // the hand is in the trouser pocket: only the cuff shows
      ctx.save();
      ctx.translate(wx, wy);
      ctx.rotate(-b);
      const tucked = new Path2D();
      tucked.roundRect(-6, -2.5, 12, 4, 1.5);
      shape(tucked, SHIRT, 1.4);
      ctx.restore();
      return;
    }
    // cuff, then hand, both along the forearm
    ctx.save();
    ctx.translate(wx, wy);
    ctx.rotate(-b);
    if (hand === "open") ctx.scale(1.2, 1.2);
    const cuff = new Path2D();
    cuff.roundRect(-6.2, -1.5, 12.4, 4.6, 1.6);
    shape(cuff, SHIRT);
    const palm = new Path2D();
    if (hand === "open") {
      // a mitten with four finger tips and a thumb
      palm.moveTo(-6, 3.5);
      palm.lineTo(-6.6, 12);
      for (let i = 0; i < 4; i++) palm.arc(-4.9 + i * 3.3, 13 + (i === 1 || i === 2 ? 1.6 : 0), 1.7, Math.PI, 0, true);
      palm.lineTo(6.6, 8);
      palm.quadraticCurveTo(11 * side, 7, 9.5 * side, 3.5);
      palm.lineTo(6, 3.5);
      palm.closePath();
    } else if (hand === "point") {
      palm.roundRect(-5.6, 3, 11.2, 9, 4);
      palm.roundRect(-1.4 + side * 2.5, 9, 3.6, 10, 1.8);
    } else {
      palm.arc(0, 8.6, 6.4, 0, Math.PI * 2);
    }
    shape(palm, SKIN);
    if (hand === "fist") {
      ctx.strokeStyle = SKIN_SHADE; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(-3, 10.5); ctx.lineTo(3, 10.5); ctx.stroke();
    }
    ctx.restore();
  };

  // --- legs (behind the jacket) ---
  for (const l of legs) {
    limb(l.side * HIP_X, 0, l.kx, l.ky, l.ax, l.ay, 16.5, TROUSER);
    // shoe: points outwards when standing, forwards when the leg swings
    const toe = Math.abs(pose.legL[0]) + Math.abs(pose.legR[0]) > 0.5 ? 1 : l.side;
    const shoe = new Path2D();
    shoe.roundRect(l.ax - 10 + toe * 4, l.ay - 1.5, 20, SHOE + 1.5, [5, 5, 2, 2]);
    shape(shoe, "#17171a");
    ctx.fillStyle = "#3f3f46";
    ctx.fillRect(l.ax - 3 + toe * 7, l.ay + 0.8, 6, 1.6);
  }

  // --- torso and everything attached to it ---
  ctx.rotate(pose.lean);
  ctx.scale(1, breath);

  const sideOf = (which: "L" | "R") => (which === "L" ? -1 : 1) as -1 | 1;
  // the arm swinging back in a run goes behind the jacket; every other arm is in front of it
  const behind = (["L", "R"] as const).filter((w) => pose[`hand${w}`] === "fist" && pose[`arm${w}`][0] < -0.25 && pose.lean > 0.1);
  const front = (["L", "R"] as const).filter((w) => !behind.includes(w));
  for (const w of behind) arm(sideOf(w), pose[`arm${w}`], pose[`hand${w}`], 0);

  const jacket = new Path2D();
  jacket.moveTo(-15, -42);
  jacket.quadraticCurveTo(-25, -41, -25.5, -31);
  jacket.lineTo(-23.5, 1.5);
  jacket.quadraticCurveTo(-23, 5.5, -18, 5.5);
  jacket.lineTo(18, 5.5);
  jacket.quadraticCurveTo(23, 5.5, 23.5, 1.5);
  jacket.lineTo(25.5, -31);
  jacket.quadraticCurveTo(25, -41, 15, -42);
  jacket.closePath();
  shape(jacket, SUIT);

  // shirt front, belt, tie, lapels
  ctx.save();
  ctx.clip(jacket);
  const shirt = new Path2D();
  shirt.moveTo(-9.5, -43); shirt.lineTo(9.5, -43); shirt.lineTo(6.5, 1); shirt.lineTo(-6.5, 1); shirt.closePath();
  shape(shirt, SHIRT, 0);
  const belt = new Path2D();
  belt.rect(-26, 0.2, 52, 6);
  shape(belt, "#141417", 0);
  ctx.restore();
  ctx.fillStyle = "#8f8f96";
  ctx.fillRect(-3.4, 1.2, 6.8, 3.4);
  ctx.fillStyle = "#141417";
  ctx.fillRect(-1.6, 2.2, 3.2, 1.4);

  const tie = new Path2D();
  tie.moveTo(-3.2, -41.5); tie.lineTo(3.2, -41.5); tie.lineTo(2.2, -36.5);
  tie.lineTo(5.2, -8); tie.lineTo(0, -1.5); tie.lineTo(-5.2, -8); tie.lineTo(-2.2, -36.5);
  tie.closePath();
  shape(tie, TIE, 1.5);
  ctx.strokeStyle = TIE_DARK; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(-2.4, -36.5); ctx.lineTo(2.4, -36.5); ctx.stroke();

  for (const s of [-1, 1]) {
    const lapel = new Path2D();
    lapel.moveTo(s * 15, -42); lapel.lineTo(s * 9, -43); lapel.lineTo(s * 5.5, -14); lapel.lineTo(s * 13.5, -24);
    lapel.closePath();
    shape(lapel, SUIT_DARK, 1.6);
    // collar point
    const collar = new Path2D();
    collar.moveTo(s * 9.5, -43.5); lapel.lineTo(s * 3.4, -42); collar.lineTo(s * 3.4, -42); collar.lineTo(s * 7.5, -35.5);
    collar.closePath();
    shape(collar, SHIRT, 1.3);
  }
  // jacket highlight
  ctx.strokeStyle = SUIT_LIGHT; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-21, -30); ctx.lineTo(-20, -8); ctx.stroke();

  // --- head ---
  ctx.save();
  ctx.translate(0, NECK_Y);
  ctx.rotate(pose.head);
  drawHead(ctx, blink, pose.smile, shape);
  ctx.restore();

  for (const w of front) arm(sideOf(w), pose[`arm${w}`], pose[`hand${w}`], w === "L" ? waveL : 0);

  ctx.restore();
}

function drawHead(
  ctx: CanvasRenderingContext2D,
  blink: number,
  smile: number,
  shape: (path: Path2D, fill: string, line?: number) => void
) {
  // neck
  ctx.fillStyle = SKIN_SHADE;
  ctx.fillRect(-5, -6, 12, 9);

  // hair: a big afro, one silhouette made of overlapping tufts
  const hair = new Path2D();
  const cx = -2, cy = -52, rx = 31, ry = 29;
  hair.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + 0.2;
    if (Math.sin(a) > 0.72) continue; // no tufts under the chin
    hair.moveTo(cx + Math.cos(a) * rx + 8.5, cy + Math.sin(a) * ry);
    hair.arc(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 8, 0, Math.PI * 2);
  }
  ctx.strokeStyle = INK; ctx.lineWidth = LINE * 2; ctx.stroke(hair);
  ctx.fillStyle = HAIR; ctx.fill(hair);
  // curls
  ctx.strokeStyle = HAIR_LIGHT; ctx.lineWidth = 1.5;
  for (const [x, y, r, s] of [[-20, -68, 3.6, 0.4], [-9, -75, 3.6, 2.2], [3, -77, 3.6, 4], [15, -73, 3.6, 5.5], [25, -66, 3.2, 1.2], [-28, -56, 3.6, 1], [-17, -58, 3.4, 3.2], [-5, -66, 3.4, 5.2], [8, -67, 3.2, 0.9], [20, -64, 3, 2.8], [-26, -43, 3.6, 4.4], [-20, -32, 3.4, 2]] as const) {
    ctx.beginPath(); ctx.arc(x, y, r, s, s + 3.6); ctx.stroke();
  }

  // ear (his right, on the viewer's left)
  const ear = new Path2D();
  ear.ellipse(-12.5, -33, 4.6, 6.2, 0, 0, Math.PI * 2);
  shape(ear, SKIN, 1.8);

  // face: turned slightly to the viewer's right
  const face = new Path2D();
  face.moveTo(-9, -52);
  face.quadraticCurveTo(-8, -61, 4, -61);
  face.lineTo(24, -61);
  face.quadraticCurveTo(33, -60, 33, -50);
  face.lineTo(33, -24);
  face.quadraticCurveTo(32, -5, 13, -4);
  face.quadraticCurveTo(-8, -5, -9, -24);
  face.closePath();
  shape(face, SKIN, 2);

  // beard with the moustache, wrapping the jaw
  const beard = new Path2D();
  beard.moveTo(-9.6, -37);
  beard.quadraticCurveTo(-4, -31, 2, -33);
  beard.quadraticCurveTo(13, -38.5, 24, -33);
  beard.quadraticCurveTo(30, -31, 33.6, -37);
  beard.lineTo(33.6, -23);
  beard.quadraticCurveTo(32, -3, 13, -2.5);
  beard.quadraticCurveTo(-8, -3.5, -9.6, -23);
  beard.closePath();
  shape(beard, HAIR, 1.8);

  // mouth
  const mw = 10.5, mh = 1 + 3.6 * smile;
  const mouth = new Path2D();
  mouth.moveTo(13 - mw, -25);
  mouth.lineTo(13 + mw, -25);
  mouth.quadraticCurveTo(13 + mw - 1, -25 + mh * 1.5, 13, -25 + mh * 1.55);
  mouth.quadraticCurveTo(13 - mw + 1, -25 + mh * 1.5, 13 - mw, -25);
  mouth.closePath();
  shape(mouth, SHIRT, 1.5);

  // nose
  ctx.strokeStyle = SKIN_SHADE; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(17, -44); ctx.lineTo(19.5, -37.5); ctx.lineTo(15, -37); ctx.stroke();

  // eyes and brows
  for (const ex of [4.5, 24.5]) {
    const open = 1 - blink;
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.ellipse(ex, -45.5, 2.5, Math.max(0.5, 2.1 * open), 0, 0, Math.PI * 2); ctx.fill();
    if (open > 0.6) { ctx.fillStyle = "#fff"; ctx.fillRect(ex + 0.5, -46.6, 1, 1); }
    ctx.strokeStyle = HAIR; ctx.lineWidth = 2.8;
    ctx.beginPath(); ctx.moveTo(ex - 5, -51); ctx.quadraticCurveTo(ex, -52.6, ex + 5, -51); ctx.stroke();
  }
}
