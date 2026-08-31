import os
import joblib


# -----------------------------
# Load trained ML model
# -----------------------------

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "ml",
    "model.pkl"
)

model = joblib.load(MODEL_PATH)


def calculate_prediction(
    cpu_usage: float,
    memory_usage: float,
    error_rate: float,
    response_time: float
):
    # -----------------------------
    # Validate input metrics
    # -----------------------------

    if not 0 <= cpu_usage <= 100:
        raise ValueError("CPU usage must be between 0 and 100")

    if not 0 <= memory_usage <= 100:
        raise ValueError("Memory usage must be between 0 and 100")

    if not 0 <= error_rate <= 100:
        raise ValueError("Error rate must be between 0 and 100")

    if response_time < 0:
        raise ValueError("Response time cannot be negative")

    # -----------------------------
    # Prepare metrics for ML model
    # -----------------------------

    metrics = [[
        cpu_usage,
        memory_usage,
        error_rate,
        response_time
    ]]

    # -----------------------------
    # ML prediction
    # -----------------------------

    prediction = model.predict(metrics)[0]

    probabilities = model.predict_proba(metrics)[0]

    failure_probability = round(float(probabilities[1]), 2)

    # -----------------------------
    # Determine risk level
    # -----------------------------

    if failure_probability >= 0.80:
        risk_level = "critical"
        predicted_status = "likely_failure"

    elif failure_probability >= 0.60:
        risk_level = "high"
        predicted_status = "high_risk"

    elif failure_probability >= 0.40:
        risk_level = "medium"
        predicted_status = "moderate_risk"

    else:
        risk_level = "low"
        predicted_status = "low_risk"

    # -----------------------------
    # Generate explanation
    # -----------------------------

    issues = []

    if cpu_usage >= 80:
        issues.append("high CPU usage")

    if memory_usage >= 80:
        issues.append("high memory usage")

    if error_rate >= 5:
        issues.append("elevated error rate")

    if response_time >= 2000:
        issues.append("slow response time")

    if issues:
        explanation = (
            "Risk detected due to "
            + ", ".join(issues)
            + "."
        )
    else:
        explanation = (
            "System metrics are currently within a healthy range."
        )

    return {
        "failure_probability": failure_probability,
        "predicted_status": predicted_status,
        "risk_level": risk_level,
        "explanation": explanation
    }