"""Builds the home hero's vector character from the runner's pixel-art sheet.

    python3 scripts/build-hero-vector.py
    (needs: pillow numpy scipy opencv-python-headless scikit-learn)

public/runner/assets/hero.png + hero.json  ->
  public/hero/maher.svg            every frame the hero uses, traced to flat-colour vector shapes
  src/components/hero/frames.ts    where each frame sits in that sheet

Two steps per frame:
  1. clean  - remove what the background remover left behind (white beside hands, fists and
              legs, pale haze on the outline) while keeping teeth, shirt, collar and cuffs
  2. trace  - snap every pixel to a small fixed palette, smooth the pixel stairs, and outline
              each colour region as a vector path. The shapes are the artwork's own shapes, so
              the likeness is kept; only the blur and the noise go.
The wave pose is also split into body and hand, so the hand can swing at the wrist.
"""
import json
import numpy as np
import math
import cv2
from PIL import Image
from scipy import ndimage as ndi
from sklearn.cluster import KMeans

SRC = "public/runner/assets/"
UP = 8          # trace at 8x so one-pixel features (eyes, brows) survive the smoothing
COLOURS = 10
GAP = 4         # sheet px between frames

# (the sheet's "look" frames are drawn off-model, so the hero does not use them)
USED = (["idle_0", "wave_2", "waiting_2", "thinking_1"]
        + [f"runA_{i}" for i in range(8)] + [f"jump_{i}" for i in range(1, 5)]
        # the hard landing (crouch, then down on his knees and back up) and the limp carry
        + ["jump_0", "failed_1", "failed_2", "failed_3", "duck_0"]
        # wedged between two words: unimpressed, glaring, straining
        + ["review_2", "thinking_2", "thinking_3"])
# where his legs are in the standing frames (sheet px), so every pose stands on the same spot;
# the sheet's own anchors are bounding-box centres and drift when an arm goes out
TOO_DARK = ("duck_0",)  # drawn with a near-black suit; brought back to the standing frame's tones
STAND_AUTO = ("review_2", "thinking_2", "thinking_3")  # standing frames anchored by the script
LEGS_X = {"idle_0": 40, "wave_2": 47, "waiting_2": 45.6, "thinking_1": 41.5}

sheet = np.array(Image.open(SRC + "hero.png").convert("RGBA")).astype(int)
frames = json.load(open(SRC + "hero.json"))["frames"]


def parts(f):
    r, g, b, al = f[..., 0], f[..., 1], f[..., 2], f[..., 3]
    opaque = al > 40
    lum = (r * 299 + g * 587 + b * 114) // 1000
    sat = f[..., :3].max(-1) - f[..., :3].min(-1)
    skin = opaque & (r - b > 45) & (r > 150)
    blue = opaque & (b - r > 40)
    return opaque, lum, sat, skin, blue


def clean(f):
    f = f.copy()
    h, w = f.shape[:2]
    opaque, lum, sat, skin, blue = parts(f)
    near_skin = ndi.binary_dilation(skin, iterations=3)
    near_tie = ndi.binary_dilation(blue, iterations=3)
    tie_top = np.nonzero(blue.any(1))[0].min() if blue.any() else 0
    tie_x = np.nonzero(blue)[1].mean() if blue.any() else w / 2
    kill = np.zeros_like(opaque)
    # Leftover background. The real whites are the shirt (touches the tie), the teeth (centred
    # above the tie) and the cuffs (small bands touching a hand). Anything else white is what the
    # background remover missed: between the legs, under an arm, beside a raised hand or fist.
    for thr, min_area in ((165, 1), (120, 30)):
        lab, k = ndi.label(opaque & (lum > thr) & (sat < 40))
        for i in range(1, k + 1):
            c = lab == i
            ys, xs = np.nonzero(c)
            area, cx, cy = c.sum(), xs.mean(), ys.mean()
            if area < min_area or (c & near_tie).any():
                continue                                    # shirt and collar
            if cy < tie_top + 2 and abs(cx - tie_x) < 14:
                continue                                    # teeth
            touches_skin = (c & near_skin).any()
            if thr == 165:
                if not (touches_skin and area < 48):        # everything but a cuff
                    kill |= c
            elif cy > tie_top and not touches_skin:         # pale-grey leftovers below the collar
                kill |= c
    # Haze: peel light, colourless pixels off the silhouette edge (stops at the dark outline).
    keep = opaque & ~kill
    for _ in range(3):
        edge = keep & ndi.binary_dilation(~keep)
        peel = edge & (lum > 115) & (sat < 45) & ~ndi.binary_dilation(skin, iterations=1)
        if not peel.any():
            break
        keep &= ~peel
    f[opaque & ~keep] = 0
    return f


def split_wave(f):
    """wave_2 -> (body without the hand, the hand with its cuff, wrist pivot)"""
    h, w = f.shape[:2]
    opaque, lum, sat, skin, blue = parts(f)
    lab, k = ndi.label(skin)
    hands = [lab == i for i in range(1, k + 1)]
    hand = max((c for c in hands if np.nonzero(c)[1].mean() < w * 0.4 and np.nonzero(c)[0].mean() < h * 0.5), key=lambda c: c.sum())
    lab, k = ndi.label(opaque & (lum > 165) & (sat < 40))
    cuff = np.zeros_like(hand)
    for i in range(1, k + 1):
        c = lab == i
        if (c & ndi.binary_dilation(hand, iterations=3)).any() and not (c & ndi.binary_dilation(blue, iterations=3)).any():
            cuff |= c
    piece = ndi.binary_dilation(hand | cuff, iterations=2) & opaque  # take the dark outline with it
    body, only = f.copy(), f.copy()
    body[piece] = 0
    only[~piece] = 0
    ys, xs = np.nonzero(cuff)
    return body, only, (float(xs.mean()), float(ys.mean()))


def upscale(f):
    h, w = f.shape[:2]
    a = f[..., 3].astype(np.float32) / 255
    pre = f[..., :3].astype(np.float32) * a[..., None]
    big_a = cv2.resize(a, (w * UP, h * UP), interpolation=cv2.INTER_CUBIC)
    big = cv2.resize(pre, (w * UP, h * UP), interpolation=cv2.INTER_CUBIC) / np.maximum(big_a[..., None], 1e-3)
    return np.clip(big, 0, 255).astype(np.uint8), big_a


def head_of(alpha):
    """The head as drawn: (mask, widest row width, neck row, neck centre x) of an alpha map.
    Follows the silhouette down from the crown to the narrowest row under the widest one (the neck)."""
    op = alpha > 0.5
    rows = np.nonzero(op.any(1))[0]
    top = rows[0]
    cx = np.nonzero(op[top])[0].mean()
    widths, mids = [], []
    for r in range(top, op.shape[0]):
        lab, n = ndi.label(op[r])
        if not n:
            break
        runs = [np.nonzero(lab == i + 1)[0] for i in range(n)]
        run = min(runs, key=lambda x: 0 if x[0] <= cx <= x[-1] else min(abs(x[0] - cx), abs(x[-1] - cx)))
        widths.append(len(run)); mids.append(run.mean()); cx = run.mean()
    widths = np.array(widths)
    widest = int(widths[: len(widths) // 2].argmax())
    span = widths[widest: widest + int(widths[widest] * 0.9)]
    neck = widest + int(span.argmin())
    above = op.copy(); above[top + neck:] = False
    lab, n = ndi.label(above)
    head = lab == (1 + np.argmax(ndi.sum(above, lab, range(1, n + 1))))
    return head, int(widths[widest]), top + neck, float(mids[neck])


def shrink_head(big, big_a, k):
    """The run frames are drawn with a larger head than the standing poses. Scale the head by k
    about the neck so every frame shares one head size; the body is left as drawn."""
    head, _, neck, cx = head_of(big_a)
    M = np.float32([[k, 0, cx * (1 - k)], [0, k, neck * (1 - k)]])
    size = (big.shape[1], big.shape[0])
    ha = cv2.warpAffine(big_a * head, M, size, flags=cv2.INTER_AREA)
    pre = big.astype(np.float32) * (big_a * head)[..., None]
    hc = cv2.warpAffine(pre, M, size, flags=cv2.INTER_AREA) / np.maximum(ha[..., None], 1e-3)
    body_a = big_a * ~head
    # the smaller head uncovers a sliver of shoulder it used to hide: continue the body under it
    hole = cv2.dilate(head.astype(np.uint8), np.ones((UP * 3, UP * 3), np.uint8)).astype(bool) & (np.arange(big.shape[0])[:, None] > neck - UP * 6) & head
    filled = cv2.inpaint(big, (head & ~hole).astype(np.uint8) * 0 + hole.astype(np.uint8), UP, cv2.INPAINT_TELEA)
    body = np.where(hole[..., None], filled, big)
    body_a = np.where(hole, 1.0, body_a).astype(np.float32)
    a = ha[..., None]
    out = hc * a + body.astype(np.float32) * (1 - a)
    out_a = ha + body_a * (1 - ha)
    return np.clip(out, 0, 255).astype(np.uint8), out_a


def trace(f, centers, rgb, ox, head_k=1.0, scale=1.0):
    big, big_a = upscale(f)
    if head_k < 0.99:
        big, big_a = shrink_head(big, big_a, head_k)
    lab = cv2.cvtColor(big, cv2.COLOR_RGB2LAB).astype(np.float32)
    idx = ((lab[:, :, None, :] - centers[None, None]) ** 2).sum(-1).argmin(-1)
    # majority vote in a small neighbourhood: removes speckle and rounds the pixel stairs
    votes = np.stack([cv2.GaussianBlur((idx == i).astype(np.float32), (0, 0), UP * 0.55) for i in range(len(centers))], -1)
    idx = votes.argmax(-1)
    mask = cv2.GaussianBlur((big_a > 0.5).astype(np.float32), (0, 0), UP * 0.45) > 0.5
    order = np.argsort([-(mask & (idx == i)).sum() for i in range(len(centers))])  # big regions first
    out = []
    for i in order:
        m = (mask & (idx == i)).astype(np.uint8)
        m = cv2.dilate(m, np.ones((3, 3), np.uint8))  # a hair of overlap, so no gaps between colours
        contours, _ = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
        d = ""
        for c in contours:
            if cv2.contourArea(c) < UP * UP * 1.5:
                continue
            c = cv2.approxPolyDP(c, UP * 0.4, True)[:, 0, :] / UP * scale
            if len(c) < 3:
                continue
            # compact path data: integer tenths of a unit, relative moves
            pts = np.round((c + [ox, 0]) * 10).astype(int)
            steps = np.diff(pts, axis=0)
            d += f"M{pts[0][0]} {pts[0][1]}l" + " ".join(f"{dx} {dy}" for dx, dy in steps) + "z"
        if d:
            out.append(f'<path fill="#{rgb[i][0]:02x}{rgb[i][1]:02x}{rgb[i][2]:02x}" fill-rule="evenodd" d="{d}"/>')
    return out


def match_tone(f, ref):
    """Some frames are drawn darker than the rest (near-black suit and hair). Remap their dark
    tones onto the reference frame's, leaving skin, shirt and tie alone."""
    def lab_of(g):
        m = g[..., 3] > 128
        return cv2.cvtColor(g[..., :3].astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32), m
    lab, m = lab_of(f)
    rl, rm = lab_of(ref)
    dark, rdark = m & (lab[..., 0] < 110), rm & (rl[..., 0] < 110)
    src = np.percentile(lab[..., 0][dark], [5, 50, 95])
    dst = np.percentile(rl[..., 0][rdark], [5, 50, 95])
    L = lab[..., 0]
    mapped = np.interp(L, [0, *src, 140, 255], [0, *dst, 140, 255])
    lab[..., 0] = np.where(m, mapped, L)
    out = f.copy()
    out[..., :3] = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)
    return out


cells = {}  # name -> (pixels, anchor x)
for name in USED:
    x, y, w, h, ax = frames[name]
    pixels = clean(sheet[y:y + h, x:x + w])
    if name in TOO_DARK:
        x0, y0, w0, h0, _ = frames["idle_0"]
        pixels = match_tone(pixels, clean(sheet[y0:y0 + h0, x0:x0 + w0]))
    if name in STAND_AUTO:
        # same rule the hand-measured anchors follow: the middle of his feet
        ys, xs = np.nonzero(pixels[int(h * 0.93):, :, 3] > 128)
        ax = round(float(xs.mean()), 1)
        print(f"{name}: feet at {ax}")
    cells[name] = (pixels, LEGS_X.get(name, ax))
body, hand, wrist = split_wave(cells["wave_2"][0])
cells["wave_body"] = (body, LEGS_X["wave_2"])
cells["wave_hand"] = (hand, LEGS_X["wave_2"])

# one palette for every frame, so colours never shift between poses
px = np.concatenate([c[c[..., 3] > 128][:, :3] for c, _ in cells.values()]).astype(np.uint8)
lab = cv2.cvtColor(px.reshape(-1, 1, 3), cv2.COLOR_RGB2LAB).reshape(-1, 3).astype(np.float32)
centers = KMeans(n_clusters=COLOURS, n_init=4, random_state=3).fit(lab[:: max(1, len(lab) // 60000)]).cluster_centers_
rgb = cv2.cvtColor(centers.reshape(-1, 1, 3).astype(np.uint8), cv2.COLOR_LAB2RGB).reshape(-1, 3)

# One head size for every frame. The sheet draws the run cycle with a bigger head on the same body,
# and the jump frames smaller all over; the standing pose is the reference.
head_w = {n: head_of(c[..., 3] / 255)[1] for n, (c, _) in cells.items()}
REF = head_w["idle_0"]
RUN_HEAD = 0.86    # row-width measure says 0.82 (70px vs 85px); 0.86 matches the face, which is what the eye compares
FAILED_HEAD = 0.9  # the slumped frames are drawn with a bigger head too
JUMP_SCALE = 1.08  # measured by eye against the standing head: raised fists defeat head_of() here

paths, layout, ox = [], {}, 0
for name, (pixels, anchor) in cells.items():
    h, w = pixels.shape[:2]
    head_k = RUN_HEAD if name.startswith("runA") else FAILED_HEAD if name.startswith("failed") else 1.0
    scale = JUMP_SCALE if name in ("jump_1", "jump_2", "jump_3") else 1.0
    print(f"{name}: head {head_w[name]}px, head x{head_k:.2f}, frame x{scale:.2f}")
    paths += trace(pixels, centers, rgb, ox, head_k, scale)
    w, h, anchor = math.ceil(w * scale), math.ceil(h * scale), round(anchor * scale, 1)
    layout[name] = [ox, 0, w, h, anchor]
    ox += w + GAP
W, H = ox - GAP, max(v[3] for v in layout.values())
# intrinsic size is 3x the view box: some browsers rasterise an SVG image at its intrinsic size
# before scaling it, and he is drawn at up to ~2x
open("public/hero/maher.svg", "w").write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W * 3}" height="{H * 3}"><g transform="scale(.1)">' + "".join(paths) + "</g></svg>\n")
open("src/components/hero/frames.ts", "w").write(
    "// Generated by scripts/build-hero-vector.py. Do not edit by hand.\n"
    "// name -> [x, y, width, height, anchorX] in the units of /hero/maher.svg\n"
    f"export const SHEET_W = {W};\nexport const SHEET_H = {H};\n"
    f"export const WRIST = {{ x: {wrist[0]:.1f}, y: {wrist[1]:.1f} }}; // wave pose: the hand's pivot\n"
    "export const FRAMES: Record<string, [number, number, number, number, number]> = "
    + json.dumps(layout, indent=2) + ";\n")
print(f"maher.svg {W}x{H}, {len(paths)} paths; wrist {wrist}")
