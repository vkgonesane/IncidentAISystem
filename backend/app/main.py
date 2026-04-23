from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import Base, engine
from app.models.incident import Incident
from app.models.ai_analysis import AIAnalysis
from app.routes.alerts import router as alerts_router

app = FastAPI(title="Incident AI System API")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(alerts_router)


@app.get("/")
def home():
    return {"message": "Incident AI System Running"}


@app.get("/health")
def health():
    return {"status": "ok"}