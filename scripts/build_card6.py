from PIL import Image, ImageDraw

SVG_PATH = r"c:\Users\Admin\Documents\GitHub\New folder\public\card6-graphic.svg"
OUT_HI = r"c:\Users\Admin\Documents\GitHub\New folder\public\card6.webp"
OUT_LO = r"c:\Users\Admin\Documents\GitHub\New folder\public\card6_compressed.webp"

HI_SIZE = (683, 810)
LO_SIZE = (455, 540)
COVER_FILL = 0.96


def green_gradient(size: tuple[int, int]) -> Image.Image:
    width, height = size
    base = Image.new("RGB", size, "#0A5C3A")
    draw = ImageDraw.Draw(base)

    for y in range(height):
        t = y / max(height - 1, 1)
        r = int(10 + (46 - 10) * t)
        g = int(92 + (155 - 92) * t)
        b = int(58 + (98 - 58) * t)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    return base


def fit_cover(graphic: Image.Image, size: tuple[int, int]) -> tuple[Image.Image, tuple[int, int]]:
    target_w, target_h = size
    scale = max(target_w / graphic.width, target_h / graphic.height) * COVER_FILL
    new_w = int(graphic.width * scale)
    new_h = int(graphic.height * scale)
    resized = graphic.resize((new_w, new_h), Image.Resampling.LANCZOS)
    x = (target_w - new_w) // 2
    y = (target_h - new_h) // 2
    return resized, (x, y)


def render_svg_rgba(size: tuple[int, int]) -> Image.Image:
    import subprocess
    import tempfile
    import os

    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        subprocess.run(
            [
                "node",
                "-e",
                f"""
const sharp = require('sharp');
sharp('{SVG_PATH.replace(chr(92), '/')}', {{ density: 400 }})
  .resize({size[0]}, {size[1]}, {{ fit: 'inside', background: {{ r: 0, g: 0, b: 0, alpha: 0 }} }})
  .png()
  .toFile('{tmp_path.replace(chr(92), '/')}');
""",
            ],
            check=True,
            cwd=r"c:\Users\Admin\Documents\GitHub\New folder",
        )
        return Image.open(tmp_path).convert("RGBA")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def compose_card(size: tuple[int, int]) -> Image.Image:
    canvas = green_gradient(size).convert("RGBA")
    graphic = render_svg_rgba(size)
    resized, (x, y) = fit_cover(graphic, size)
    canvas.alpha_composite(resized, (x, y))
    return canvas.convert("RGB")


def main() -> None:
    hi = compose_card(HI_SIZE)
    lo = compose_card(LO_SIZE)
    hi.save(OUT_HI, "WEBP", quality=88, method=6)
    lo.save(OUT_LO, "WEBP", quality=82, method=6)
    print("Wrote", OUT_HI, OUT_LO)


if __name__ == "__main__":
    main()
