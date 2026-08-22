import json
from flask import Blueprint, request, jsonify
from models_db import db, PredictionHistory

soil_bp = Blueprint("soil", __name__)


def get_user_id_from_header():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer agriai_token_"):
        try:
            return int(auth_header.replace("Bearer agriai_token_", "").strip())
        except (ValueError, TypeError):
            return None
    return None


def recommend(n, p, k, ph):
    tips = []
    if n < 40:
        tips.append("Nitrogen is low — apply urea or ammonium sulfate.")
    elif n > 80:
        tips.append("Nitrogen is high — reduce nitrogen fertilizer to avoid excess vegetative growth.")
    if p < 20:
        tips.append("Phosphorus is low — apply single super phosphate (SSP) or DAP.")
    if k < 20:
        tips.append("Potassium is low — apply muriate of potash (MOP).")
    if ph < 5.5:
        tips.append("Soil is acidic — apply agricultural lime to raise pH.")
    elif ph > 7.5:
        tips.append("Soil is alkaline — apply gypsum or organic matter to lower pH gradually.")
    if not tips:
        tips.append("N-P-K and pH levels look balanced for most crops.")
    return tips


@soil_bp.route("/recommend", methods=["POST"])
def soil_recommend():
    data = request.get_json(silent=True) or {}
    required = ["nitrogen", "phosphorus", "potassium", "ph"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    try:
        n, p, k, ph = (float(data[f]) for f in required)
    except (ValueError, TypeError):
        return jsonify({"error": "All fields must be numeric."}), 400

    recommendations = recommend(n, p, k, ph)
    res_payload = {
        "inputs": {"nitrogen": n, "phosphorus": p, "potassium": k, "ph": ph},
        "recommendations": recommendations,
    }

    user_id = get_user_id_from_header()
    try:
        log_entry = PredictionHistory(
            user_id=user_id,
            tool_type="soil_recommendation",
            input_data=json.dumps(res_payload["inputs"]),
            result_data=json.dumps({"recommendations": recommendations}),
        )
        db.session.add(log_entry)
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        print("Failed to save soil recommendation log:", err)

    return jsonify(res_payload)