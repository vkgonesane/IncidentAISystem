import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
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

function KPICard({ title, value, subtitle, icon, gradient }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>

            <Typography variant="h4" sx={{ mt: 1 }}>
              {value}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>

          <Box sx={{ ...kpiIconStyles, background: gradient }}>
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function KPICards({ incidents = [] }) {
  const totalIncidents = incidents.length;

  const activeIncidents = incidents.filter(
    (incident) => String(incident.status || "").toUpperCase() !== "RESOLVED"
  ).length;

  const criticalIncidents = incidents.filter(
    (incident) => String(incident.severity || "").toUpperCase() === "CRITICAL"
  ).length;

  const autoDetected = incidents.filter(
    (incident) => String(incident.source_type || "").toUpperCase() === "AUTO"
  ).length;

  const duplicateAlertsPrevented = incidents.reduce((sum, incident) => {
    return sum + Number(incident.duplicate_count || 0);
  }, 0);

  const resolvedIncidents = incidents.filter(
    (incident) => String(incident.status || "").toUpperCase() === "RESOLVED"
  ).length;

  const cards = [
    {
      title: "Total Incidents",
      value: totalIncidents,
      subtitle: "All alerts in current view",
      icon: <SensorsOutlinedIcon />,
      gradient: "linear-gradient(135deg, #2563eb, #0284c7)",
    },
    {
      title: "Active Incidents",
      value: activeIncidents,
      subtitle: "Open or in progress",
      icon: <ReportProblemOutlinedIcon />,
      gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    },
    {
      title: "Critical Incidents",
      value: criticalIncidents,
      subtitle: "Highest priority issues",
      icon: <LocalFireDepartmentOutlinedIcon />,
      gradient: "linear-gradient(135deg, #dc2626, #991b1b)",
    },
    {
      title: "Auto Detected",
      value: autoDetected,
      subtitle: "Detected from log scanner",
      icon: <AutoAwesomeOutlinedIcon />,
      gradient: "linear-gradient(135deg, #7c3aed, #2563eb)",
    },
    {
      title: "Duplicates Prevented",
      value: duplicateAlertsPrevented,
      subtitle: "Grouped duplicate alerts",
      icon: <ContentCopyOutlinedIcon />,
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
    {
      title: "Resolved Incidents",
      value: resolvedIncidents,
      subtitle: "Closed incidents",
      icon: <CheckCircleOutlineOutlinedIcon />,
      gradient: "linear-gradient(135deg, #16a34a, #15803d)",
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
        <KPICard key={card.title} {...card} />
      ))}
    </Box>
  );
}

export default KPICards;