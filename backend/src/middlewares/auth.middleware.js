const jwt = require("../utils/jwt.utils");
const { pool } = require("../config/db");
const { error } = require("../utils/response");

exports.verifyToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return error(res, "Unauthorized: No token provided", 401);
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verifyAccessToken(token);

    const [rows] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1",
      [decoded.id]
    );

    if (!rows.length) return error(res, "User not found", 401);

    req.user = rows[0];
    next();
  } catch (err) {
    return error(res, "Invalid or expired token", 401);
  }
};
