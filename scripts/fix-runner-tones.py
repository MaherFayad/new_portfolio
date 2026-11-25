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


# --- second pass: skin tone and head size -------------------------------------------------------
# The look frames also have a more orange skin and a head about a fifth larger than the rest.
from scipy import ndimage as ndi  # noqa: E402

UP = 4
sheet = np.array(Image.open(SRC + "hero.png").convert("RGBA"))


def skin_of(rgba):
    r, g, b = (rgba[..., i].astype(int) for i in range(3))
    return (rgba[..., 3] > 128) & (r > 150) & (r > g) & (g > b) & (r - b > 40)


def head_of(alpha, chin=None):
    """(mask, widest row, neck row, neck centre x): follow the silhouette down from the crown to
    the narrowest row under the widest one."""
    op = alpha > 0.5
    top = np.nonzero(op.any(1))[0][0]
    cx = np.nonzero(op[top])[0].mean()
    widths, mids = [], []
    for r in range(top, op.shape[0]):
        lab, n = ndi.label(op[r])
        if not n:
            break
        runs = [np.nonzero(lab == i + 1)[0] for i in range(n)]
        run = min(runs, key=lambda v: 0 if v[0] <= cx <= v[-1] else min(abs(v[0] - cx), abs(v[-1] - cx)))
        widths.append(len(run)); mids.append(run.mean()); cx = run.mean()
    widths = np.array(widths)
    widest = int(widths[: len(widths) // 2].argmax())
    span = widths[widest: widest + int(widths[widest] * 0.9)]
    neck = widest + int(span.argmin())
    if chin is not None:
        neck = chin - top  # bent-over poses have no narrow neck row: cut under the face instead
    above = op.copy(); above[top + neck:] = False
    lab, n = ndi.label(above)
    head = lab == (1 + np.argmax(ndi.sum(above, lab, range(1, n + 1))))
    return head, int(widths[widest]), top + neck, float(mids[neck])


def chin_row(cell):
    """Bottom of the face: the lowest row of the largest patch of skin."""
    lab, n = ndi.label(skin_of(cell))
    face = lab == (1 + np.argmax(ndi.sum(lab > 0, lab, range(1, n + 1))))
    return int(np.nonzero(face.any(1))[0][-1]) + 3


def shrink_head(cell, k, chin=None):
    h, w = cell.shape[:2]
    a = cell[..., 3].astype(np.float32) / 255
    pre = cell[..., :3].astype(np.float32) * a[..., None]
    big_a = cv2.resize(a, (w * UP, h * UP), interpolation=cv2.INTER_NEAREST)
    big = cv2.resize(pre, (w * UP, h * UP), interpolation=cv2.INTER_NEAREST)
    head, _, neck, cx = head_of(big_a, None if chin is None else chin * UP)
    M = np.float32([[k, 0, cx * (1 - k)], [0, k, neck * (1 - k)]])
    size = (w * UP, h * UP)
    ha = cv2.warpAffine(big_a * head, M, size, flags=cv2.INTER_AREA)
    hc = cv2.warpAffine(big * head[..., None], M, size, flags=cv2.INTER_AREA)
    # under the old, larger head: carry the body's own pixels up into the sliver it uncovers
    body_a = big_a * ~head
    body = big * (~head)[..., None]
    hole = head & (np.arange(h * UP)[:, None] > neck - UP * 5)
    if hole.any():
        rgb8 = np.clip(big / np.maximum(big_a[..., None], 1e-3), 0, 255).astype(np.uint8)
        filled = cv2.inpaint(rgb8, hole.astype(np.uint8), UP * 2, cv2.INPAINT_TELEA).astype(np.float32)
        body = np.where(hole[..., None], filled, body)
        body_a = np.where(hole, 1.0, body_a)
    out_a = ha + body_a * (1 - ha)
    out = hc + body * (1 - ha)[..., None]
    small_a = cv2.resize(out_a, (w, h), interpolation=cv2.INTER_AREA)
    small = cv2.resize(out, (w, h), interpolation=cv2.INTER_AREA) / np.maximum(small_a[..., None], 1e-3)
    res = np.zeros_like(cell)
    res[..., :3] = np.clip(small, 0, 255).astype(np.uint8)
    solid = small_a > 0.5
    # The tip of the old, larger beard is left sticking out beside the new one, just under the cut:
    # a spur a few pixels thin. Open the silhouette there and drop whatever does not survive.
    new_head = cv2.resize(ha, (w, h), interpolation=cv2.INTER_AREA) > 0.5
    row = neck // UP
    cols = np.nonzero(new_head[max(0, row - 2)])[0]  # how wide the new beard is where it meets the body
    band = np.zeros_like(solid)
    band[max(0, row - 3): row + 13] = True
    if len(cols):
        band[:, cols[0] - 1: cols[-1] + 2] = False
    dark = res[..., :3].max(-1) < 95  # beard, never the white collar
    opened = cv2.morphologyEx(solid.astype(np.uint8), cv2.MORPH_OPEN, np.ones((7, 7), np.uint8)).astype(bool)
    solid &= ~(band & dark & ~opened)
    res[..., 3] = np.where(solid, 255, 0)
    return res


ref_cell = sheet[y0:y0 + h0, x0:x0 + w0]
ref_skin = cv2.cvtColor(np.ascontiguousarray(ref_cell[..., :3]), cv2.COLOR_RGB2LAB).astype(np.float32)[skin_of(ref_cell)].mean(0)
ref_head = head_of(ref_cell[..., 3] / 255)[1]

for name in FRAMES:
    x, y, w, h = frames[name][:4]
    cell = sheet[y:y + h, x:x + w].copy()
    m = skin_of(cell)
    lab = cv2.cvtColor(np.ascontiguousarray(cell[..., :3]), cv2.COLOR_RGB2LAB).astype(np.float32)
    shift = ref_skin - lab[m].mean(0)
    if np.abs(shift).max() > 1.5:
        lab[m] += shift
        cell[..., :3] = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB)
    chin = chin_row(cell)
    head, width = head_of(cell[..., 3] / 255, chin)[:2]
    share = head.sum() / (cell[..., 3] > 128).sum()
    k = ref_head / width
    # the duck's head is tucked into his arms, and a "head" that is most of the figure means the
    # cut was wrong: both are left alone
    if name.startswith("look") and k < 0.93 and share < 0.5:
        cell = shrink_head(cell, max(k, 0.8), chin)
    print(f"{name}: head is {share:.0%} of the figure")
    print(f"{name}: skin shift {np.round(shift, 1)}, head {width}px vs {ref_head}px")
    sheet[y:y + h, x:x + w] = cell

Image.fromarray(sheet).save(SRC + "hero.png", optimize=True)
