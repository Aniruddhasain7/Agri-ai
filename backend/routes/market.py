import random
from flask import Blueprint, request, jsonify

market_bp = Blueprint("market", __name__)

BASE_PRICE_PER_QUINTAL = {
    "rice": 2100, "wheat": 2300, "maize": 1900,
    "cotton": 6800, "sugarcane": 340, "soybean": 4600,
}


@market_bp.route("/trend", methods=["GET"])
def price_trend():
    crop = request.args.get("crop", "").lower()
    if crop not in BASE_PRICE_PER_QUINTAL:
        return jsonify({"error": f"Unknown crop. Supported: {list(BASE_PRICE_PER_QUINTAL)}"}), 400

    base = BASE_PRICE_PER_QUINTAL[crop]
    random.seed(crop)
    trend = [round(base * (1 + random.uniform(-0.08, 0.08)), 2) for _ in range(7)]

    return jsonify({
        "crop": crop,
        "unit": "INR per quintal",
        "last_7_day_trend": trend,
        "predicted_next_day": round(trend[-1] * (1 + random.uniform(-0.03, 0.03)), 2),
    })