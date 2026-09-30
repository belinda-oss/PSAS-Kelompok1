import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import os
import math
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

def generate_pattern(design_id: str, width: int = 500, height: int = 600) -> np.ndarray:
    """
    Generate high-resolution cute & aesthetic nail art patterns.
    """
    img = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    design_id = design_id.lower()

    if "blush" in design_id or "jelly" in design_id or "korean" in design_id:
        # Korean Blush Jelly Ombre: milky translucent base with rosy pink center aura
        for y in range(height):
            for x in range(width):
                pass
        base = Image.new("RGBA", (width, height), (255, 240, 242, 255))
        # Rosy blush aura in center
        aura = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        adraw = ImageDraw.Draw(aura)
        cx, cy = width // 2, int(height * 0.55)
        rx, ry = int(width * 0.42), int(height * 0.38)
        adraw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(235, 87, 115, 210))
        aura = aura.filter(ImageFilter.GaussianBlur(radius=int(width * 0.22)))
        base = Image.alpha_composite(base, aura)
        
        # Add delicate tiny star glitter & pearl sparkles
        sdraw = ImageDraw.Draw(base)
        sparkle_coords = [(width*0.35, height*0.35), (width*0.65, height*0.4), (width*0.5, height*0.65), (width*0.3, height*0.7)]
        for sx, sy in sparkle_coords:
            sdraw.ellipse([sx-3, sy-3, sx+3, sy+3], fill=(255, 255, 255, 240))
            sdraw.line([sx-8, sy, sx+8, sy], fill=(255, 255, 255, 200), width=1)
            sdraw.line([sx, sy-8, sx, sy+8], fill=(255, 255, 255, 200), width=1)
        return cv2.cvtColor(np.array(base), cv2.COLOR_RGBA2BGRA)

    elif "french" in design_id or "gold" in design_id:
        # French Glam Gold: Elegant nude pink bed with crisp white French smile curve & gold glitter lining
        base = Image.new("RGBA", (width, height), (248, 224, 218, 255))
        fdraw = ImageDraw.Draw(base)
        # French tip arc at top
        fdraw.pieslice([-width*0.2, -height*0.1, width*1.2, height*0.48], 0, 180, fill=(255, 255, 255, 255))
        # Gold metallic smile line
        fdraw.arc([-width*0.2, -height*0.1, width*1.2, height*0.49], 0, 180, fill=(222, 175, 78, 255), width=int(width*0.04))
        # Micro gold specks
        return cv2.cvtColor(np.array(base), cv2.COLOR_RGBA2BGRA)

    elif "aurora" in design_id or "pastel" in design_id:
        # Pastel Aurora Glaze: Iridescent shimmer gradient (Lavender, Mint, Peach)
        base = Image.new("RGBA", (width, height), (230, 220, 250, 255))
        grad = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        gdraw = ImageDraw.Draw(grad)
        gdraw.ellipse([0, 0, width, height], fill=(180, 230, 245, 170))
        gdraw.ellipse([int(width*0.2), int(height*0.3), int(width*1.1), height], fill=(255, 200, 220, 160))
        grad = grad.filter(ImageFilter.GaussianBlur(radius=int(width * 0.25)))
        base = Image.alpha_composite(base, grad)
        return cv2.cvtColor(np.array(base), cv2.COLOR_RGBA2BGRA)

    elif "cherry" in design_id or "sakura" in design_id or "floral" in design_id:
        # Cherry Blossom Floral: Soft milky sheer pink base with cute sakura flower petals
        base = Image.new("RGBA", (width, height), (252, 235, 238, 255))
        bdraw = ImageDraw.Draw(base)
        # Petals
        centers = [(width*0.5, height*0.45), (width*0.3, height*0.75), (width*0.72, height*0.25)]
        for cx, cy in centers:
            r = width * 0.13
            for angle in range(0, 360, 72):
                rad = math.radians(angle)
                px = cx + math.cos(rad) * r
                py = cy + math.sin(rad) * r
                bdraw.ellipse([px-r*0.6, py-r*0.6, px+r*0.6, py+r*0.6], fill=(255, 182, 193, 235))
            # Golden center
            bdraw.ellipse([cx-r*0.3, cy-r*0.3, cx+r*0.3, cy+r*0.3], fill=(245, 205, 95, 255))
        return cv2.cvtColor(np.array(base), cv2.COLOR_RGBA2BGRA)

    elif "starry" in design_id or "celestial" in design_id or "night" in design_id:
        # Celestial Starry Night: Deep midnight navy cat-eye with silver constellations
        base = Image.new("RGBA", (width, height), (18, 22, 45, 255))
        sdraw = ImageDraw.Draw(base)
        # Cosmic nebula dust
        nebula = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        ndraw = ImageDraw.Draw(nebula)
        ndraw.ellipse([int(width*0.1), int(height*0.2), int(width*0.9), int(height*0.8)], fill=(65, 85, 175, 180))
        nebula = nebula.filter(ImageFilter.GaussianBlur(radius=int(width * 0.2)))
        base = Image.alpha_composite(base, nebula)
        
        # Stars & crescent moon
        sdraw = ImageDraw.Draw(base)
        sdraw.ellipse([width*0.5-8, height*0.35-8, width*0.5+8, height*0.35+8], fill=(245, 245, 255, 240))
        sdraw.ellipse([width*0.5-4, height*0.35-10, width*0.5+10, height*0.35+6], fill=(18, 22, 45, 255))
        for x, y in [(0.25, 0.2), (0.75, 0.4), (0.4, 0.65), (0.7, 0.75), (0.3, 0.8)]:
            sdraw.ellipse([width*x-2, height*y-2, width*x+2, height*y+2], fill=(255, 255, 255, 240))
        return cv2.cvtColor(np.array(base), cv2.COLOR_RGBA2BGRA)

    elif "ruby" in design_id or "velvet" in design_id:
        # Ruby Velvet Glamour: Deep rich wine red with luminous 3D magnetic cat-eye slash
        base = Image.new("RGBA", (width, height), (115, 10, 32, 255))
        slash = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        sdraw = ImageDraw.Draw(slash)
        sdraw.line([-width*0.1, height*0.9, width*1.1, height*0.1], fill=(225, 75, 95, 220), width=int(width*0.28))
        slash = slash.filter(ImageFilter.GaussianBlur(radius=int(width * 0.12)))
        base = Image.alpha_composite(base, slash)
        return cv2.cvtColor(np.array(base), cv2.COLOR_RGBA2BGRA)

    elif "doodle" in design_id or "y2k" in design_id:
        # Cute Pastel Y2K Doodle: Cream base with mini hearts and smiles
        base = Image.new("RGBA", (width, height), (255, 250, 235, 255))
        ddraw = ImageDraw.Draw(base)
        # Cute pastel hearts
        ddraw.ellipse([width*0.35, height*0.4, width*0.5, height*0.52], fill=(255, 135, 160, 240))
        ddraw.ellipse([width*0.48, height*0.4, width*0.63, height*0.52], fill=(255, 135, 160, 240))
        ddraw.polygon([(width*0.35, height*0.46), (width*0.63, height*0.46), (width*0.49, height*0.62)], fill=(255, 135, 160, 240))
        # Smiles
        ddraw.arc([width*0.3, height*0.7, width*0.7, height*0.85], 0, 180, fill=(80, 160, 230, 240), width=int(width*0.04))
        return cv2.cvtColor(np.array(base), cv2.COLOR_RGBA2BGRA)

    else:
        # Minimalist Rose Gold Foil: Chic nude neutral with delicate gold flakes
        base = Image.new("RGBA", (width, height), (242, 226, 218, 255))
        fdraw = ImageDraw.Draw(base)
        # Gold leaf speckles
        gold_specks = [
            (width*0.3, height*0.3, 12), (width*0.65, height*0.25, 8),
            (width*0.5, height*0.5, 16), (width*0.35, height*0.7, 10),
            (width*0.7, height*0.65, 14)
        ]
        for gx, gy, sz in gold_specks:
            fdraw.polygon([
                (gx, gy - sz), (gx + sz*0.8, gy - sz*0.3),
                (gx + sz*0.6, gy + sz*0.7), (gx - sz*0.5, gy + sz*0.9),
                (gx - sz*0.9, gy + sz*0.2)
            ], fill=(218, 165, 32, 230))
        return cv2.cvtColor(np.array(base), cv2.COLOR_RGBA2BGRA)

print("Test generator loaded successfully!")
