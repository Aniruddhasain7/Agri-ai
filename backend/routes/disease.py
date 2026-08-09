"""
Crop Disease Detection.
Loads a trained PyTorch model (backend/models/disease_model.pth) or Keras model
if present, otherwise falls back to a deterministic mock so the endpoint still works.

The CLASS_ADVICE dict maps every PlantVillage class name the model can output
to human-readable advice shown to the farmer.
"""
import os
import io
import json
import hashlib
import numpy as np
from PIL import Image
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

disease_bp = Blueprint("disease", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
PTH_PATH = os.path.join(MODEL_DIR, "disease_model.pth")
H5_PATH = os.path.join(MODEL_DIR, "disease_model.h5")
CLASS_INDEX_PATH = os.path.join(MODEL_DIR, "class_indices.json")

_pytorch_model = None
_keras_model = None
_idx_to_label = None

# Try loading PyTorch model first
if os.path.exists(PTH_PATH) and os.path.exists(CLASS_INDEX_PATH):
    try:
        import torch
        import torch.nn as nn
        from torchvision import transforms, models

        with open(CLASS_INDEX_PATH) as f:
            class_indices = json.load(f)
        _idx_to_label = {v: k for k, v in class_indices.items()}
        num_classes = len(_idx_to_label)

        _pytorch_model = models.mobilenet_v2(weights=None)
        _pytorch_model.classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(_pytorch_model.last_channel, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, num_classes)
        )
        _pytorch_model.load_state_dict(torch.load(PTH_PATH, map_location="cpu", weights_only=True))
        _pytorch_model.eval()

        _pytorch_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        print("Loaded PyTorch GPU/CPU disease model successfully!")
    except Exception as err:
        print("Failed loading PyTorch model:", err)

# Fallback to Keras H5 if present
elif os.path.exists(H5_PATH) and os.path.exists(CLASS_INDEX_PATH):
    try:
        import tensorflow as tf
        _keras_model = tf.keras.models.load_model(H5_PATH)
        with open(CLASS_INDEX_PATH) as f:
            class_indices = json.load(f)
        _idx_to_label = {v: k for k, v in class_indices.items()}
        print("Loaded Keras disease model successfully!")
    except Exception as err:
        print("Failed loading Keras model:", err)

# ── Advice lookup for real PlantVillage class names ───────────────────────────
CLASS_ADVICE = {
    "Pepper__bell___Bacterial_spot": (
        "Bacterial spot detected on bell pepper. Apply copper-based bactericide spray; "
        "avoid overhead irrigation; remove and destroy heavily infected leaves."
    ),
    "Pepper__bell___healthy": "Plant appears healthy. Continue regular monitoring.",
    "Potato___Early_blight": (
        "Early blight (Alternaria solani) detected. Apply mancozeb or chlorothalonil fungicide; "
        "ensure adequate spacing for airflow; avoid water stress."
    ),
    "Potato___Late_blight": (
        "Late blight (Phytophthora infestans) detected — highly destructive. "
        "Apply metalaxyl or cymoxanil fungicide immediately; destroy infected foliage; "
        "do not compost infected material."
    ),
    "Potato___healthy": "Plant appears healthy. Continue regular monitoring.",
    "Tomato_Bacterial_spot": (
        "Bacterial spot detected on tomato. Use copper bactericide; avoid overhead watering; "
        "rotate crops next season."
    ),
    "Tomato_Early_blight": (
        "Early blight detected on tomato. Apply mancozeb or azoxystrobin fungicide; "
        "remove lower infected leaves; mulch soil to reduce splash spread."
    ),
    "Tomato_Late_blight": (
        "Late blight detected — act immediately. Apply metalaxyl-based fungicide; "
        "remove and bag infected plant parts; avoid working in wet field."
    ),
    "Tomato_Leaf_Mold": (
        "Leaf mold detected. Improve greenhouse ventilation; apply chlorothalonil fungicide; "
        "reduce leaf wetness by avoiding overhead irrigation."
    ),
    "Tomato_Septoria_leaf_spot": (
        "Septoria leaf spot detected. Apply copper-based or chlorothalonil fungicide; "
        "remove infected lower leaves; practice crop rotation."
    ),
    "Tomato_Spider_mites_Two_spotted_spider_mite": (
        "Spider mite infestation detected. Apply miticide (abamectin or bifenazate); "
        "spray undersides of leaves thoroughly; increase humidity if possible."
    ),
    "Tomato__Target_Spot": (
        "Target spot (Corynespora cassiicola) detected. Apply azoxystrobin or mancozeb; "
        "improve plant spacing; avoid excessive nitrogen fertilization."
    ),
    "Tomato__Tomato_YellowLeaf__Curl_Virus": (
        "Tomato Yellow Leaf Curl Virus detected. No curative treatment available. "
        "Control whitefly vectors with imidacloprid; remove infected plants; use virus-resistant varieties."
    ),
    "Tomato__Tomato_mosaic_virus": (
        "Tomato Mosaic Virus detected. No curative treatment. Remove infected plants; "
        "sterilize tools; use certified virus-free seeds; control aphid vectors."
    ),
    "Tomato_healthy": "Plant appears healthy. Continue regular monitoring.",
}

DEFAULT_ADVICE = "Consult your local agronomist for a detailed treatment plan."

MOCK_CLASSES = [
    {"label": "Healthy", "advice": "No action needed. Keep monitoring regularly."},
    {"label": "Leaf Blight", "advice": "Apply copper-based fungicide; remove affected leaves; improve drainage."},
    {"label": "Powdery Mildew", "advice": "Apply sulfur-based fungicide; increase airflow; avoid overhead watering."},
    {"label": "Bacterial Spot", "advice": "Use copper bactericide spray; avoid field work when wet; rotate crops."},
    {"label": "Nutrient Deficiency (Nitrogen)", "advice": "Apply nitrogen-rich fertilizer; consider a soil test."},
]


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def mock_predict(image_bytes: bytes):
    digest = hashlib.sha256(image_bytes).hexdigest()
    idx = int(digest, 16) % len(MOCK_CLASSES)
    confidence = 70 + (int(digest[:4], 16) % 30)
    result = MOCK_CLASSES[idx]
    return {"label": result["label"], "confidence": confidence, "advice": result["advice"]}


def real_predict_pytorch(image_bytes: bytes):
    import torch
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = _pytorch_transform(img).unsqueeze(0)

    with torch.no_grad():
        outputs = _pytorch_model(tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]
        top_idx = int(torch.argmax(probabilities))
        confidence = float(probabilities[top_idx]) * 100

    label = _idx_to_label[top_idx]
    advice = CLASS_ADVICE.get(label, DEFAULT_ADVICE)
    return {"label": label, "confidence": round(confidence, 2), "advice": advice}


def real_predict_keras(image_bytes: bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((224, 224))
    arr = np.array(img) / 255.0
    x = np.expand_dims(arr, axis=0)
    preds = _keras_model.predict(x)[0]
    top_idx = int(np.argmax(preds))
    confidence = float(preds[top_idx]) * 100
    label = _idx_to_label[top_idx]
    advice = CLASS_ADVICE.get(label, DEFAULT_ADVICE)
    return {"label": label, "confidence": round(confidence, 2), "advice": advice}


@disease_bp.route("/predict", methods=["POST"])
def predict_disease():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided. Use form field name 'image'."}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename."}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": f"Unsupported file type. Allowed: {ALLOWED_EXTENSIONS}"}), 400

    filename = secure_filename(file.filename)
    image_bytes = file.read()

    if _pytorch_model is not None:
        prediction = real_predict_pytorch(image_bytes)
        source = "pytorch_gpu_model"
    elif _keras_model is not None:
        prediction = real_predict_keras(image_bytes)
        source = "keras_model"
    else:
        prediction = mock_predict(image_bytes)
        source = "mock"

    return jsonify({
        "filename": filename,
        "prediction": prediction["label"],
        "confidence_percent": prediction["confidence"],
        "recommended_action": prediction["advice"],
        "source": source,
    })