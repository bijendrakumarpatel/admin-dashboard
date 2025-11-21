import api from "./apiClient";

const parseError = (err) => {
  return err?.response?.data || { message: err.message || "Unknown error" };
};

const getPayload = (res) => res.data?.data ?? res.data;

export const getProducts = async (params = {}) => {
  try {
    const res = await api.get("/products", { params });
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const getProductById = async (id) => {
  try {
    const res = await api.get(`/products/${id}`);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const createProduct = async (data) => {
  try {
    const res = await api.post("/products", data);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const updateProduct = async (id, data) => {
  try {
    const res = await api.put(`/products/${id}`, data);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/products/${id}`);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
