#!/usr/bin/env python3
"""Generate KCD Lima theme assets with pixel-art chasquis."""

from pathlib import Path

try:
    from PIL import Image
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow", "-q"])
    from PIL import Image

PUBLIC = Path(__file__).resolve().parent.parent / "src/main/webui/public"
PUBLIC.mkdir(parents=True, exist_ok=True)

SKY = (135, 206, 235)
GREEN_DARK = (74, 124, 89)
GREEN_LIGHT = (107, 142, 78)
EARTH = (139, 105, 20)
TRAIL = (196, 163, 90)
STONE = (160, 150, 130)

# Side-view chasqui runner, 24x16 pixels (W x H)
CHASQUI_PIXELS = [
    "........................",
    "......ssss..............",
    ".....sshhss.............",
    ".....shgghs.............",
    ".....ssssss.............",
    "....dddbbbbd............",
    "...dddbbbbbd............",
    "...ddbbbllbd............",
    "..ddbbbbddbd............",
    "..bbblllbbb.............",
    "..bbbdddbbb.............",
    ".bbbdd..ddbb............",
    ".bbb....bbb.............",
    "..bb....bb..............",
    "..dd....dd..............",
    ".dd......dd.............",
]

PALETTES = {
    "blue": {
        "b": (46, 109, 164),   # tunic main
        "d": (26, 68, 110),    # tunic shadow
        "l": (108, 168, 220),  # tunic highlight
        "s": (222, 184, 150),  # skin
        "h": (61, 41, 20),     # hair
        "g": (241, 196, 15),   # headband
    },
    "red": {
        "b": (192, 57, 43),
        "d": (120, 35, 28),
        "l": (231, 108, 95),
        "s": (222, 184, 150),
        "h": (61, 41, 20),
        "g": (241, 196, 15),
    },
}

SCALE = 4


def render_pixel_sprite(palette_name: str) -> Image.Image:
    palette = PALETTES[palette_name]
    w = len(CHASQUI_PIXELS[0])
    h = len(CHASQUI_PIXELS)
    img = Image.new("RGBA", (w * SCALE, h * SCALE), (0, 0, 0, 0))
    pixels = img.load()

    for y, row in enumerate(CHASQUI_PIXELS):
        for x, ch in enumerate(row):
            if ch == ".":
                continue
            color = palette.get(ch)
            if not color:
                continue
            for dy in range(SCALE):
                for dx in range(SCALE):
                    pixels[x * SCALE + dx, y * SCALE + dy] = color + (255,)

    return img


def make_circuit():
    from PIL import ImageDraw

    w, h = 777, 518
    img = Image.new("RGB", (w, h), SKY)
    draw = ImageDraw.Draw(img)

    draw.polygon([(0, 280), (200, 120), (400, 200), (600, 80), (777, 160), (777, 320), (0, 340)], fill=GREEN_DARK)
    draw.polygon([(0, 340), (150, 260), (350, 300), (550, 220), (777, 280), (777, 518), (0, 518)], fill=GREEN_LIGHT)

    cx, cy = 390, 300
    for i in range(5):
        y = cy + i * 18
        width = 180 - i * 20
        draw.rectangle([cx - width // 2, y, cx + width // 2, y + 12], fill=EARTH, outline=STONE)
    draw.rectangle([cx - 30, cy - 40, cx + 30, cy], fill=STONE)
    draw.polygon([(cx - 50, cy - 40), (cx, cy - 80), (cx + 50, cy - 40)], fill=STONE)

    trail_width = 14
    draw.arc([40, 60, 720, 460], start=200, end=340, fill=TRAIL, width=trail_width)
    draw.arc([60, 80, 700, 440], start=340, end=520, fill=TRAIL, width=trail_width)
    draw.arc([100, 120, 660, 400], start=80, end=200, fill=TRAIL, width=trail_width)
    draw.line([(120, 150), (280, 90), (520, 80), (700, 110)], fill=TRAIL, width=trail_width)
    draw.line([(80, 270), (180, 450), (300, 420), (560, 470), (750, 320)], fill=TRAIL, width=trail_width)

    img.save(PUBLIC / "machu-picchu-circuit.png")


def make_favicon():
    sprite = render_pixel_sprite("blue").resize((32, 32), Image.Resampling.NEAREST)
    sprite.save(PUBLIC / "favicon.ico", format="ICO", sizes=[(32, 32)])


if __name__ == "__main__":
    make_circuit()
    render_pixel_sprite("blue").save(PUBLIC / "car-blue.png")
    render_pixel_sprite("red").save(PUBLIC / "car-red.png")
    make_favicon()
    print(f"Pixel-art chasquis written to {PUBLIC}")
