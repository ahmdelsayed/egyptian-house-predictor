"""Flask API for the Egyptian house-price prediction model."""

import math
import os

import joblib
import pandas as pd
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BACKEND_DIR, "static")
MODEL_PATH = os.path.join(BACKEND_DIR, "house_price_model.pkl")
MODEL_FEATURES = ["city", "type", "size_sqm", "bedrooms", "bathrooms"]

if not os.path.isfile(MODEL_PATH):
    raise FileNotFoundError(f"Trained model file was not found: {MODEL_PATH}")

model = joblib.load(MODEL_PATH)
if list(getattr(model, "feature_names_in_", [])) != MODEL_FEATURES:
    raise RuntimeError(
        "The trained model must use these input features in order: "
        + ", ".join(MODEL_FEATURES)
    )

try:
    encoder = model.named_steps["preprocessor"].named_transformers_["cat"]
    CITY_OPTIONS = sorted(str(value) for value in encoder.categories_[0])
    TYPE_OPTIONS = sorted(str(value) for value in encoder.categories_[1])
except (AttributeError, IndexError, KeyError, TypeError) as exc:
    raise RuntimeError(
        "The trained model does not contain the expected city and type encoder."
    ) from exc

if not CITY_OPTIONS or not TYPE_OPTIONS:
    raise RuntimeError("The trained model has no city or property-type categories.")

app = Flask(
    __name__,
    static_folder=STATIC_DIR,
    static_url_path="",
)
CORS(app)


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/api/options")
def options():
    return jsonify({"cities": CITY_OPTIONS, "types": TYPE_OPTIONS})


@app.post("/api/predict")
def predict():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be a JSON object."}), 400

    required = MODEL_FEATURES
    missing = [field for field in required if data.get(field) in (None, "")]
    if missing:
        return jsonify({"error": f"Missing field(s): {', '.join(missing)}"}), 400

    city = str(data["city"]).strip()
    property_type = str(data["type"]).strip()
    if city not in CITY_OPTIONS:
        return jsonify({"error": "Please select a city from the available options."}), 400
    if property_type not in TYPE_OPTIONS:
        return jsonify(
            {"error": "Please select a property type from the available options."}
        ), 400

    numeric_values = {}
    for field in MODEL_FEATURES[2:]:
        value = data[field]
        if isinstance(value, bool):
            return jsonify({"error": "Area, bedrooms and bathrooms must be numbers."}), 400
        try:
            numeric_values[field] = float(value)
        except (TypeError, ValueError):
            return jsonify({"error": "Area, bedrooms and bathrooms must be numbers."}), 400

    size_sqm = numeric_values["size_sqm"]
    bedrooms = numeric_values["bedrooms"]
    bathrooms = numeric_values["bathrooms"]
    if not all(math.isfinite(value) for value in numeric_values.values()):
        return jsonify({"error": "Area, bedrooms and bathrooms must be finite numbers."}), 400
    if not 0 < size_sqm <= 100000:
        return jsonify({"error": "Area (sqm) must be greater than 0 and at most 100000."}), 400
    if not 0 <= bedrooms <= 50:
        return jsonify({"error": "Bedrooms must be between 0 and 50."}), 400
    if not 0 <= bathrooms <= 50:
        return jsonify({"error": "Bathrooms must be between 0 and 50."}), 400

    model_input = pd.DataFrame(
        [{
            "city": city,
            "type": property_type,
            "size_sqm": size_sqm,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
        }],
        columns=MODEL_FEATURES,
    )
    try:
        prediction = float(model.predict(model_input)[0])
        if not math.isfinite(prediction) or prediction < 0:
            raise ValueError("Model returned an invalid price.")
    except Exception:
        app.logger.exception("Price prediction failed.")
        return jsonify({"error": "Prediction failed. Please try again later."}), 500

    return jsonify({
        "predicted_price": round(prediction, 2),
        "currency": "EGP",
    })


@app.get("/")
def home():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.isfile(index_path):
        return send_from_directory(STATIC_DIR, "index.html")
    return jsonify({"service": "Egyptian House Price Predictor API", "status": "ok"})


@app.get("/<path:path>")
def frontend(path):
    index_path = os.path.join(STATIC_DIR, "index.html")
    if not os.path.isfile(index_path):
        return jsonify({"error": "Not found."}), 404
    if os.path.isfile(os.path.join(STATIC_DIR, path)):
        return send_from_directory(STATIC_DIR, path)
    return send_from_directory(STATIC_DIR, "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5000")), debug=False)
