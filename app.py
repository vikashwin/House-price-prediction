import pickle
from pathlib import Path

import pandas as pd
from flask import Flask, jsonify, render_template, request

ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "RidgeModel.pkl"
DATA_PATH = ROOT / "Cleaned_data.csv"

app = Flask(
    __name__,
    static_folder="static",
    template_folder="templates",
)

_pipe = None
_locations = None


def get_pipe():
    global _pipe
    if _pipe is None:
        if not MODEL_PATH.is_file():
            raise FileNotFoundError(
                f"Missing {MODEL_PATH.name}. Run: python train_model.py"
            )
        with open(MODEL_PATH, "rb") as f:
            _pipe = pickle.load(f)
    return _pipe


def get_locations():
    global _locations
    if _locations is None:
        df = pd.read_csv(DATA_PATH)
        if "Unnamed: 0" in df.columns:
            df = df.drop(columns=["Unnamed: 0"])
        _locations = sorted(df["location"].dropna().unique().tolist())
    return _locations


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/locations")
def api_locations():
    return jsonify({"locations": get_locations()})


@app.route("/api/predict", methods=["POST"])
def api_predict():
    data = request.get_json(silent=True) or {}
    try:
        location = str(data.get("location", "")).strip()
        total_sqft = float(data["total_sqft"])
        bath = float(data["bath"])
        bhk = float(data["bhk"])
    except (KeyError, TypeError, ValueError):
        return jsonify({"error": "Invalid input. Need location, total_sqft, bath, bhk."}), 400

    if not location:
        return jsonify({"error": "Location is required."}), 400

    locs = get_locations()
    if location not in locs:
        return jsonify(
            {
                "error": "Unknown location. Pick a neighbourhood from the list.",
                "hint": location[:80],
            }
        ), 400

    X = pd.DataFrame(
        [{"location": location, "total_sqft": total_sqft, "bath": bath, "bhk": bhk}]
    )
    pipe = get_pipe()
    pred = float(pipe.predict(X)[0])
    return jsonify(
        {
            "price_lakhs": round(pred, 2),
            "currency_note": "Lakhs INR (₹), as in the dataset",
        }
    )


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
