import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import RadarRoundedIcon from "@mui/icons-material/RadarRounded";

import { loginUser } from "../api/incidentApi";
import { useAuth } from "../auth/AuthContext";

import VendorIQLogo from "../components/brand/VendorIQLogo";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginUser(formData);

      login(response);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    "& .MuiInputBase-root": {
      borderRadius: 4,
      backgroundColor: "#ffffff",
      color: "#0f172a",
      height: 58,
      fontWeight: 700,
    },

    "& input::placeholder": {
      color: "#64748b",
      opacity: 1,
      fontWeight: 600,
    },

    "& fieldset": {
      borderColor: "#dbe3ea",
    },

    "& .MuiOutlinedInput-root:hover fieldset": {
      borderColor: "#cbd5e1",
    },

    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: "#10b981",
      borderWidth: "2px",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -180,
          right: -180,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "rgba(16, 185, 129, 0.08)",
          filter: "blur(40px)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: -220,
          left: -180,
          width: 460,
          height: 460,
          borderRadius: "50%",
          background:
            "rgba(37, 99, 235, 0.08)",
          filter: "blur(45px)",
        }}
      />

      <Box
        sx={{
          width: "100%",
          maxWidth: 1180,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1.15fr 0.85fr",
          },
          gap: 6,
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          <Chip
            icon={<RadarRoundedIcon />}
            label="Realtime Vendor Monitoring"
            sx={{
              mb: 3,
              backgroundColor:
                "rgba(16,185,129,0.12)",
              color: "#047857",
              fontWeight: 800,
              border:
                "1px solid rgba(16,185,129,0.18)",
            }}
          />

          <Typography
            sx={{
              fontSize: {
                md: 54,
                lg: 66,
              },
              lineHeight: 1,
              fontWeight: 950,
              color: "#0f172a",
              letterSpacing: "-0.05em",
              maxWidth: 720,
            }}
          >
            Vendor intelligence for modern payment operations.
          </Typography>

          <Typography
            sx={{
              mt: 3,
              color: "#475569",
              fontSize: 19,
              lineHeight: 1.8,
              maxWidth: 620,
            }}
          >
            Detect ACK failures, SLA breaches,
            anomalies, duplicate incidents,
            and AI-generated operational risk
            from a unified realtime command
            center.
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 5 }}
          >
            {[
              [
                "Realtime Alerts",
                <BoltRoundedIcon key="bolt" />,
              ],
              [
                "JWT Protected",
                <SecurityRoundedIcon key="security" />,
              ],
              [
                "AI Incident Triage",
                <RadarRoundedIcon key="radar" />,
              ],
            ].map(([label, icon]) => (
              <Box
                key={label}
                sx={{
                  px: 2.2,
                  py: 1.4,
                  borderRadius: 4,
                  backgroundColor: "#ffffff",
                  border:
                    "1px solid #e2e8f0",
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 800,
                  boxShadow:
                    "0 2px 8px rgba(15,23,42,0.04)",
                }}
              >
                {icon}
                {label}
              </Box>
            ))}
          </Stack>
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 450,
            justifySelf: "center",
            borderRadius: 7,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 10px 40px rgba(15,23,42,0.08)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: 6,
              background:
                "linear-gradient(90deg, #10b981, #059669)",
            }}
          />

          <Box sx={{ p: 5 }}>
            <Stack spacing={3}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <VendorIQLogo size={46} />

                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        color: "#0f172a",
                        fontWeight: 950,
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      VendorIQ
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        color: "#64748b",
                        mt: 0.4,
                      }}
                    >
                      INTELLIGENT. REALTIME.
                      RELIABLE.
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    color: "#64748b",
                    mt: 2,
                  }}
                >
                  Sign in to access the realtime
                  incident command center.
                </Typography>
              </Box>

              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
              >
                <Stack spacing={2.5}>
                  <TextField
                    placeholder="Email"
                    name="email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    sx={inputSx}
                  />

                  <TextField
                    placeholder="Password"
                    name="password"
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    sx={inputSx}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      height: 56,
                      borderRadius: 4,
                      fontWeight: 900,
                      textTransform: "none",
                      fontSize: 16,
                      background:
                        "linear-gradient(135deg, #10b981, #059669)",
                      boxShadow:
                        "0 10px 24px rgba(16,185,129,0.28)",

                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #059669, #047857)",
                      },
                    }}
                  >
                    {loading
                      ? "Signing in..."
                      : "Enter Command Center"}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;