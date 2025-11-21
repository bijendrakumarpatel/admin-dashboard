import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth();

  // Step 1: NOT LOGGED IN
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Step 2: NOT ADMIN
  if (user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // Step 3: VALID ADMIN
  return children;
}
