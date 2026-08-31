from database.connection import db
from models.prediction import PredictionCreate
from utils.prediction import calculate_prediction
from bson import ObjectId


def create_prediction(
    prediction: PredictionCreate,
    current_user
):
    predictions_collection = db["predictions"]

    # Find incident belonging to current user
    incident = db["incidents"].find_one({
        "_id": ObjectId(prediction.incident_id),
        "created_by": str(current_user["_id"])
    })

    if incident is None:
        return None

    # Get data directly from incident
    service = incident["service"]
    severity = incident["severity"]

    # Get system metrics from request
    cpu_usage = prediction.cpu_usage
    memory_usage = prediction.memory_usage
    error_rate = prediction.error_rate
    response_time = prediction.response_time

    # Calculate prediction using system metrics
    prediction_result = calculate_prediction(
        cpu_usage,
        memory_usage,
        error_rate,
        response_time
    )

    # Create prediction document
    new_prediction = {
        "incident_id": prediction.incident_id,
        "service": service,
        "severity": severity,

        # System metrics
        "cpu_usage": cpu_usage,
        "memory_usage": memory_usage,
        "error_rate": error_rate,
        "response_time": response_time,

        # Prediction result
        "failure_probability": prediction_result["failure_probability"],
        "predicted_status": prediction_result["predicted_status"],
        "risk_level": prediction_result["risk_level"],

        "explanation": prediction_result["explanation"],
        "created_by": str(current_user["_id"])
    }

    result = predictions_collection.insert_one(new_prediction)

    return {
        "id": str(result.inserted_id),
        "incident_id": prediction.incident_id,
        "service": service,
        "severity": severity,

        # System metrics
        "cpu_usage": cpu_usage,
        "memory_usage": memory_usage,
        "error_rate": error_rate,
        "response_time": response_time,

        # Prediction result
        "failure_probability": prediction_result["failure_probability"],
        "predicted_status": prediction_result["predicted_status"],
        "risk_level": prediction_result["risk_level"],

        "explanation": prediction_result["explanation"],
        "created_by": str(current_user["_id"])
    }


def get_predictions(current_user):

    predictions_collection = db["predictions"]

    predictions = predictions_collection.find({
        "created_by": str(current_user["_id"])
    })

    result = []

    for prediction in predictions:
        result.append({
            "id": str(prediction["_id"]),
            "incident_id": prediction["incident_id"],
            "service": prediction["service"],
            "severity": prediction["severity"],

            # System metrics
            "cpu_usage": prediction.get("cpu_usage"),
            "memory_usage": prediction.get("memory_usage"),
            "error_rate": prediction.get("error_rate"),
            "response_time": prediction.get("response_time"),

            # Prediction result
            "failure_probability": prediction["failure_probability"],
            "predicted_status": prediction["predicted_status"],
            "risk_level": prediction["risk_level"],

            "explanation": prediction["explanation"],
            "created_by": prediction["created_by"]
        })

    return result


def get_prediction_by_id(
    prediction_id: str,
    current_user
):
    predictions_collection = db["predictions"]

    prediction = predictions_collection.find_one({
        "_id": ObjectId(prediction_id),
        "created_by": str(current_user["_id"])
    })

    if prediction is None:
        return None

    return {
        "id": str(prediction["_id"]),
        "incident_id": prediction["incident_id"],
        "service": prediction["service"],
        "severity": prediction["severity"],

        # System metrics
        "cpu_usage": prediction.get("cpu_usage"),
        "memory_usage": prediction.get("memory_usage"),
        "error_rate": prediction.get("error_rate"),
        "response_time": prediction.get("response_time"),

        # Prediction result
        "failure_probability": prediction["failure_probability"],
        "predicted_status": prediction["predicted_status"],
        "risk_level": prediction["risk_level"],

        "explanation": prediction["explanation"],
        "created_by": prediction["created_by"]
    }
    
    
    
def save_monitoring_prediction(
    metrics,
    prediction_result
):
    predictions_collection = db["predictions"]

    new_prediction = {
        "source": "system_monitoring",

        # System metrics
        "cpu_usage": metrics["cpu_usage"],
        "memory_usage": metrics["memory_usage"],
        "error_rate": metrics["error_rate"],
        "response_time": metrics["response_time"],

        # ML prediction
        "failure_probability": prediction_result["failure_probability"],
        "predicted_status": prediction_result["predicted_status"],
        "risk_level": prediction_result["risk_level"],

        "explanation": "Prediction generated from real-time system monitoring"
    }

    result = predictions_collection.insert_one(new_prediction)

    return {
        "id": str(result.inserted_id),
        **new_prediction
    }