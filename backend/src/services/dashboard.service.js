const { pool } = require("../config/db");

// Import all tables to count data
const { table: customerTable } = require("../models/Customer");
const { table: productTable } = require("../models/Product");
const { table: orderTable } = require("../models/Order");
const { table: paymentTable } = require("../models/Payment");
const { table: expenseTable } = require("../models/Expense");

exports.summary = async () => {
  // Run queries in parallel for performance
  const [
    [customers],
    [products],
    [orders],
    [payments],
    [expenses]
  ] = await Promise.all([
    pool.query(`SELECT COUNT(*) as count FROM ${customerTable}`),
    pool.query(`SELECT COUNT(*) as count FROM ${productTable}`),
    pool.query(`SELECT COUNT(*) as count FROM ${orderTable}`),
    pool.query(`SELECT SUM(amount) as total FROM ${paymentTable}`),
    pool.query(`SELECT SUM(amount) as total FROM ${expenseTable}`)
  ]);

  return {
    totalCustomers: customers[0].count || 0,
    totalProducts: products[0].count || 0,
    totalOrders: orders[0].count || 0,
    totalRevenue: payments[0].total || 0,
    totalExpenses: expenses[0].total || 0,
    netProfit: (payments[0].total || 0) - (expenses[0].total || 0)
  };
};