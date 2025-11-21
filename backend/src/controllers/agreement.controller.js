const agreementService = require("../services/agreement.service");
const response = require("../utils/response");

exports.list = async (req, res, next) => {
  try {
    const data = await agreementService.list();
    response.success(res, "Agreements fetched", data);
  } catch (e) {
    next(e);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const data = await agreementService.get(req.params.id);
    response.success(res, "Agreement fetched", data);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await agreementService.create(req.body);
    response.success(res, "Agreement created", data);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await agreementService.update(req.params.id, req.body);
    response.success(res, "Agreement updated", data);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await agreementService.remove(req.params.id);
    response.success(res, "Agreement deleted");
  } catch (e) {
    next(e);
  }
};
