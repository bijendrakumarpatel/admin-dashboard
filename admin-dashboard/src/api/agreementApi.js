import api from "./apiClient";

const parseError = (err) => {
  return err?.response?.data || { message: err.message || "Unknown error" };
};

const getPayload = (res) => res.data?.data ?? res.data;

export const getAgreements = async (params = {}) => {
  try {
    const res = await api.get("/agreements", { params });
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const getAgreementById = async (id) => {
  try {
    const res = await api.get(`/agreements/${id}`);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const createAgreement = async (data) => {
  try {
    const res = await api.post("/agreements", data);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const updateAgreement = async (id, data) => {
  try {
    const res = await api.put(`/agreements/${id}`, data);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export const deleteAgreement = async (id) => {
  try {
    const res = await api.delete(`/agreements/${id}`);
    return getPayload(res);
  } catch (err) {
    throw parseError(err);
  }
};

export default {
  getAgreements,
  getAgreementById,
  createAgreement,
  updateAgreement,
  deleteAgreement,
};
