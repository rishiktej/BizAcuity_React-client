import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token; // true if token exists

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
