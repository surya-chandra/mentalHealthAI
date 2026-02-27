from flask import Blueprint, request, jsonify
from services.gemini_service import get_gemini_response

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/api/ai/chat", methods=["POST"])
def chat():
    data = request.json
    messages = data.get("messages", [])

    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    try:
        reply = get_gemini_response(messages)
        return jsonify({"reply": reply})
    except Exception as e:
        print("Gemini Error:", e)
        return jsonify({"error": "AI service failed"}), 500