import os
import smtplib

from email.message import EmailMessage

from dotenv import load_dotenv
from sqlalchemy.orm import Session

from app.database.db import SessionLocal

from app.models.notification_recipient import (
    NotificationRecipient
)

load_dotenv()


def build_incident_email(
    incident,
    ai_result=None
):
    subject = (
        f"[INCIDENT ALERT] "
        f"{incident.vendor} - "
        f"{incident.severity}"
    )

    body = f"""
VendorIQ Incident Alert

Incident ID: {incident.id}
Vendor: {incident.vendor}
Environment: {incident.environment}
Severity: {incident.severity}
Error Code: {incident.error_code}
Status: {incident.status}
Created At: {incident.created_at}

========================================
""".strip()

    if ai_result:
        body += f"""

AI ANALYSIS

Root Cause:
{ai_result.get("root_cause")}

Confidence:
{ai_result.get("confidence")}

Recommendation:
{ai_result.get("recommendation")}
"""

    return subject, body


def get_vendor_recipients(
    vendor: str
):
    db: Session = SessionLocal()

    try:
        recipients = (
            db.query(NotificationRecipient)
            .filter(
                NotificationRecipient.vendor
                == vendor,
                NotificationRecipient.is_active
                == True
            )
            .all()
        )

        return [
            recipient.email
            for recipient in recipients
        ]

    finally:
        db.close()


def send_email_notification(
    incident,
    ai_result=None
):
    subject, body = build_incident_email(
        incident,
        ai_result
    )

    smtp_host = os.getenv("SMTP_HOST")

    smtp_port = int(
        os.getenv("SMTP_PORT", "587")
    )

    smtp_username = os.getenv(
        "SMTP_USERNAME"
    )

    smtp_password = os.getenv(
        "SMTP_PASSWORD"
    )

    recipient_emails = (
        get_vendor_recipients(
            incident.vendor
        )
    )

    print("\n========== EMAIL DEBUG ==========")

    print("Vendor:", incident.vendor)

    print(
        "Recipients:",
        recipient_emails
    )

    print("=================================\n")

    if not recipient_emails:
        print(
            "No active recipients found "
            "for vendor."
        )

        return False

    if not all([
        smtp_host,
        smtp_username,
        smtp_password
    ]):
        print(
            "Missing SMTP configuration."
        )

        return False

    message = EmailMessage()

    message["Subject"] = subject

    message["From"] = smtp_username

    message["To"] = ", ".join(
        recipient_emails
    )

    message.set_content(body)

    try:
        print(
            "Connecting to SMTP..."
        )

        with smtplib.SMTP(
            smtp_host,
            smtp_port
        ) as server:

            server.ehlo()

            server.starttls()

            server.ehlo()

            print(
                "Logging into SMTP..."
            )

            server.login(
                smtp_username,
                smtp_password
            )

            print(
                "Sending email..."
            )

            server.send_message(message)

        print(
            "Email sent successfully ✅"
        )

        return True

    except Exception as e:
        print(
            f"Email failed ❌: {str(e)}"
        )

        return False