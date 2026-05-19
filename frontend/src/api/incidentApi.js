import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const incidentApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getIncidents = async (filters = {}) => {
  const response = await incidentApi.get("/incidents", {
    params: filters,
  });

  return response.data;
};

export const getIncidentById = async (incidentId) => {
  const response = await incidentApi.get(`/incidents/${incidentId}`);

  return response.data;
};

export const updateIncident = async (incidentId, updateData) => {
  const response = await incidentApi.put(`/incidents/${incidentId}`, updateData);

  return response.data;
};

export const getSimilarIncidents = async (incidentId) => {
  const response = await incidentApi.get(`/incidents/${incidentId}/similar`);

  return response.data;
};

export const getIncidentTimeline = async (incidentId) => {
  const response = await incidentApi.get(`/incidents/${incidentId}/timeline`);

  return response.data;
};

export default incidentApi;