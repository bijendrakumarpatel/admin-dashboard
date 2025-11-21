import api from "./apiClient";

const parseError = (err) => {
  return err?.response?.data || { message: err.message || "Unknown error" };
};

const getPayload = (res) => res.data?.data ?? res.data;

export const getOrders = async (params = {}) => {
  try {
    const res = await api.get("/orders", { params });
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const getOrderById = async (id) => {
  try {
    const res = await api.get(`/orders/${id}`);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const createOrder = async (data) => {
  try {
    const res = await api.post("/orders", data);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const updateOrder = async (id, data) => {
  try {
    const res = await api.put(`/orders/${id}`, data);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const deleteOrder = async (id) => {
  try {
    const res = await api.delete(`/orders/${id}`);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
