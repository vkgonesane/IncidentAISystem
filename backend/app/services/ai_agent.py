def analyze_incident(incident):
    root_cause = "Unknown issue"
    confidence = 0.50
    recommendation = "Please investigate the incident manually."

    if incident.error_code == "HTTP_502":
        root_cause = "Bad Gateway - upstream vendor service may be unavailable"
        confidence = 0.88
        recommendation = "Check vendor API health and retry failed requests."

    elif incident.error_code == "HTTP_500":
        root_cause = "Internal Server Error - service or dependency failure"
        confidence = 0.84
        recommendation = "Check backend service logs and dependent systems."

    elif incident.error_code == "TIMEOUT":
        root_cause = "Request timeout - network latency or slow upstream system"
        confidence = 0.81
        recommendation = "Inspect response times, network latency, and upstream availability."

    elif incident.error_code == "DB_CONN_ERROR":
        root_cause = "Database connection issue"
        confidence = 0.90
        recommendation = "Verify database status, credentials, and connection pool health."

    if incident.severity == "CRITICAL":
        recommendation += " Escalate immediately to the on-call engineer."

    return {
        "root_cause": root_cause,
        "confidence": confidence,
        "recommendation": recommendation
    }