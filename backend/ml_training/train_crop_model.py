"""
Trains crop recommendation model on Kaggle's Crop_recommendation.csv.
Download from: https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset
Place the CSV in this same ml_training/ folder before running.
"""
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

df = pd.read_csv("Crop_recommendation.csv")
X = df[["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, preds))
print(classification_report(y_test, preds))

joblib.dump(model, "../models/crop_model.joblib")
print("Saved to backend/models/crop_model.joblib")