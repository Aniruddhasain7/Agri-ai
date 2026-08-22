import os
import json
import joblib
import pandas as pd
from flask import Blueprint, request, jsonify
from models_db import db, PredictionHistory

yield_bp = Blueprint("yield_predict", __name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "yield_model.joblib")
_model = None
if os.path.exists(MODEL_PATH):
    try:
        _model = joblib.load(MODEL_PATH)
    except Exception as err:
        print("Warning: Could not load yield_model.joblib, using fallback engine:", err)

SUPPORTED_CROPS = [
    "Maize", "Potatoes", "Rice, paddy", "Sorghum", "Soybeans",
    "Wheat", "Cassava", "Sweet potatoes", "Plantains and others", "Yams",
]


def get_user_id_from_header():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer agriai_token_"):
        try:
            return int(auth_header.replace("Bearer agriai_token_", "").strip())
        except (ValueError, TypeError):
            return None
    return None


def formula_fallback(rainfall, pesticides, temp):
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
        area = str(data["area"])
        item = str(data["item"])
        year = int(data["year"])
        rainfall = float(data["rainfall_mm"])
        pesticides = float(data["pesticides_tonnes"])
        temp = float(data["avg_temp"])
    except (ValueError, TypeError):
        return jsonify({"error": "year must be an integer; rainfall_mm, pesticides_tonnes, avg_temp must be numbers."}), 400

    if _model is not None:
        row = pd.DataFrame([{
            "Area": area, "Item": item, "Year": year,
            "average_rain_fall_mm_per_year": rainfall,
            "pesticides_tonnes": pesticides, "avg_temp": temp,
        }])
        per_hectare = round(float(_model.predict(row)[0]), 4)
        source = "ml_model"
    else:
        per_hectare = formula_fallback(rainfall, pesticides, temp)
        source = "formula_fallback"

    res_payload = {
        "area": area,
        "item": item,
        "year": year,
        "estimated_yield_tons_per_hectare": per_hectare,
        "supported_crops": SUPPORTED_CROPS,
    }

    user_id = get_user_id_from_header()
    try:
        log_entry = PredictionHistory(
            user_id=user_id,
            tool_type="yield_prediction",
            input_data=json.dumps({"area": area, "item": item, "year": year, "rainfall_mm": rainfall, "pesticides_tonnes": pesticides, "avg_temp": temp}),
            result_data=json.dumps({"estimated_yield_tons_per_hectare": per_hectare, "source": source}),
        )
        db.session.add(log_entry)
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        print("Failed to save yield prediction log:", err)

    return jsonify(res_payload)