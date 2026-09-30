import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import math
import sys
sys.path.append('.')
from scratch.test_nail_decorator import generate_pattern

def decorate_nails_image(input_img_bgr, design_id="blush", nail_length_factor=1.0):
    h, w, c = input_img_bgr.shape
    output_bgr = input_img_bgr.copy()

    # Load HandLandmarker
    base_options = python.BaseOptions(model_asset_path='ai-service/app/models/hand_landmarker.task')
    options = vision.HandLandmarkerOptions(
        base_options=base_options,
        num_hands=2,
        min_hand_detection_confidence=0.25,
        min_hand_presence_confidence=0.25,
        min_tracking_confidence=0.25
    )
    detector = vision.HandLandmarker.create_from_options(options)

    img_rgb = cv2.cvtColor(input_img_bgr, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)
    detection_result = detector.detect(mp_image)

    # Pre-generate pattern
    pattern_bgra = generate_pattern(design_id, width=400, height=500)
    p_h, p_w = pattern_bgra.shape[:2]

    detected_nails = []

    if detection_result.hand_landmarks:
        for hand_idx, landmarks in enumerate(detection_result.hand_landmarks):
            fingers = [
                (3, 4, 'Thumb', 0.55, 0.48),
                (7, 8, 'Index', 0.46, 0.42),
                (11, 12, 'Middle', 0.47, 0.44),
                (15, 16, 'Ring', 0.45, 0.42),
                (19, 20, 'Pinky', 0.40, 0.38)
            ]
            for dip_idx, tip_idx, fname, wr, lr in fingers:
                dip = landmarks[dip_idx]
                tip = landmarks[tip_idx]
                dx = (tip.x - dip.x) * w
                dy = (tip.y - dip.y) * h
                dist = math.hypot(dx, dy)
                if dist < 5:
                    continue

                angle = math.degrees(math.atan2(dy, dx))
                
                # Center of nail
                cx = int((tip.x * w) - 0.10 * dx)
                cy = int((tip.y * h) - 0.10 * dy)
                
                # Determine nail dimensions
                nail_len = int(dist * lr * 1.1 * nail_length_factor)
                nail_wid = int(dist * wr * 0.55)

                if nail_len < 4 or nail_wid < 3:
                    continue

                detected_nails.append({
                    "finger": fname,
                    "center": (cx, cy),
                    "axes": (nail_wid, nail_len),
                    "angle": angle
                })

                # Create affine transformation from pattern to nail ellipse
                # Pattern top-center corresponds to nail tip
                src_pts = np.float32([
                    [p_w * 0.5, p_h * 0.1],     # Top
                    [p_w * 0.15, p_h * 0.5],    # Left
                    [p_w * 0.85, p_h * 0.5]     # Right
                ])
                
                rad = math.radians(angle)
                perp_rad = rad + math.pi / 2.0
                
                # Nail tip position along finger direction
                tip_x = cx + math.cos(rad) * (nail_len * 0.85)
                tip_y = cy + math.sin(rad) * (nail_len * 0.85)
                
                left_x = cx - math.cos(perp_rad) * (nail_wid * 0.9)
                left_y = cy - math.sin(perp_rad) * (nail_wid * 0.9)
                
                right_x = cx + math.cos(perp_rad) * (nail_wid * 0.9)
                right_y = cy + math.sin(perp_rad) * (nail_wid * 0.9)

                dst_pts = np.float32([
                    [tip_x, tip_y],
                    [left_x, left_y],
                    [right_x, right_y]
                ])

                M = cv2.getAffineTransform(src_pts, dst_pts)
                warped_pattern = cv2.warpAffine(pattern_bgra, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0,0))

                # Create precision nail mask (smooth almond/oval contour)
                nail_mask = np.zeros((h, w), dtype=np.float32)
                cv2.ellipse(nail_mask, (cx, cy), (nail_wid, nail_len), angle + 90, 0, 360, 1.0, -1)
                
                # Soft feathering around nail boundary
                blur_ksize = max(3, int(nail_wid * 0.25) * 2 + 1)
                feathered_mask = cv2.GaussianBlur(nail_mask, (blur_ksize, blur_ksize), 0)
                
                # Alpha composite pattern onto output
                pattern_rgb = warped_pattern[:, :, :3].astype(np.float32)
                pattern_alpha = (warped_pattern[:, :, 3].astype(np.float32) / 255.0) * feathered_mask * 0.92
                pattern_alpha = np.clip(pattern_alpha, 0.0, 1.0)[:, :, np.newaxis]

                output_bgr_f = output_bgr.astype(np.float32)
                output_bgr_f = output_bgr_f * (1.0 - pattern_alpha) + pattern_rgb * pattern_alpha

                # 4. Add Glossy Shine / Specular Highlight (Kilau Kuku Salon)
                shine_mask = np.zeros((h, w), dtype=np.float32)
                # Primary curved highlight streak slightly offset to the left edge
                shine_cx = int(cx - math.cos(perp_rad) * (nail_wid * 0.35))
                shine_cy = int(cy - math.sin(perp_rad) * (nail_wid * 0.35))
                shine_len = max(2, int(nail_len * 0.55))
                shine_wid = max(1, int(nail_wid * 0.18))
                
                cv2.ellipse(shine_mask, (shine_cx, shine_cy), (shine_wid, shine_len), angle + 90, 0, 360, 1.0, -1)
                
                # Secondary micro gleam at tip
                gleam_cx = int(tip_x - math.cos(rad) * (nail_len * 0.2) + math.cos(perp_rad) * (nail_wid * 0.25))
                gleam_cy = int(tip_y - math.sin(rad) * (nail_len * 0.2) + math.sin(perp_rad) * (nail_wid * 0.25))
                cv2.circle(shine_mask, (gleam_cx, gleam_cy), max(1, int(nail_wid * 0.12)), 0.7, -1)

                shine_blur = max(3, int(shine_wid * 1.5) * 2 + 1)
                feathered_shine = cv2.GaussianBlur(shine_mask, (shine_blur, shine_blur), 0)
                feathered_shine = feathered_shine * feathered_mask # keep within nail boundary

                # Add highlight in Screen blend
                shine_layer = np.full_like(output_bgr_f, 255.0)
                shine_intensity = np.clip(feathered_shine * 0.70, 0.0, 1.0)[:, :, np.newaxis]
                output_bgr_f = output_bgr_f + (shine_layer - output_bgr_f) * shine_intensity

                output_bgr = np.clip(output_bgr_f, 0, 255).astype(np.uint8)

    return output_bgr, detected_nails

# Test running
test_img = cv2.imread('ai-service/test_hand.jpg')
res_img, nails = decorate_nails_image(test_img, design_id="blush")
cv2.imwrite('scratch/rendered_nail_art.png', res_img)
print(f"Rendered successfully! Detected {len(nails)} nails. Saved to scratch/rendered_nail_art.png")
