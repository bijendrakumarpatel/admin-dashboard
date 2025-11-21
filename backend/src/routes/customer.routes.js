const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// LOGIN
router.post("/login", authController.login);

// SEND OTP
router.post("/send-otp", authController.sendOtp);

// VERIFY OTP
router.post("/verify-otp", authController.verifyOtp);

// REFRESH TOKEN
router.post("/refresh-token", authController.refreshToken);

// LOGOUT
router.post("/logout", authController.logout);

// CURRENT USER (PROTECTED)
router.get("/me", verifyToken, authController.me);

module.exports = router;
