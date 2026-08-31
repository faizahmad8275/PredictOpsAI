from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.health import router as health_router
from routes.user import router as user_router
from routes.incident import router as incident_router
from routes.prediction import router as prediction_router
from routes import report

app = FastAPI(title="PredictOps AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(user_router)
app.include_router(incident_router)
app.include_router(prediction_router)
app.include_router(report.router)


@app.get("/")
def home():
    return {
        "message": "PredictOps AI Backend is running!"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("Backend.main:app", host="127.0.0.1", port=8000, reload=True)