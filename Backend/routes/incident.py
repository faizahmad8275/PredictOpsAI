from fastapi import APIRouter, HTTPException, Depends
from Backend.models.incident import IncidentCreate, IncidentUpdate
from Backend.utils.auth import get_current_user

from Backend.controllers.incident_controller import (
    create_incident,
    get_incidents,
    get_incident_by_id,
    update_incident,
    delete_incident
)


router = APIRouter(
    prefix="/incidents",
    tags=["Incidents"]
)


@router.post("/")
def create_new_incident(
    incident: IncidentCreate,
    current_user = Depends(get_current_user)
):
    return create_incident(incident, current_user)


@router.get("/")
def get_all_incidents(
    current_user = Depends(get_current_user)
):
    return get_incidents(current_user)


@router.get("/{incident_id}")
def get_single_incident(
    incident_id: str,
    current_user = Depends(get_current_user)
):
    result = get_incident_by_id(
        incident_id,
        current_user
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return result




@router.patch("/{incident_id}")
def update_existing_incident(
    incident_id: str,
    incident: IncidentUpdate,
    current_user = Depends(get_current_user)
):
    result = update_incident(
        incident_id,
        incident,
        current_user
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return result




@router.delete("/{incident_id}")
def delete_existing_incident(
    incident_id: str,
    current_user = Depends(get_current_user)
):
    result = delete_incident(
        incident_id,
        current_user
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return {
        "message": "Incident deleted successfully"
    }