const { pool } = require("../config/db");
const { table } = require("../models/Agreement");

exports.list = async () => {
  const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY start_date DESC`);
  return rows;
};

exports.create = async (data) => {
  const { customer_id, title, description, start_date, end_date, status } = data;
  const [result] = await pool.query(
    `INSERT INTO ${table} (customer_id, title, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)`,
    [customer_id, title, description, start_date, end_date, status || 'active']
  );
  return { id: result.insertId, ...data };
};

exports.update = async (id, data) => {
  const { title, description, start_date, end_date, status } = data;
  await pool.query(
    `UPDATE ${table} SET title=?, description=?, start_date=?, end_date=?, status=? WHERE id=?`,
    [title, description, start_date, end_date, status, id]
  );
  return { id, ...data };
};

exports.delete = async (id) => {
  await pool.query(`DELETE FROM ${table} WHERE id=?`, [id]);
  return { message: "Agreement deleted" };
};