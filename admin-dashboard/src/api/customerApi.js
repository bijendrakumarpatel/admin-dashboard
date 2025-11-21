import api from "./apiClient";

const parseError = (err) => {
  return err?.response?.data || { message: err.message || "Unknown error" };
};

const getPayload = (res) => res.data?.data ?? res.data;

export const getCustomers = async (params = {}) => {
  try {
    const res = await api.get("/customers", { params });
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const getCustomerById = async (id) => {
  try {
    const res = await api.get(`/customers/${id}`);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const createCustomer = async (data) => {
  try {
    const res = await api.post("/customers", data);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const updateCustomer = async (id, data) => {
  try {
    const res = await api.put(`/customers/${id}`, data);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const deleteCustomer = async (id) => {
  try {
    const res = await api.delete(`/customers/${id}`);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export default {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
