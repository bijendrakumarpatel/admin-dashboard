const { pool } = require("../config/db");
const { table } = require("../models/Product");

exports.list = async () => {
  const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY created_at DESC`);
  return rows;
};

exports.create = async (data) => {
  const { name, sku, price, stock, category } = data;
  const [result] = await pool.query(
    `INSERT INTO ${table} (name, sku, price, stock, category) VALUES (?, ?, ?, ?, ?)`,
    [name, sku, price, stock, category]
  );
  return { id: result.insertId, ...data };
};

exports.update = async (id, data) => {
  const { name, sku, price, stock, category } = data;
  await pool.query(
    `UPDATE ${table} SET name=?, sku=?, price=?, stock=?, category=? WHERE id=?`,
    [name, sku, price, stock, category, id]
  );
  return { id, ...data };
};

exports.delete = async (id) => {
  await pool.query(`DELETE FROM ${table} WHERE id=?`, [id]);
  return { message: "Product deleted" };
};