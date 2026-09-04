# 🏠 House Price Prediction

A full-stack machine learning application that predicts house prices using a Ridge Regression model. Enter a location, area, bathroom count, and BHK to get an instant price estimate in Indian Lakhs (₹).

![Python](https://img.shields.io/badge/Python-3.x-blue)
![React](https://img.shields.io/badge/React-Vite-61DAFB)
![Flask](https://img.shields.io/badge/Flask-REST%20API-000000)
![scikit-learn](https://img.shields.io/badge/scikit--learn-Ridge%20Regression-F7931E)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Application Flow](#application-flow)
- [Machine Learning](#machine-learning)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Git Workflow](#git-workflow)
- [Troubleshooting](#troubleshooting)

---

## Features

- 📍 Select a house location from the dataset
- 📐 Enter total area in square feet
- 🛁 Enter number of bathrooms
- 🛏️ Enter BHK (bedrooms)
- 💰 Get an estimated house price in Indian Lakhs (₹)
- 🔗 React frontend communicates with Flask through REST APIs
- ⚡ Ridge ML pipeline is loaded when a prediction is requested

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite |
| Backend | Flask (REST API) |
| Data processing | Pandas, NumPy |
| Machine learning | Scikit-learn (Ridge Regression) |

## Project Structure

```
House-price-prediction/
│
├── backend/
│   ├── app.py                 # Flask REST API
│   ├── train_model.py         # Trains and saves the Ridge model
│   ├── requirements.txt
│   ├── Cleaned_data.csv
│   ├── Beng_House_Data.csv
│   └── RidgeModel.pkl         # Trained model pipeline
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

## Application Flow

**Loading locations**
```
React Frontend → GET /api/locations → Flask Backend → Cleaned_data.csv → Location Dropdown
```

**Predicting a price**
```
React Frontend → POST /api/predict → Flask Backend → RidgeModel.pkl → Predicted Price → React Frontend
```

## Machine Learning

**Input features**

| Feature | Description |
|---|---|
| `location` | House location |
| `total_sqft` | Total area in square feet |
| `bath` | Number of bathrooms |
| `bhk` | Number of bedrooms |

**Training pipeline**

1. `OneHotEncoder` — encodes `location`
2. `StandardScaler` — scales numeric features
3. `Ridge Regression` — predicts price

The trained pipeline is saved as `backend/RidgeModel.pkl`.

---

## Getting Started

### Backend Setup

```bash
# 1. Open the project
cd House-price-prediction

# 2. Create a virtual environment
py -m venv .venv

# 3. Activate it (Windows)
.venv\Scripts\Activate.ps1

# 4. Install backend dependencies
python -m pip install -r backend\requirements.txt

# 5. Train the model if RidgeModel.pkl is missing
cd backend
python train_model.py
cd ..

# 6. Start Flask
cd backend
python app.py
```

Backend runs at: **http://127.0.0.1:5000**

### Frontend Setup

Open a second terminal.

```bash
cd House-price-prediction\frontend

# Install dependencies
npm install

# Start React
npm run dev
```

Frontend runs at: **http://localhost:5173**

> ⚠️ Keep both terminals running — the frontend depends on the backend API.

---

## API Endpoints

### Get Locations

`GET /api/locations`

**Example**
```
http://127.0.0.1:5000/api/locations
```

**Response**
```json
{
  "locations": [
    "Whitefield",
    "Electronic City"
  ]
}
```

### Predict House Price

`POST /api/predict`

**Request**
```json
{
  "location": "Whitefield",
  "total_sqft": 1200,
  "bath": 2,
  "bhk": 2
}
```

**Response**
```json
{
  "price_lakhs": 75.42,
  "currency_note": "Lakhs INR (₹), as in the dataset"
}
```

---

## Git Workflow

Create and work on the development branch:

```bash
git switch -c dev
```

After making changes:

```bash
git status
git add .
git commit -m "Add React frontend and Flask API integration"
git push -u origin dev
```

Then open a Pull Request: `dev → main`

After the Pull Request is merged:

```bash
git switch main
git pull origin main
```

**Files that should be ignored (`.gitignore`)**
```
.venv/
node_modules/
frontend/dist/
__pycache__/
.env
.vscode/
```

**Files that should be committed**
```
backend/requirements.txt
frontend/package.json
frontend/package-lock.json
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Flask cannot start | Activate the venv (`.venv\Scripts\Activate.ps1`), then run `python -m pip install -r backend\requirements.txt` |
| React cannot connect to Flask | Confirm Flask is running at `http://127.0.0.1:5000` and React at `http://localhost:5173` |
| CORS errors | Install Flask-CORS: `python -m pip install flask-cors` |
| `RidgeModel.pkl` is missing | Run `cd backend && python train_model.py` |

---

## Built With

React.js · Flask · Python · Pandas · NumPy · Scikit-learn · Ridge Regression