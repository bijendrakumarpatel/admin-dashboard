const { pool } = require("../config/db");
const { table } = require("../models/Order");

exports.list = async () => {
  const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY order_date DESC`);
  return rows;
};

exports.create = async (data) => {
  const { customer_id, total_amount, status, order_date } = data;
  const [result] = await pool.query(
    `INSERT INTO ${table} (customer_id, total_amount, status, order_date) VALUES (?, ?, ?, ?)`,
    [customer_id, total_amount, status || 'pending', order_date || new Date()]
  );
  return { id: result.insertId, ...data };
};

exports.update = async (id, data) => {
  const { status, total_amount } = data;
  await pool.query(
    `UPDATE ${table} SET status=?, total_amount=? WHERE id=?`,
    [status, total_amount, id]
  );
  return { id, ...data };
};

exports.delete = async (id) => {
  await pool.query(`DELETE FROM ${table} WHERE id=?`, [id]);
  return { message: "Order deleted" };
};