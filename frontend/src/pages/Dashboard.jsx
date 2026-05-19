import { useMemo, useState } from "react";
import { Alert } from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import KPICards from "../components/dashboard/KPICards";
import IncidentFilters from "../components/dashboard/IncidentFilters";
import IncidentTable from "../components/dashboard/IncidentTable";
import IncidentDrawer from "../components/incident/IncidentDrawer";
import useIncidents from "../hooks/useIncidents";

function Dashboard() {
  const {
    incidents,
    filters,
    loading,
    refreshing,
    error,
    updateFilter,
    resetFilters,
    fetchIncidents,
    resolveIncident,
  } = useIncidents();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);

  const filteredIncidents = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return incidents;
    }

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
        incident.source_type,
        incident.source_name,
        incident.ai_analysis?.summary,
        incident.ai_analysis?.root_cause,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearchTerm);
    });
  }, [incidents, searchTerm]);

  const handleIncidentClick = (incident) => {
    setSelectedIncident(incident);
  };

  const handleDrawerClose = () => {
    setSelectedIncident(null);
  };

  return (
    <DashboardLayout
      refreshing={refreshing}
      onRefresh={() => fetchIncidents({ silent: true })}
    >
      <DashboardHeader />

      <KPICards incidents={incidents} />

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
        onIncidentClick={handleIncidentClick}
      />

      <IncidentDrawer
        open={Boolean(selectedIncident)}
        incident={selectedIncident}
        onClose={handleDrawerClose}
        onResolve={resolveIncident}
      />
    </DashboardLayout>
  );
}

export default Dashboard;