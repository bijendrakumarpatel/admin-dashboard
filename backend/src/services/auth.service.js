const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt.utils");
const { hashPassword } = require("../utils/password.utils");

// Tables
const { table: userTable } = require("../models/User");
const { table: otpTable } = require("../models/OTP");

// ----------------------------------------
// FIND USER BY email / username / phone
// ----------------------------------------
exports.findUser = async (identifier) => {
  const [rows] = await pool.query(
    `SELECT id, name, email, username, phone, password, role 
     FROM ${userTable} 
     WHERE email = ? OR username = ? OR phone = ?
     LIMIT 1`,
    [identifier, identifier, identifier]
  );
  return rows[0] || null;
};

// ----------------------------------------
// LOGIN
// ----------------------------------------
exports.login = async (identifier, password) => {
  const user = await this.findUser(identifier);
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid password");

  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id, role: user.role });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

// ----------------------------------------
// SEND OTP
// ----------------------------------------
exports.sendOtp = async (identifier) => {
  const otp = ("" + Math.floor(100000 + Math.random() * 900000)).slice(-6);

  await pool.query(`DELETE FROM ${otpTable} WHERE identifier = ?`, [identifier]);

  await pool.query(
    `INSERT INTO ${otpTable} (identifier, otp_code, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
    [identifier, otp]
  );

  return otp;
};

// ----------------------------------------
// VERIFY OTP
// ----------------------------------------
exports.verifyOtp = async (identifier, otp) => {
  const [rows] = await pool.query(
    `SELECT * FROM ${otpTable}
     WHERE identifier = ?
     ORDER BY id DESC LIMIT 1`,
    [identifier]
  );

  if (!rows.length) throw new Error("OTP not found");
  const record = rows[0];

  if (record.otp_code !== otp) throw new Error("Invalid OTP");
  if (new Date(record.expires_at) < new Date()) throw new Error("OTP expired");

  // Remove OTP
  await pool.query(`DELETE FROM ${otpTable} WHERE identifier = ?`, [identifier]);

  // Find or create user
  let user = await this.findUser(identifier);

  if (!user) {
    const randomPass = await hashPassword(
      Math.random().toString(36).substring(2, 10)
    );

    const [result] = await pool.query(
      `INSERT INTO ${userTable} (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      ["OTP User", identifier, randomPass, "admin"]
    );

    user = {
      id: result.insertId,
      name: "OTP User",
      email: identifier,
      role: "admin",
    };
  }

  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id, role: user.role });

  return { user, accessToken, refreshToken };
};

// ----------------------------------------
// REFRESH TOKEN
// ----------------------------------------
exports.refreshToken = async (token) => {
  const user = verifyRefreshToken(token);

  const accessToken = signAccessToken(user);
  const newRefreshToken = signRefreshToken(user);

  return { accessToken, refreshToken: newRefreshToken };
};

// ----------------------------------------
// GET USER BY ID (for /me)
// ----------------------------------------
exports.findUserById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, name, email, role FROM ${userTable} WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};
