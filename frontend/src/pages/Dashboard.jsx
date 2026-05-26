import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Snackbar } from "@mui/material";

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

import {
  getAlertSources,
  getDashboardSummary,
  getIncidentTrend,
  simulateAlert,
} from "../api/incidentApi";

function Dashboard() {
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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);

  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [incidentTrend, setIncidentTrend] = useState([]);
  const [alertSources, setAlertSources] = useState([]);

  const [summaryLoading, setSummaryLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  const [simulatingAlert, setSimulatingAlert] = useState(false);

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

  return (
    <>
      <DashboardLayout refreshing={refreshing} onRefresh={handleRefresh}>
        <DashboardHeader
          onSimulateAlert={handleSimulateAlert}
          simulatingAlert={simulatingAlert}
          liveStatus={liveStatus}
          liveEvent={liveEvent}
        />

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
          <IncidentTrendChart
            data={incidentTrend}
            loading={analyticsLoading}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 2,
            }}
          >
            <AlertSourcesCard
              sources={alertSources}
              loading={analyticsLoading}
            />

            <LatestAIInsightCard
              incidents={incidents}
              loading={loading}
            />
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

        <IncidentDrawer
          open={Boolean(selectedIncident)}
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onResolve={resolveIncident}
        />
      </DashboardLayout>

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