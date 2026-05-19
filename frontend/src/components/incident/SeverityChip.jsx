import { Chip } from "@mui/material";

const severityConfig = {
  CRITICAL: {
    label: "Critical",
    color: "error",
  },
  HIGH: {
    label: "High",
    color: "warning",
  },
  MEDIUM: {
    label: "Medium",
    color: "info",
  },
  LOW: {
    label: "Low",
    color: "success",
  },
};

function SeverityChip({ severity }) {
  const normalizedSeverity = String(severity || "").toUpperCase();
  const config = severityConfig[normalizedSeverity] || {
    label: severity || "Unknown",
    color: "default",
  };

  return (
    <Chip
      size="small"
      label={config.label}
      color={config.color}
      variant="filled"
    />
  );
}

export default SeverityChip;