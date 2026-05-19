import { useCallback, useEffect, useState } from "react";
import { getIncidents, updateIncident } from "../api/incidentApi";

const DEFAULT_FILTERS = {
  status: "",
  vendor: "",
  severity: "",
  environment: "",
  error_code: "",
  limit: 50,
  offset: 0,
};

function useIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const buildApiFilters = useCallback((currentFilters) => {
    const apiFilters = {};

    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        apiFilters[key] = value;
      }
    });

    return apiFilters;
  }, []);

  const fetchIncidents = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const apiFilters = buildApiFilters(filters);
        const data = await getIncidents(apiFilters);

        setIncidents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch incidents:", err);
        setError("Unable to load incidents. Please check if FastAPI is running.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters, buildApiFilters]
  );

  const updateFilter = (name, value) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value,
      offset: 0,
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const resolveIncident = async (incidentId) => {
    await updateIncident(incidentId, {
      status: "RESOLVED",
    });

    await fetchIncidents({ silent: true });
  };

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchIncidents({ silent: true });
    }, 15000);

    return () => clearInterval(intervalId);
  }, [fetchIncidents]);

  return {
    incidents,
    filters,
    loading,
    refreshing,
    error,
    updateFilter,
    resetFilters,
    fetchIncidents,
    resolveIncident,
  };
}

export default useIncidents;