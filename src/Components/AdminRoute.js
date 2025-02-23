import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");

  // Redirect to login if no role is found
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if the role is not "admin"
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Render children if the role is "admin"
  return children;
};

export default AdminRoute;
