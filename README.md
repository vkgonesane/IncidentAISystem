# VendorIQ — AI-Powered Vendor Incident Intelligence Platform

VendorIQ is a full-stack AIOps-inspired incident intelligence platform designed to help engineering, operations, and SRE teams detect, analyze, and respond to vendor and payment-processing incidents in real time.

The platform simulates how modern production systems ingest operational alerts, store incident data, perform AI-assisted analysis, monitor SLA breaches, and provide realtime operational visibility through a modern dashboard experience.

---

# Live Application

### Frontend

https://vendoriq-ai.vercel.app

### Backend API

https://vendoriq-api.onrender.com

### Swagger Documentation

https://vendoriq-api.onrender.com/docs

---

# Project Goal

Modern enterprise systems rely heavily on external vendors, APIs, payment processors, and distributed services.

When failures occur, engineering teams often need to manually:

* investigate operational issues
* analyze logs and alerts
* identify root causes
* evaluate business impact
* track SLA breaches
* notify stakeholders
* coordinate incident response

VendorIQ aims to automate and simplify that workflow using backend engineering, realtime systems, and AI-assisted operational intelligence.

The platform is designed to simulate enterprise-grade incident monitoring systems used in:

* SRE environments
* FinTech operations
* Vendor management systems
* Payment processing platforms
* AIOps workflows

---

# Key Features

## Real-Time Incident Monitoring

* Live operational dashboard
* WebSocket-powered realtime updates
* Auto-refresh monitoring
* Simulated incident ingestion
* Operational KPI tracking

---

## AI-Assisted Incident Intelligence

* Risk scoring engine
* Severity classification
* Root-cause prediction
* SLA breach analysis
* Correlation scoring
* AI-generated recommendations

---

## Vendor / ACH Monitoring

* ACK delay monitoring
* Payment-processing incident simulation
* Vendor operational analysis
* Impacted amount analysis
* ACH workflow monitoring
* SLA violation tracking

---

## Modern Operations Dashboard

* KPI metric cards
* Incident trend analytics
* Alert source distribution
* AI insights panel
* Responsive enterprise UI
* Material UI design system

---

## Backend APIs

* Incident ingestion APIs
* Dashboard analytics APIs
* Trend APIs
* Realtime websocket APIs
* AI intelligence endpoints
* Incident detail APIs

---

# System Architecture

```text
Monitoring Systems / Vendor Events
                |
                v
      Incident Ingestion APIs
           (FastAPI Backend)
                |
                v
      PostgreSQL Database
                |
                v
     AI Intelligence Engine
                |
                v
 Realtime Dashboard + Analytics
                |
                v
 React Frontend Dashboard
```

---

# AI Intelligence Engine

VendorIQ uses a hybrid operational AI engine that performs:

* Incident risk analysis
* Severity prediction
* Root-cause inference
* SLA breach evaluation
* Operational recommendation generation
* Incident correlation analysis

Example intelligence signals:

* ACK delay duration
* Vendor behavior patterns
* Impacted transaction amount
* Severity level
* Error code analysis
* Historical operational logic

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

# Technology Stack

## Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* WebSockets
* Uvicorn

---

## Frontend

* React
* Vite
* Material UI
* Axios
* Recharts

---

## Database

### Development

* SQLite

### Production

* PostgreSQL

---

## Deployment

### Frontend Hosting

* Vercel

### Backend Hosting

* Render

### Database Hosting

* Render PostgreSQL

---

# Project Structure

```text
Incident-AI-System
│
├── backend
│   ├── app
│   │   ├── database
│   │   │   └── db.py
│   │   │
│   │   ├── models
│   │   │   ├── incident.py
│   │   │   ├── ai_analysis.py
│   │   │   └── incident_update.py
│   │   │
│   │   ├── routes
│   │   │   ├── alerts.py
│   │   │   ├── dashboard.py
│   │   │   ├── incidents.py
│   │   │   ├── intelligence.py
│   │   │   ├── monitoring.py
│   │   │   └── realtime.py
│   │   │
│   │   ├── schemas
│   │   │
│   │   ├── services
│   │   │   ├── ai_agent.py
│   │   │   └── websocket_manager.py
│   │   │
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── charts
│   │
│   └── package.json
│
└── docs
```

---

# Backend Setup

## Clone Repository

```bash
git clone https://github.com/vkgonesane/IncidentAISystem.git
```

---

## Navigate to Backend

```bash
cd backend
```

---

## Create Virtual Environment

```bash
python -m venv venv
```

---

## Activate Environment

### Windows

```bash
venv\Scripts\activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run Backend Server

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

# Frontend Setup

## Navigate to Frontend

```bash
cd frontend
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Environment Variables

## Backend `.env`

```env
DATABASE_URL=your_database_url
CORS_ORIGINS=http://localhost:5173
```

---

## Frontend `.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_WS_URL=ws://127.0.0.1:8000/ws/incidents
```

---

# API Documentation

FastAPI automatically generates Swagger documentation.

Available at:

```text
https://vendoriq-api.onrender.com/docs
```

---

# Current Features

* FastAPI backend APIs
* SQLAlchemy ORM integration
* PostgreSQL production database
* Realtime websocket updates
* AI-assisted incident intelligence
* Incident monitoring dashboard
* SLA breach monitoring
* Vendor incident simulation
* Dashboard analytics APIs
* Production deployment setup

---

# Planned Features

* JWT Authentication
* Role-Based Access Control (RBAC)
* ML-based anomaly detection
* Vector similarity search
* LLM-powered incident summaries
* Docker containerization
* CI/CD pipelines
* Prometheus + Grafana monitoring
* Slack / Teams notifications
* Dynatrace / Splunk integration

---

# Learning Goals

This project explores real-world backend and operational engineering concepts including:

* API design
* scalable backend architecture
* realtime systems
* database modeling
* AI-assisted automation
* operational intelligence systems
* production deployment workflows
* AIOps-inspired architectures

---

# Future Improvements

* integrate monitoring platforms
* improve AI correlation engine
* add semantic incident similarity
* implement production authentication
* support distributed event streaming
* optimize realtime websocket scaling
* introduce observability tooling

---

# Author

## Vaibhav

Built as a portfolio-grade backend and AI engineering project inspired by enterprise incident management and operational intelligence systems.
