import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function getLiveMeta(liveStatus) {
  const status = String(
    liveStatus || ""
  ).toLowerCase();

  if (status === "connected") {
    return {
      label: "Realtime Connected",
      bg: "rgba(16,185,129,0.10)",
      color: "#047857",
      border: "rgba(16,185,129,0.18)",
    };
  }

  if (
    status === "connecting" ||
    status === "reconnecting"
  ) {
    return {
      label: "Realtime Reconnecting",
      bg: "rgba(245,158,11,0.10)",
      color: "#b45309",
      border: "rgba(245,158,11,0.18)",
    };
  }

  if (status === "error") {
    return {
      label: "Realtime Error",
      bg: "rgba(239,68,68,0.10)",
      color: "#b91c1c",
      border: "rgba(239,68,68,0.18)",
    };
  }

  return {
    label: "Realtime Disconnected",
    bg: "#f8fafc",
    color: "#64748b",
    border: "#e2e8f0",
  };
}

function DashboardHeader({
  onSimulateAlert,
  simulatingAlert = false,
  liveStatus = "disconnected",
  liveEvent = null,
}) {
  const liveMeta =
    getLiveMeta(liveStatus);

  return (
    <Box
      sx={{
        mb: 3.5,
        p: { xs: 3, md: 4 },
        borderRadius: 6,

        background:
          "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",

        border: "1px solid #e2e8f0",

        boxShadow:
          "0 4px 20px rgba(15,23,42,0.04)",
      }}
    >
      <Stack
        spacing={3}
        sx={{
          flexDirection: {
            xs: "column",
            lg: "row",
          },

          justifyContent:
            "space-between",

          alignItems: {
            xs: "flex-start",
            lg: "center",
          },
        }}
      >
        <Box sx={{ maxWidth: 840 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: "wrap",
              gap: 1,
              mb: 2,
            }}
          >
            <Chip
              icon={<HubOutlinedIcon />}
              label="Vendor Intelligence"
              size="small"
              sx={{
                backgroundColor:
                  "#ecfdf5",

                color: "#047857",

                fontWeight: 800,

                border:
                  "1px solid rgba(16,185,129,0.16)",
              }}
            />

            <Chip
              icon={
                <FiberManualRecordIcon
                  sx={{
                    fontSize: 11,
                    color:
                      liveMeta.color,
                  }}
                />
              }
              label={liveMeta.label}
              size="small"
              sx={{
                backgroundColor:
                  liveMeta.bg,

                color:
                  liveMeta.color,

                fontWeight: 800,

                border: `1px solid ${liveMeta.border}`,
              }}
            />
          </Stack>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 950,
              color: "#0f172a",

              letterSpacing:
                "-0.05em",

              lineHeight: 1.05,
            }}
          >
            VendorIQ Command Center
          </Typography>

          <Typography
            sx={{
              mt: 1.8,

              color: "#64748b",

              fontSize: 15,

              lineHeight: 1.9,

              maxWidth: 760,
            }}
          >
            Monitor vendor and
            payment-processing
            incidents, identify SLA
            risk, correlate operational
            failures, and review
            AI-assisted investigation
            insights from a unified
            operational workspace.
          </Typography>

          {liveEvent && (
            <Typography
              sx={{
                mt: 2,

                color: "#94a3b8",

                fontSize: 12,

                fontWeight: 700,

                letterSpacing:
                  "0.02em",
              }}
            >
              LAST EVENT ·{" "}
              {liveEvent.type}
              {liveEvent.incident_id
                ? ` · INCIDENT #${liveEvent.incident_id}`
                : ""}
            </Typography>
          )}
        </Box>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            width: {
              xs: "100%",
              lg: "auto",
            },
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={
              <SensorsOutlinedIcon />
            }
            onClick={onSimulateAlert}
            disabled={simulatingAlert}
            sx={{
              minWidth: 220,

              borderRadius: 3,

              px: 3,

              py: 1.4,

              textTransform: "none",

              fontWeight: 900,

              background:
                "linear-gradient(135deg, #10b981, #059669)",

              boxShadow:
                "0 10px 24px rgba(16,185,129,0.18)",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #059669, #047857)",
              },
            }}
          >
            {simulatingAlert
              ? "Generating Alert..."
              : "Generate Incident"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default DashboardHeader;