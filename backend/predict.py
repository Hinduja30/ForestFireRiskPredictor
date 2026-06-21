import os
import numpy as np
import joblib

LABEL_NAMES = ["Low", "Medium", "High", "Extreme"]

FEATURE_COLS = [
    "latitude", "longitude", "brightness", "bright_t31",
    "thermal_delta", "frp", "confidence", "daynight_enc", "month"
]

RECOMMENDATIONS = {
    "Low":     "No immediate action required. Routine monitoring advised.",
    "Medium":  "Elevated risk detected. Increase patrol frequency in this zone.",
    "High":    "High fire risk. Alert forest department and prepare response teams.",
    "Extreme": "Immediate action required. Deploy response teams and issue public advisories.",
}

COLORS = {
    "Low": "#22c55e",
    "Medium": "#eab308",
    "High": "#f97316",
    "Extreme": "#ef4444"
}


def load_artifacts(model_dir="."):
    model = joblib.load(os.path.join(model_dir, "model.pkl"))
    scaler = joblib.load(os.path.join(model_dir, "scaler.pkl"))
    return model, scaler


def predict_risk(latitude, longitude, brightness, bright_t31,
                 frp, confidence, daynight, month=None, model_dir="."):
    model, scaler = load_artifacts(model_dir)

    daynight_enc = 1 if str(daynight).upper() == "D" else 0
    thermal_delta = float(brightness) - float(bright_t31)

    if month is None:
        from datetime import datetime
        month = datetime.now().month

    features = np.array([[
        float(latitude), float(longitude), float(brightness),
        float(bright_t31), thermal_delta, float(frp),
        float(confidence), daynight_enc, int(month)
    ]])

    features_scaled = scaler.transform(features)
    label_idx = int(model.predict(features_scaled)[0])
    proba = model.predict_proba(features_scaled)[0]
    label = LABEL_NAMES[label_idx]

    return {
        "risk": label,
        "probability": round(float(proba[label_idx]) * 100, 2),
        "recommendation": RECOMMENDATIONS[label],
        "color": COLORS[label],
        "all_probabilities": {
            LABEL_NAMES[i]: round(float(p) * 100, 2)
            for i, p in enumerate(proba)
        },
    }
