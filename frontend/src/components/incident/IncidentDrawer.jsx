import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  Drawer,
  Stack,
  Typography,
  Button,
} from "@mui/material";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

import {
  getIncidentCorrelation,
  getIncidentTimeline,
  getMajorIncidentSummary,
} from "../../api/incidentApi";

import { formatDateTime, safeText } from "../../utils/formatters";

import AIInsightCard from "./AIInsightCard";
import AIOpsInsightCard from "./AIOpsInsightCard";
import TimelinePanel from "./TimelinePanel";
import SeverityChip from "./SeverityChip";
import StatusChip from "./StatusChip";
import SourceBadge from "./SourceBadge";
import DuplicateBadge from "./DuplicateBadge";

function DetailItem({ label, value }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 800 }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mt: 0.35,
          fontWeight: 700,
        }}
      >
        {safeText(value)}
      </Typography>
    </Box>
  );
}

function DetailCard({ title, children }) {
  return (
    <Card
      sx={{
        border: "1px solid #e2e8f0",
        borderRadius: 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 900,
            mb: 1.5,
          }}
        >
          {title}
        </Typography>

        {children}
      </CardContent>
    </Card>
  );
}

function HeaderMetric({ label, value }) {
  return (
    <Box
      sx={{
        px: 1.3,
        py: 0.8,
        borderRadius: 2,
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        minWidth: 112,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 800 }}
      >
        {label}
      </Typography>

      <Typography variant="body2" sx={{ fontWeight: 900, mt: 0.2 }}>
        {safeText(value)}
      </Typography>
    </Box>
  );
}

function IncidentDrawer({ open, incident, onClose, onResolve }) {
  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  const [correlation, setCorrelation] = useState(null);
  const [majorSummary, setMajorSummary] = useState(null);

  const [aiopsLoading, setAiopsLoading] = useState(false);
  const [aiopsError, setAiopsError] = useState("");

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

    const fetchAIOpsInsights = async () => {
      if (!open || !incident?.id) return;

      try {
        setAiopsLoading(true);
        setAiopsError("");

        const [correlationData, summaryData] = await Promise.all([
          getIncidentCorrelation(incident.id),
          getMajorIncidentSummary(incident.id),
        ]);

        setCorrelation(correlationData);
        setMajorSummary(summaryData);
      } catch (err) {
        console.error("Failed to load AIOps intelligence:", err);

        setCorrelation(null);
        setMajorSummary(null);

        setAiopsError("Unable to load AIOps intelligence.");
      } finally {
        setAiopsLoading(false);
      }
    };

    fetchTimeline();
    fetchAIOpsInsights();
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
      ModalProps={{
        BackdropProps: {
          sx: {
            backgroundColor: "rgba(15, 23, 42, 0.28)",
            backdropFilter: "blur(2px)",
          },
        },
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: "50vw !important",
          maxWidth: "760px !important",
          minWidth: "620px !important",
          backgroundColor: "#f8fafc",
          borderLeft: "1px solid #e2e8f0",
          boxShadow: "-12px 0 32px rgba(15, 23, 42, 0.16)",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          overflowY: "auto",
          p: 2.5,
        }}
      >
        <Card
          sx={{
            borderRadius: 4,
            border: "1px solid #dbeafe",
            background:
              "linear-gradient(135deg, rgba(240,253,250,0.95), rgba(239,246,255,0.95))",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
          }}
        >
          <CardContent sx={{ p: 2.2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2.5,
                      backgroundColor: "#ecfdf5",
                      color: "#059669",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #a7f3d0",
                    }}
                  >
                    <AccountTreeOutlinedIcon fontSize="small" />
                  </Box>

                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 950,
                        lineHeight: 1.1,
                      }}
                    >
                      Incident #{incident?.id}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.25 }}
                    >
                      {safeText(
                        `${incident?.error_code || "Unknown error"} • ${
                          incident?.vendor || "Unknown vendor"
                        } • ${incident?.environment || "Unknown env"}`,
                        "AIOps investigation details"
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                onClick={onClose}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.18s ease",

                  "&:hover": {
                    backgroundColor: "#f8fafc",
                    borderColor: "#cbd5e1",
                    transform: "scale(1.03)",
                  },
                }}
              >
                <CloseIcon
                  sx={{
                    fontSize: 18,
                    color: "#475569",
                  }}
                />
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{
                gap: 1,
                mt: 2,
              }}
            >
              <SeverityChip severity={incident?.severity} />
              <StatusChip status={incident?.status} />
              <SourceBadge sourceType={incident?.source_type} />
              <DuplicateBadge duplicateCount={incident?.duplicate_count} />
            </Stack>

            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
              }}
            >
              <HeaderMetric label="SLA Status" value={incident?.sla_status} />
              <HeaderMetric
                label="ACK Delay"
                value={`${incident?.ack_delay_minutes || 0} mins`}
              />
              <HeaderMetric label="Source" value={incident?.source_name} />
            </Box>

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
                sx={{
                  mt: 2,
                  borderRadius: 2.5,
                  py: 1.1,
                  fontWeight: 900,
                  boxShadow: "0 8px 18px rgba(22, 163, 74, 0.24)",
                }}
              >
                {resolving ? "Resolving..." : "Resolve Incident"}
              </Button>
            )}
          </CardContent>
        </Card>

        <Divider sx={{ my: 2.5 }} />

        <Stack spacing={2}>
          <DetailCard title="Operational Context">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.8,
              }}
            >
              <DetailItem label="Vendor" value={incident?.vendor} />
              <DetailItem
                label="Environment"
                value={incident?.environment}
              />
              <DetailItem
                label="Error Code"
                value={incident?.error_code}
              />
              <DetailItem
                label="Source"
                value={incident?.source_name}
              />
              <DetailItem
                label="SLA Status"
                value={incident?.sla_status}
              />
              <DetailItem
                label="ACK Delay"
                value={`${incident?.ack_delay_minutes || 0} mins`}
              />
            </Box>
          </DetailCard>

          <DetailCard title="Business Impact">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.8,
              }}
            >
              <DetailItem
                label="Records Impacted"
                value={incident?.records_impacted}
              />

              <DetailItem
                label="Amount Impacted"
                value={incident?.amount_impacted}
              />

              <DetailItem
                label="Created At"
                value={formatDateTime(incident?.created_at)}
              />

              <DetailItem
                label="Last Seen"
                value={formatDateTime(incident?.last_seen_at)}
              />
            </Box>
          </DetailCard>

          <AIOpsInsightCard
            correlation={correlation}
            majorSummary={majorSummary}
            loading={aiopsLoading}
            error={aiopsError}
          />

          <AIInsightCard aiAnalysis={incident?.ai_analysis} />

          {rawPayload && (
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: "#0f172a",
                color: "#e5e7eb",
                overflow: "auto",
                maxHeight: 180,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  color: "#ffffff",
                }}
              >
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

          <TimelinePanel
            timeline={timeline}
            loading={timelineLoading}
          />
        </Stack>
      </Box>
    </Drawer>
  );
}

export default IncidentDrawer;