from fastapi import APIRouter, Depends, HTTPException
from Backend.models.prediction import PredictionCreate
from Backend.controllers.prediction_controller import (
    create_prediction,
    get_predictions,
    get_prediction_by_id
)
from Backend.utils.auth import get_current_user



router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"]
)


@router.post("/")
def create_new_prediction(
    prediction: PredictionCreate,
    current_user = Depends(get_current_user)
):
    return create_prediction(
        prediction,
        current_user
    )
    
    
    
@router.get("/")
def get_all_predictions(
    current_user = Depends(get_current_user)
):
    return get_predictions(current_user)



@router.get("/{prediction_id}")
def get_single_prediction(
    prediction_id: str,
    current_user = Depends(get_current_user)
):
    result = get_prediction_by_id(
        prediction_id,
        current_user
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    return result