import api from "./apiClient";

const parseError = (err) => {
  return err?.response?.data || { message: err.message || "Unknown error" };
};

const getPayload = (res) => res.data?.data ?? res.data;

export const getExpenses = async (params = {}) => {
  try {
    const res = await api.get("/expenses", { params });
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const getExpenseById = async (id) => {
  try {
    const res = await api.get(`/expenses/${id}`);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const createExpense = async (data) => {
  try {
    const res = await api.post("/expenses", data);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const updateExpense = async (id, data) => {
  try {
    const res = await api.put(`/expenses/${id}`, data);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const deleteExpense = async (id) => {
  try {
    const res = await api.delete(`/expenses/${id}`);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export default {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
