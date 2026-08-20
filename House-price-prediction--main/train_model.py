"""Train Ridge pipeline matching Untitled.ipynb and save RidgeModel.pkl."""
import pickle
from pathlib import Path

import pandas as pd
from sklearn.compose import make_column_transformer
from sklearn.linear_model import Ridge
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "Cleaned_data.csv"
OUT = ROOT / "RidgeModel.pkl"


def main():
    df = pd.read_csv(DATA)
    if "Unnamed: 0" in df.columns:
        df = df.drop(columns=["Unnamed: 0"])
    X = df.drop(columns=["price"])
    y = df["price"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=0
    )
    column_trans = make_column_transformer(
        (OneHotEncoder(sparse_output=False), ["location"]),
        remainder="passthrough",
    )
    scaler = StandardScaler()
    ridge = Ridge()
    pipe = make_pipeline(column_trans, scaler, ridge)
    pipe.fit(X_train, y_train)
    r2 = r2_score(y_test, pipe.predict(X_test))
    print(f"Ridge test R²: {r2:.4f}")
    with open(OUT, "wb") as f:
        pickle.dump(pipe, f)
    print(f"Saved {OUT}")


if __name__ == "__main__":
    main()
