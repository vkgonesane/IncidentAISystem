import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";

import Sidebar from "../components/layout/Sidebar";

import {
  createNotificationRecipient,
  deleteNotificationRecipient,
  getNotificationRecipients,
} from "../api/incidentApi";

function NotificationSettings() {
  const [recipients, setRecipients] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      vendor: "",
      email: "",
    });

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const loadRecipients = async () => {
    try {
      const data =
        await getNotificationRecipients();

      setRecipients(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]:
        event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    setError("");

    setSuccess("");

    try {
      await createNotificationRecipient(
        formData
      );

      setSuccess(
        "Recipient added successfully"
      );

      setFormData({
        vendor: "",
        email: "",
      });

      loadRecipients();
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to add recipient"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    recipientId
  ) => {
    try {
      await deleteNotificationRecipient(
        recipientId
      );

      loadRecipients();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f1f5f9",
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
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-0.04em",
              }}
            >
              Notification Settings
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#64748b",
              }}
            >
              Configure vendor-based
              incident alert recipients.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 6,
              border: "1px solid #e2e8f0",
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  Add Recipient
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: "#64748b",
                    fontSize: 14,
                  }}
                >
                  Assign alert recipients
                  for vendors.
                </Typography>
              </Box>

              {success && (
                <Alert severity="success">
                  {success}
                </Alert>
              )}

              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
              >
                <Stack
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  spacing={2}
                >
                  <TextField
                    fullWidth
                    label="Vendor"
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleChange}
                  />

                  <TextField
                    fullWidth
                    label="Recipient Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      minWidth: 180,
                      borderRadius: 3,
                      fontWeight: 800,
                      textTransform: "none",
                      background:
                        "linear-gradient(135deg, #10b981, #059669)",

                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #059669, #047857)",
                      },
                    }}
                  >
                    {loading
                      ? "Adding..."
                      : "Add Recipient"}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 6,
              border: "1px solid #e2e8f0",
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  Active Recipients
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: "#64748b",
                    fontSize: 14,
                  }}
                >
                  Dynamic vendor routing
                  configuration.
                </Typography>
              </Box>

              <Stack spacing={2}>
                {recipients.map(
                  (recipient) => (
                    <Paper
                      key={recipient.id}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 4,
                        border:
                          "1px solid #e2e8f0",
                        background:
                          "#ffffff",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <NotificationsActiveRoundedIcon
                              sx={{
                                color:
                                  "#10b981",
                              }}
                            />

                            <Typography
                              sx={{
                                fontWeight: 800,
                                color:
                                  "#0f172a",
                              }}
                            >
                              {
                                recipient.vendor
                              }
                            </Typography>

                            <Chip
                              label="ACTIVE"
                              size="small"
                              sx={{
                                backgroundColor:
                                  "rgba(16,185,129,0.12)",
                                color:
                                  "#047857",
                                fontWeight: 800,
                              }}
                            />
                          </Stack>

                          <Typography
                            sx={{
                              color:
                                "#64748b",
                            }}
                          >
                            {
                              recipient.email
                            }
                          </Typography>
                        </Stack>

                        <IconButton
                          onClick={() =>
                            handleDelete(
                              recipient.id
                            )
                          }
                          sx={{
                            color: "#ef4444",
                          }}
                        >
                          <DeleteRoundedIcon />
                        </IconButton>
                      </Stack>
                    </Paper>
                  )
                )}

                {recipients.length === 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 5,
                      borderRadius: 5,
                      border:
                        "1px dashed #cbd5e1",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#64748b",
                      }}
                    >
                      No recipients configured
                      yet.
                    </Typography>
                  </Paper>
                )}
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
}

export default NotificationSettings;