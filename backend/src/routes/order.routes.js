const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { adminMiddleware } = require("../middlewares/admin.middleware");

router.use(verifyToken);
router.use(adminMiddleware);

router.get("/", orderController.list);
router.get("/:id", orderController.getOne);
router.post("/", orderController.create);
router.put("/:id", orderController.update);
router.delete("/:id", orderController.remove);

module.exports = router;
