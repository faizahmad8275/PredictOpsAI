def calculate_prediction(severity: str):

    severity = severity.lower()

    if severity == "critical":
        failure_probability = 0.90
        risk_level = "critical"
        predicted_status = "likely_failure"

    elif severity == "high":
        failure_probability = 0.75
        risk_level = "high"
        predicted_status = "high_risk"

    elif severity == "medium":
        failure_probability = 0.45
        risk_level = "medium"
        predicted_status = "moderate_risk"

    else:
        failure_probability = 0.20
        risk_level = "low"
        predicted_status = "low_risk"

    return {
        "failure_probability": failure_probability,
        "predicted_status": predicted_status,
        "risk_level": risk_level
    }