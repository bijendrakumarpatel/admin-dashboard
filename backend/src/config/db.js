const mysql = require("mysql2/promise");
const { logger } = require("../utils/logger");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

pool
  .getConnection()
  .then((conn) => {
    logger.info("✅ MySQL connected");
    conn.release();
  })
  .catch((err) => {
    logger.error("❌ MySQL connection error:", err.message);
  });

module.exports = { pool };
