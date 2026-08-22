import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

df = pd.read_csv("yield_df.csv")

X = df[["Area", "Item", "Year", "average_rain_fall_mm_per_year", "pesticides_tonnes", "avg_temp"]]

y = df["hg/ha_yield"] / 10000

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

preprocessor = ColumnTransformer([
    ("cat_encoder", OneHotEncoder(handle_unknown="ignore"), ["Area", "Item"]),
], remainder="passthrough")

pipeline = Pipeline([
    ("preprocess", preprocessor),
    ("model", RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)),
])

pipeline.fit(X_train, y_train)
preds = pipeline.predict(X_test)
print("MAE (t/ha):", round(mean_absolute_error(y_test, preds), 4))
print("R2 :", round(r2_score(y_test, preds), 4))

joblib.dump(pipeline, "../models/yield_model.joblib", compress=3)