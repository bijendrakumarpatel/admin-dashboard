const paymentService = require("../services/payment.service");
const response = require("../utils/response");

exports.list = async (req, res, next) => {
  try {
    const data = await paymentService.list();
    response.success(res, "Payments fetched", data);
  } catch (e) {
    next(e);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const data = await paymentService.get(req.params.id);
    response.success(res, "Payment fetched", data);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await paymentService.create(req.body);
    response.success(res, "Payment created", data);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await paymentService.update(req.params.id, req.body);
    response.success(res, "Payment updated", data);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await paymentService.remove(req.params.id);
    response.success(res, "Payment deleted");
  } catch (e) {
    next(e);
  }
};
