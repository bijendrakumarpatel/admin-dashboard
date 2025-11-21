const userService = require("../services/user.service");
const response = require("../utils/response");

exports.listUsers = async (req, res, next) => {
  try {
    const users = await userService.list();
    return response.success(res, "Users fetched", users);
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await userService.get(req.params.id);
    return response.success(res, "User fetched", user);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const created = await userService.create(req.body);
    return response.success(res, "User created", created);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updated = await userService.update(req.params.id, req.body);
    return response.success(res, "User updated", updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.remove(req.params.id);
    return response.success(res, "User deleted");
  } catch (err) {
    next(err);
  }
};
