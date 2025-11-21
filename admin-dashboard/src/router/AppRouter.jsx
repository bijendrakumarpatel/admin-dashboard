import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// Auth Pages
import Login from "../pages/Auth/Login";
import OTPVerify from "../pages/Auth/OTPVerify";

// Admin Pages
import Dashboard from "../pages/Dashboard/Dashboard";
import Customers from "../pages/Customers/Customers";
import Products from "../pages/Products/Products";
import Agreements from "../pages/Agreements/Agreements";
import Orders from "../pages/Orders/Orders";
import Payments from "../pages/Payments/Payments";
import Expenses from "../pages/Expenses/Expenses";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";

export default function AppRouter() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/otp-verify" element={<OTPVerify />} />

      {/* ADMIN & PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <AdminRoute>
            <Customers />
          </AdminRoute>
        }
      />

      <Route
        path="/products"
        element={
          <AdminRoute>
            <Products />
          </AdminRoute>
        }
      />

      <Route
        path="/agreements"
        element={
          <AdminRoute>
            <Agreements />
          </AdminRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <AdminRoute>
            <Orders />
          </AdminRoute>
        }
      />

      <Route
        path="/payments"
        element={
          <AdminRoute>
            <Payments />
          </AdminRoute>
        }
      />

      <Route
        path="/expenses"
        element={
          <AdminRoute>
            <Expenses />
          </AdminRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <AdminRoute>
            <Reports />
          </AdminRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <AdminRoute>
            <Settings />
          </AdminRoute>
        }
      />

      {/* DEFAULT */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<h2>404 - Page Not Found</h2>} />
    </Routes>
  );
}
