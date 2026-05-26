import os
import requests

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LOG_FILE = os.path.join(BASE_DIR, "logs", "sample_app.log")
STATE_FILE = os.path.join(BASE_DIR, "logs", "scanner_state.txt")

API_URL = "http://127.0.0.1:8000/alerts"


def get_last_processed_line():
    if not os.path.exists(STATE_FILE):
        return 0

    with open(STATE_FILE, "r") as file:
        value = file.read().strip()

    if not value:
        return 0

    return int(value)


def save_last_processed_line(line_number):
    with open(STATE_FILE, "w") as file:
        file.write(str(line_number))


def process_log_line(line: str):
    if "ERROR" not in line:
        return

    parts = line.split()

    if len(parts) < 4:
        return

    vendor = parts[1]
    environment = parts[2]
    error_code = parts[3]

    severity = "HIGH"

    if error_code in ["HTTP_502", "DB_CONN_ERROR"]:
        severity = "CRITICAL"

    payload = {
        "vendor": vendor,
        "environment": environment,
        "severity": severity,
        "error_code": error_code,
        "source_type": "AUTO",
        "source_name": "log_scanner",
        "raw_payload": line
    }

    response = requests.post(API_URL, json=payload)

    print("Alert Sent:", response.status_code)
    print(response.json())


def scan_logs():
    last_processed_line = get_last_processed_line()

    with open(LOG_FILE, "r") as file:
        lines = file.readlines()

    new_lines = lines[last_processed_line:]

    if not new_lines:
        print("No new log lines to process.")
        return

    for line in new_lines:
        process_log_line(line.strip())

    save_last_processed_line(len(lines))


if __name__ == "__main__":
    scan_logs()