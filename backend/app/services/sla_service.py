def get_sla_status(
    ack_delay_minutes: int,
    sla_minutes: int,
):
    if ack_delay_minutes >= sla_minutes:
        return "BREACHED"

    if ack_delay_minutes >= int(sla_minutes * 0.8):
        return "AT_RISK"

    return "WITHIN"