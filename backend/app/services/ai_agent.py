from sqlalchemy.orm import Session

from app.models.incident import Incident


def rule_based_analysis(incident: Incident):
    error_code = incident.error_code

    if error_code == "ACK_TIMEOUT":
        return {
            "root_cause": "Vendor acknowledgement not received within SLA window",
            "confidence": 0.89,
            "recommendation": (
                "Validate outbound file delivery, inspect ACK listener or queue, "
                "review retry logs, and contact the vendor if ACK remains missing."
            )
        }

    if error_code == "SLA_BREACH":
        return {
            "root_cause": "Vendor processing exceeded the agreed SLA window",
            "confidence": 0.87,
            "recommendation": (
                "Escalate to vendor support, verify processing status, "
                "and notify payment operations about potential downstream delay."
            )
        }

    if error_code == "FILE_MISMATCH":
        return {
            "root_cause": "Mismatch detected between transmitted file and vendor acknowledgement",
            "confidence": 0.86,
            "recommendation": (
                "Compare record counts, file checksum, amount totals, "
                "and reconciliation logs before reprocessing."
            )
        }

    if error_code == "PAYMENT_DELAY":
        return {
            "root_cause": "Payment processing delay detected in vendor or batch workflow",
            "confidence": 0.83,
            "recommendation": (
                "Inspect payment batch status, settlement window, queue backlog, "
                "and vendor processing confirmation."
            )
        }

    if error_code == "HTTP_502":
        return {
            "root_cause": "Possible upstream vendor outage or gateway instability",
            "confidence": 0.88,
            "recommendation": "Escalate issue to vendor support and inspect upstream gateway health."
        }

    if error_code == "HTTP_500":
        return {
            "root_cause": "Internal application failure or dependency issue",
            "confidence": 0.84,
            "recommendation": "Inspect application logs and downstream service dependencies."
        }

    if error_code == "TIMEOUT":
        return {
            "root_cause": "Request timeout caused by latency or slow upstream response",
            "confidence": 0.81,
            "recommendation": "Inspect network latency, response times, and upstream availability."
        }

    if error_code == "DB_CONN_ERROR":
        return {
            "root_cause": "Database connection instability or DB outage",
            "confidence": 0.90,
            "recommendation": "Inspect DB server health, connection pool usage, and failover status."
        }

    return {
        "root_cause": "Unknown issue detected",
        "confidence": 0.50,
        "recommendation": "Further investigation required."
    }


def build_summary(incident: Incident, recurrence_count: int):
    summary = (
        f"{incident.severity} severity incident detected for "
        f"{incident.vendor} in {incident.environment} environment."
    )

    if incident.error_code == "ACK_TIMEOUT":
        summary += (
            f" Vendor ACK delay is {incident.ack_delay_minutes} minutes "
            f"against SLA of {incident.sla_minutes} minutes."
        )

    if incident.sla_status == "BREACHED":
        summary += " SLA status is BREACHED."

    if incident.is_anomaly:
        summary += " This incident is flagged as an anomaly based on historical delay patterns."

    if recurrence_count > 1:
        summary += (
            f" Similar incidents have occurred {recurrence_count} times, "
            f"indicating a recurring operational issue."
        )

    return summary


def build_priority_reason(incident: Incident):
    if incident.sla_status == "BREACHED":
        return (
            "High priority because the vendor ACK SLA has been breached, "
            "which may delay payment processing or downstream reconciliation."
        )

    if incident.severity == "CRITICAL":
        return (
            "Critical priority because the incident impacts production systems "
            "and may affect business operations."
        )

    if incident.severity == "HIGH":
        return (
            "High priority because the issue may impact system reliability "
            "or customer experience."
        )

    return "Standard operational priority."


def build_recurrence_insight(recurrence_count: int):
    if recurrence_count <= 1:
        return "No significant recurrence pattern detected."

    return (
        f"This incident pattern has occurred {recurrence_count} times "
        f"for similar vendor/error combinations."
    )


def analyze_incident(
    incident: Incident,
    db: Session = None
):
    base_analysis = rule_based_analysis(incident)

    recurrence_count = 1

    if db:
        recurrence_count = (
            db.query(Incident)
            .filter(Incident.vendor == incident.vendor)
            .filter(Incident.error_code == incident.error_code)
            .count()
        )

    summary = build_summary(
        incident,
        recurrence_count
    )

    recurrence_insight = build_recurrence_insight(
        recurrence_count
    )

    priority_reason = build_priority_reason(
        incident
    )

    result = {
        "root_cause": base_analysis["root_cause"],
        "confidence": base_analysis["confidence"],
        "recommendation": base_analysis["recommendation"],
        "summary": summary,
        "recurrence_insight": recurrence_insight,
        "priority_reason": priority_reason
    }

    return result