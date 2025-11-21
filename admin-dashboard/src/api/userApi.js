import api from "./apiClient";

const parseError = (err) => {
  return err?.response?.data || { message: err.message || "Unknown error" };
};

const getPayload = (res) => res.data?.data ?? res.data;

export const getUsers = async (params = {}) => {
  try {
    const res = await api.get("/users", { params });
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const getUserById = async (id) => {
  try {
    const res = await api.get(`/users/${id}`);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const createUser = async (data) => {
  try {
    const res = await api.post("/users", data);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const updateUser = async (id, data) => {
  try {
    const res = await api.put(`/users/${id}`, data);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
