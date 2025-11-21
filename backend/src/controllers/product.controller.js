const productService = require("../services/product.service");
const response = require("../utils/response");

exports.list = async (req, res, next) => {
  try {
    const data = await productService.list();
    response.success(res, "Products fetched", data);
  } catch (e) {
    next(e);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const data = await productService.get(req.params.id);
    response.success(res, "Product fetched", data);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await productService.create(req.body);
    response.success(res, "Product added", data);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await productService.update(req.params.id, req.body);
    response.success(res, "Product updated", data);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await productService.remove(req.params.id);
    response.success(res, "Product deleted");
  } catch (e) {
    next(e);
  }
};
