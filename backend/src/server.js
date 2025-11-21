require("dotenv").config();
const http = require("http");
const app = require("./app");
const { logger } = require("./utils/logger");
const { pool } = require("./config/db");     // ✔️ FIXED: use pool
const bcrypt = require("bcryptjs");          // ✔️ FIXED: bcryptjs for compatibility

const PORT = process.env.PORT || 5000;

// =======================================================
// 🔥 Create Default Admin (only first time)
// =======================================================
async function createDefaultAdmin() {
  const email = "admin@example.com";
  const password = "admin123";  // ✔️ Default password

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
    console.error("❌ Error creating default admin:", err);
  }
}

// Run admin creation
createDefaultAdmin();

// =======================================================
// START SERVER
// =======================================================
const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  console.log(`Frontend allowed: http://localhost:5173`);
});
