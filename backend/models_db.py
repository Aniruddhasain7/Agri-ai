from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    farm_type = db.Column(db.String(100), default="Grain & Crops")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    disease_logs = db.relationship("DiseaseHistory", backref="user", lazy=True)
    prediction_logs = db.relationship("PredictionHistory", backref="user", lazy=True)

    def __init__(self, name=None, email=None, farm_type="Grain & Crops", password_hash=None, **kwargs):
        super().__init__(**kwargs)
        if name is not None:
            self.name = name
        if email is not None:
            self.email = email
        if farm_type is not None:
            self.farm_type = farm_type
        if password_hash is not None:
            self.password_hash = password_hash

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "farm_type": self.farm_type,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class DiseaseHistory(db.Model):
    __tablename__ = "disease_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    filename = db.Column(db.String(200), nullable=False)
    prediction = db.Column(db.String(100), nullable=False)
    confidence_percent = db.Column(db.Float, nullable=False)
    recommended_action = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, user_id=None, filename="", prediction="", confidence_percent=0.0, recommended_action="", **kwargs):
        super().__init__(**kwargs)
        if user_id is not None:
            self.user_id = user_id
        if filename:
            self.filename = filename
        if prediction:
            self.prediction = prediction
        if confidence_percent:
            self.confidence_percent = confidence_percent
        if recommended_action:
            self.recommended_action = recommended_action

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "filename": self.filename,
            "prediction": self.prediction,
            "confidence_percent": self.confidence_percent,
            "recommended_action": self.recommended_action,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class PredictionHistory(db.Model):
    __tablename__ = "prediction_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    tool_type = db.Column(db.String(50), nullable=False)
    input_data = db.Column(db.Text, nullable=False)
    result_data = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, user_id=None, tool_type="", input_data="", result_data="", **kwargs):
        super().__init__(**kwargs)
        if user_id is not None:
            self.user_id = user_id
        if tool_type:
            self.tool_type = tool_type
        if input_data:
            self.input_data = input_data
        if result_data:
            self.result_data = result_data

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "tool_type": self.tool_type,
            "input_data": self.input_data,
            "result_data": self.result_data,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
