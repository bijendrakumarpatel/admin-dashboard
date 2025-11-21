const customerService = require("../services/customer.service");
const response = require("../utils/response");

exports.list = async (req, res, next) => {
  try {
    const data = await customerService.list();
    response.success(res, "Customers fetched", data);
  } catch (e) {
    next(e);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const data = await customerService.get(req.params.id);
    response.success(res, "Customer fetched", data);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await customerService.create(req.body);
    response.success(res, "Customer added", data);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await customerService.update(req.params.id, req.body);
    response.success(res, "Customer updated", data);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await customerService.remove(req.params.id);
    response.success(res, "Customer deleted");
  } catch (e) {
    next(e);
  }
};
