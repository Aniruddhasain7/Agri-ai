"""
Crop Yield Prediction
------------------------
Predicts yield (tonnes/hectare) from: country, crop, year, rainfall,
pesticide usage, and average temperature.

Trained on yield_df.csv with columns:
  Area, Item, Year, average_rain_fall_mm_per_year, pesticides_tonnes,
  avg_temp, hg/ha_yield (target converted to t/ha during training).

Loads backend/models/yield_model.joblib if present, else falls back
to a rough formula so the endpoint still responds.
"""
import os
import joblib
import pandas as pd
from flask import Blueprint, request, jsonify

yield_bp = Blueprint("yield_predict", __name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "yield_model.joblib")
_model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None

# Crops the model was actually trained on (from yield_df.csv 'Item' column)
SUPPORTED_CROPS = [
    "Maize", "Potatoes", "Rice, paddy", "Sorghum", "Soybeans",
    "Wheat", "Cassava", "Sweet potatoes", "Plantains and others", "Yams",
]


def formula_fallback(rainfall, pesticides, temp):
    """Rough placeholder used only if the trained model file is missing."""
    base = 3.0
    rainfall_factor = 1.0 + max(-0.3, min(0.3, (rainfall - 800) / 2000))
    temp_penalty = 1.0 - (abs(temp - 25) * 0.015)
    pesticide_factor = 1.0 + min(0.2, pesticides / 5000)
    return round(base * rainfall_factor * max(0.5, temp_penalty) * pesticide_factor, 2)


@yield_bp.route("/predict", methods=["POST"])
def predict_yield():
    data = request.get_json(silent=True) or {}
    required = ["area", "item", "year", "rainfall_mm", "pesticides_tonnes", "avg_temp"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    try:
        area = str(data["area"])          # country name, e.g. "India"
        item = str(data["item"])          # crop name, e.g. "Rice, paddy"
        year = int(data["year"])
        rainfall = float(data["rainfall_mm"])
        pesticides = float(data["pesticides_tonnes"])
        temp = float(data["avg_temp"])
    except (ValueError, TypeError):
        return jsonify({"error": "year must be an integer; rainfall_mm, pesticides_tonnes, avg_temp must be numbers."}), 400

    if _model is not None:
        # Column names must exactly match what train_yield_model.py used for training
        row = pd.DataFrame([{
            "Area": area, "Item": item, "Year": year,
            "average_rain_fall_mm_per_year": rainfall,
            "pesticides_tonnes": pesticides, "avg_temp": temp,
        }])
        # Model was trained on hg/ha_yield ÷ 10000 → output is already tonnes/ha
        per_hectare = round(float(_model.predict(row)[0]), 4)
        source = "ml_model"
    else:
        per_hectare = formula_fallback(rainfall, pesticides, temp)
        source = "formula_fallback"

    return jsonify({
        "area": area,
        "item": item,
        "year": year,
        "estimated_yield_tons_per_hectare": per_hectare,
        "source": source,
        "supported_crops": SUPPORTED_CROPS,
    })