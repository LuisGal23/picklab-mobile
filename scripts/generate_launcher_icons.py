#!/usr/bin/env python3
import os
import sys
from PIL import Image, ImageDraw, ImageFilter

def create_app_icon(logo_path: str, out_path: str, size: int = 192, is_round: bool = False):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background: modern deep dark navy/slate gradient
    bg = Image.new("RGBA", (size, size), (8, 14, 26, 255))
    bg_draw = ImageDraw.Draw(bg)

    # Draw gradient / glow circle
    glow_color = (34, 197, 94, 60) # Emerald glow
    bg_draw.ellipse(
        [(size * 0.15, size * 0.15), (size * 0.85, size * 0.85)],
        fill=glow_color
    )
    bg = bg.filter(ImageFilter.GaussianBlur(radius=size * 0.08))

    # Mask: round or rounded squircle
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    if is_round:
        mask_draw.ellipse([(0, 0), (size, size)], fill=255)
    else:
        radius = int(size * 0.22) # Squircle radius
        mask_draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)

    # Composite background with mask
    base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    base.paste(bg, (0, 0), mask=mask)

    # Subtle inner border for premium finish
    border_draw = ImageDraw.Draw(base)
    border_color = (255, 255, 255, 45)
    if is_round:
        border_draw.ellipse([(1, 1), (size - 2, size - 2)], outline=border_color, width=max(1, int(size * 0.015)))
    else:
        border_draw.rounded_rectangle([(1, 1), (size - 2, size - 2)], radius=int(size * 0.22), outline=border_color, width=max(1, int(size * 0.015)))

    # Load logo
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert("RGBA")
        # Scale logo to fit nicely (about 65% of icon size)
        target_logo_size = int(size * 0.65)
        logo.thumbnail((target_logo_size, target_logo_size), Image.Resampling.LANCZOS)
        
        offset_x = (size - logo.width) // 2
        offset_y = (size - logo.height) // 2

        # Add drop shadow under logo
        shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        shadow.paste(logo, (offset_x, offset_y + int(size * 0.02)), mask=logo)
        shadow_blur = shadow.filter(ImageFilter.GaussianBlur(radius=size * 0.04))
        base.paste(shadow_blur, (0, 0), mask=shadow_blur)

        # Paste logo
        base.paste(logo, (offset_x, offset_y), mask=logo)

    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    base.save(out_path, "PNG")
    print(f"Generated {out_path} ({size}x{size})")

if __name__ == "__main__":
    logo_file = sys.argv[1] if len(sys.argv) > 1 else "src/assets/logo.png"
    out_dir = sys.argv[2] if len(sys.argv) > 2 else "res"

    sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
        "drawable": 192,
    }

    for folder, sz in sizes.items():
        create_app_icon(logo_file, os.path.join(out_dir, folder, "ic_launcher.png"), size=sz, is_round=False)
        create_app_icon(logo_file, os.path.join(out_dir, folder, "ic_launcher_round.png"), size=sz, is_round=True)
