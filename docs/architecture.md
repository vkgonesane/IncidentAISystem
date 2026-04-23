```md
# System Architecture

## High Level Design

```

Monitoring Tools
↓
FastAPI API
↓
Database (SQLite / PostgreSQL)
↓
AI Analysis Engine (Planned)
↓
React Dashboard (Planned)

```

---

## Backend Flow

```

Incoming Alert
↓
POST /alerts API
↓
Validation (Pydantic)
↓
Database Insert (SQLAlchemy)
↓
Incident Stored
↓
Response Returned

```

---

## Read Flow

### Fetch All Incidents

```

GET /incidents
↓
Fetch all records from database
↓
Return JSON response

```

### Fetch Single Incident

```

GET /incidents/{id}
↓
Find specific incident by ID
↓
Return incident data
↓
If not found → return 404 error

```

---

## Update Flow

```

PUT /incidents/{id}
↓
Receive update request
↓
Find incident in database
↓
Update only provided fields
↓
Commit changes to database
↓
Return updated incident

```

Example status update flow:

```

OPEN
↓
INVESTIGATING
↓
RESOLVED

```

---

## Current Implemented Components

### 1. FastAPI
Used to build backend API endpoints.

### 2. SQLAlchemy
Used as ORM to connect Python models with database tables.

### 3. SQLite
Used as development database.

### 4. Pydantic
Used for request validation and response schemas.

### 5. Uvicorn
Used to run the FastAPI application server.

---

## Current Backend Structure

```

backend/
│
├── app/
│   ├── main.py
│   ├── database/
│   │   └── db.py
│   ├── models/
│   │   └── incident.py
│   ├── schemas/
│   │   ├── alert_schema.py
│   │   └── incident_schema.py
│   ├── routes/
│   │   └── alerts.py
│   └── services/
│       └── ai_agent.py
│
├── incidents.db
├── requirements.txt

```

---

## Database Design

### Table: incidents

Fields:

- `id` → primary key
- `vendor` → vendor/system name
- `environment` → PROD / QA / DEV
- `severity` → HIGH / MEDIUM / LOW
- `error_code` → incident error code
- `status` → OPEN / INVESTIGATING / RESOLVED
- `created_at` → timestamp of incident creation

---

## Current API Endpoints

### Create
- `POST /alerts`

### Read
- `GET /incidents`
- `GET /incidents/{id}`

### Update
- `PUT /incidents/{id}`

### Utility
- `GET /health`
- `GET /`

---

## Request-Response Architecture

```

Client / Swagger UI
↓
FastAPI Route
↓
Pydantic Schema Validation
↓
SQLAlchemy ORM
↓
SQLite Database
↓
Response Model
↓
JSON Response Returned

```

---

## Design Principles Used

### Separation of Concerns
- routes → API handling
- schemas → validation
- models → database structure
- database → connection setup
- services → business logic

### Persistence First
Incident data is stored first before future AI analysis.

### Clean Architecture
The project is structured so that components are separated and easier to scale later.

---

## Planned Future Enhancements

### 1. Filtering & Search
Examples:
- `GET /incidents?status=OPEN`
- `GET /incidents?vendor=Experian`

### 2. Email Notification Service
Automatically notify stakeholders when incidents are created or updated.

### 3. AI Root Cause Analysis
Use an LLM / AI engine to suggest:
- probable root cause
- confidence score
- recommended action

### 4. Similar Incident Detection
Use vector search to find similar past incidents.

### 5. React Dashboard
Frontend to:
- view incidents
- filter incidents
- update incident status
- see AI suggestions

### 6. PostgreSQL Migration
Upgrade from SQLite to PostgreSQL for production readiness.

---

## Long-Term Target Architecture

```

Monitoring Tools
↓
FastAPI Alert Ingestion API
↓
Database Storage
↓
AI Analysis Layer
↓
Notification Service
↓
React Dashboard

```

---

## Current Project Stage

Current progress: **50 / 100**

### Completed
- backend setup
- database connection
- incident model
- create API
- read APIs
- update API
- response schemas
- documentation

### Next Phase
- filtering
- search
- AI integration
- notifications
- frontend dashboard
```