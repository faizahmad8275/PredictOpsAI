from database.connection import db
from models.incident import IncidentCreate, IncidentUpdate
from bson import ObjectId


def create_incident(incident: IncidentCreate, current_user):
    incidents_collection = db["incidents"]

    new_incident = {
        "service": incident.service,
        "description": incident.description,
        "severity": incident.severity,
        "status": incident.status,
        "created_by": str(current_user["_id"])
    }

    result = incidents_collection.insert_one(new_incident)

    return {
        "id": str(result.inserted_id),
        "service": incident.service,
        "description": incident.description,
        "severity": incident.severity,
        "status": incident.status,
        "created_by": str(current_user["_id"])
    }
    
def get_incidents(current_user):
    incidents_collection = db["incidents"]

    incidents = incidents_collection.find({
        "created_by": str(current_user["_id"])
    })

    result = []

    for incident in incidents:
        result.append({
            "id": str(incident["_id"]),
            "service": incident["service"],
            "description": incident["description"],
            "severity": incident["severity"],
            "status": incident["status"],
            "created_by": incident["created_by"]
        })

    return result


def get_incident_by_id(incident_id: str, current_user):
    incidents_collection = db["incidents"]

    incident = incidents_collection.find_one({
        "_id": ObjectId(incident_id),
        "created_by": str(current_user["_id"])
    })

    if incident is None:
        return None

    return {
        "id": str(incident["_id"]),
        "service": incident["service"],
        "description": incident["description"],
        "severity": incident["severity"],
        "status": incident["status"],
        "created_by": incident["created_by"]
    }
    
    
    
def update_incident(
    incident_id: str,
    incident: IncidentUpdate,
    current_user
):
    incidents_collection = db["incidents"]

    update_data = {
        key: value
        for key, value in incident.model_dump().items()
        if value is not None
    }

    if not update_data:
        return None

    result = incidents_collection.update_one(
        {
            "_id": ObjectId(incident_id),
            "created_by": str(current_user["_id"])
        },
        {"$set": update_data}
    )

    if result.matched_count == 0:
        return None

    updated_incident = incidents_collection.find_one({
        "_id": ObjectId(incident_id),
        "created_by": str(current_user["_id"])
    })

    return {
        "id": str(updated_incident["_id"]),
        "service": updated_incident["service"],
        "description": updated_incident["description"],
        "severity": updated_incident["severity"],
        "status": updated_incident["status"],
        "created_by": updated_incident["created_by"]
    }
    
    
    
    
def delete_incident(incident_id: str, current_user):
    incidents_collection = db["incidents"]

    result = incidents_collection.delete_one({
        "_id": ObjectId(incident_id),
        "created_by": str(current_user["_id"])
    })

    if result.deleted_count == 0:
        return False

    return True