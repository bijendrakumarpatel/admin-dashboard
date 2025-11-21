const { pool } = require("../config/db");
const { table } = require("../models/User");
const { hashPassword } = require("../utils/password.utils");

// ----------------------------------------
// LIST ALL USERS (Hide passwords)
// ----------------------------------------
exports.list = async () => {
  const [rows] = await pool.query(
    `SELECT id, name, email, role, phone, created_at, updated_at 
     FROM ${table} 
     ORDER BY created_at DESC`
  );
  return rows;
};

// ----------------------------------------
// CREATE NEW USER (Admin adds staff)
// ----------------------------------------
exports.create = async (data) => {
  const { name, email, password, role, phone } = data;

  // Hash the password before saving
  const hashedPassword = await hashPassword(password);

  const [result] = await pool.query(
    `INSERT INTO ${table} (name, email, password, role, phone) 
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, hashedPassword, role || 'staff', phone]
  );

  return { 
    id: result.insertId, 
    name, 
    email, 
    role, 
    phone 
  };
};

// ----------------------------------------
// UPDATE USER
// ----------------------------------------
exports.update = async (id, data) => {
  const { name, email, role, phone, password } = data;

  // If password is provided, hash it and update everything
  if (password && password.trim() !== "") {
    const hashedPassword = await hashPassword(password);
    await pool.query(
      `UPDATE ${table} 
       SET name=?, email=?, role=?, phone=?, password=? 
       WHERE id=?`,
      [name, email, role, phone, hashedPassword, id]
    );
  } else {
    // If no password provided, just update info
    await pool.query(
      `UPDATE ${table} 
       SET name=?, email=?, role=?, phone=? 
       WHERE id=?`,
      [name, email, role, phone, id]
    );
  }

  return { id, name, email, role, phone };
};

// ----------------------------------------
// DELETE USER
// ----------------------------------------
exports.delete = async (id) => {
  await pool.query(`DELETE FROM ${table} WHERE id=?`, [id]);
  return { message: "User deleted successfully" };
};

// ----------------------------------------
// GET SINGLE USER
// ----------------------------------------
exports.getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, name, email, role, phone, created_at 
     FROM ${table} 
     WHERE id=?`, 
    [id]
  );
  return rows[0];
};