import api from "./apiClient";

const parseError = (err) => {
  return err?.response?.data || { message: err.message || "Unknown error" };
};

const getPayload = (res) => res.data?.data ?? res.data;

export const getSummary = async () => {
  try {
    const res = await api.get("/dashboard/summary");
    return getPayload(res); // { totalCustomers, totalOrders, ... }
  } catch (err) {
    throw parseError(err);
  }
};

export const getChartsData = async (params = {}) => {
  try {
    const res = await api.get("/dashboard/charts", { params });
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export default {
  getSummary,
  getChartsData,
};
