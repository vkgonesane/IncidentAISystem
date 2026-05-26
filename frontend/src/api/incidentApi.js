import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

const incidentApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getIncidents = async (filters = {}) => {
  const response = await incidentApi.get("/incidents", {
    params: filters,
  });

  return response.data;
};

export const getIncidentById = async (incidentId) => {
  const response = await incidentApi.get(
    `/incidents/${incidentId}`
  );

  return response.data;
};

export const updateIncident = async (
  incidentId,
  payload
) => {
  const response = await incidentApi.put(
    `/incidents/${incidentId}`,
    payload
  );

  return response.data;
};

export const getDashboardSummary = async () => {
  const response = await incidentApi.get(
    "/dashboard/summary"
  );

  return response.data;
};

export const getIncidentTrend = async () => {
  const response = await incidentApi.get(
    "/incidents/trend"
  );

  return response.data;
};

export const getAlertSources = async () => {
  const response = await incidentApi.get(
    "/alerts/sources"
  );

  return response.data;
};

export const getIncidentTimeline = async (
  incidentId
) => {
  const response = await incidentApi.get(
    `/incidents/${incidentId}/timeline`
  );

  return response.data;
};

export const getIncidentCorrelation = async (
  incidentId
) => {
  const response = await incidentApi.get(
    `/incidents/${incidentId}/correlation`
  );

  return response.data;
};

export const getMajorIncidentSummary = async (
  incidentId
) => {
  const response = await incidentApi.get(
    `/incidents/${incidentId}/major-summary`
  );

  return response.data;
};

export const simulateAlert = async () => {
  const response = await incidentApi.post(
    "/alerts/simulate"
  );

  return response.data;
};

export const createManualAlert = async (
  payload
) => {
  const response = await incidentApi.post(
    "/alerts",
    payload
  );

  return response.data;
};

export default incidentApi;