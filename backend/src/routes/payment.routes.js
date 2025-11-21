const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { adminMiddleware } = require("../middlewares/admin.middleware");

router.use(verifyToken);
router.use(adminMiddleware);

router.get("/", paymentController.list);
router.get("/:id", paymentController.getOne);
router.post("/", paymentController.create);
router.put("/:id", paymentController.update);
router.delete("/:id", paymentController.remove);

module.exports = router;
