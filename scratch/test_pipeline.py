import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import math
import sys
sys.path.append('.')
from scratch.test_nail_decorator import generate_pattern

# Load HandLandmarker
base_options = python.BaseOptions(model_asset_path='ai-service/app/models/hand_landmarker.task')
options = vision.HandLandmarkerOptions(
    base_options=base_options,
    num_hands=2,
    min_hand_detection_confidence=0.3,
    min_hand_presence_confidence=0.3,
    min_tracking_confidence=0.3
)
detector = vision.HandLandmarker.create_from_options(options)

# Load test image
img_bgr = cv2.imread('ai-service/test_hand.jpg')
h, w, c = img_bgr.shape
print(f"Image loaded: {w}x{h}")

# MediaPipe needs RGB
img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)

detection_result = detector.detect(mp_image)
print(f"Detected hands: {len(detection_result.hand_landmarks)}")

if detection_result.hand_landmarks:
    for hand_idx, landmarks in enumerate(detection_result.hand_landmarks):
        print(f"Hand #{hand_idx+1}: {len(landmarks)} landmarks")
        # Finger tips & DIP pairs: (dip, tip, name, width_ratio)
        fingers = [
            (3, 4, 'Thumb', 0.52),
            (7, 8, 'Index', 0.44),
            (11, 12, 'Middle', 0.45),
            (15, 16, 'Ring', 0.43),
            (19, 20, 'Pinky', 0.40)
        ]
        for dip_idx, tip_idx, fname, wr in fingers:
            dip = landmarks[dip_idx]
            tip = landmarks[tip_idx]
            dx = (tip.x - dip.x) * w
            dy = (tip.y - dip.y) * h
            dist = math.hypot(dx, dy)
            angle = math.degrees(math.atan2(dy, dx))
            # Center of nail bed
            cx = int((tip.x * w) - 0.12 * dx)
            cy = int((tip.y * h) - 0.12 * dy)
            nail_len = int(dist * 0.42)
            nail_wid = int(dist * wr * 0.5)
            print(f"  {fname}: center=({cx}, {cy}), len={nail_len}, wid={nail_wid}, angle={angle:.1f}deg")
else:
    print("No hand landmarks detected directly. Fallback nail estimation will be used if needed.")
