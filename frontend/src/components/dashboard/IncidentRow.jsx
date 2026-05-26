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
  const status = String(slaStatus || "").toUpperCase();

  if (status === "BREACHED") {
    return {
      label: "SLA Breached",
      bg: "#fee2e2",
      color: "#991b1b",
      border: "#fecaca",
    };
  }

  if (status === "AT_RISK") {
    return {
      label: "SLA At Risk",
      bg: "#ffedd5",
      color: "#9a3412",
      border: "#fed7aa",
    };
  }

  return {
    label: "SLA Within",
    bg: "#ecfdf5",
    color: "#065f46",
    border: "#a7f3d0",
  };
}

function formatAmount(value) {
  const numberValue = Number(value || 0);

  if (numberValue >= 10000000) {
    return `$${(numberValue / 10000000).toFixed(1)}Cr`;
  }

  if (numberValue >= 100000) {
    return `$${(numberValue / 100000).toFixed(1)}L`;
  }

  return `$${numberValue.toLocaleString()}`;
}

function IncidentRow({ incident, onClick }) {
  const confidence = incident?.ai_analysis?.confidence;
  const numericConfidence = Number(confidence || 0);
  const confidenceValue =
    numericConfidence <= 1 ? numericConfidence * 100 : numericConfidence;

  const slaMeta = getSlaStyles(incident?.sla_status);

  return (
    <TableRow
      hover
      onClick={() => onClick(incident)}
      sx={{
        cursor: "pointer",
        "& td": {
          borderBottom: "1px solid #eef2f7",
          py: 1.7,
        },
        "&:hover": {
          backgroundColor: "#f8fafc",
        },
      }}
    >
      <TableCell>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 950, color: "#0f172a" }}>
            #{incident.id} · {safeText(incident.error_code, "Incident alert")}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {safeText(
              incident.ai_analysis?.root_cause || incident.description,
              "Click to inspect incident intelligence"
            )}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>
        <SeverityChip severity={incident.severity} />
      </TableCell>

      <TableCell>
        <StatusChip status={incident.status} />
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          {safeText(incident.vendor)}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {safeText(incident.environment)}
        </Typography>
      </TableCell>

      <TableCell>
        <Stack spacing={0.7}>
          <Chip
            size="small"
            label={slaMeta.label}
            sx={{
              width: "fit-content",
              backgroundColor: slaMeta.bg,
              color: slaMeta.color,
              border: `1px solid ${slaMeta.border}`,
              fontWeight: 800,
            }}
          />

          <Typography variant="caption" color="text.secondary">
            ACK delay: {incident.ack_delay_minutes || 0} mins
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack spacing={0.5}>
          <Typography variant="body2" sx={{ fontWeight: 850 }}>
            {formatAmount(incident.amount_impacted)}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {Number(incident.records_impacted || 0).toLocaleString()} records
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack spacing={0.7}>
          <SourceBadge sourceType={incident.source_type} />
          <DuplicateBadge duplicateCount={incident.duplicate_count} />
        </Stack>
      </TableCell>

      <TableCell>
        <Stack spacing={0.7}>
          <Typography variant="caption" sx={{ fontWeight: 900 }}>
            {getConfidenceLabel(confidence)}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={Number.isNaN(confidenceValue) ? 0 : Math.min(confidenceValue, 100)}
            sx={{
              width: 92,
              height: 7,
              borderRadius: 99,
              backgroundColor: "#e2e8f0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#059669",
              },
            }}
          />
        </Stack>
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          {formatRelativeTime(incident.last_seen_at || incident.created_at)}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export default IncidentRow;