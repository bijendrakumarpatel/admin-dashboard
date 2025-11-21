import api from "./apiClient";

const parseError = (err) => {
  return err?.response?.data || { message: err.message || "Unknown error" };
};

const getPayload = (res) => res.data?.data ?? res.data;

export const getPayments = async (params = {}) => {
  try {
    const res = await api.get("/payments", { params });
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const getPaymentById = async (id) => {
  try {
    const res = await api.get(`/payments/${id}`);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const createPayment = async (data) => {
  try {
    const res = await api.post("/payments", data);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const updatePayment = async (id, data) => {
  try {
    const res = await api.put(`/payments/${id}`, data);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const deletePayment = async (id) => {
  try {
    const res = await api.delete(`/payments/${id}`);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export default {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};
