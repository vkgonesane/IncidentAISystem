import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

import { formatDateTime, safeText } from "../../utils/formatters";

function getEventMeta(updateType = "") {
  const normalizedType = String(updateType || "").toUpperCase();

  if (normalizedType.includes("CREATED")) {
    return {
      label: "Created",
      icon: <AddCircleOutlineOutlinedIcon fontSize="small" />,
      bg: "#ecfdf5",
      color: "#065f46",
      border: "#6ee7b7",
    };
  }

  if (normalizedType.includes("AI")) {
    return {
      label: "AI Analysis",
      icon: <AutoAwesomeOutlinedIcon fontSize="small" />,
      bg: "#e0f2fe",
      color: "#075985",
      border: "#7dd3fc",
    };
  }

  if (normalizedType.includes("EMAIL_SENT")) {
    return {
      label: "Email Sent",
      icon: <EmailOutlinedIcon fontSize="small" />,
      bg: "#ecfdf5",
      color: "#065f46",
      border: "#6ee7b7",
    };
  }

  if (normalizedType.includes("EMAIL_FAILED")) {
    return {
      label: "Email Failed",
      icon: <ErrorOutlineOutlinedIcon fontSize="small" />,
      bg: "#fee2e2",
      color: "#991b1b",
      border: "#fecaca",
    };
  }

  if (normalizedType.includes("DUPLICATE")) {
    return {
      label: "Duplicate",
      icon: <ContentCopyOutlinedIcon fontSize="small" />,
      bg: "#fff7ed",
      color: "#9a3412",
      border: "#fed7aa",
    };
  }

  if (normalizedType.includes("STATUS")) {
    return {
      label: "Status Change",
      icon: <CheckCircleOutlineOutlinedIcon fontSize="small" />,
      bg: "#f1f5f9",
      color: "#334155",
      border: "#cbd5e1",
    };
  }

  return {
    label: safeText(updateType, "Timeline Event"),
    icon: <TimelineOutlinedIcon fontSize="small" />,
    bg: "#f8fafc",
    color: "#334155",
    border: "#e2e8f0",
  };
}

function TimelineEvent({ event, isLast }) {
  const updateType = event.update_type || event.event_type || event.action || event.status;
  const meta = getEventMeta(updateType);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "34px 1fr",
        columnGap: 1.5,
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "999px",
            backgroundColor: meta.bg,
            color: meta.color,
            border: `1px solid ${meta.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          {meta.icon}
        </Box>

        {!isLast && (
          <Box
            sx={{
              position: "absolute",
              top: 30,
              bottom: -18,
              width: "1px",
              backgroundColor: "#e2e8f0",
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          pb: isLast ? 0 : 2.2,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Chip
            size="small"
            label={meta.label}
            sx={{
              backgroundColor: meta.bg,
              color: meta.color,
              border: `1px solid ${meta.border}`,
              fontWeight: 800,
              height: 24,
            }}
          />

          <Typography variant="caption" color="text.secondary">
            {formatDateTime(event.created_at || event.timestamp || event.updated_at)}
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          sx={{
            mt: 0.8,
            lineHeight: 1.6,
            color: "#334155",
          }}
        >
          {safeText(event.message || event.notes || event.description, "No details")}
        </Typography>

        {event.created_by && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.6, display: "block" }}>
            By {event.created_by}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function TimelinePanel({ timeline = [], loading = false }) {
  return (
    <Card
      sx={{
        border: "1px solid #e2e8f0",
        borderRadius: 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        backgroundColor: "#ffffff",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              backgroundColor: "#f1f5f9",
              color: "#334155",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TimelineOutlinedIcon fontSize="small" />
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              Incident Event Stream
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Timeline of creation, AI analysis, duplicate detection, and notifications
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={26} />
          </Box>
        )}

        {!loading && timeline.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No timeline events found.
          </Typography>
        )}

        {!loading && timeline.length > 0 && (
          <Stack spacing={0}>
            {timeline.map((event, index) => (
              <TimelineEvent
                key={event.id || index}
                event={event}
                isLast={index === timeline.length - 1}
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default TimelinePanel;