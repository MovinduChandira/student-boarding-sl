import { Navigate } from "react-router-dom";
import { homeFor } from "./roles.js";

export default function RequireRole({ role, children }) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={homeFor[user.role] || "/login"} replace />;
  return children;
}
