"""
Egyptian House Price Predictor - Backend API
----------------------------------------------
Loads the trained scikit-learn pipeline (house_price_model.pkl) that was
saved from the Colab notebook and exposes it over a small REST API.

Endpoints
  GET  /api/options   -> valid city / property-type choices (read straight
                          from the model's OneHotEncoder, so the frontend
                          dropdowns can never send a value the model
                          wasn't trained on)
  POST /api/predict    -> { city, type, size_sqm, bedrooms, bathrooms } -> { predicted_price }
  GET  /api/health     -> simple liveness check
"""

import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

MODEL_PATH = os.path.join(os.path.dirname(__file__), "house_price_model.pkl")

app = Flask(__name__)
CORS(app)  # allow the React dev server (different port) to call this API

# ---------------------------------------------------------------------------
# Load the model once at startup
# ---------------------------------------------------------------------------
model = joblib.load(MODEL_PATH)

# The pipeline is: ColumnTransformer(OneHotEncoder on ['city', 'type']) -> RandomForestRegressor
# Pull the categories the encoder was actually trained on, so the frontend
# only ever offers choices the model understands.
_preprocessor = model.named_steps["preprocessor"]
_ohe = _preprocessor.named_transformers_["cat"]
CITY_OPTIONS = sorted(_ohe.categories_[0].tolist())
TYPE_OPTIONS = sorted(_ohe.categories_[1].tolist())

# Column order must match the training DataFrame (X) from the notebook:
# features = ['city', 'type', 'size_sqm', 'bedrooms', 'bathrooms']
FEATURE_ORDER = ["city", "type", "size_sqm", "bedrooms", "bathrooms"]


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/api/options")
def options():
    return jsonify({"cities": CITY_OPTIONS, "types": TYPE_OPTIONS})


@app.post("/api/predict")
def predict():
    data = request.get_json(silent=True) or {}

    # ---- validation: keep the error messages simple and specific ----
    required = ["city", "type", "size_sqm", "bedrooms", "bathrooms"]
    missing = [f for f in required if data.get(f) in (None, "")]
    if missing:
        return jsonify({"error": f"Missing field(s): {', '.join(missing)}"}), 400

    city = str(data["city"]).strip()
    ptype = str(data["type"]).strip()

    if city not in CITY_OPTIONS:
        return jsonify({"error": f"Unknown city: '{city}'"}), 400
    if ptype not in TYPE_OPTIONS:
        return jsonify({"error": f"Unknown property type: '{ptype}'"}), 400

    try:
        size_sqm = float(data["size_sqm"])
        bedrooms = float(data["bedrooms"])
        bathrooms = float(data["bathrooms"])
    except (TypeError, ValueError):
        return jsonify({"error": "Area, bedrooms and bathrooms must be numbers."}), 400

    if size_sqm <= 0:
        return jsonify({"error": "Area (sqm) must be greater than 0."}), 400
    if size_sqm > 100000:
        return jsonify({"error": "That area looks unrealistic. Please check the value."}), 400
    if not (0 <= bedrooms <= 50):
        return jsonify({"error": "Bedrooms must be between 0 and 50."}), 400
    if not (0 <= bathrooms <= 50):
        return jsonify({"error": "Bathrooms must be between 0 and 50."}), 400

    row = pd.DataFrame(
        [[city, ptype, size_sqm, bedrooms, bathrooms]],
        columns=FEATURE_ORDER,
    )

    try:
        prediction = model.predict(row)[0]
    except Exception as exc:  # keep the API from ever crashing on bad input
        return jsonify({"error": f"Prediction failed: {exc}"}), 500

    return jsonify({
        "predicted_price": round(float(prediction), 2),
        "currency": "EGP",
    })


if __name__ == "__main__":
    # debug=True is fine for local student-project use only
    app.run(host="0.0.0.0", port=5000, debug=True)
