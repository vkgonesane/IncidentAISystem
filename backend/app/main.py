import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import Base, engine
from app.models.incident import Incident
from app.models.ai_analysis import AIAnalysis
from app.models.incident_update import IncidentUpdate

from app.routes.alerts import router as alerts_router
from app.routes.dashboard import router as dashboard_router
from app.routes.incidents import router as incidents_router
from app.routes.intelligence import router as intelligence_router
from app.routes.monitoring import router as monitoring_router
from app.routes.realtime import router as realtime_router

load_dotenv()

app = FastAPI(title="Incident AI System API")

Base.metadata.create_all(bind=engine)

cors_origins = os.getenv("CORS_ORIGINS", "")

allowed_origins = [
    origin.strip()
    for origin in cors_origins.split(",")
    if origin.strip()
]

if not allowed_origins:
    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(alerts_router)
app.include_router(dashboard_router)
app.include_router(incidents_router)
app.include_router(intelligence_router)
app.include_router(monitoring_router)
app.include_router(realtime_router)


@app.get("/")
def home():
    return {"message": "Incident AI System Running"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "incident-ai-system-api",
    }