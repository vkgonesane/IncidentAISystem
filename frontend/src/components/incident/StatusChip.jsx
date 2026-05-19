import { Chip } from "@mui/material";

const statusConfig = {
  OPEN: {
    label: "Open",
    color: "error",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "warning",
  },
  RESOLVED: {
    label: "Resolved",
    color: "success",
  },
};

function StatusChip({ status }) {
  const normalizedStatus = String(status || "").toUpperCase();
  const config = statusConfig[normalizedStatus] || {
    label: status || "Unknown",
    color: "default",
  };

  return (
    <Chip
      size="small"
      label={config.label}
      color={config.color}
      variant={normalizedStatus === "RESOLVED" ? "filled" : "outlined"}
    />
  );
}

export default StatusChip;