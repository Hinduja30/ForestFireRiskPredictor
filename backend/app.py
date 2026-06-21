import os
import json
import time
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Optional

from predict import predict_risk, load_artifacts

MODEL = None
SCALER = None
MODEL_META = {}
MODEL_DIR = os.getenv("MODEL_DIR", ".")
START_TIME = time.time()


@asynccontextmanager
async def lifespan(app: FastAPI):
    global MODEL, SCALER, MODEL_META
    try:
        MODEL, SCALER = load_artifacts(MODEL_DIR)
        meta_path = os.path.join(MODEL_DIR, "meta.json")
        if os.path.exists(meta_path):
            with open(meta_path) as f:
                MODEL_META = json.load(f)
        print("✅ Model loaded.")
    except Exception as e:
        print(f"⚠️  Model load failed: {e}")
    yield


app = FastAPI(
    title="Forest Fire Risk Prediction API",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    latitude:   float = Field(..., ge=-90,  le=90,  example=18.22)
    longitude:  float = Field(..., ge=-180, le=180, example=77.12)
    brightness: float = Field(..., ge=200,  le=600, example=345.0)
    bright_t31: float = Field(..., ge=200,  le=600, example=310.0)
    frp:        float = Field(..., ge=0,            example=35.0)
    confidence: float = Field(..., ge=0,   le=100,  example=92.0)
    daynight:   str   = Field(default="D",          example="D")
    month:      Optional[int] = Field(default=None, ge=1, le=12)

    @field_validator("daynight")
    @classmethod
    def validate_daynight(cls, v):
        if v.upper() not in ("D", "N"):
            raise ValueError("daynight must be D or N")
        return v.upper()


@app.get("/")
def root():
    return {"message": "FireGuard API v2.0", "docs": "/docs", "health": "/health"}


@app.get("/health")
def health():
    return {
        "status": "ok" if MODEL else "model_not_loaded",
        "model_loaded": MODEL is not None,
        "accuracy": MODEL_META.get("accuracy"),
        "n_training_samples": MODEL_META.get("n_samples"),
        "uptime_seconds": round(time.time() - START_TIME, 1),
    }


@app.post("/api/predict")
def predict(req: PredictRequest):
    if MODEL is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")
    try:
        result = predict_risk(
            latitude=req.latitude,
            longitude=req.longitude,
            brightness=req.brightness,
            bright_t31=req.bright_t31,
            frp=req.frp,
            confidence=req.confidence,
            daynight=req.daynight,
            month=req.month,
            model_dir=MODEL_DIR,
        )
        result["thermal_delta"] = round(req.brightness - req.bright_t31, 2)
        result["timestamp"] = datetime.utcnow().isoformat() + "Z"
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/stats")
def stats():
    return {
        "model": "XGBoost Classifier",
        "accuracy": MODEL_META.get("accuracy"),
        "dataset": "MODIS FIRMS India 2010-2024",
        "n_samples": MODEL_META.get("n_samples"),
        "class_distribution": MODEL_META.get("class_distribution"),
    }
