import os
import joblib
import pandas as pd


# Get project root path
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "Backend",
    "ml",
    "model.pkl"
)


# Load trained ML model
model = joblib.load(MODEL_PATH)


def predict_failure(
    cpu_usage: float,
    memory_usage: float,
    error_rate: float,
    response_time: float
):

    # Create DataFrame with the same feature names
    # used during model training
    metrics = pd.DataFrame([{
        "cpu_usage": cpu_usage,
        "memory_usage": memory_usage,
        "error_rate": error_rate,
        "response_time": response_time
    }])

    # Predict failure class
    prediction = model.predict(metrics)[0]

    # Get probability of failure
    probability = model.predict_proba(metrics)[0][1]

    probability = round(float(probability), 2)

    # Determine risk level
    if probability >= 0.80:
        risk_level = "critical"
        predicted_status = "likely_failure"

    elif probability >= 0.60:
        risk_level = "high"
        predicted_status = "high_risk"

    elif probability >= 0.40:
        risk_level = "medium"
        predicted_status = "moderate_risk"

    else:
        risk_level = "low"
        predicted_status = "low_risk"

    return {
        "failure_probability": probability,
        "predicted_status": predicted_status,
        "risk_level": risk_level
    }