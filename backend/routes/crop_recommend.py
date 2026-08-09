"""
Crop Recommendation
---------------------
Given soil N-P-K, temperature, humidity, pH, and rainfall, recommends
the best-suited crop. Trained on the Kaggle "Crop Recommendation Dataset".

Falls back to a simple rule-based guess if crop_model.joblib isn't present yet,
so the endpoint works immediately even before you've trained the real model.
"""
import os
import joblib
import pandas as pd
from flask import Blueprint, request, jsonify

crop_bp = Blueprint("crop_recommend", __name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "crop_model.joblib")
model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None


def rule_based_fallback(n, p, k, temp, humidity, ph, rainfall):
    if rainfall > 200 and temp > 20:
        return "rice"
    if temp < 20 and rainfall < 100:
        return "wheat"
    if ph < 5.5:
        return "tea"
    if k > 80 and p > 40:
        return "cotton"
    return "maize"


@crop_bp.route("/recommend", methods=["POST"])
def recommend_crop():
    data = request.get_json(silent=True) or {}
    required = ["nitrogen", "phosphorus", "potassium", "temperature", "humidity", "ph", "rainfall"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    try:
        values = {f: float(data[f]) for f in required}
    except (ValueError, TypeError):
        return jsonify({"error": "All fields must be numeric."}), 400

    if model is not None:
        row = pd.DataFrame([{
            "N": values["nitrogen"], "P": values["phosphorus"], "K": values["potassium"],
            "temperature": values["temperature"], "humidity": values["humidity"],
            "ph": values["ph"], "rainfall": values["rainfall"],
        }])
        prediction = model.predict(row)[0]
        source = "ml_model"
    else:
        prediction = rule_based_fallback(**values)
        source = "rule_based_fallback"

    return jsonify({
        "recommended_crop": prediction,
        "source": source,
        "inputs_used": values,
    })