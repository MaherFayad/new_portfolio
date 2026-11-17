"""Builds the home hero's sprite assets from the runner's sheet.

    python3 scripts/build-hero-sprite.py        (needs pillow, numpy, scipy)

public/runner/assets/hero.png + hero.json  ->
  hero-home.webp  the same sheet with the background remover's leftovers cleaned up
  hero-wave.webp  the wave pose split in two cells (body without the hand | the hand), so the
                  hand can be rotated smoothly at the wrist instead of flipping between frames
"""
import json
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = "public/runner/assets/"
sheet = Image.open(SRC + "hero.png").convert("RGBA")
A = np.array(sheet).astype(int)
frames = json.load(open(SRC + "hero.json"))["frames"]


def parts(f):
    r, g, b, al = f[..., 0], f[..., 1], f[..., 2], f[..., 3]
    opaque = al > 40
    lum = (r * 299 + g * 587 + b * 114) // 1000
    sat = f[..., :3].max(-1) - f[..., :3].min(-1)
    skin = opaque & (r - b > 45) & (r > 150)
    blue = opaque & (b - r > 40)
    return opaque, lum, sat, skin, blue


for name, (x, y, w, h, _) in frames.items():
    f = A[y:y + h, x:x + w].copy()
    opaque, lum, sat, skin, blue = parts(f)
    near_skin = ndi.binary_dilation(skin, iterations=3)
    near_tie = ndi.binary_dilation(blue, iterations=3)
    tie_top = np.nonzero(blue.any(1))[0].min() if blue.any() else 0
    kill = np.zeros_like(opaque)

    # Leftover background. The real whites are the shirt (touches the tie), the teeth (centred
    # above the tie) and the cuffs (small bands touching a hand). Anything else white is what the
    # background remover missed: between the legs, under an arm, beside a raised hand or fist.
    tie_x = np.nonzero(blue)[1].mean() if blue.any() else w / 2
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
    A[y:y + h, x:x + w] = f

clean = Image.fromarray(A.astype("uint8"), "RGBA")
clean.save(SRC + "hero-home.webp", quality=90, method=6, alpha_quality=100)

# The wave pose, split into body and hand.
x, y, w, h, _ = frames["wave_2"]
f = A[y:y + h, x:x + w].copy()
opaque, lum, sat, skin, blue = parts(f)
lab, k = ndi.label(skin)
hand = max((lab == i for i in range(1, k + 1) if np.nonzero(lab == i)[1].mean() < w * 0.4 and np.nonzero(lab == i)[0].mean() < h * 0.5),
           key=lambda c: c.sum())
white = opaque & (lum > 165) & (sat < 40)
lab, k = ndi.label(white)
cuff = np.zeros_like(hand)
for i in range(1, k + 1):
    c = lab == i
    if (c & ndi.binary_dilation(hand, iterations=3)).any() and not (c & ndi.binary_dilation(blue, iterations=3)).any():
        cuff |= c
piece = ndi.binary_dilation(hand | cuff, iterations=2) & opaque  # take the dark outline with it
cy, cx = [float(v.mean()) for v in np.nonzero(cuff)]
out = np.zeros((h, w * 2, 4), dtype="uint8")
body = f.copy(); body[piece] = 0
only = f.copy(); only[~piece] = 0
out[:, :w] = body
out[:, w:] = only
Image.fromarray(out, "RGBA").save(SRC + "hero-wave.webp", quality=92, method=6, alpha_quality=100)
print(f"wave_2 cell {w}x{h}, wrist pivot x={cx:.1f} y={cy:.1f}, hand px={int(piece.sum())}")
