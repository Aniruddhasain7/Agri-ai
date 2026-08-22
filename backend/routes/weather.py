import requests
from flask import Blueprint, request, jsonify

weather_bp = Blueprint("weather", __name__)
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


def build_advice(temp_c, precipitation_mm, wind_kph, humidity_percent):
    advice = []
    if precipitation_mm > 5:
        advice.append("Rain expected — delay pesticide/fertilizer spraying to avoid runoff.")
    elif precipitation_mm == 0 and humidity_percent < 40:
        advice.append("Dry conditions — consider irrigation, especially for shallow-rooted crops.")
    if temp_c > 35:
        advice.append("High heat — irrigate during early morning or evening to reduce evaporation loss.")
    elif temp_c < 10:
        advice.append("Low temperature — protect sensitive seedlings with mulch or row covers.")
    if wind_kph > 30:
        advice.append("Strong winds — avoid spraying (drift risk) and stake tall/young plants.")
    if not advice:
        advice.append("Conditions look stable — good window for routine field work.")
    return advice


@weather_bp.route("/advice", methods=["GET"])
def weather_advice():
    try:
        lat = float(request.args.get("lat", ""))
        lon = float(request.args.get("lon", ""))
    except (ValueError, TypeError):
        return jsonify({"error": "Provide numeric 'lat' and 'lon' query params."}), 400

    params = {
        "latitude": lat, "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
        "daily": "precipitation_sum,temperature_2m_max,temperature_2m_min",
        "forecast_days": 3, "timezone": "auto",
    }

    try:
        resp = requests.get(OPEN_METEO_URL, params=params, timeout=8)
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException as e:
        return jsonify({"error": f"Weather service unavailable: {str(e)}"}), 502

    current = data.get("current", {})
    temp_c = current.get("temperature_2m", 0)
    precip = current.get("precipitation", 0)
    wind = current.get("wind_speed_10m", 0)
    humidity = current.get("relative_humidity_2m", 0)

    return jsonify({
        "location": {"lat": lat, "lon": lon},
        "current_conditions": {
            "temperature_c": temp_c, "humidity_percent": humidity,
            "precipitation_mm": precip, "wind_speed_kph": wind,
        },
        "forecast_3_day": data.get("daily", {}),
        "farming_advice": build_advice(temp_c, precip, wind, humidity),
    })