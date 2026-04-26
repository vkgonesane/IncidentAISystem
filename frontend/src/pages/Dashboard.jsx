import { useEffect, useState } from "react";
import {
  createIncident,
  getIncidents,
  updateIncident,
} from "../api/incidentApi";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [view, setView] = useState("ACTIVE");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    vendor: "",
    environment: "PROD",
    severity: "HIGH",
    error_code: "",
  });

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleCreateIncident = async () => {
    if (!form.vendor || !form.error_code) {
      alert("Vendor and Error Code are required");
      return;
    }

    try {
      await createIncident(form);

      setForm({
        vendor: "",
        environment: "PROD",
        severity: "HIGH",
        error_code: "",
      });

      await loadIncidents();
      setView("ACTIVE");
    } catch (error) {
      console.error("Error creating incident:", error);
      alert("Failed to create incident");
    }
  };

  const handleResolveIncident = async (incident) => {
    try {
      await updateIncident(incident.id, { status: "RESOLVED" });
      setSelectedIncident(null);
      await loadIncidents();
      setView("RESOLVED");
    } catch (error) {
      console.error("Error resolving incident:", error);
      alert("Failed to resolve incident");
    }
  };

  const activeIncidents = incidents.filter((i) => i.status === "OPEN");
  const criticalIncidents = incidents.filter(
  (i) => i.severity === "CRITICAL" && i.status === "OPEN"
);
  const resolvedIncidents = incidents.filter((i) => i.status === "RESOLVED");

  const getFilteredIncidents = () => {
    if (view === "ALL") return incidents;
    if (view === "ACTIVE") return activeIncidents;
    if (view === "CRITICAL") return criticalIncidents;
    if (view === "RESOLVED") return resolvedIncidents;
    return incidents;
  };

  const displayList = getFilteredIncidents().filter((incident) =>
    `${incident.vendor} ${incident.environment} ${incident.error_code} ${incident.severity} ${incident.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getSeverityColor = (severity) => {
    if (severity === "CRITICAL") return "error";
    if (severity === "HIGH") return "warning";
    if (severity === "MEDIUM") return "info";
    return "default";
  };

  const getStatusColor = (status) => {
    if (status === "OPEN") return "error";
    if (status === "RESOLVED") return "success";
    return "default";
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f6f8fb", py: 5 }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h1"
            fontWeight={900}
            sx={{
              fontSize: { xs: "34px", md: "52px" },
              letterSpacing: "-1px",
              color: "#111827",
            }}
          >
            Incident AI System
          </Typography>

          <Typography color="text.secondary" mt={1} fontSize={17}>
            AI-powered incident monitoring and response dashboard
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 4, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight={800} mb={2}>
            Create New Incident
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Vendor"
                name="vendor"
                value={form.vendor}
                onChange={handleFormChange}
                placeholder="Experian"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Environment"
                name="environment"
                value={form.environment}
                onChange={handleFormChange}
              >
                <MenuItem value="PROD">PROD</MenuItem>
                <MenuItem value="UAT">UAT</MenuItem>
                <MenuItem value="DEV">DEV</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Severity"
                name="severity"
                value={form.severity}
                onChange={handleFormChange}
              >
                <MenuItem value="CRITICAL">CRITICAL</MenuItem>
                <MenuItem value="HIGH">HIGH</MenuItem>
                <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                <MenuItem value="LOW">LOW</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Error Code"
                name="error_code"
                value={form.error_code}
                onChange={handleFormChange}
                placeholder="HTTP_502"
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleCreateIncident}
          >
            Create Incident
          </Button>
        </Paper>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <OptionCard
              title="All Incidents"
              value={incidents.length}
              active={view === "ALL"}
              onClick={() => setView("ALL")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <OptionCard
              title="Active Incidents"
              value={activeIncidents.length}
              active={view === "ACTIVE"}
              onClick={() => setView("ACTIVE")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <OptionCard
              title="Critical Incidents"
              value={criticalIncidents.length}
              active={view === "CRITICAL"}
              onClick={() => setView("CRITICAL")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <OptionCard
              title="Resolved Incidents"
              value={resolvedIncidents.length}
              active={view === "RESOLVED"}
              onClick={() => setView("RESOLVED")}
            />
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            mb={2}
          >
            <Box>
              <Typography variant="h5" fontWeight={800}>
                {view === "ALL" && "All Incidents"}
                {view === "ACTIVE" && "Currently Active Incidents"}
                {view === "CRITICAL" && "Critical Incidents"}
                {view === "RESOLVED" && "Resolved Incidents"}
              </Typography>

              <Typography color="text.secondary" fontSize={14}>
                Click an incident to view details and AI insights
              </Typography>
            </Box>

            <Button variant="outlined" onClick={loadIncidents}>
              Refresh
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Box mb={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by vendor, environment, error code, severity, or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          {displayList.length === 0 ? (
            <Typography color="text.secondary">
              No incidents found for this view.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {displayList.map((incident) => (
                <Card
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    boxShadow: "none",
                    transition: "0.2s",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ py: 2 }}>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", md: "center" }}
                      spacing={2}
                    >
                      <Box>
                        <Typography fontWeight={800}>
                          #{incident.id} — {incident.vendor}
                        </Typography>

                        <Typography color="text.secondary" fontSize={14}>
                          {incident.environment} • {incident.error_code}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={incident.severity}
                          color={getSeverityColor(incident.severity)}
                          size="small"
                        />
                        <Chip
                          label={incident.status}
                          color={getStatusColor(incident.status)}
                          size="small"
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Paper>

        <IncidentPopup
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onResolve={handleResolveIncident}
          getSeverityColor={getSeverityColor}
          getStatusColor={getStatusColor}
        />
      </Container>
    </Box>
  );
}

function OptionCard({ title, value, active, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: 4,
        cursor: "pointer",
        border: active ? "2px solid #2563eb" : "1px solid #e5e7eb",
        backgroundColor: active ? "#eff6ff" : "#ffffff",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Typography color="text.secondary" fontSize={14}>
          {title}
        </Typography>

        <Typography variant="h4" fontWeight={900}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function IncidentPopup({
  incident,
  onClose,
  onResolve,
  getSeverityColor,
  getStatusColor,
}) {
  if (!incident) return null;

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={900}>Incident #{incident.id}</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Typography>Vendor: {incident.vendor}</Typography>
          <Typography>Environment: {incident.environment}</Typography>
          <Typography>Error: {incident.error_code}</Typography>
          <Typography>Created At: {incident.created_at}</Typography>

          <Stack direction="row" spacing={1}>
            <Chip
              label={incident.severity}
              color={getSeverityColor(incident.severity)}
            />
            <Chip label={incident.status} color={getStatusColor(incident.status)} />
          </Stack>

          <Divider />

          <Typography fontWeight={800}>AI Insight</Typography>

          <Typography>
            Root Cause: {incident.ai_analysis?.root_cause || "N/A"}
          </Typography>

          <Typography>
            Confidence: {incident.ai_analysis?.confidence ?? "N/A"}
          </Typography>

          <Typography>
            Recommendation: {incident.ai_analysis?.recommendation || "N/A"}
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>

            {incident.status !== "RESOLVED" && (
              <Button
                variant="contained"
                color="success"
                onClick={() => onResolve(incident)}
              >
                Resolve Incident
              </Button>
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default Dashboard;