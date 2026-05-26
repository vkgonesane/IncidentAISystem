from app.models.incident import Incident


def is_anomaly_alert(db, alert):
    historical_incidents = (
        db.query(Incident)
        .filter(Incident.vendor == alert.vendor)
        .filter(Incident.error_code == alert.error_code)
        .filter(Incident.ack_delay_minutes > 0)
        .all()
    )

    if len(historical_incidents) < 3:
        return False

    average_delay = sum(
        incident.ack_delay_minutes
        for incident in historical_incidents
    ) / len(historical_incidents)

    current_delay = alert.ack_delay_minutes or 0

    return current_delay > average_delay * 2