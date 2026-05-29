# VendorIQ — AI-Powered Vendor Incident Intelligence Platform

VendorIQ is a full-stack AIOps-inspired incident intelligence platform built to simulate how enterprise operations and SRE teams monitor, analyze, and respond to vendor/payment-processing incidents in real time.

The system ingests operational alerts, performs AI-assisted risk analysis, tracks SLA breaches, detects anomalies, and provides real-time operational visibility through a modern dashboard experience.

---

# Live Application

Frontend:
https://vendoriq-ai.vercel.app

Backend API:
https://vendoriq-api.onrender.com

Swagger Docs:
https://vendoriq-api.onrender.com/docs

---

# Key Features

## Real-Time Incident Monitoring

- Live operational dashboard
- Realtime WebSocket updates
- Auto-refresh monitoring
- Incident ingestion simulation

---

## AI-Assisted Risk Intelligence

- Risk scoring engine
- Severity classification
- SLA breach detection
- Root-cause prediction
- Recommendation generation
- Incident correlation scoring

---

## Vendor / ACH Monitoring

- ACK delay monitoring
- Payment processing incident tracking
- Amount impacted analysis
- Vendor operational intelligence
- ACH workflow simulation

---

## Modern Operations Dashboard

- KPI cards
- Incident trend analytics
- Alert source distribution
- AI prediction panel
- Responsive enterprise UI
- Material UI based design system

---

## Backend APIs

- Incident ingestion APIs
- Dashboard summary APIs
- Trend APIs
- Incident detail APIs
- Realtime websocket APIs
- AI intelligence endpoints

---

# Tech Stack

## Frontend

- React
- Vite
- Material UI
- Axios
- Recharts

## Backend

- FastAPI
- SQLAlchemy
- Pydantic
- WebSockets
- Uvicorn

## Database

- PostgreSQL (Production)
- SQLite (Local Development)

## Deployment

- Vercel (Frontend)
- Render (Backend + PostgreSQL)

---

# System Architecture

```text
Frontend (React + MUI)
        ↓
REST APIs + WebSockets
        ↓
FastAPI Backend
        ↓
AI Intelligence Engine
        ↓
PostgreSQL Database
```

---

# AI Intelligence Engine

VendorIQ uses a hybrid operational AI engine that performs:

- Incident risk analysis
- Severity prediction
- SLA breach analysis
- Root-cause inference
- Operational recommendation generation
- Incident correlation analysis

Example intelligence signals:

- ACK delay duration
- Vendor behavior
- Impacted amount
- Severity level
- Error code patterns
- Historical operational logic

---

# Example Incident Flow

```text
Vendor ACK Delay Detected
        ↓
Incident Created
        ↓
AI Risk Analysis Generated
        ↓
SLA Evaluation
        ↓
Realtime Dashboard Update
        ↓
Operational Recommendation Generated
```

---

# Local Development Setup

## Clone Repository

```bash
git clone https://github.com/vkgonesane/IncidentAISystem.git
```

---

# Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Environment Variables

## Backend

Create `.env`

```env
DATABASE_URL=your_database_url
CORS_ORIGINS=http://localhost:5173
```

## Frontend

Create `.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_WS_URL=ws://127.0.0.1:8000/ws/incidents
```

---

# API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | API health |
| GET | `/incidents` | Get incidents |
| GET | `/dashboard/summary` | Dashboard KPIs |
| GET | `/incidents/trend` | Incident trends |
| POST | `/alerts/simulate` | Simulate incident |
| PUT | `/incidents/{id}` | Update incident |
| WS | `/ws/incidents` | Realtime updates |

---

# Production Highlights

- Production frontend deployment
- Production backend deployment
- Realtime websocket infrastructure
- PostgreSQL cloud database
- AI-assisted operational intelligence
- Enterprise-inspired monitoring architecture

---

# Future Enhancements

- JWT Authentication
- Role-Based Access Control (RBAC)
- ML-based anomaly detection
- Vector similarity search
- LLM-powered incident summaries
- Docker containerization
- CI/CD pipelines
- Prometheus + Grafana monitoring

---

# Why This Project?

VendorIQ was built to simulate real-world operational intelligence systems used by:

- SRE teams
- FinTech operations teams
- Incident management teams
- Vendor monitoring systems
- Payment processing platforms

The project focuses heavily on:

- backend engineering
- realtime systems
- operational intelligence
- AIOps-inspired architecture
- production deployment practices

---

# Author

## Vaibhav

Built as a portfolio-grade AIOps and operational intelligence platform inspired by enterprise incident management systems.