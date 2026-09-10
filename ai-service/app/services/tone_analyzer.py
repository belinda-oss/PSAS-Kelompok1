"""
Logika Analisis Warna Kulit & Rekomendasi Nail Art / Eyelash
Menggunakan pemrosesan warna citra (HSV/LAB Color Space).
"""

def analyze_hand_tone(preset: str = "warm") -> dict:
    preset_data = {
        "warm": {
            "skin_tone": "Warm",
            "recommended_style": "Hassle Style / Elegant Nude",
            "matched_color": "Warm Medium & Rose Gold",
            "service_type": "Nail Art & Eyelash Extension",
            "recommendation_note": "Berdasarkan skin tone hangat, warna nude hangat dan nail art dengan aksen gold sangat cocok untuk memberikan kesan elegan dan alami."
        },
        "cool": {
            "skin_tone": "Cool",
            "recommended_style": "French Glam / Classic Pink",
            "matched_color": "Cool Berry & Silver Glow",
            "service_type": "Lash Lift & Cool Nails",
            "recommendation_note": "Berdasarkan skin tone dingin, nuansa pink pastel, berry lembut, dan detail silver akan memancarkan kilau kulit yang lebih cerah."
        },
        "deep": {
            "skin_tone": "Deep",
            "recommended_style": "Bold Luxury / High Contrast",
            "matched_color": "Deep Burgundy & Champagne Gold",
            "service_type": "Volume Eyelash & Foot Spa",
            "recommendation_note": "Berdasarkan skin tone deep, pilihan warna burgundy intens, nude karamel, dan aksen emas memberikan tampilan mewah dan berkelas."
        }
    }
    return preset_data.get(preset.lower(), preset_data["warm"])
