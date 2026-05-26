import { Box, Card, CardContent, Skeleton, Stack, Typography } from "@mui/material";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";

const kpiIconStyles = {
  width: 44,
  height: 44,
  borderRadius: 3,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
};

function formatAmount(value) {
  const numericValue = Number(value || 0);

  if (numericValue >= 10000000) {
    return `$${(numericValue / 10000000).toFixed(1)}Cr`;
  }

  if (numericValue >= 100000) {
    return `$${(numericValue / 100000).toFixed(1)}L`;
  }

  return `$${numericValue.toLocaleString()}`;
}

function KPICard({ title, value, subtitle, icon, accentColor, loading }) {
  return (
    <Card
      sx={{
        position: "relative",
        border: "0.5px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor: accentColor,
        }}
      />

      <CardContent>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>

            {loading ? (
              <Skeleton variant="text" width={90} height={44} sx={{ mt: 1 }} />
            ) : (
              <Typography variant="h4" sx={{ mt: 1, color: "#0f172a" }}>
                {value}
              </Typography>
            )}

            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>

          <Box sx={{ ...kpiIconStyles, backgroundColor: accentColor }}>
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function KPICards({ incidents = [], summary = null, loading = false }) {
  const fallbackTotal = incidents.length;

  const fallbackOpen = incidents.filter(
    (incident) => String(incident.status || "").toUpperCase() !== "RESOLVED"
  ).length;

  const fallbackCritical = incidents.filter(
    (incident) => String(incident.severity || "").toUpperCase() === "CRITICAL"
  ).length;

  const fallbackSlaBreached = incidents.filter(
    (incident) => String(incident.sla_status || "").toUpperCase() === "BREACHED"
  ).length;

  const fallbackAnomalies = incidents.filter(
    (incident) => Boolean(incident.is_anomaly)
  ).length;

  const totalIncidents = summary?.total_incidents ?? fallbackTotal;
  const openIncidents = summary?.open_incidents ?? fallbackOpen;
  const criticalIncidents = summary?.critical_incidents ?? fallbackCritical;
  const slaBreached = summary?.sla_breached ?? fallbackSlaBreached;
  const anomaliesDetected = summary?.anomalies_detected ?? fallbackAnomalies;
  const totalAmountImpacted = summary?.total_amount_impacted ?? 0;
  const averageAckDelay = summary?.average_ack_delay ?? 0;

  const cards = [
    {
      title: "Total Incidents",
      value: totalIncidents,
      subtitle: "All ingested incidents",
      icon: <SensorsOutlinedIcon />,
      accentColor: "#059669",
    },
    {
      title: "Open Incidents",
      value: openIncidents,
      subtitle: "Currently active issues",
      icon: <ReportProblemOutlinedIcon />,
      accentColor: "#dc2626",
    },
    {
      title: "Critical Incidents",
      value: criticalIncidents,
      subtitle: "Highest priority issues",
      icon: <LocalFireDepartmentOutlinedIcon />,
      accentColor: "#991b1b",
    },
    {
      title: "SLA Breached",
      value: slaBreached,
      subtitle: "ACK delay crossed SLA",
      icon: <ScheduleOutlinedIcon />,
      accentColor: "#d97706",
    },
    {
      title: "Anomalies",
      value: anomaliesDetected,
      subtitle: "Unusual delay patterns",
      icon: <AutoAwesomeOutlinedIcon />,
      accentColor: "#0891b2",
    },
    {
      title: "Amount Impacted",
      value: formatAmount(totalAmountImpacted),
      subtitle: `Avg ACK delay: ${averageAckDelay} mins`,
      icon: <PaymentsOutlinedIcon />,
      accentColor: "#059669",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          lg: "repeat(3, 1fr)",
        },
        gap: 2,
        mb: 3,
      }}
    >
      {cards.map((card) => (
        <KPICard key={card.title} {...card} loading={loading} />
      ))}
    </Box>
  );
}

export default KPICards;