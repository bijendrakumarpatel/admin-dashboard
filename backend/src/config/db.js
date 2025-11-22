const mysql = require("mysql2/promise");
const { logger } = require("../utils/logger");

// --- START: CORRECTED ENVIRONMENT VARIABLE USAGE ---

// Log the actual DB env values provided by Railway for debugging
// Note: We are using the standard Railway MySQL prefixes here: MYSQL_
logger.info("DB CONFIG (Reading from MYSQL_ variables):", {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

const pool = mysql.createPool({
  // Use environment variables provided by Railway for the MySQL service
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  
  // Ensure port is parsed as a number if it exists
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,

  connectionLimit: 10,

  // Required for Railway MySQL connections to work over their internal network
  ssl: {
    rejectUnauthorized: false,
  },
});
// --- END: CORRECTED ENVIRONMENT VARIABLE USAGE ---

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    logger.info("✅ MySQL connected successfully!");
    conn.release();
  } catch (err) {
    logger.error("❌ MySQL connection failed:", {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage,
    });
  }
}

testConnection();

module.exports = { pool };