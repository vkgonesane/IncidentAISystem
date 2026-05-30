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

---

## Backend
- FastAPI
- SQLAlchemy
- Pydantic
- WebSockets
- Uvicorn

---

## Database
- PostgreSQL (Production)
- SQLite (Local Development)

---

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