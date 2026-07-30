# Forest Fire Risk Predictor – Web App

A full-stack web application for forest fire risk prediction, powered by the original ML model (Random Forest + Gradient Boosting ensemble).

## Project Structure

```
forest_fire_app/
├── app.py                     ← Flask backend (API server)
├── forest_fire_predictor.py   ← Original ML model (unchanged)
├── requirements.txt
├── templates/
│   └── index.html             ← Frontend UI
├── model/
│   └── fire_pipeline.pkl      ← Auto-generated on first run
└── data/
    └── (place your .csv files here for custom training)
```

## Quick Start

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Flask server
```bash
python app.py
```

On first run, the model trains automatically using built-in sample data (~2000 rows). This takes ~10–20 seconds.

### 3. Open in browser
```
http://localhost:5000
```

## API Endpoints

### `POST /predict`
Predict fire risk for given weather conditions.

**Request body (JSON):**
```json
{
  "place":    "Bengaluru",
  "temp":     38.5,
  "humidity": 20.0,
  "wind":     25.0,
  "rain":     0.5
}
```

**Response:**
```json
{
  "place":       "Bengaluru",
  "probability": 0.84,
  "percent":     84.0,
  "level":       "CRITICAL",
  "icon":        "🔥",
  "advice":      "CRITICAL FIRE RISK...",
  "fwi":         85.2,
  "dryness_idx": 1.19,
  "prediction":  1,
  "inputs": { "temp": 38.5, "humidity": 20.0, "wind": 25.0, "rain": 0.5 }
}
```

### `POST /train`
Re-train the model (useful after adding new CSV data to `data/`).

## Custom Training Data

Place your CSV files in the `data/` folder. Supported column names:
- `temperature` / `temp`
- `humidity` / `rh` / `relative_humidity`
- `wind_speed` / `wind` / `ws`
- `rainfall` / `rain` / `precip`
- `fire_occurred` / `fire` / `classes` / `confidence`

Then call `POST /train` or restart the app with the model deleted.

## Risk Levels

| Level    | Probability | Color  |
|----------|-------------|--------|
| LOW      | 0–30%       | Green  |
| MODERATE | 30–55%      | Amber  |
| HIGH     | 55–75%      | Orange |
| CRITICAL | 75–100%     | Red    |
