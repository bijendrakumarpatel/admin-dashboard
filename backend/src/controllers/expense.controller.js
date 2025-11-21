const expenseService = require("../services/expense.service");
const response = require("../utils/response");

exports.list = async (req, res, next) => {
  try {
    const data = await expenseService.list();
    response.success(res, "Expenses fetched", data);
  } catch (e) {
    next(e);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const data = await expenseService.get(req.params.id);
    response.success(res, "Expense fetched", data);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await expenseService.create(req.body);
    response.success(res, "Expense created", data);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await expenseService.update(req.params.id, req.body);
    response.success(res, "Expense updated", data);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await expenseService.remove(req.params.id);
    response.success(res, "Expense deleted");
  } catch (e) {
    next(e);
  }
};
