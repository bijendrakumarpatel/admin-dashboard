const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expense.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { adminMiddleware } = require("../middlewares/admin.middleware");

router.use(verifyToken);
router.use(adminMiddleware);

router.get("/", expenseController.list);
router.get("/:id", expenseController.getOne);
router.post("/", expenseController.create);
router.put("/:id", expenseController.update);
router.delete("/:id", expenseController.remove);

module.exports = router;
