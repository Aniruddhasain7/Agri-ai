"""
Soil Analysis & Fertilizer Recommendation — rule-based thresholds on N-P-K + pH.
"""
from flask import Blueprint, request, jsonify

soil_bp = Blueprint("soil", __name__)


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

    return jsonify({
        "inputs": {"nitrogen": n, "phosphorus": p, "potassium": k, "ph": ph},
        "recommendations": recommend(n, p, k, ph),
    })