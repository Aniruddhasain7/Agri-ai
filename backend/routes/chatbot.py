"""
Farmer Chatbot — powered by Google Gemini (google-genai SDK >= 2.0).
Requires GEMINI_API_KEY in backend/.env
"""
import os
from google import genai  # type: ignore[import-untyped]
from google.genai import types  # type: ignore[import-untyped]
from flask import Blueprint, request, jsonify

chatbot_bp = Blueprint("chatbot", __name__)

_client = None

def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    return _client

SYSTEM_INSTRUCTION = (
    "You are an agricultural assistant helping farmers with practical advice on crops, "
    "pests, irrigation, fertilizer, weather, and market decisions. Keep answers concise, "
    "practical, and easy to understand for a non-technical farmer. If the question is "
    "unrelated to agriculture, politely redirect to farming topics."
)

# In-memory session store: session_id → list of message dicts
# Each message: {"role": "user"|"model", "parts": [str]}
sessions: dict[str, list] = {}


@chatbot_bp.route("/message", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()
    session_id = data.get("session_id", "default")
    lang = data.get("lang", "English")

    if not message:
        return jsonify({"error": "Field 'message' is required."}), 400
    if not os.environ.get("GEMINI_API_KEY"):
        return jsonify({"error": "GEMINI_API_KEY not configured on the server."}), 500

    client = _get_client()

    # Bootstrap a new session with the system instruction priming exchange
    if session_id not in sessions:
        sessions[session_id] = [
            types.Content(role="user",  parts=[types.Part(text=SYSTEM_INSTRUCTION)]),
            types.Content(role="model", parts=[types.Part(text="Understood. I'll help with practical farming advice.")]),
        ]

    history = sessions[session_id]
    prompt = f"Respond in {lang}. Farmer's question: {message}"

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=history + [types.Content(role="user", parts=[types.Part(text=prompt)])],
            config=types.GenerateContentConfig(system_instruction=None),
        )
        reply = response.text

        # Append to history for multi-turn conversation
        history.append(types.Content(role="user",  parts=[types.Part(text=prompt)]))
        history.append(types.Content(role="model", parts=[types.Part(text=reply)]))
    except Exception as e:
        return jsonify({"error": f"Gemini API error: {str(e)}"}), 502

    return jsonify({"reply": reply, "session_id": session_id})