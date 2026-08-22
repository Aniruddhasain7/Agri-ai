import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.exceptions import HTTPException

from models_db import db, User, PredictionHistory
from routes.auth import auth_bp
from routes.disease import disease_bp
from routes.yield_predict import yield_bp
from routes.soil import soil_bp
from routes.weather import weather_bp
from routes.market import market_bp
from routes.crop_recommend import crop_bp
from routes.chatbot import chatbot_bp

from urllib.parse import urlparse, urlunparse, quote_plus, unquote

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, ".env"))

def sanitize_db_url(url_str):
    if not url_str:
        return url_str
    try:
        parsed = urlparse(url_str)
        if parsed.password:
            raw_pass = unquote(parsed.password)
            quoted_pass = quote_plus(raw_pass)
            user_part = parsed.username or ""
            host_part = parsed.hostname or ""
            port_part = f":{parsed.port}" if parsed.port else ""
            netloc = f"{user_part}:{quoted_pass}@{host_part}{port_part}"
            components = list(parsed)
            components[1] = netloc
            return urlunparse(components)
    except Exception:
        pass
    return url_str

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

    raw_db_url = os.getenv("DATABASE_URL")
    if not raw_db_url:
        raise ValueError(
            "DATABASE_URL environment variable is missing! "
            "Please set DATABASE_URL in backend/.env with your PostgreSQL URI "
            "(e.g., DATABASE_URL=postgresql://user:password@host:5432/dbname)"
        )

    if raw_db_url.startswith("postgres://"):
        raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)

    db_url = sanitize_db_url(raw_db_url)

    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)

    with app.app_context():
        try:
            db.create_all()
            print("PostgreSQL database tables verified/created successfully!")
            if not User.query.first():
                demo_user = User(name="Demo Farmer", email="demo@agriai.org", farm_type="Grain & Crops")
                demo_user.set_password("demo1234")
                db.session.add(demo_user)
                db.session.commit()
                print("Seeded default demo user into PostgreSQL database (demo@agriai.org)")
        except Exception as err:
            db.session.rollback()
            print(f"Error: PostgreSQL database initialization failed: {err}")
            raise err

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(disease_bp, url_prefix="/api/disease")
    app.register_blueprint(yield_bp, url_prefix="/api/yield")
    app.register_blueprint(soil_bp, url_prefix="/api/soil")
    app.register_blueprint(weather_bp, url_prefix="/api/weather")
    app.register_blueprint(market_bp, url_prefix="/api/market")
    app.register_blueprint(crop_bp, url_prefix="/api/crop")
    app.register_blueprint(chatbot_bp, url_prefix="/api/chatbot")

    @app.errorhandler(500)
    def handle_500(err):
        db.session.rollback()
        original_err = getattr(err, "original_exception", err)
        return jsonify({"error": f"Internal Server Error: {str(original_err)}"}), 500

    @app.errorhandler(Exception)
    def handle_exception(err):
        db.session.rollback()
        if isinstance(err, HTTPException):
            return jsonify({"error": err.description}), err.code
        return jsonify({"error": f"Server error: {str(err)}"}), 500

    @app.route("/api/health")
    def health():
        return {"status": "ok", "service": "AgriAI API"}

    @app.route("/api/predictions/history", methods=["GET"])
    def get_predictions_history():
        tool_type = request.args.get("tool", "")
        try:
            query = PredictionHistory.query
            if tool_type:
                query = query.filter_by(tool_type=tool_type)
            logs = query.order_by(PredictionHistory.created_at.desc()).limit(20).all()
            return {"history": [log.to_dict() for log in logs]}
        except Exception as err:
            return {"history": [], "error": str(err)}, 500

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
