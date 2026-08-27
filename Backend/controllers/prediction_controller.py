from Backend.database.connection import db
from Backend.models.prediction import PredictionCreate
from Backend.utils.prediction import calculate_prediction
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

    # Calculate prediction
    prediction_result = calculate_prediction(severity)

    new_prediction = {
        "incident_id": prediction.incident_id,
        "service": service,
        "severity": severity,
        "failure_probability": prediction_result["failure_probability"],
        "predicted_status": prediction_result["predicted_status"],
        "risk_level": prediction_result["risk_level"],
        "explanation": "Prediction generated based on incident severity",
        "created_by": str(current_user["_id"])
    }

    result = predictions_collection.insert_one(new_prediction)

    return {
        "id": str(result.inserted_id),
        "incident_id": prediction.incident_id,
        "service": service,
        "severity": severity,
        "failure_probability": prediction_result["failure_probability"],
        "predicted_status": prediction_result["predicted_status"],
        "risk_level": prediction_result["risk_level"],
        "explanation": "Prediction generated based on incident severity",
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
        "failure_probability": prediction["failure_probability"],
        "predicted_status": prediction["predicted_status"],
        "risk_level": prediction["risk_level"],
        "explanation": prediction["explanation"],
        "created_by": prediction["created_by"]
    }