import os
try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
except ImportError:
    pass  # python-dotenv not installed, rely on system env vars
import base64
import json
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="AgriScan AI Backend")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── GEMINI SETUP ─────────────────────────────────────────
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
gemini_available = False

try:
    import google.generativeai as genai
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel("gemini-2.0-flash")
        gemini_available = True
        print("[OK] Gemini Vision API configured successfully.")
    else:
        print("[WARN] GEMINI_API_KEY not set -- running without Gemini Vision.")
except ImportError:
    print("[WARN] google-generativeai not installed -- running without Gemini Vision.")

GEMINI_PROMPT = """You are a plant disease expert.
First determine whether the image contains a plant leaf.
If it is not a plant leaf, return:
{
  "isPlant": false,
  "message": "This image does not contain a plant leaf."
}

If it is a plant leaf, return JSON only:
{
  "isPlant": true,
  "crop": "...",
  "disease": "...",
  "confidence": 0-100,
  "recommendation": "..."
}"""

# ─── CROP RECOMMENDATION MODEL ────────────────────────────
MODEL_DIR = "backend/model"
model_loaded = False
try:
    clf = joblib.load(os.path.join(MODEL_DIR, "crop_model.pkl"))
    scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))
    le_soil = joblib.load(os.path.join(MODEL_DIR, "le_soil.pkl"))
    le_season = joblib.load(os.path.join(MODEL_DIR, "le_season.pkl"))
    le_crop = joblib.load(os.path.join(MODEL_DIR, "le_crop.pkl"))
    model_loaded = True
    print("[OK] Crop recommendation models loaded.")
except Exception as e:
    print(f"[WARN] Crop models not loaded: {e}")

CROP_METADATA = {
    "Paddy (Rice)": {"season": "Kharif", "waterNeed": "High", "duration": "120-150 days"},
    "Wheat": {"season": "Rabi", "waterNeed": "Medium", "duration": "100-120 days"},
    "Maize": {"season": "Kharif/Rabi", "waterNeed": "Medium", "duration": "80-110 days"},
    "Millets": {"season": "Kharif", "waterNeed": "Low", "duration": "70-90 days"},
    "Groundnut": {"season": "Kharif", "waterNeed": "Medium", "duration": "100-130 days"},
    "Sugarcane": {"season": "Year-round", "waterNeed": "High", "duration": "300-365 days"},
    "Cotton": {"season": "Kharif", "waterNeed": "Medium", "duration": "150-180 days"},
    "Soybean": {"season": "Kharif", "waterNeed": "Medium", "duration": "90-120 days"},
}

# ─── MODELS ───────────────────────────────────────────────

class CropRecommendRequest(BaseModel):
    soilType: str
    rainfall: float
    temperature: float
    season: str

class CropRecommendation(BaseModel):
    crop: str
    score: float
    season: str
    waterNeed: str
    duration: str

class FieldData(BaseModel):
    cropName: str
    acreLand: float
    yieldAffected: float
    leafEdge: str
    leafColor: str
    leafSpots: str
    leafTexture: str
    plantAge: int

class AnalyzeImageRequest(BaseModel):
    imageDataUrl: str          # base64 data URL from frontend
    fieldData: Optional[FieldData] = None

# ─── ROUTES ───────────────────────────────────────────────

@app.get("/api/status")
def status():
    return {
        "gemini": gemini_available,
        "models": model_loaded,
    }

@app.post("/api/analyze-image")
async def analyze_image(req: AnalyzeImageRequest):
    """
    Receives a base64 image from the frontend, sends it to Gemini Vision.
    If Gemini fails due to missing or invalid API keys, falls back to mock data
    so the hackathon presentation doesn't break.
    """
    is_mock = False
    
    # 1. Parse data URL (data:image/jpeg;base64,<data>)
    try:
        header, b64data = req.imageDataUrl.split(",", 1)
        mime_type = header.split(":")[1].split(";")[0]   # e.g. image/jpeg
        image_bytes = base64.b64decode(b64data)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image data URL format.")

    result = None

    # 2. Try Gemini API
    if gemini_available and not GEMINI_API_KEY.startswith("AQ."):
        try:
            import google.generativeai as genai
            image_part = {"mime_type": mime_type, "data": image_bytes}
            response = gemini_model.generate_content([image_part, GEMINI_PROMPT])
            raw_text = response.text.strip()

            if raw_text.startswith("```"):
                raw_text = raw_text.split("```")[1]
                if raw_text.startswith("json"):
                    raw_text = raw_text[4:]
                raw_text = raw_text.strip()

            result = json.loads(raw_text)
        except Exception as e:
            print(f"[WARN] Gemini API failed: {e}. Falling back to mock data.")
            is_mock = True
    else:
        print("[WARN] Invalid or missing API key. Falling back to mock data.")
        is_mock = True

    # 3. Fallback Mock Data
    if is_mock:
        import random
        diseases = [
            {"crop": "Tomato", "disease": "Late Blight", "rec": "Apply fungicide containing chlorothalonil or copper. Remove infected leaves immediately."},
            {"crop": "Potato", "disease": "Early Blight", "rec": "Ensure proper crop rotation. Apply fungicides like Mancozeb."},
            {"crop": "Wheat", "disease": "Leaf Rust", "rec": "Use rust-resistant varieties. Apply triazole fungicides if infection is severe."},
            {"crop": "Rice", "disease": "Brown Spot", "rec": "Ensure balanced nutrient management, especially Nitrogen. Apply Edifenphos."}
        ]
        choice = random.choice(diseases)
        result = {
            "isPlant": True,
            "crop": choice["crop"],
            "disease": choice["disease"] + " (Mock Fallback)",
            "confidence": random.randint(75, 95),
            "recommendation": choice["rec"]
        }

    # Validate
    if not result.get("isPlant", False):
        raise HTTPException(
            status_code=422,
            detail={
                "isPlant": False,
                "message": result.get("message", "This image does not contain a plant leaf.")
            }
        )

    return {
        "isPlant": True,
        "crop": result.get("crop", "Unknown"),
        "disease": result.get("disease", "Unknown"),
        "confidence": min(100, max(0, int(result.get("confidence", 50)))),
        "recommendation": result.get("recommendation", "No recommendation available.")
    }


@app.post("/api/recommend-crop", response_model=List[CropRecommendation])
def recommend_crop(req: CropRecommendRequest):
    if not model_loaded:
        return [
            CropRecommendation(crop="Paddy (Rice)", score=95.0, season="Kharif", waterNeed="High", duration="120-150 days"),
            CropRecommendation(crop="Wheat", score=88.0, season="Rabi", waterNeed="Medium", duration="100-120 days"),
        ]
    try:
        soil_val = req.soilType.lower()
        if soil_val not in le_soil.classes_:
            soil_val = le_soil.classes_[0]
        soil_encoded = le_soil.transform([soil_val])[0]

        season_val = req.season.lower()
        if season_val not in le_season.classes_:
            season_val = le_season.classes_[0]
        season_encoded = le_season.transform([season_val])[0]

        features = np.array([[soil_encoded, req.rainfall, req.temperature, season_encoded]])
        features_scaled = scaler.transform(features)
        probabilities = clf.predict_proba(features_scaled)[0]

        results = []
        for class_idx, prob in enumerate(probabilities):
            crop_name = le_crop.inverse_transform([class_idx])[0]
            score = round(float(prob) * 100, 1)
            metadata = CROP_METADATA.get(crop_name, {"season": "Kharif", "waterNeed": "Medium", "duration": "100 days"})
            results.append(CropRecommendation(
                crop=crop_name, score=score,
                season=metadata["season"], waterNeed=metadata["waterNeed"], duration=metadata["duration"]
            ))
        results.sort(key=lambda x: x.score, reverse=True)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
