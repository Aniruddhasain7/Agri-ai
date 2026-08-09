import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from models_db import db
from routes.auth import auth_bp
from routes.disease import disease_bp
from routes.yield_predict import yield_bp
from routes.soil import soil_bp
from routes.weather import weather_bp
from routes.market import market_bp
from routes.crop_recommend import crop_bp
from routes.chatbot import chatbot_bp

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, ".env"))

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

    # Database Configuration (Supports Cloud PostgreSQL or Local SQLite)
    db_url = os.getenv("DATABASE_URL", "sqlite:///" + os.path.join(basedir, "agriai.db"))
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(disease_bp, url_prefix="/api/disease")
    app.register_blueprint(yield_bp, url_prefix="/api/yield")
    app.register_blueprint(soil_bp, url_prefix="/api/soil")
    app.register_blueprint(weather_bp, url_prefix="/api/weather")
    app.register_blueprint(market_bp, url_prefix="/api/market")
    app.register_blueprint(crop_bp, url_prefix="/api/crop")
    app.register_blueprint(chatbot_bp, url_prefix="/api/chatbot")

    @app.route("/api/health")
    def health():
        return {"status": "ok", "service": "AgriAI API"}

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
