const { error } = require("../utils/response");

exports.adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return error(res, "Admin access required", 403);
  }
  next();
};
