const { pool } = require("../config/db");
const { table } = require("../models/Customer");

exports.list = async () => {
  const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY created_at DESC`);
  return rows;
};

exports.create = async (data) => {
  const { name, email, phone, address } = data;
  const [result] = await pool.query(
    `INSERT INTO ${table} (name, email, phone, address) VALUES (?, ?, ?, ?)`,
    [name, email, phone, address]
  );
  return { id: result.insertId, ...data };
};

exports.update = async (id, data) => {
  const { name, email, phone, address } = data;
  await pool.query(
    `UPDATE ${table} SET name=?, email=?, phone=?, address=? WHERE id=?`,
    [name, email, phone, address, id]
  );
  return { id, ...data };
};

exports.delete = async (id) => {
  await pool.query(`DELETE FROM ${table} WHERE id=?`, [id]);
  return { message: "Customer deleted" };
};

exports.getById = async (id) => {
  const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id=?`, [id]);
  return rows[0];
};