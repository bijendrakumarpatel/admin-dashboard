const dashboardService = require("../services/dashboard.service");
const response = require("../utils/response");

exports.summary = async (req, res, next) => {
  try {
    const data = await dashboardService.summary();
    response.success(res, "Dashboard summary loaded", data);
  } catch (e) {
    next(e);
  }
};

exports.charts = async (req, res, next) => {
  try {
    const data = await dashboardService.charts();
    response.success(res, "Dashboard charts loaded", data);
  } catch (e) {
    next(e);
  }
};
