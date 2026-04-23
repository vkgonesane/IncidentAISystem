def build_incident_email(incident):
    subject = f"[INCIDENT ALERT] {incident.vendor} - {incident.severity}"

    body = f"""
Incident Created Successfully

Incident ID: {incident.id}
Vendor: {incident.vendor}
Environment: {incident.environment}
Severity: {incident.severity}
Error Code: {incident.error_code}
Status: {incident.status}
Created At: {incident.created_at}

Recommended Action:
Please investigate the issue and provide updates.
""".strip()

    return subject, body


def send_email_notification(incident):
    subject, body = build_incident_email(incident)

    print("\n" + "=" * 60)
    print("EMAIL NOTIFICATION TRIGGERED")
    print("=" * 60)
    print(f"Subject: {subject}")
    print("\nBody:")
    print(body)
    print("=" * 60 + "\n")