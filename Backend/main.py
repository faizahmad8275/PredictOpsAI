from fastapi import FastAPI

from routes.health import router as health_router
from routes.user import router as user_router
from routes.incident import router as incident_router
from routes.prediction import router as prediction_router

app = FastAPI(title="PredictOps AI")

app.include_router(health_router)
app.include_router(user_router)
app.include_router(incident_router)
app.include_router(prediction_router)


@app.get("/")
def home():
    return {
        "message": "PredictOps AI Backend is running!"
    }