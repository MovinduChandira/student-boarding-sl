import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import { Home } from "./App.jsx";
import Login from "./Login.jsx";
import ResetPassword from "./ResetPassword.jsx";
import Register from "./Register.jsx";
import StudentHome from "./StudentHome.jsx";
import OwnerHome from "./OwnerHome.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import RequireRole from "./RequireRole.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student-home" element={<RequireRole role="student"><StudentHome /></RequireRole>} />
        <Route path="/owner-home" element={<RequireRole role="owner"><OwnerHome /></RequireRole>} />
        <Route path="/admin-dashboard" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);