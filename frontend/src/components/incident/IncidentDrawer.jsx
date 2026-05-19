import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import { getIncidentTimeline } from "../../api/incidentApi";
import { formatDateTime, safeText } from "../../utils/formatters";
import AIInsightCard from "./AIInsightCard";
import TimelinePanel from "./TimelinePanel";
import SeverityChip from "./SeverityChip";
import StatusChip from "./StatusChip";
import SourceBadge from "./SourceBadge";
import DuplicateBadge from "./DuplicateBadge";

function DetailItem({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.4, fontWeight: 600 }}>
        {safeText(value)}
      </Typography>
    </Box>
  );
}

function IncidentDrawer({ open, incident, onClose, onResolve }) {
  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [resolveError, setResolveError] = useState("");
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    const fetchTimeline = async () => {
      if (!open || !incident?.id) return;

      try {
        setTimelineLoading(true);
        const data = await getIncidentTimeline(incident.id);
        setTimeline(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load timeline:", err);
        setTimeline([]);
      } finally {
        setTimelineLoading(false);
      }
    };

    fetchTimeline();
  }, [open, incident]);

  const handleResolve = async () => {
    if (!incident?.id) return;

    try {
      setResolving(true);
      setResolveError("");
      await onResolve(incident.id);
      onClose();
    } catch (err) {
      console.error(err);
      setResolveError("Unable to resolve incident.");
    } finally {
      setResolving(false);
    }
  };

  const rawPayload = incident?.raw_payload;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", md: 620 },
          backgroundColor: "#f8fafc",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h5">
              Incident #{incident?.id}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {safeText(incident?.title || incident?.message || incident?.description, "Incident details")}
            </Typography>
          </Box>

          <Button
            startIcon={<CloseOutlinedIcon />}
            onClick={onClose}
            variant="outlined"
            size="small"
          >
            Close
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mt: 2 }}>
          <SeverityChip severity={incident?.severity} />
          <StatusChip status={incident?.status} />
          <SourceBadge sourceType={incident?.source_type} />
          <DuplicateBadge duplicateCount={incident?.duplicate_count} />
        </Stack>

        {resolveError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {resolveError}
          </Alert>
        )}

        {String(incident?.status || "").toUpperCase() !== "RESOLVED" && (
          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={<CheckCircleOutlineOutlinedIcon />}
            onClick={handleResolve}
            disabled={resolving}
            sx={{ mt: 2 }}
          >
            {resolving ? "Resolving..." : "Resolve Incident"}
          </Button>
        )}

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            mb: 3,
          }}
        >
          <DetailItem label="Vendor" value={incident?.vendor} />
          <DetailItem label="Environment" value={incident?.environment} />
          <DetailItem label="Error Code" value={incident?.error_code} />
          <DetailItem label="Source Name" value={incident?.source_name} />
          <DetailItem label="Created At" value={formatDateTime(incident?.created_at)} />
          <DetailItem label="Last Seen" value={formatDateTime(incident?.last_seen_at)} />
        </Box>

        <Stack spacing={2.5}>
          <AIInsightCard aiAnalysis={incident?.ai_analysis} />

          {rawPayload && (
            <Box
              sx={{
                p: 2,
                borderRadius: 4,
                backgroundColor: "#0f172a",
                color: "#e5e7eb",
                overflow: "auto",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1, color: "#ffffff" }}>
                Raw Payload
              </Typography>

              <pre
                style={{
                  margin: 0,
                  fontSize: 12,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {typeof rawPayload === "string"
                  ? rawPayload
                  : JSON.stringify(rawPayload, null, 2)}
              </pre>
            </Box>
          )}

          <TimelinePanel timeline={timeline} loading={timelineLoading} />
        </Stack>
      </Box>
    </Drawer>
  );
}

export default IncidentDrawer;