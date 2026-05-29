import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CrisisAlertOutlinedIcon from "@mui/icons-material/CrisisAlertOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";

const guideItems = [
  {
    title: "ACK Delay",
    icon: <AccessTimeOutlinedIcon />,
    color: "#059669",
    bg: "#ecfdf5",
    tag: "Vendor Response Signal",
    meaning:
      "ACK means acknowledgement. It confirms that a vendor received or processed a payment or ACH file.",
    impact:
      "If the ACK is delayed, payment operations may not know whether the vendor received the file successfully. This can create SLA risk, reconciliation delays, or downstream payment uncertainty.",
    example:
      "If ACK delay is 90 minutes and SLA is 30 minutes, VendorIQ marks the incident as breached and raises operational priority.",
  },
  {
    title: "SLA Breach",
    icon: <CrisisAlertOutlinedIcon />,
    color: "#dc2626",
    bg: "#fee2e2",
    tag: "Operational Risk",
    meaning:
      "SLA means Service Level Agreement. It defines the expected time window for a vendor or system to respond.",
    impact:
      "When an incident crosses the SLA threshold, it becomes more urgent because business operations may be delayed.",
    example:
      "If a vendor must return an ACK within 30 minutes but responds after 60 minutes, the incident becomes SLA BREACHED.",
  },
  {
    title: "Correlation Score",
    icon: <AccountTreeOutlinedIcon />,
    color: "#2563eb",
    bg: "#eff6ff",
    tag: "AIOps Intelligence",
    meaning:
      "Correlation score estimates how strongly one incident is connected to other incidents around the same time.",
    impact:
      "A high correlation score may indicate a larger vendor outage, repeated failure pattern, or shared operational root cause.",
    example:
      "Multiple ACK_TIMEOUT incidents from the same vendor within 15 minutes produce a higher correlation score.",
  },
  {
    title: "ACH Processing",
    icon: <PaymentsOutlinedIcon />,
    color: "#0891b2",
    bg: "#ecfeff",
    tag: "Payment Workflow",
    meaning:
      "ACH is an electronic payment transfer workflow. Companies often send payment files to vendors or banks for processing.",
    impact:
      "If ACH file transmission, validation, or acknowledgement fails, payments may be delayed, duplicated, or require manual reconciliation.",
    example:
      "VendorIQ simulates ACH file issues like ACK_TIMEOUT, FILE_MISMATCH, SLA_BREACH, and PAYMENT_DELAY.",
  },
  {
    title: "Risk Score",
    icon: <WarningAmberOutlinedIcon />,
    color: "#d97706",
    bg: "#fffbeb",
    tag: "Priority Engine",
    meaning:
      "Risk score represents how operationally important an incident is based on severity, environment, amount impacted, records impacted, and SLA status.",
    impact:
      "Higher risk incidents should be investigated first because they may impact production systems, payments, vendors, or customers.",
    example:
      "A CRITICAL PROD incident with high amount impacted and SLA breach receives higher priority than a LOW TEST incident.",
  },
  {
    title: "Anomaly Detection",
    icon: <QueryStatsOutlinedIcon />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    tag: "Pattern Detection",
    meaning:
      "An anomaly is behavior that looks unusual compared to expected operational patterns.",
    impact:
      "Anomalies help teams detect abnormal vendor delays, sudden incident spikes, or unexpected payment-processing behavior.",
    example:
      "If ACK delay is much higher than normal vendor behavior, VendorIQ can flag it as anomalous.",
  },
];

function IntelligenceCard({ item }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 5,
        border: "1px solid #e2e8f0",
        boxShadow:
          "0 1px 3px rgba(15,23,42,0.08)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 3,
              backgroundColor: item.bg,
              color: item.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${item.color}22`,
            }}
          >
            {item.icon}
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
              }}
            >
              {item.title}
            </Typography>

            <Chip
              label={item.tag}
              size="small"
              sx={{
                mt: 0.5,
                fontSize: 11,
                fontWeight: 800,
                backgroundColor: item.bg,
                color: item.color,
              }}
            />
          </Box>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Typography
          variant="caption"
          sx={{
            fontWeight: 900,
            color: "#475569",
          }}
        >
          WHAT IT MEANS
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 1,
            mb: 2,
            lineHeight: 1.8,
            color: "#334155",
          }}
        >
          {item.meaning}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            fontWeight: 900,
            color: "#475569",
          }}
        >
          WHY IT MATTERS
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 1,
            mb: 2,
            lineHeight: 1.8,
            color: "#334155",
          }}
        >
          {item.impact}
        </Typography>

        <Box
          sx={{
            p: 2,
            borderRadius: 4,
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 900,
              color: item.color,
            }}
          >
            VENDORIQ EXAMPLE
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              lineHeight: 1.7,
              fontWeight: 600,
            }}
          >
            {item.example}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function IntelligenceGuide() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          ml: { md: "280px" },
          p: { xs: 2, md: 4 },
        }}
      >
        <Stack spacing={4}>
          <Box>
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() =>
                navigate("/dashboard")
              }
              sx={{
                mb: 2,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
                color: "#475569",
              }}
            >
              Back to Dashboard
            </Button>

            <Box
              sx={{
                p: 4,
                borderRadius: 6,
                background:
                  "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                border:
                  "1px solid #e2e8f0",
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 4,
                    background:
                      "linear-gradient(135deg, #10b981, #059669)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HubOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 950,
                      color: "#0f172a",
                      letterSpacing:
                        "-0.04em",
                    }}
                  >
                    Intelligence Guide
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      color: "#64748b",
                    }}
                  >
                    VendorIQ operational
                    intelligence concepts
                    and AI terminology.
                  </Typography>
                </Box>
              </Stack>

              <Typography
                sx={{
                  maxWidth: 950,
                  lineHeight: 1.9,
                  color: "#475569",
                }}
              >
                This guide explains how
                VendorIQ interprets
                vendor incidents,
                payment-processing
                failures, SLA breaches,
                anomaly patterns,
                correlation signals,
                and AI-assisted
                operational risk scoring.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
                xl: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {guideItems.map((item) => (
              <IntelligenceCard
                key={item.title}
                item={item}
              />
            ))}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default IntelligenceGuide;