import datetime

from app.models.incident import Incident


CORRELATION_WINDOW_MINUTES = 90


def get_related_incidents(db, current_incident: Incident):
    window_start = (
        current_incident.created_at
        - datetime.timedelta(minutes=CORRELATION_WINDOW_MINUTES)
    )

    window_end = (
        current_incident.created_at
        + datetime.timedelta(minutes=CORRELATION_WINDOW_MINUTES)
    )

    return (
        db.query(Incident)
        .filter(Incident.id != current_incident.id)
        .filter(Incident.created_at >= window_start)
        .filter(Incident.created_at <= window_end)
        .filter(
            (Incident.vendor == current_incident.vendor)
            | (Incident.environment == current_incident.environment)
            | (Incident.error_code == current_incident.error_code)
            | (Incident.sla_status == current_incident.sla_status)
            | (Incident.severity == current_incident.severity)
        )
        .order_by(Incident.created_at.desc())
        .limit(15)
        .all()
    )


def calculate_incident_similarity(
    current_incident: Incident,
    related_incident: Incident,
):
    score = 0
    reasons = []

    if related_incident.vendor == current_incident.vendor:
        score += 25
        reasons.append("Matching vendor")

    if related_incident.error_code == current_incident.error_code:
        score += 25
        reasons.append("Matching error code")

    if related_incident.environment == current_incident.environment:
        score += 15
        reasons.append("Matching environment")

    if related_incident.severity == current_incident.severity:
        score += 10
        reasons.append("Matching severity")

    if related_incident.sla_status == current_incident.sla_status:
        score += 10
        reasons.append("Matching SLA behavior")

    if related_incident.is_anomaly:
        score += 5
        reasons.append("Anomaly-related operational event")

    if related_incident.duplicate_count > 1:
        score += 5
        reasons.append("Repeated duplicate activity detected")

    time_difference = abs(
        (
            related_incident.created_at
            - current_incident.created_at
        ).total_seconds()
        / 60
    )

    if time_difference <= 15:
        score += 15
        reasons.append("Occurred within 15 minutes")

    elif time_difference <= 30:
        score += 10
        reasons.append("Occurred within 30 minutes")

    elif time_difference <= 60:
        score += 5
        reasons.append("Occurred within 60 minutes")

    return {
        "score": min(score, 100),
        "reasons": reasons,
    }


def build_correlation_response(
    current_incident: Incident,
    related_incidents,
):
    enriched_related_incidents = []

    total_score = 0
    all_reasons = []

    for incident in related_incidents:
        similarity = calculate_incident_similarity(
            current_incident,
            incident,
        )

        similarity_score = similarity["score"]

        total_score += similarity_score
        all_reasons.extend(similarity["reasons"])

        enriched_related_incidents.append(
            {
                "id": incident.id,
                "vendor": incident.vendor,
                "environment": incident.environment,
                "severity": incident.severity,
                "error_code": incident.error_code,
                "status": incident.status,
                "sla_status": incident.sla_status,
                "is_anomaly": incident.is_anomaly,
                "duplicate_count": incident.duplicate_count,
                "created_at": incident.created_at,
                "similarity_score": similarity_score,
                "similarity_reasons": similarity["reasons"],
            }
        )

    unique_reasons = list(dict.fromkeys(all_reasons))

    average_score = (
        total_score / len(related_incidents)
        if related_incidents
        else 0
    )

    strongest_score = max(
        [
            incident["similarity_score"]
            for incident in enriched_related_incidents
        ],
        default=0,
    )

    critical_related_count = sum(
        1
        for incident in related_incidents
        if incident.severity == "CRITICAL"
    )

    breached_count = sum(
        1
        for incident in related_incidents
        if incident.sla_status == "BREACHED"
    )

    anomaly_count = sum(
        1
        for incident in related_incidents
        if incident.is_anomaly
    )

    risk_boost = 0

    if current_incident.severity == "CRITICAL":
        risk_boost += 15
    elif current_incident.severity == "HIGH":
        risk_boost += 10

    if len(related_incidents) >= 5:
        risk_boost += 15
    elif len(related_incidents) >= 3:
        risk_boost += 10

    if critical_related_count >= 2:
        risk_boost += 10

    if breached_count >= 2:
        risk_boost += 10

    if anomaly_count >= 1:
        risk_boost += 5

    correlation_score = round(
        min(
            max(average_score, strongest_score * 0.75) + risk_boost,
            100,
        )
    )

    potential_major_incident = (
        correlation_score >= 70
        or len(related_incidents) >= 4
        or critical_related_count >= 2
        or breached_count >= 3
    )

    return {
        "incident_id": current_incident.id,
        "related_count": len(related_incidents),
        "correlation_score": correlation_score,
        "potential_major_incident": potential_major_incident,
        "critical_related_count": critical_related_count,
        "breached_related_count": breached_count,
        "anomaly_related_count": anomaly_count,
        "reasons": unique_reasons,
        "related_incidents": enriched_related_incidents,
    }


def build_major_summary(
    current_incident: Incident,
    related_incidents,
):
    related_count = len(related_incidents)

    breached_count = sum(
        1
        for incident in related_incidents
        if incident.sla_status == "BREACHED"
    )

    anomaly_count = sum(
        1
        for incident in related_incidents
        if incident.is_anomaly
    )

    critical_count = sum(
        1
        for incident in related_incidents
        if incident.severity == "CRITICAL"
    )

    duplicate_activity_count = sum(
        1
        for incident in related_incidents
        if incident.duplicate_count > 1
    )

    major_incident = (
        related_count >= 5
        or breached_count >= 3
        or critical_count >= 2
        or anomaly_count >= 2
    )

    if major_incident:
        risk_level = "HIGH"

    elif related_count >= 3:
        risk_level = "MEDIUM"

    else:
        risk_level = "LOW"

    summary_parts = []

    if major_incident:
        summary_parts.append(
            "Potential major operational incident detected involving correlated vendor or SLA degradation patterns."
        )

    else:
        summary_parts.append(
            "No large-scale operational degradation pattern detected currently."
        )

    if breached_count > 0:
        summary_parts.append(
            f"{breached_count} related incidents breached SLA thresholds."
        )

    if critical_count > 0:
        summary_parts.append(
            f"{critical_count} critical severity operational alerts were identified."
        )

    if anomaly_count > 0:
        summary_parts.append(
            f"{anomaly_count} anomaly-driven operational events were detected."
        )

    if duplicate_activity_count > 0:
        summary_parts.append(
            f"{duplicate_activity_count} incidents showed duplicate operational activity patterns."
        )

    summary_parts.append(
        f"Operational correlation analysis detected {related_count} related incidents "
        f"within a {CORRELATION_WINDOW_MINUTES}-minute investigation window."
    )

    recommended_action = (
        "Continue monitoring operational workflows and vendor acknowledgements."
    )

    if major_incident:
        recommended_action = (
            "Escalate to incident bridge immediately, validate vendor ACK processing, "
            "inspect downstream payment queues, review reconciliation delays, "
            "and notify operational stakeholders."
        )

    return {
        "incident_id": current_incident.id,
        "major_incident": major_incident,
        "risk_level": risk_level,
        "summary": " ".join(summary_parts),
        "recommended_action": recommended_action,
    }