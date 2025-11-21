const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { adminMiddleware } = require("../middlewares/admin.middleware");

router.use(verifyToken);
router.use(adminMiddleware);

router.get("/", productController.list);
router.get("/:id", productController.getOne);
router.post("/", productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.remove);

module.exports = router;
