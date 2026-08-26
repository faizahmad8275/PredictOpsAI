from pydantic import BaseModel


class PredictionCreate(BaseModel):
    incident_id: str


class PredictionResponse(BaseModel):
    incident_id: str
    service: str
    severity: str
    failure_probability: float
    predicted_status: str
    risk_level: str
    explanation: str