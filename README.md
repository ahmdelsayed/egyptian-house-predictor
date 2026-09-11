# Egyptian House Price Predictor

A small full-stack app that estimates a listing price for a property in
Egypt, built on top of a Random Forest model trained on real Egyptian
real-estate listings.

## Project idea

Estimate the expected listing price of a property in Egypt from a few
details a user can enter easily: location, property type, area, bedrooms,
and bathrooms. This is an **estimated listing price**, not an official
property valuation.

## Dataset

- Source: [Egyptian Real Estate Listings, Kaggle](https://www.kaggle.com/)
  (see the Colab notebook for the exact dataset link used).
- Target: `price`.

## Data cleaning

- Dropped rows with a missing `price` (can't train on an unknown target).
- Removed the `url` column (not useful for prediction).
- `price` was stored as text with commas (e.g. `"1,200,000"`) — stripped
  commas and converted to float.
- `size` was a free-text field like `"Delivery in 2025 / 150 sqm"` —
  extracted the numeric sqm value into a new `size_sqm` column and
  dropped the original.
- `bedrooms` was text like `"3 Bedrooms"` — extracted the digit and
  converted to numeric; missing values filled with the **median**
  (chosen over the mean because a few very large villas would otherwise
  skew the fill value).
- `bathrooms` coerced to numeric, missing values filled with the median.
- `available_from` parsed into a real date, then split into
  year/month/day features plus a `available_date_missing` flag for rows
  where the date was missing.
- Dropped `down_payment` / `down_payment_amount` (not used).

## EDA — key insights

1. **Price is right-skewed** — most properties cluster at lower prices
   with a long tail of expensive villas/compounds.
2. **Location clearly affects price** — average price varies a lot across
   the top governorates/cities.
3. **Bedrooms and bathrooms are correlated (~0.77)** — bigger properties
   tend to have more of both, which is expected but worth keeping in
   mind for modeling.
4. The initial `size_sqm` extraction looked broken (near-zero correlation
   with price) — this was investigated and fixed before using the
   feature to train the final model.

## Features & target

- **Features**: `city`, `type` (property type), `size_sqm`, `bedrooms`,
  `bathrooms` — all things a user can type into a simple form.
- **Target**: `price`.

## Model

- Preprocessing: `OneHotEncoder` on `city` and `type`; `size_sqm`,
  `bedrooms`, `bathrooms` passed through as-is.
- Two models were trained and compared:
  - **Linear Regression** (baseline)
  - **Random Forest Regressor**
- **Final model: Random Forest** — chosen for lower MAE and higher R²
  than the linear baseline.

## Evaluation

- **MAE**: average absolute difference (in EGP) between predicted and
  actual price — the lower, the closer predictions are to reality on
  average.
- **R²**: how much of the variation in price the model explains — closer
  to 1 is better.
- (See the notebook's output cell for the exact numbers from this run.)

## Application — how data moves through the app

```
User fills the form (React)
   -> POST /api/predict  { city, type, size_sqm, bedrooms, bathrooms }
   -> Flask backend validates input
   -> Loads house_price_model.pkl (the saved sklearn Pipeline)
   -> model.predict(...) -> predicted price
   -> JSON response { predicted_price, currency }
   -> React displays "Estimated listing price"
```

The dropdown options (cities / property types) are **not hardcoded** —
the backend reads them directly from the trained `OneHotEncoder`'s
`categories_`, via `GET /api/options`, so the frontend can never send a
value the model wasn't trained on.

## Vibe coding / AI usage

The notebook (data cleaning, EDA, model training) was built and
iterated on in Google Colab. The Flask backend and React frontend were
then generated with AI assistance from the saved model file, with the
API contract (`/api/predict`, `/api/options`) and input validation
specified explicitly rather than left to the tool to guess.

**Biggest challenge**: making sure the frontend could never send a
`city` or `type` value the model hadn't seen during training — solved by
serving the encoder's own categories as the dropdown source of truth,
instead of hardcoding a list that could drift out of sync with the
model.

## What I learned

1. How a scikit-learn `Pipeline` (preprocessing + model) lets you save
   and load one artifact and get consistent predictions without
   re-doing preprocessing by hand.
2. Why using the median instead of the mean matters when filling missing
   values in skewed data (like bedroom counts).
3. How to design a minimal REST contract between a React frontend and a
   Python ML backend — three small validated endpoints are enough for a
   working product.

## Running the app

### Deploy on Render

The included `render.yaml` deploys the Flask API and React frontend as two
Render services. Create a new Render Blueprint from this repository and deploy
it. The frontend uses `VITE_API_BASE` in production and falls back to the local
Flask URL during development.

**Backend**

```bash
cd backend
pip install -r requirements.txt
python app.py
# runs on http://localhost:5000
```

**Frontend** (in a second terminal)

```bash
cd frontend
npm install
npm run dev
# runs on http://localhost:5173
```

Open `http://localhost:5173`, fill in the form, and click **Predict
price**.

## Testing performed

- Small property (e.g. 70 sqm, 1 bed, 1 bath)
- Medium property (e.g. 150 sqm, 3 bed, 2 bath)
- Large property (e.g. 400 sqm, 6 bed, 5 bath)
- Missing fields -> clear error message, no crash
- Unrealistic values (e.g. negative/huge area) -> clear error message,
  no crash

## Limitations

- Trained on listing data, not sale prices — this is an **estimated
  listing price**, not an appraisal.
- Only 5 simple features are used; things like finishing quality,
  floor, or exact neighborhood aren't captured.
- Location is limited to the governorates present in the training data.
