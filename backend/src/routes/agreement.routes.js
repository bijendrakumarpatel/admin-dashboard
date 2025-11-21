const express = require("express");
const router = express.Router();

const agreementController = require("../controllers/agreement.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { adminMiddleware } = require("../middlewares/admin.middleware");

router.use(verifyToken);
router.use(adminMiddleware);

router.get("/", agreementController.list);
router.get("/:id", agreementController.getOne);
router.post("/", agreementController.create);
router.put("/:id", agreementController.update);
router.delete("/:id", agreementController.remove);

module.exports = router;
