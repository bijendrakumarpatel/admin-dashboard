const { error } = require("../utils/response");
const { logger } = require("../utils/logger");

exports.notFoundHandler = (req, res, next) => {
  return error(res, "Route not found", 404);
};

exports.errorHandler = (err, req, res, next) => {
  logger.error("Unhandled error:", err);
  if (res.headersSent) return;
  return error(res, err.message || "Internal server error", err.statusCode || 500);
};
