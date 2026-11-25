"""A few frames of the runner's sprite sheet (the "look" set and the duck) are drawn with a
near-black suit and hair, darker than every other frame. This remaps their dark tones onto the
standing frame's, in place, and leaves skin, shirt and tie alone. Geometry is untouched, so the
frame table in hero.json stays valid. Safe to run again: frames already matched barely move.

    pip install pillow numpy opencv-python-headless
    python scripts/fix-runner-tones.py
"""
import json

import cv2
import numpy as np
from PIL import Image

SRC = "public/runner/assets/"
FRAMES = ["look_0", "look_1", "look_2", "duck_0"]

sheet = np.array(Image.open(SRC + "hero.png").convert("RGBA"))
frames = json.load(open(SRC + "hero.json"))["frames"]


def lab_of(rgba):
    return cv2.cvtColor(np.ascontiguousarray(rgba[..., :3]), cv2.COLOR_RGB2LAB).astype(np.float32), rgba[..., 3] > 128


x0, y0, w0, h0 = frames["idle_0"][:4]
ref, ref_mask = lab_of(sheet[y0:y0 + h0, x0:x0 + w0])
dst = np.percentile(ref[..., 0][ref_mask & (ref[..., 0] < 110)], [5, 50, 95])

for name in FRAMES:
    x, y, w, h = frames[name][:4]
    cell = sheet[y:y + h, x:x + w]
    lab, mask = lab_of(cell)
    src = np.percentile(lab[..., 0][mask & (lab[..., 0] < 110)], [5, 50, 95])
    L = lab[..., 0]
    lab[..., 0] = np.where(mask, np.interp(L, [0, *src, 140, 255], [0, *dst, 140, 255]), L)
    cell[..., :3] = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)
    print(f"{name}: dark tones {np.round(src)} -> {np.round(dst)}")

Image.fromarray(sheet).save(SRC + "hero.png", optimize=True)
