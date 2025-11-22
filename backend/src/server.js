const mysql = require("mysql2/promise"); // Added this line back for type checking/utility in setupDatabase
require("dotenv").config();
const http = require("http");
const app = require("./app");
const { logger } = require("./utils/logger");
const { pool } = require("./config/db"); 
const bcrypt = require("bcryptjs"); // For hashing
const fs = require('fs/promises'); // New: To read schema.sql
const path = require('path');     // New: To resolve file path

const PORT = process.env.PORT || 5000;

// =======================================================
// 1. Create Default Admin (Moved and modified)
// =======================================================
async function createDefaultAdmin() {
  const email = "admin@example.com";
  const password = "admin123";

  try {
    // Check if admin already exists
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length > 0) {
      console.log("⭐ Default admin already exists.");
      return;
    }

    // Hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // Insert admin
    await pool.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Super Admin", email, hashedPass, "admin"]
    );

    console.log("🔥 Default Admin Created Successfully!");
    console.log("➡️  Email: admin@example.com");
    console.log("➡️  Password: admin123");

  } catch (err) {
    // This catch block is kept for safety, but migration should prevent ER_NO_SUCH_TABLE
    console.error("❌ Error creating default admin (after schema migration):", err.message);
  }
}

// =======================================================
// 2. Database Setup (Schema Migration)
// =======================================================
async function setupDatabase() {
    try {
        // Confirm connection is active
        await pool.getConnection().then(conn => conn.release());
        logger.info("Database connection is confirmed active.");

        // Read and Execute Schema.sql (CREATE TABLES)
        logger.info("Attempting to run database schema setup...");
        
        // Path adjusted to look in the /src/database directory
        const schemaPath = path.join(__dirname, 'database/schema.sql');
        const schemaSql = await fs.readFile(schemaPath, 'utf8');

        // Execute multiple statements for schema creation
        // We use mysql2's method to allow multiple statements if your pool is configured for it
        await pool.query(schemaSql, { multipleStatements: true });
        logger.info("✅ Database schema (tables) created successfully.");
        
        // 3. Create default admin ONLY after tables are confirmed to be created
        await createDefaultAdmin();

    } catch (err) {
        // Handle common errors like: Tables already exist (code 1050) or Connection failed
        if (err.code === 'ER_TABLE_EXISTS_ERROR') {
             logger.warn("Database schema already exists, skipping table creation.");
             // Run admin creation even if migration is skipped
             await createDefaultAdmin(); 
        } else if (err.code === 'ECONNREFUSED') {
             logger.error("❌ Database setup skipped: Connection failed due to missing variables.");
        } else {
             logger.error("❌ Database setup failed unexpectedly:", { message: err.message, code: err.code });
        }
    }
}


// =======================================================
// 3. START SERVER (Now calling setupDatabase inside the listen callback)
// =======================================================
const server = http.createServer(app);

server.listen(PORT, async () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  console.log(`Frontend allowed: http://localhost:5173`);
  
  // 🔥 Run the full database setup when the server is listening
  await setupDatabase();
});

// We removed the old global call to createDefaultAdmin()