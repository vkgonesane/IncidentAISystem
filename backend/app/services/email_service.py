import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

load_dotenv()


def build_incident_email(incident, ai_result=None):
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
""".strip()

    # Add AI insights
    if ai_result:
        body += f"""

================ AI ANALYSIS ================

Root Cause:
{ai_result.get("root_cause")}

Confidence:
{ai_result.get("confidence")}

Recommendation:
{ai_result.get("recommendation")}
"""

    return subject, body


def send_email_notification(incident, ai_result=None):
    subject, body = build_incident_email(incident, ai_result)

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    alert_email_to = os.getenv("ALERT_EMAIL_TO")

    if not all([smtp_host, smtp_username, smtp_password, alert_email_to]):
        print("Email config missing → printing email instead")
        print_email_to_console(subject, body)
        return False

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = smtp_username
    message["To"] = alert_email_to
    message.set_content(body)

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(message)

        print("Email sent successfully ✅")
        return True

    except Exception as e:
        print(f"Email failed ❌: {e}")
        print_email_to_console(subject, body)
        return False


def print_email_to_console(subject, body):
    print("\n" + "=" * 60)
    print("EMAIL PREVIEW")
    print("=" * 60)
    print(f"Subject: {subject}")
    print("\nBody:")
    print(body)
    print("=" * 60 + "\n")