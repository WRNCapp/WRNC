"""Render the @GMW_357i origin carousel (1080x1350, Instagram 4:5).

Usage: python3 build_slides.py <source_dir> <font.ttf> [dog_photo] [regret_selfie]
Source photos are the owner's originals; outputs land next to this script.
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageOps

W, H = 1080, 1350
PHOTO_TOP, PHOTO_BOTTOM = 150, 1080  # photo band, text lives below it
OUT = os.path.dirname(os.path.abspath(__file__))

src, font_path = sys.argv[1], sys.argv[2]
dog = sys.argv[3] if len(sys.argv) > 3 else None
regret = sys.argv[4] if len(sys.argv) > 4 else None


def font(size):
    return ImageFont.truetype(font_path, size)


def load(name, box=None):
    im = Image.open(os.path.join(src, name)).convert("RGB")
    return im.crop(box) if box else im


def fit_band(im, anchor=0.5):
    """Scale-to-cover the photo band; anchor 0=left, 1=right."""
    bw, bh = W, PHOTO_BOTTOM - PHOTO_TOP
    s = max(bw / im.width, bh / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    l, t = round((im.width - bw) * anchor), (im.height - bh) // 2
    return im.crop((l, t, l + bw, t + bh))


def centered(d, y, text, size, fill="white"):
    f = font(size)
    w = d.textlength(text, font=f)
    d.text(((W - w) / 2, y), text, font=f, fill=fill)


def slide(n, photo, headline, sub=None, handle=True, anchor=0.5):
    c = Image.new("RGB", (W, H), "black")
    if photo is not None:
        c.paste(fit_band(photo, anchor), (0, PHOTO_TOP))
    d = ImageDraw.Draw(c)
    centered(d, 1120, headline, 92)
    if sub:
        centered(d, 1225, sub, 52, fill=(200, 200, 200))
    if handle:
        d.text((40, 60), "@GMW_357I", font=font(44), fill=(150, 150, 150))
        d.text((W - 110, 60), f"{n}/7", font=font(44), fill=(150, 150, 150))
    c.save(os.path.join(OUT, f"slide_{n}.jpg"), quality=92)


def cover(photo):
    """Full-bleed cover with a bottom gradient for legibility."""
    s = max(W / photo.width, H / photo.height)
    im = photo.resize((round(photo.width * s), round(photo.height * s)), Image.LANCZOS)
    l, t = (im.width - W) // 2, (im.height - H) // 2
    c = im.crop((l, t, l + W, t + H))
    shade = Image.new("L", (W, H), 0)
    sd = ImageDraw.Draw(shade)
    for y in range(850, H):
        sd.line([(0, y), (W, y)], fill=int(235 * (y - 850) / (H - 850)))
    c = Image.composite(Image.new("RGB", (W, H), "black"), c, shade)
    d = ImageDraw.Draw(c)
    centered(d, 1075, "IT SAYS BMW ON THE GRILLE.", 96)
    centered(d, 1170, "IT'S LYING.", 96, fill=(230, 60, 40))
    centered(d, 1275, "SWIPE  >", 46, fill=(200, 200, 200))
    c.save(os.path.join(OUT, "slide_1.jpg"), quality=92)


cover(load("24d033aa-image.png", (72, 565, 1140, 1912)))
slide(2, load("a9ab0e47-image.jpg", (0, 272, 1080, 1080)),
      "#001 DIDN'T START FINISHED.", "SAT IN MY YARD FOR 8 YEARS.")
slide(3, load("3bbab943-image.jpg", (0, 270, 1080, 1080)),
      "IT CAME APART FIRST.", "ENGINE. CLUTCH. DIFF. ALL OF IT.")

# Slide 4: the M60 confession. No photo of the M60 exists, so the face tells it.
def slide_4_text_only():
    c = Image.new("RGB", (W, H), "black")
    d = ImageDraw.Draw(c)
    d.text((40, 60), "@GMW_357I", font=font(44), fill=(150, 150, 150))
    d.text((W - 110, 60), "4/7", font=font(44), fill=(150, 150, 150))
    centered(d, 360, "MOST EXPENSIVE MISTAKE", 80, fill=(150, 150, 150))
    centered(d, 450, "SO FAR:", 80, fill=(150, 150, 150))
    centered(d, 620, "BOUGHT A BMW M60 V8.", 120)
    centered(d, 760, "NIKASIL BLOCK.", 120, fill=(230, 60, 40))
    centered(d, 960, "REVERSED COURSE.", 80)
    c.save(os.path.join(OUT, "slide_4.jpg"), quality=92)


slide(5, load("ba12c471-image.jpg"),
      "SO I WENT AMERICAN.", "5.7L LS1. PARTS IN EVERY TOWN.", anchor=1.0)
slide(6, load("6a8e4020-image.jpg", (0, 115, 1206, 880)),
      "BMW OUTSIDE. GM INSIDE.", "THAT'S THE GMW.")
def face_crop(im, cy=0.56):
    """Portrait photo into the landscape band, centered on the face (cy of height)."""
    h = round(im.width * (PHOTO_BOTTOM - PHOTO_TOP) / W)
    t = min(max(round(im.height * cy - h / 2), 0), im.height - h)
    return im.crop((0, t, im.width, t + h))


dog_im = ImageOps.exif_transpose(Image.open(dog)).convert("RGB") if dog else None
if dog_im is not None and dog_im.width > dog_im.height:
    slide(7, dog_im, "THE REAL CREW CHIEF.", "SUPERVISES. DOES NOT TURN WRENCHES.", anchor=0.85)
else:
    slide(7, face_crop(dog_im) if dog_im is not None else None,
          "THE REAL CREW CHIEF.", "SUPERVISES. DOES NOT TURN WRENCHES." if dog else "[ DOG PHOTO GOES HERE ]")
if regret:
    slide(4, face_crop(ImageOps.exif_transpose(Image.open(regret)).convert("RGB"), cy=0.62),
          "M60 V8. NIKASIL BLOCK.", "MOST EXPENSIVE MISTAKE SO FAR. REVERSED COURSE.")
else:
    slide_4_text_only()
print("done")
