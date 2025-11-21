const express = require("express");
const cors = require("./middlewares/cors.middleware");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/error.middleware");
const { notFoundHandler } = require("./middlewares/error.middleware");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const agreementRoutes = require("./routes/agreement.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const expenseRoutes = require("./routes/expense.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(cors);
app.use(express.json());
app.use(morgan("dev"));

// API prefix
const API_PREFIX = "/api";

// Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/customers`, customerRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/agreements`, agreementRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);
app.use(`${API_PREFIX}/expenses`, expenseRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);

// 404
app.use(notFoundHandler);
// Error handler
app.use(errorHandler);

module.exports = app;
