const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { adminMiddleware } = require("../middlewares/admin.middleware");

router.use(verifyToken);
router.use(adminMiddleware);

router.get("/summary", dashboardController.summary);

module.exports = router;
