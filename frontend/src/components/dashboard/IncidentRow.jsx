import {
  Box,
  Chip,
  LinearProgress,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import {
  formatRelativeTime,
  getConfidenceLabel,
  safeText,
} from "../../utils/formatters";

import SeverityChip from "../incident/SeverityChip";
import StatusChip from "../incident/StatusChip";
import SourceBadge from "../incident/SourceBadge";
import DuplicateBadge from "../incident/DuplicateBadge";

function getSlaStyles(slaStatus) {
  const status = String(
    slaStatus || ""
  ).toUpperCase();

  if (status === "BREACHED") {
    return {
      label: "BREACHED",
      bg: "rgba(239,68,68,0.10)",
      color: "#b91c1c",
      border:
        "rgba(239,68,68,0.18)",
    };
  }

  if (status === "AT_RISK") {
    return {
      label: "AT RISK",
      bg: "rgba(245,158,11,0.10)",
      color: "#b45309",
      border:
        "rgba(245,158,11,0.18)",
    };
  }

  return {
    label: "WITHIN SLA",
    bg: "rgba(16,185,129,0.10)",
    color: "#047857",
    border:
      "rgba(16,185,129,0.18)",
  };
}

function formatAmount(value) {
  const numberValue = Number(
    value || 0
  );

  if (numberValue >= 10000000) {
    return `$${(
      numberValue / 10000000
    ).toFixed(1)}Cr`;
  }

  if (numberValue >= 100000) {
    return `$${(
      numberValue / 100000
    ).toFixed(1)}L`;
  }

  return `$${numberValue.toLocaleString()}`;
}

function IncidentRow({
  incident,
  onClick,
}) {
  const confidence =
    incident?.ai_analysis
      ?.confidence;

  const numericConfidence =
    Number(confidence || 0);

  const confidenceValue =
    numericConfidence <= 1
      ? numericConfidence * 100
      : numericConfidence;

  const slaMeta =
    getSlaStyles(
      incident?.sla_status
    );

  return (
    <TableRow
      hover
      onClick={() =>
        onClick(incident)
      }
      sx={{
        cursor: "pointer",

        transition:
          "background-color 0.18s ease",

        "& td": {
          borderBottom:
            "1px solid #f1f5f9",

          py: 2,
        },

        "&:hover": {
          backgroundColor:
            "#f8fafc",
        },
      }}
    >
      <TableCell>
        <Box>
          <Typography
            sx={{
              fontSize: 14,

              fontWeight: 850,

              color: "#0f172a",

              letterSpacing:
                "-0.01em",
            }}
          >
            #{incident.id} ·{" "}
            {safeText(
              incident.error_code,
              "Incident alert"
            )}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,

              color: "#64748b",

              fontSize: 12,

              lineHeight: 1.6,

              maxWidth: 320,

              display:
                "-webkit-box",

              overflow: "hidden",

              WebkitLineClamp: 2,

              WebkitBoxOrient:
                "vertical",
            }}
          >
            {safeText(
              incident.ai_analysis
                ?.root_cause ||
                incident.description,
              "Click to inspect incident intelligence"
            )}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>
        <SeverityChip
          severity={
            incident.severity
          }
        />
      </TableCell>

      <TableCell>
        <StatusChip
          status={incident.status}
        />
      </TableCell>

      <TableCell>
        <Typography
          sx={{
            fontSize: 13,

            fontWeight: 800,

            color: "#0f172a",
          }}
        >
          {safeText(
            incident.vendor
          )}
        </Typography>

        <Typography
          sx={{
            mt: 0.4,

            color: "#94a3b8",

            fontSize: 11,

            fontWeight: 700,
          }}
        >
          {safeText(
            incident.environment
          )}
        </Typography>
      </TableCell>

      <TableCell>
        <Stack spacing={0.8}>
          <Chip
            size="small"
            label={slaMeta.label}
            sx={{
              width: "fit-content",

              backgroundColor:
                slaMeta.bg,

              color:
                slaMeta.color,

              border: `1px solid ${slaMeta.border}`,

              fontWeight: 800,

              fontSize: 11,
            }}
          />

          <Typography
            sx={{
              fontSize: 11,

              color: "#94a3b8",

              fontWeight: 700,
            }}
          >
            ACK delay ·{" "}
            {incident.ack_delay_minutes ||
              0}{" "}
            mins
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack spacing={0.6}>
          <Typography
            sx={{
              fontSize: 13,

              fontWeight: 850,

              color: "#0f172a",
            }}
          >
            {formatAmount(
              incident.amount_impacted
            )}
          </Typography>

          <Typography
            sx={{
              fontSize: 11,

              color: "#94a3b8",

              fontWeight: 700,
            }}
          >
            {Number(
              incident.records_impacted ||
                0
            ).toLocaleString()}{" "}
            records
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack spacing={0.8}>
          <SourceBadge
            sourceType={
              incident.source_type
            }
          />

          <DuplicateBadge
            duplicateCount={
              incident.duplicate_count
            }
          />
        </Stack>
      </TableCell>

      <TableCell>
        <Stack spacing={0.8}>
          <Typography
            sx={{
              fontSize: 11,

              fontWeight: 900,

              color: "#334155",

              letterSpacing:
                "0.02em",
            }}
          >
            {getConfidenceLabel(
              confidence
            )}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={
              Number.isNaN(
                confidenceValue
              )
                ? 0
                : Math.min(
                    confidenceValue,
                    100
                  )
            }
            sx={{
              width: 88,

              height: 6,

              borderRadius: 999,

              backgroundColor:
                "#e2e8f0",

              "& .MuiLinearProgress-bar":
                {
                  backgroundColor:
                    "#10b981",
                },
            }}
          />
        </Stack>
      </TableCell>

      <TableCell>
        <Typography
          sx={{
            fontSize: 12,

            fontWeight: 800,

            color: "#475569",

            whiteSpace: "nowrap",
          }}
        >
          {formatRelativeTime(
            incident.last_seen_at ||
              incident.created_at
          )}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export default IncidentRow;