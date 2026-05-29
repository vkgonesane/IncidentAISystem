import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import KPICards from "../components/dashboard/KPICards";
import IncidentFilters from "../components/dashboard/IncidentFilters";
import IncidentTable from "../components/dashboard/IncidentTable";
import IncidentDrawer from "../components/incident/IncidentDrawer";
import IncidentTrendChart from "../components/dashboard/IncidentTrendChart";
import AlertSourcesCard from "../components/dashboard/AlertSourcesCard";
import LatestAIInsightCard from "../components/dashboard/LatestAIInsightCard";

import useIncidents from "../hooks/useIncidents";
import { useAuth } from "../auth/AuthContext";

import {
  createManualAlert,
  getAlertSources,
  getDashboardSummary,
  getIncidentTrend,
  simulateAlert,
} from "../api/incidentApi";

const initialManualAlert = {
  vendor: "PFIZER",
  environment: "PROD",
  severity: "HIGH",
  error_code: "ACK_TIMEOUT",
  records_impacted: 1200,
  amount_impacted: 450000,
  ack_delay_minutes: 35,
};

function SectionCard({ title, subtitle, children }) {
  return (
    <Card
      sx={{
        border: "1px solid #e2e8f0",
        borderRadius: 4,
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>

        {children}
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isOperator = user?.role === "OPERATOR";
  const canManageIncidents = isAdmin || isOperator;

  const {
    incidents,
    filters,
    loading,
    refreshing,
    error,
    liveEvent,
    liveStatus,
    updateFilter,
    resetFilters,
    fetchIncidents,
    resolveIncident,
  } = useIncidents();

  const [activePage, setActivePage] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);

  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [incidentTrend, setIncidentTrend] = useState([]);
  const [alertSources, setAlertSources] = useState([]);

  const [summaryLoading, setSummaryLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  const [simulatingAlert, setSimulatingAlert] = useState(false);
  const [manualAlertOpen, setManualAlertOpen] = useState(false);
  const [manualAlertForm, setManualAlertForm] = useState(initialManualAlert);
  const [creatingManualAlert, setCreatingManualAlert] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const [toast, setToast] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const fetchDashboardSummary = async ({ silent = false } = {}) => {
    try {
      if (!silent) setSummaryLoading(true);
      setSummaryError("");

      const data = await getDashboardSummary();
      setDashboardSummary(data);
    } catch (err) {
      setSummaryError("Failed to load dashboard summary.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchDashboardAnalytics = async ({ silent = false } = {}) => {
    try {
      if (!silent) setAnalyticsLoading(true);

      const [trendData, sourceData] = await Promise.all([
        getIncidentTrend(),
        getAlertSources(),
      ]);

      setIncidentTrend(trendData);
      setAlertSources(sourceData);
    } catch (err) {
      setSummaryError("Failed to load dashboard analytics.");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardSummary();
    fetchDashboardAnalytics();
  }, []);

  useEffect(() => {
    if (!liveEvent) return;

    fetchDashboardSummary({ silent: true });
    fetchDashboardAnalytics({ silent: true });

    const notification = {
      id: liveEvent.incident_id || Date.now(),
      incident_id: liveEvent.incident_id,
      title:
        liveEvent.type === "DUPLICATE_ALERT"
          ? "Duplicate incident activity"
          : "Live incident detected",
      message:
        liveEvent.type === "DUPLICATE_ALERT"
          ? `Duplicate activity detected for incident #${liveEvent.incident_id}`
          : `${liveEvent.error_code || "Alert"} from ${
              liveEvent.vendor || "unknown vendor"
            }`,
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 8));

    if (liveEvent.type === "INCIDENT_CREATED") {
      setToast({
        open: true,
        severity: "info",
        message: `Live incident detected: ${liveEvent.error_code} (${liveEvent.vendor})`,
      });
    }

    if (liveEvent.type === "DUPLICATE_ALERT") {
      setToast({
        open: true,
        severity: "warning",
        message: `Duplicate incident activity detected (#${liveEvent.incident_id})`,
      });
    }
  }, [liveEvent]);

  const handleRefresh = async () => {
    await fetchIncidents({ silent: true });
    await fetchDashboardSummary();
    await fetchDashboardAnalytics();
  };

  const handleSimulateAlert = async () => {
    if (!canManageIncidents) return;

    try {
      setSimulatingAlert(true);

      const response = await simulateAlert();

      await fetchIncidents({ silent: true });
      await fetchDashboardSummary({ silent: true });
      await fetchDashboardAnalytics({ silent: true });

      setToast({
        open: true,
        severity: "success",
        message: `Simulated incident #${response.incident_id} created successfully.`,
      });
    } catch (err) {
      setToast({
        open: true,
        severity: "error",
        message: "Failed to simulate alert.",
      });
    } finally {
      setSimulatingAlert(false);
    }
  };

  const handleCreateManualAlert = async () => {
    if (!canManageIncidents) return;

    try {
      setCreatingManualAlert(true);

      const payload = {
        ...manualAlertForm,
        records_impacted: Number(manualAlertForm.records_impacted || 0),
        amount_impacted: Number(manualAlertForm.amount_impacted || 0),
        ack_delay_minutes: Number(manualAlertForm.ack_delay_minutes || 0),
      };

      const response = await createManualAlert(payload);

      await fetchIncidents({ silent: true });
      await fetchDashboardSummary({ silent: true });
      await fetchDashboardAnalytics({ silent: true });

      setManualAlertOpen(false);
      setManualAlertForm(initialManualAlert);

      setToast({
        open: true,
        severity: "success",
        message: `Manual alert #${
          response.incident_id || response.id || "created"
        } created successfully.`,
      });
    } catch (err) {
      setToast({
        open: true,
        severity: "error",
        message: "Failed to create manual alert.",
      });
    } finally {
      setCreatingManualAlert(false);
    }
  };

  const filteredIncidents = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) return incidents;

    return incidents.filter((incident) => {
      const searchableText = [
        incident.id,
        incident.title,
        incident.message,
        incident.description,
        incident.vendor,
        incident.environment,
        incident.error_code,
        incident.severity,
        incident.status,
        incident.assignee,
        incident.source_type,
        incident.source_name,
        incident.sla_status,
        incident.ai_analysis?.summary,
        incident.ai_analysis?.root_cause,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearchTerm);
    });
  }, [incidents, searchTerm]);

  const handleNotificationClick = (notification) => {
    const match = incidents.find(
      (incident) => incident.id === notification.incident_id
    );

    if (match) {
      setSelectedIncident(match);
      setActivePage("dashboard");
    }
  };

  const renderPage = () => {
    if (activePage === "ai-insights") {
      return (
        <Stack spacing={2}>
          <SectionCard
            title="AI Insights"
            subtitle="Latest root-cause predictions and operational recommendations."
          >
            <LatestAIInsightCard incidents={incidents} loading={loading} />
          </SectionCard>

          <IncidentTable
            incidents={filteredIncidents}
            loading={loading}
            error={error}
            onIncidentClick={setSelectedIncident}
          />
        </Stack>
      );
    }

    if (activePage === "timeline") {
      return (
        <SectionCard
          title="Timeline"
          subtitle="Recent incident activity ordered by latest seen time."
        >
          <IncidentTable
            incidents={filteredIncidents}
            loading={loading}
            error={error}
            onIncidentClick={setSelectedIncident}
          />
        </SectionCard>
      );
    }

    if (activePage === "reliability") {
      return (
        <Stack spacing={2}>
          <KPICards
            incidents={incidents}
            summary={dashboardSummary}
            loading={summaryLoading}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
              gap: 2,
            }}
          >
            <IncidentTrendChart data={incidentTrend} loading={analyticsLoading} />
            <AlertSourcesCard sources={alertSources} loading={analyticsLoading} />
          </Box>
        </Stack>
      );
    }

    if (activePage === "settings") {
      return (
        <SectionCard
          title="Settings"
          subtitle="Deployment and runtime configuration overview."
        >
          <Stack spacing={1.5}>
            <Typography variant="body2">
              API Base URL:{" "}
              {import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}
            </Typography>

            <Typography variant="body2">
              WebSocket URL:{" "}
              {import.meta.env.VITE_WS_URL ||
                "ws://127.0.0.1:8000/ws/incidents"}
            </Typography>

            <Typography variant="body2">Live Status: {liveStatus}</Typography>

            <Typography variant="body2">
              Current Role: {user?.role || "VIEWER"}
            </Typography>
          </Stack>
        </SectionCard>
      );
    }

    return (
      <>
        <DashboardHeader
          onSimulateAlert={
            canManageIncidents ? handleSimulateAlert : undefined
          }
          onOpenManualAlert={
            canManageIncidents
              ? () => setManualAlertOpen(true)
              : undefined
          }
          simulatingAlert={simulatingAlert}
          liveStatus={liveStatus}
          liveEvent={liveEvent}
        />

        {!canManageIncidents && (
          <Alert severity="info" sx={{ mb: 2 }}>
            You are signed in as VIEWER. Operational actions are hidden.
          </Alert>
        )}

        <KPICards
          incidents={incidents}
          summary={dashboardSummary}
          loading={summaryLoading}
        />

        {summaryError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {summaryError}
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "2fr 1fr",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <IncidentTrendChart data={incidentTrend} loading={analyticsLoading} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 2,
            }}
          >
            <AlertSourcesCard sources={alertSources} loading={analyticsLoading} />

            <LatestAIInsightCard incidents={incidents} loading={loading} />
          </Box>
        </Box>

        <IncidentFilters
          filters={filters}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onFilterChange={updateFilter}
          onResetFilters={resetFilters}
        />

        {refreshing && !loading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Refreshing latest incidents...
          </Alert>
        )}

        <IncidentTable
          incidents={filteredIncidents}
          loading={loading}
          error={error}
          onIncidentClick={setSelectedIncident}
        />
      </>
    );
  };

  return (
    <>
      <DashboardLayout
        refreshing={refreshing}
        onRefresh={handleRefresh}
        activePage={activePage}
        onPageChange={setActivePage}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      >
        {renderPage()}

        <IncidentDrawer
          open={Boolean(selectedIncident)}
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onResolve={canManageIncidents ? resolveIncident : undefined}
        />
      </DashboardLayout>

      {canManageIncidents && (
        <Dialog
          open={manualAlertOpen}
          onClose={() => setManualAlertOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ fontWeight: 900 }}>
            Create Manual Alert
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Vendor"
                value={manualAlertForm.vendor}
                onChange={(e) =>
                  setManualAlertForm((prev) => ({
                    ...prev,
                    vendor: e.target.value,
                  }))
                }
                fullWidth
              />

              <TextField
                label="Environment"
                select
                value={manualAlertForm.environment}
                onChange={(e) =>
                  setManualAlertForm((prev) => ({
                    ...prev,
                    environment: e.target.value,
                  }))
                }
                fullWidth
              >
                <MenuItem value="PROD">PROD</MenuItem>
                <MenuItem value="UAT">UAT</MenuItem>
                <MenuItem value="DEV">DEV</MenuItem>
              </TextField>

              <TextField
                label="Severity"
                select
                value={manualAlertForm.severity}
                onChange={(e) =>
                  setManualAlertForm((prev) => ({
                    ...prev,
                    severity: e.target.value,
                  }))
                }
                fullWidth
              >
                <MenuItem value="LOW">LOW</MenuItem>
                <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                <MenuItem value="HIGH">HIGH</MenuItem>
                <MenuItem value="CRITICAL">CRITICAL</MenuItem>
              </TextField>

              <TextField
                label="Error Code"
                value={manualAlertForm.error_code}
                onChange={(e) =>
                  setManualAlertForm((prev) => ({
                    ...prev,
                    error_code: e.target.value,
                  }))
                }
                fullWidth
              />

              <TextField
                label="Records Impacted"
                type="number"
                value={manualAlertForm.records_impacted}
                onChange={(e) =>
                  setManualAlertForm((prev) => ({
                    ...prev,
                    records_impacted: e.target.value,
                  }))
                }
                fullWidth
              />

              <TextField
                label="Amount Impacted"
                type="number"
                value={manualAlertForm.amount_impacted}
                onChange={(e) =>
                  setManualAlertForm((prev) => ({
                    ...prev,
                    amount_impacted: e.target.value,
                  }))
                }
                fullWidth
              />

              <TextField
                label="ACK Delay Minutes"
                type="number"
                value={manualAlertForm.ack_delay_minutes}
                onChange={(e) =>
                  setManualAlertForm((prev) => ({
                    ...prev,
                    ack_delay_minutes: e.target.value,
                  }))
                }
                fullWidth
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setManualAlertOpen(false)}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleCreateManualAlert}
              disabled={creatingManualAlert}
            >
              {creatingManualAlert ? "Creating..." : "Create Alert"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          sx={{
            width: "100%",
            fontWeight: 700,
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Dashboard;