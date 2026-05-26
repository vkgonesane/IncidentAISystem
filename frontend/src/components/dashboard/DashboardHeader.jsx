import { Box, Button, Chip, Stack, Typography } from "@mui/material";

import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function getLiveMeta(liveStatus) {
  const status = String(liveStatus || "").toLowerCase();

  if (status === "connected") {
    return {
      label: "Live connected",
      bg: "#ecfdf5",
      color: "#065f46",
      border: "#a7f3d0",
    };
  }

  if (status === "connecting" || status === "reconnecting") {
    return {
      label: "Live reconnecting",
      bg: "#fffbeb",
      color: "#92400e",
      border: "#fde68a",
    };
  }

  if (status === "error") {
    return {
      label: "Live error",
      bg: "#fee2e2",
      color: "#991b1b",
      border: "#fecaca",
    };
  }

  return {
    label: "Live disconnected",
    bg: "#f1f5f9",
    color: "#475569",
    border: "#cbd5e1",
  };
}

function DashboardHeader({
  onSimulateAlert,
  simulatingAlert = false,
  liveStatus = "disconnected",
  liveEvent = null,
}) {
  const liveMeta = getLiveMeta(liveStatus);

  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 4,
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <Stack
        spacing={2.5}
        sx={{
          flexDirection: {
            xs: "column",
            md: "row",
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
        }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: "wrap",
              gap: 1,
              mb: 1.5,
            }}
          >
            <Chip
              icon={<HubOutlinedIcon />}
              label="Vendor intelligence layer"
              size="small"
              sx={{
                backgroundColor: "#ecfdf5",
                color: "#065f46",
                fontWeight: 800,
                border: "1px solid #a7f3d0",
              }}
            />

            <Chip
              icon={<SensorsOutlinedIcon />}
              label="Monitoring-ready workflow"
              size="small"
              sx={{
                backgroundColor: "#f1f5f9",
                color: "#334155",
                fontWeight: 800,
                border: "1px solid #cbd5e1",
              }}
            />

            <Chip
              icon={
                <FiberManualRecordIcon
                  sx={{
                    fontSize: 12,
                    color: liveMeta.color,
                  }}
                />
              }
              label={liveMeta.label}
              size="small"
              sx={{
                backgroundColor: liveMeta.bg,
                color: liveMeta.color,
                fontWeight: 900,
                border: `1px solid ${liveMeta.border}`,
              }}
            />
          </Stack>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 950,
              color: "#0f172a",
              letterSpacing: "-0.04em",
            }}
          >
            VendorIQ Command Center
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mt: 1,
              maxWidth: 760,
              lineHeight: 1.7,
            }}
          >
            Monitor vendor/payment incidents, detect SLA risk, correlate related
            failures, and review AI-generated operational recommendations from
            one investigation workspace.
          </Typography>

          {liveEvent && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 1,
                fontWeight: 700,
              }}
            >
              Last realtime event: {liveEvent.type}
              {liveEvent.incident_id
                ? ` · Incident #${liveEvent.incident_id}`
                : ""}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1.2}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SensorsOutlinedIcon />}
            onClick={onSimulateAlert}
            disabled={simulatingAlert}
            sx={{
              borderRadius: 2,
              fontWeight: 900,
              backgroundColor: "#059669",
              boxShadow: "0 8px 18px rgba(5, 150, 105, 0.22)",
              "&:hover": {
                backgroundColor: "#047857",
              },
            }}
          >
            {simulatingAlert ? "Simulating..." : "Simulate Vendor Alert"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default DashboardHeader;