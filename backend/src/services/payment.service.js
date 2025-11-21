const { pool } = require("../config/db");
const { table } = require("../models/Payment");

exports.list = async () => {
  const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY payment_date DESC`);
  return rows;
};

exports.create = async (data) => {
  const { order_id, amount, method, status } = data;
  const [result] = await pool.query(
    `INSERT INTO ${table} (order_id, amount, method, status, payment_date) VALUES (?, ?, ?, ?, NOW())`,
    [order_id, amount, method, status || 'completed']
  );
  return { id: result.insertId, ...data };
};

exports.delete = async (id) => {
  await pool.query(`DELETE FROM ${table} WHERE id=?`, [id]);
  return { message: "Payment record deleted" };
};