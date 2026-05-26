import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import CrisisAlertOutlinedIcon from "@mui/icons-material/CrisisAlertOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";

function getRiskMeta(score) {
  if (score >= 80) {
    return {
      color: "#dc2626",
      bg: "#fee2e2",
      border: "#fecaca",
      label: "Critical correlation",
    };
  }

  if (score >= 60) {
    return {
      color: "#ea580c",
      bg: "#ffedd5",
      border: "#fdba74",
      label: "High operational correlation",
    };
  }

  return {
    color: "#059669",
    bg: "#ecfdf5",
    border: "#6ee7b7",
    label: "Moderate operational activity",
  };
}

function InsightMetric({ label, value }) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2.5,
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 800 }}
      >
        {label}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          mt: 0.5,
          fontWeight: 950,
          color: "#0f172a",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function RelatedIncidentCard({ incident }) {
  return (
    <Box
      sx={{
        p: 1.1,
        borderRadius: 2,
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        minHeight: 92,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 900,
            color: "#0f172a",
          }}
        >
          #{incident.id}
        </Typography>

        <Chip
          size="small"
          label={incident.severity}
          sx={{
            height: 20,
            fontSize: 11,
            fontWeight: 900,
            backgroundColor:
              incident.severity === "CRITICAL"
                ? "#fee2e2"
                : incident.severity === "HIGH"
                ? "#ffedd5"
                : "#ecfdf5",
            color:
              incident.severity === "CRITICAL"
                ? "#991b1b"
                : incident.severity === "HIGH"
                ? "#9a3412"
                : "#065f46",
          }}
        />
      </Stack>

      <Typography
        variant="body2"
        sx={{
          mt: 0.7,
          fontWeight: 800,
          fontSize: 13,
          lineHeight: 1.2,
        }}
      >
        {incident.vendor} • {incident.environment}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          mt: 0.5,
          fontSize: 11,
        }}
      >
        {incident.error_code}
      </Typography>

      <Chip
        size="small"
        label={incident.sla_status}
        sx={{
          mt: 0.8,
          height: 20,
          fontSize: 10,
          fontWeight: 900,
          backgroundColor:
            incident.sla_status === "BREACHED"
              ? "#fee2e2"
              : incident.sla_status === "AT_RISK"
              ? "#ffedd5"
              : "#ecfdf5",
          color:
            incident.sla_status === "BREACHED"
              ? "#991b1b"
              : incident.sla_status === "AT_RISK"
              ? "#9a3412"
              : "#065f46",
        }}
      />
    </Box>
  );
}

function AIOpsInsightCard({
  correlation,
  majorSummary,
  loading,
  error,
}) {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">
            AIOps Intelligence
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Loading operational intelligence...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <Alert severity="warning">{error}</Alert>;
  }

  if (!correlation && !majorSummary) {
    return null;
  }

  const score = Number(
    correlation?.correlation_score || 0
  );

  const riskMeta = getRiskMeta(score);

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${riskMeta.border}`,
        background: `linear-gradient(135deg, ${riskMeta.bg}, #ffffff)`,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
      }}
    >
      <CardContent sx={{ p: 2.4 }}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              backgroundColor: riskMeta.bg,
              color: riskMeta.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${riskMeta.border}`,
            }}
          >
            <HubOutlinedIcon />
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900 }}
            >
              AIOps Intelligence
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Correlation analysis, blast radius,
              operational risk, and major incident
              intelligence
            </Typography>
          </Box>
        </Stack>

        {/* ── CORRELATION SCORE BOX ── only this section changed ── */}
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: "#ffffff",
            border: `1px solid ${riskMeta.border}`,
          }}
        >
          {/* Label + chip grouped together on one line */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 0.6 }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 800, letterSpacing: "0.05em" }}
            >
              CORRELATION SCORE
            </Typography>

            <Chip
              size="small"
              label={riskMeta.label}
              sx={{
                height: 20,
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 999,
                backgroundColor: riskMeta.bg,
                color: riskMeta.color,
                border: `1px solid ${riskMeta.border}`,
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
          </Stack>

          {/* Score value sitting directly under the label+chip row */}
          <Typography
            sx={{
              fontSize: "2.8rem",
              fontWeight: 950,
              color: riskMeta.color,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {score}%
          </Typography>

          <LinearProgress
            variant="determinate"
            value={Math.min(score, 100)}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: 99,
              backgroundColor: "#e2e8f0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: riskMeta.color,
              },
            }}
          />
        </Box>
        {/* ── END CORRELATION SCORE BOX ── */}

        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1.2,
          }}
        >
          <InsightMetric
            label="Related Incidents"
            value={correlation?.related_count || 0}
          />

          <InsightMetric
            label="Risk Level"
            value={majorSummary?.risk_level || "N/A"}
          />

          <InsightMetric
            label="Major Incident"
            value={
              correlation?.potential_major_incident
                ? "YES"
                : "NO"
            }
          />
        </Box>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          sx={{
            gap: 1,
            mt: 2,
          }}
        >
          {correlation?.potential_major_incident && (
            <Chip
              icon={<CrisisAlertOutlinedIcon />}
              label="Potential Major Incident"
              sx={{
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                fontWeight: 900,
                border: "1px solid #fecaca",
              }}
            />
          )}

          <Chip
            icon={<AccountTreeOutlinedIcon />}
            label={`${correlation?.related_count || 0} correlated operational events`}
            sx={{
              backgroundColor: "#eff6ff",
              color: "#1d4ed8",
              fontWeight: 900,
              border: "1px solid #bfdbfe",
            }}
          />

          <Chip
            icon={<BoltOutlinedIcon />}
            label={
              correlation?.reasons?.length > 0
                ? `${correlation.reasons.length} risk signals detected`
                : "No active correlation signals"
            }
            sx={{
              backgroundColor: "#fffbeb",
              color: "#92400e",
              fontWeight: 900,
              border: "1px solid #fde68a",
            }}
          />
        </Stack>

        {correlation?.reasons?.length > 0 && (
          <Box sx={{ mt: 2.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 900 }}
            >
              WHY THIS INCIDENT WAS CORRELATED
            </Typography>

            <Stack
              spacing={1}
              sx={{ mt: 1.2 }}
            >
              {correlation.reasons.map((reason) => (
                <Box
                  key={reason}
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700 }}
                  >
                    {reason}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {correlation?.related_incidents?.length > 0 && (
          <Box sx={{ mt: 2.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 900 }}
            >
              RELATED OPERATIONAL INCIDENTS
            </Typography>

            <Box
              sx={{
                mt: 1.2,
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 1.2,
              }}
            >
              {correlation.related_incidents
                .slice(0, 6)
                .map((relatedIncident) => (
                  <RelatedIncidentCard
                    key={relatedIncident.id}
                    incident={relatedIncident}
                  />
                ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2.5 }} />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 900 }}
        >
          MAJOR INCIDENT SUMMARY
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 1,
            lineHeight: 1.8,
            fontWeight: 600,
          }}
        >
          {majorSummary?.summary ||
            "No major incident summary available."}
        </Typography>

        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 3,
            backgroundColor: "#ecfdf5",
            border: "1px solid #6ee7b7",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#065f46",
              fontWeight: 900,
            }}
          >
            RECOMMENDED OPERATIONAL ACTION
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.8,
              color: "#065f46",
              lineHeight: 1.8,
              fontWeight: 600,
            }}
          >
            {majorSummary?.recommended_action ||
              "Continue monitoring operational workflows."}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AIOpsInsightCard;