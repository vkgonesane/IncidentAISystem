import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export const getIncidents = async () => {
  const response = await axios.get(`${BASE_URL}/incidents`);
  return response.data;
};

export const createIncident = async (incidentData) => {
  const response = await axios.post(`${BASE_URL}/alerts`, incidentData);
  return response.data;
};

export const updateIncident = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/incidents/${id}`, data);
  return response.data;
};