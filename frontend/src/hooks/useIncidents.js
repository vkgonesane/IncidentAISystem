import { useCallback, useEffect, useRef, useState } from "react";
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

const WS_URL = "ws://127.0.0.1:8000/ws/incidents";

function useIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [liveEvent, setLiveEvent] = useState(null);
  const [liveStatus, setLiveStatus] = useState("connecting");

  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const mountedRef = useRef(false);

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

  useEffect(() => {
    mountedRef.current = true;

    const connectSocket = () => {
      if (!mountedRef.current) return;

      setLiveStatus("connecting");

      const socket = new WebSocket(WS_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        if (!mountedRef.current) return;

        console.log("Incident WebSocket connected");
        setLiveStatus("connected");
      };

      socket.onmessage = async (event) => {
        if (!mountedRef.current) return;

        try {
          const message = JSON.parse(event.data);

          setLiveEvent(message);

          if (
            message.type === "INCIDENT_CREATED" ||
            message.type === "DUPLICATE_ALERT"
          ) {
            await fetchIncidents({ silent: true });
          }
        } catch (err) {
          console.error("Failed to process websocket message:", err);
        }
      };

      socket.onerror = () => {
        if (!mountedRef.current) return;

        setLiveStatus("error");
      };

      socket.onclose = () => {
        if (!mountedRef.current) return;

        setLiveStatus("reconnecting");

        reconnectTimerRef.current = setTimeout(() => {
          connectSocket();
        }, 3000);
      };
    };

    connectSocket();

    return () => {
      mountedRef.current = false;

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }

      if (
        socketRef.current &&
        socketRef.current.readyState !== WebSocket.CLOSED
      ) {
        socketRef.current.close();
      }
    };
  }, [fetchIncidents]);

  return {
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
  };
}

export default useIncidents;