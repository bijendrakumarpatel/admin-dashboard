const orderService = require("../services/order.service");
const response = require("../utils/response");

exports.list = async (req, res, next) => {
  try {
    const data = await orderService.list();
    response.success(res, "Orders fetched", data);
  } catch (e) {
    next(e);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const data = await orderService.get(req.params.id);
    response.success(res, "Order fetched", data);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await orderService.create(req.body);
    response.success(res, "Order created", data);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await orderService.update(req.params.id, req.body);
    response.success(res, "Order updated", data);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await orderService.remove(req.params.id);
    response.success(res, "Order deleted");
  } catch (e) {
    next(e);
  }
};
