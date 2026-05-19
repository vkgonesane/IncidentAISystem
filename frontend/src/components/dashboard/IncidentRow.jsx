import {
  Box,
  LinearProgress,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import { formatRelativeTime, getConfidenceLabel, safeText } from "../../utils/formatters";
import SeverityChip from "../incident/SeverityChip";
import StatusChip from "../incident/StatusChip";
import SourceBadge from "../incident/SourceBadge";
import DuplicateBadge from "../incident/DuplicateBadge";

function IncidentRow({ incident, onClick }) {
  const confidence = incident?.ai_analysis?.confidence;
  const numericConfidence = Number(confidence || 0);
  const confidenceValue = numericConfidence <= 1 ? numericConfidence * 100 : numericConfidence;

  return (
    <TableRow
      hover
      onClick={() => onClick(incident)}
      sx={{
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#f8fafc",
        },
      }}
    >
      <TableCell>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 900 }}>
            #{incident.id} · {safeText(incident.title || incident.message, "Incident alert")}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {safeText(incident.description || incident.error_message, "No description")}
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
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {safeText(incident.vendor)}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {safeText(incident.environment)}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {safeText(incident.error_code)}
        </Typography>
      </TableCell>

      <TableCell>
        <SourceBadge sourceType={incident.source_type} />
      </TableCell>

      <TableCell>
        <DuplicateBadge duplicateCount={incident.duplicate_count} />
      </TableCell>

      <TableCell>
        <Stack spacing={0.7}>
          <Typography variant="caption" sx={{ fontWeight: 800 }}>
            {getConfidenceLabel(confidence)}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={Number.isNaN(confidenceValue) ? 0 : Math.min(confidenceValue, 100)}
            sx={{ width: 90, height: 7, borderRadius: 99 }}
          />
        </Stack>
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {formatRelativeTime(incident.last_seen_at || incident.created_at)}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export default IncidentRow;