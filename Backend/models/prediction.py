from pydantic import BaseModel


class PredictionCreate(BaseModel):
    incident_id: str
    cpu_usage: float
    memory_usage: float
    error_rate: float
    response_time: float


class PredictionResponse(BaseModel):
    incident_id: str
    service: str
    severity: str

    cpu_usage: float
    memory_usage: float
    error_rate: float
    response_time: float

    failure_probability: float
    predicted_status: str
    risk_level: str
    explanation: str