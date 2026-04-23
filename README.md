# Incident AI System

An AI-assisted incident management platform designed to help engineering teams detect, analyze, and respond to production incidents faster.

This project simulates how modern production systems automatically process alerts from monitoring tools, store incident data, and perform AI-based root cause analysis.

---

# Project Goal

Modern production environments rely on multiple vendors, APIs, and services. When failures occur, engineers often must manually:

- investigate logs
- create incident reports
- notify stakeholders
- identify root causes

This project aims to automate that workflow using AI and backend engineering techniques.

The system will:

- ingest alerts from monitoring systems
- create incidents automatically
- store incidents in a database
- run AI analysis on incident data
- provide a dashboard for engineers
- notify stakeholders of incidents

---

# Architecture Overview

```
Monitoring Tools
        |
        v
Incident Ingestion API (FastAPI)
        |
        v
Database (SQLite / PostgreSQL)
        |
        v
AI Agent (Root Cause Analysis)
        |
        v
Notification System
        |
        v
Frontend Dashboard (React)
```

---

# Technology Stack

Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite (development)
- PostgreSQL (planned)

Frontend (planned)

- React
- Axios
- Material UI / Tailwind

AI / ML (planned)

- OpenAI API or LLM
- NLP-based log analysis
- Vector search for incident similarity

---

# Project Structure

```
Incident-AI-System
│
├── backend
│   ├── app
│   │   ├── database
│   │   │   └── db.py
│   │   ├── models
│   │   │   └── incident.py
│   │   ├── routes
│   │   │   └── alerts.py
│   │   ├── schemas
│   │   │   └── alert_schema.py
│   │   ├── services
│   │   │   └── ai_agent.py
│   │   └── main.py
│   │
│   ├── incidents.db
│   └── requirements.txt
│
├── frontend (planned)
│
└── docs
    ├── architecture.md
    ├── development-notes.md
    └── learning-log.md
```

---

# Backend Setup

Clone the repository:

```
git clone https://github.com/vkgonesane/incident-ai-system.git
```

Navigate to the backend folder:

```
cd Incident-AI-System/backend
```

Create a virtual environment:

```
python -m venv venv
```

Activate the environment:

Windows

```
venv\Scripts\activate
```

Install dependencies:

```
pip install fastapi uvicorn sqlalchemy pydantic
```

Run the server:

```
uvicorn app.main:app --reload
```

---

# API Documentation

Once the server is running, visit:

```
http://127.0.0.1:8000/docs
```

FastAPI automatically generates Swagger documentation for all endpoints.

---

# Current Features

- FastAPI backend server
- SQLAlchemy ORM integration
- SQLite database setup
- Incident database model
- Automatic table creation
- API documentation via Swagger

---

# Planned Features

- Alert ingestion API
- Incident creation API
- AI-based root cause suggestions
- Log summarization
- Incident similarity detection
- Notification system (Slack / Email / Teams)
- React dashboard
- PostgreSQL database support

---

# Learning Goals

This project is designed to explore real-world backend engineering concepts including:

- API design
- database modeling
- clean backend architecture
- AI-assisted automation
- incident management systems

---

# Future Improvements

- integrate monitoring tools (Dynatrace / Prometheus)
- add AI log analysis
- add vector database for incident similarity
- deploy backend using Docker
- build a full React dashboard

---

# Author

Built as a learning project for backend and AI engineering.
