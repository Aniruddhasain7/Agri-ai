from flask import Blueprint, request, jsonify
from models_db import db, User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    farm_type = data.get("farmType", "Grain & Crops")

    if not name or not email or not password:
        return jsonify({"error": "Fields 'name', 'email', and 'password' are required."}), 400

    try:
        db.create_all()
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "An account with this email address already exists."}), 400

        user = User(name=name, email=email, farm_type=farm_type)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        token = f"agriai_token_{user.id}"
        return jsonify({
            "message": "User registered successfully.",
            "user": user.to_dict(),
            "token": token,
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error during registration: {str(e)}"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Both 'email' and 'password' are required."}), 400

    try:
        db.create_all()
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid email address or password."}), 401

        token = f"agriai_token_{user.id}"
        return jsonify({
            "message": "Login successful.",
            "user": user.to_dict(),
            "token": token,
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error during login: {str(e)}"}), 500


@auth_bp.route("/me", methods=["GET"])
def get_current_user():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer agriai_token_"):
        return jsonify({"error": "Unauthorized or missing token."}), 401

    try:
        user_id = int(auth_header.replace("Bearer agriai_token_", "").strip())
        user = db.session.get(User, user_id)
        if not user:
            return jsonify({"error": "User not found."}), 404
        return jsonify({"user": user.to_dict()})
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid authorization token format."}), 401
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

