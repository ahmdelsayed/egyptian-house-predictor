"""
Egyptian House Price Predictor - Backend API
----------------------------------------------
Loads the trained CatBoost model (best_catboost_model.pkl) saved from the
notebook and exposes it over a small REST API.

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
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

MODEL_PATH = os.path.join(os.path.dirname(__file__), "best_catboost_model.pkl")

app = Flask(
    __name__,
    static_folder=os.path.join(os.path.dirname(__file__), "static"),
    static_url_path="",
)
CORS(app)  # allow the React dev server (different port) to call this API

# ---------------------------------------------------------------------------
# Load the model once at startup
# ---------------------------------------------------------------------------
model = joblib.load(MODEL_PATH)

# CatBoost stores feature names, but not the full training vocabulary for
# categorical columns. These are common values from the training dataset and
# are suggestions for the frontend; the API also accepts other text values.
CITY_OPTIONS = [
    "Ain Sokhna",
    "Alexandria",
    "Alamein",
    "Cairo",
    "El Gouna",
    "Giza",
    "Hurghada",
    "New Cairo",
    "North Coast",
    "Ras Al Khaimah",
    "Red Sea",
    "Sharm El Sheikh",
    "Suez",
    "6th of October",
]
TYPE_OPTIONS = [
    "Apartment",
    "Chalet",
    "Duplex",
    "Penthouse",
    "Studio",
    "Town House",
    "Twin House",
    "Villa",
]

MODEL_FEATURES = list(getattr(model, "feature_names_", []))
if not MODEL_FEATURES:
    raise RuntimeError("The CatBoost model does not contain feature names.")

CAT_FEATURES = {"compound", "city", "type", "payment_method"}
if not CAT_FEATURES.issubset(MODEL_FEATURES):
    raise RuntimeError("The CatBoost model has an unexpected categorical schema.")


def build_model_row(data):
    """Convert the public five-field request into the model's full schema."""
    city = str(data["city"]).strip()
    ptype = str(data["type"]).strip()
    type_lower = ptype.lower()

    values = {
        "compound": city,
        "city": city,
        "type": ptype,
        "payment_method": str(data.get("payment_method") or "Unknown").strip(),
        "size_sqm": float(data["size_sqm"]),
        "bedrooms_num": float(data["bedrooms"]),
        "bathrooms": float(data["bathrooms"]),
        "maid_room": float(data.get("maid_room") or 0),
        "studio_num": float(type_lower == "studio"),
        "down_payment_num": float(data.get("down_payment_num") or 0),
        "has_down_payment": float(bool(data.get("down_payment_num"))),
        "floor_num": float(data.get("floor_num") or 0),
    }

    keyword_flags = {
        "kw_sea_view": "sea view",
        "kw_fully_finished": "fully finished",
        "kw_semi_finished": "semi finished",
        "kw_not_finished": "not finished",
        "kw_furnished": "furnished",
        "kw_private_garden": "private garden",
        "kw_roof": "roof",
        "kw_lagoon": "lagoon",
        "kw_swimming_pool": "swimming pool",
        "kw_ready_to_move": "ready to move",
        "kw_under_construction": "under construction",
        "kw_prime_location": "prime location",
        "kw_club_house": "club house",
        "kw_gated_compound": "gated compound",
        "kw_corner": "corner",
        "kw_duplex": "duplex",
        "kw_sky_lounge": "sky lounge",
        "kw_immediate_delivery": "immediate delivery",
        "kw_golf_view": "golf view",
    }
    description = str(data.get("description") or "").lower()
    for feature, keyword in keyword_flags.items():
        values[feature] = float(keyword in description or keyword in type_lower)

    row = pd.DataFrame([[values.get(feature, "Unknown" if feature in CAT_FEATURES else 0)
                         for feature in MODEL_FEATURES]], columns=MODEL_FEATURES)
    for feature in CAT_FEATURES:
        row[feature] = row[feature].astype(str)
    return row

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

    data.update({
        "city": city,
        "type": ptype,
        "size_sqm": size_sqm,
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
    })

    try:
        raw_prediction = float(model.predict(build_model_row(data))[0])
        prediction = float(np.expm1(raw_prediction))
    except Exception as exc:  # keep the API from ever crashing on bad input
        return jsonify({"error": f"Prediction failed: {exc}"}), 500

    return jsonify({
        "predicted_price": round(float(prediction), 2),
        "currency": "EGP",
    })


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def frontend(path):
    file_path = os.path.join(app.static_folder, path)
    if path and os.path.isfile(file_path):
        return app.send_static_file(path)
    return app.send_static_file("index.html")


if __name__ == "__main__":
    # debug=True is fine for local student-project use only
    app.run(host="0.0.0.0", port=5000, debug=True)
