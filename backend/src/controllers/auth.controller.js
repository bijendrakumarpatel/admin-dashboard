const authService = require("../services/auth.service");
const { success, error } = require("../utils/response");

// -----------------------------------------------
// LOGIN
// -----------------------------------------------
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password)
      return error(res, "Identifier & password required", 400);

    const data = await authService.login(identifier, password);

    return success(res, "Login successful", data);
  } catch (err) {
    return error(res, err.message || "Login failed", 400);
  }
};

// -----------------------------------------------
// SEND OTP
// -----------------------------------------------
exports.sendOtp = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) return error(res, "Identifier required", 400);

    const otp = await authService.sendOtp(identifier);

    return success(res, "OTP sent successfully", { otp });
  } catch (err) {
    return error(res, err.message || "OTP sending failed", 400);
  }
};

// -----------------------------------------------
// VERIFY OTP
// -----------------------------------------------
exports.verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp)
      return error(res, "Identifier & OTP required", 400);

    const data = await authService.verifyOtp(identifier, otp);

    return success(res, "OTP verified successfully", data);
  } catch (err) {
    return error(res, err.message || "OTP verification failed", 400);
  }
};

// -----------------------------------------------
// REFRESH TOKEN
// -----------------------------------------------
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) return error(res, "Refresh token required", 400);

    const data = await authService.refreshToken(refreshToken);

    return success(res, "Token refreshed", data);
  } catch (err) {
    return error(res, err.message || "Refresh failed", 400);
  }
};

// -----------------------------------------------
// LOGOUT
// -----------------------------------------------
exports.logout = async (req, res) => {
  return success(res, "Logout successful");
};

// -----------------------------------------------
// GET CURRENT USER
// -----------------------------------------------
exports.me = async (req, res) => {
  try {
    if (!req.user) return error(res, "User not authenticated", 401);

    const user = await authService.findUserById(req.user.id);

    return success(res, "User fetched", user);
  } catch (err) {
    return error(res, err.message || "Failed to fetch user", 400);
  }
};
