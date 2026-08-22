import os
import json
import joblib
import pandas as pd
from flask import Blueprint, request, jsonify
from models_db import db, PredictionHistory

crop_bp = Blueprint("crop_recommend", __name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "crop_model.joblib")
model = None
if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
    except Exception as err:
        print("Warning: Could not load crop_model.joblib, using fallback engine:", err)


def get_user_id_from_header():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer agriai_token_"):
        try:
            return int(auth_header.replace("Bearer agriai_token_", "").strip())
        except (ValueError, TypeError):
            return None
    return None


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

    res_payload = {
        "recommended_crop": prediction,
        "inputs_used": values,
    }

    user_id = get_user_id_from_header()
    try:
        log_entry = PredictionHistory(
            user_id=user_id,
            tool_type="crop_recommendation",
            input_data=json.dumps(values),
            result_data=json.dumps({"recommended_crop": prediction, "source": source}),
        )
        db.session.add(log_entry)
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        print("Failed to save crop recommendation log:", err)

    return jsonify(res_payload)