// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, hasRole } = useAuth();

  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRoles && !allowedRoles.some((r) => hasRole(r))) {
    return <Navigate to="/unauthorized" replace />;
  }

  
  return children;
}
