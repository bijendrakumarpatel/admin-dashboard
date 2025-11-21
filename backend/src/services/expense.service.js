const { pool } = require("../config/db");
const { table } = require("../models/Expense");

exports.list = async () => {
  const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY expense_date DESC`);
  return rows;
};

exports.create = async (data) => {
  const { category, amount, description, expense_date } = data;
  const [result] = await pool.query(
    `INSERT INTO ${table} (category, amount, description, expense_date) VALUES (?, ?, ?, ?)`,
    [category, amount, description, expense_date || new Date()]
  );
  return { id: result.insertId, ...data };
};

exports.update = async (id, data) => {
  const { category, amount, description, expense_date } = data;
  await pool.query(
    `UPDATE ${table} SET category=?, amount=?, description=?, expense_date=? WHERE id=?`,
    [category, amount, description, expense_date, id]
  );
  return { id, ...data };
};

exports.delete = async (id) => {
  await pool.query(`DELETE FROM ${table} WHERE id=?`, [id]);
  return { message: "Expense deleted" };
};