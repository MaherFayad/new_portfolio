"""The three "look" frames of the runner sheet were drawn with a different face. This rebuilds them
from the character's own art: each frame keeps its body and pose, and its head is replaced by the
head of the standing frame, tilted down towards what he is looking at. Nothing is drawn by hand.
Frame rectangles are unchanged. Run once, on a sheet that still has the old heads.

    pip install pillow numpy scipy opencv-python-headless
    python scripts/redraw-look-frames.py
"""
import json
import math

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = "public/runner/assets/"
UP = 4
# degrees the head tips forward, and a nudge (x, y) in sheet pixels to seat it on the collar
LOOK = {"look_0": (13, (-6, -5)), "look_1": (20, (-6, -5)), "look_2": (16, (-7, -5))}

sheet = np.array(Image.open(SRC + "hero.png").convert("RGBA"))
frames = json.load(open(SRC + "hero.json"))["frames"]


def skin_of(rgba):
    r, g, b = (rgba[..., i].astype(int) for i in range(3))
    return (rgba[..., 3] > 128) & (r > 150) & (r > g) & (g > b) & (r - b > 40)


def head_of(cell):
    """(mask, chin row, centre x at the chin): everything joined to the crown above the bottom of
    the face."""
    op = cell[..., 3] > 128
    lab, n = ndi.label(skin_of(cell))
    face = lab == (1 + np.argmax(ndi.sum(lab > 0, lab, range(1, n + 1))))
    chin = int(np.nonzero(face.any(1))[0][-1]) + 3
    above = op.copy(); above[chin:] = False
    lab, n = ndi.label(above)
    head = lab == (1 + np.argmax(ndi.sum(above, lab, range(1, n + 1))))
    cols = np.nonzero(head[chin - 1])[0]
    return head, chin, float(cols.mean())


def up(a, interp=cv2.INTER_NEAREST):
    return cv2.resize(a, (a.shape[1] * UP, a.shape[0] * UP), interpolation=interp)


x0, y0, w0, h0 = frames["idle_0"][:4]
idle = sheet[y0:y0 + h0, x0:x0 + w0].copy()
ihead, ichin, icx = head_of(idle)
# his beard and the bit of neck under it hang below the chin line: take them with the head
below = (idle[..., 3] > 128) & (np.arange(h0)[:, None] >= ichin) & (np.arange(h0)[:, None] < ichin + 9)
dark_or_skin = (idle[..., :3].max(-1) < 110) | skin_of(idle)
lab, n = ndi.label(ihead | (below & dark_or_skin & (np.abs(np.arange(w0)[None, :] - icx) < 22)))
ihead = lab == lab[np.nonzero(ihead)[0][0], np.nonzero(ihead)[1][0]]
src_a = up(ihead.astype(np.float32))
src = up(idle[..., :3].astype(np.float32)) * src_a[..., None]

for name, (deg, (nx, ny)) in LOOK.items():
    x, y, w, h = frames[name][:4]
    cell = sheet[y:y + h, x:x + w].copy()
    head, chin, cx = head_of(cell)
    # 1. take the old head off, and with it the old beard hanging under the chin line
    rows = np.arange(h)[:, None]
    old_beard = (cell[..., 3] > 128) & (rows >= chin) & (rows < chin + 10) & (cell[..., :3].max(-1) < 70) & (np.abs(np.arange(w)[None, :] - cx) < 20)
    # ...and what is left of the old face below that line: skin, the red of the mouth, and teeth
    # (white that is not part of the shirt)
    r_, g_, b_ = (cell[..., i].astype(int) for i in range(3))
    near = (rows >= chin - 2) & (rows < chin + 18) & (np.abs(np.arange(w)[None, :] - cx) < 42) & (cell[..., 3] > 128)
    red = (r_ > 130) & (g_ < 115) & (b_ < 115)
    white = (cell[..., :3].min(-1) > 175) & (cell[..., 3] > 128)
    teeth = white & ndi.binary_dilation(red, iterations=2)  # white touching the mouth, not the collar
    scraps = near & (skin_of(cell) | red | teeth)
    scraps = ndi.binary_dilation(scraps, iterations=1) & near & ~(white & ~teeth)
    # a scrap lying on the suit becomes suit; one sticking out above the shoulder just goes
    sl, sn = ndi.label(scraps)
    on_body = np.zeros_like(scraps)
    solid = (cell[..., 3] > 128) & ~head & ~scraps
    for i in range(1, sn + 1):
        m = sl == i
        rim = ndi.binary_dilation(m, iterations=2) & ~m
        if solid[rim].mean() > 0.6:
            on_body |= m
    gone = head | old_beard | scraps
    body_rgb = cell[..., :3].copy()
    hole = old_beard | on_body | (head & (rows > chin - 2))  # where the collar and shoulders continue underneath
    body_rgb = cv2.inpaint(np.ascontiguousarray(np.where(gone[..., None], 0, body_rgb).astype(np.uint8)), gone.astype(np.uint8), 2, cv2.INPAINT_TELEA)
    body_a = ((cell[..., 3] > 128) & ~gone) | hole
    # 2. his real head, tipped forward about the chin and seated where the old one was
    t = math.radians(deg)
    c, s = math.cos(t), math.sin(t)
    px, py = icx * UP, ichin * UP
    qx, qy = (cx + nx) * UP, (chin + ny) * UP
    M = np.float32([[c, -s, qx - c * px + s * py], [s, c, qy - s * px - c * py]])
    size = (w * UP, h * UP)
    ha = cv2.warpAffine(src_a, M, size, flags=cv2.INTER_LINEAR)
    hc = cv2.warpAffine(src, M, size, flags=cv2.INTER_LINEAR)
    out_a = ha + up(body_a.astype(np.float32)) * (1 - ha)
    out = hc + up(body_rgb.astype(np.float32)) * up(body_a.astype(np.float32))[..., None] * (1 - ha)[..., None]
    small_a = cv2.resize(out_a, (w, h), interpolation=cv2.INTER_AREA)
    small = cv2.resize(out, (w, h), interpolation=cv2.INTER_AREA) / np.maximum(small_a[..., None], 1e-3)
    cell[..., :3] = np.clip(small, 0, 255).astype(np.uint8)
    cell[..., 3] = np.where(small_a > 0.5, 255, 0)
    sheet[y:y + h, x:x + w] = cell
    print(f"{name}: head tipped {deg} deg, seated at ({cx:.0f}, {chin})")

Image.fromarray(sheet).save(SRC + "hero.png", optimize=True)
