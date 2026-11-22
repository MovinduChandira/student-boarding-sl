
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

// ====================================
// SALHA'S EXISTING PROJECT PAGES
// ====================================

import { Home } from "./App.jsx";
import Login from "./Login.jsx";
import ResetPassword from "./ResetPassword.jsx";
import Register from "./Register.jsx";

import StudentHome from "./StudentHome.jsx";
import OwnerHome from "./OwnerHome.jsx";

import AdminDashboard from "./AdminDashboard.jsx";
import RequireRole from "./RequireRole.jsx";
import CreateListing from "./CreateListing.jsx";

// ====================================
// STUDENT FILTERS
// ====================================

import StudentFilters from "./StudentFilters.jsx";

// ====================================
// STUDENT AND OWNER PROFILE
// ====================================

import UserProfile from "./UserProfile.jsx";

// ====================================
// ADMIN LISTING APPROVALS - NEW MODULE
// ====================================

import ListingApprovals from "./ListingApprovals.jsx";

// ====================================
// APPLICATION ROUTES
// ====================================

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* ============================= */}
        {/* PUBLIC PAGES - SALHA'S CODE */}
        {/* ============================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ============================= */}
        {/* STUDENT HOME */}
        {/* ============================= */}

        <Route
          path="/student-home"
          element={
            <RequireRole role="student">
              <StudentHome />
            </RequireRole>
          }
        />

        {/* TEMPORARY STUDENT HOME TESTING */}
        <Route
          path="/test-student"
          element={<StudentHome />}
        />

        {/* ============================= */}
        {/* STUDENT FILTERS */}
        {/* ============================= */}

        <Route
          path="/student-filters"
          element={<StudentFilters />}
        />

        {/* ============================= */}
        {/* STUDENT PROFILE SUMMARY */}
        {/* ============================= */}

        <Route
          path="/student-profile"
          element={
            <RequireRole role="student">
              <UserProfile role="student" />
            </RequireRole>
          }
        />

        {/* TEMPORARY STUDENT PROFILE TESTING */}
        <Route
          path="/test-student-profile"
          element={<UserProfile role="student" />}
        />

        {/* ============================= */}
        {/* EDIT STUDENT PROFILE */}
        {/* ============================= */}

        <Route
          path="/student-profile/edit"
          element={
            <RequireRole role="student">
              <UserProfile
                role="student"
                editMode
              />
            </RequireRole>
          }
        />

        {/* TEMPORARY STUDENT EDIT TESTING */}
        <Route
          path="/test-student-profile/edit"
          element={
            <UserProfile
              role="student"
              editMode
            />
          }
        />

        {/* ============================= */}
        {/* OWNER HOME */}
        {/* ============================= */}

        <Route
          path="/owner-home"
          element={
            <RequireRole role="owner">
              <OwnerHome />
            </RequireRole>
          }
        />

        {/* TEMPORARY OWNER HOME TESTING */}
        <Route
          path="/test-owner"
          element={<OwnerHome />}
        />

        {/* ============================= */}
        {/* OWNER PROFILE SUMMARY */}
        {/* ============================= */}

        <Route
          path="/owner-profile"
          element={
            <RequireRole role="owner">
              <UserProfile role="owner" />
            </RequireRole>
          }
        />

        {/* TEMPORARY OWNER PROFILE TESTING */}
        <Route
          path="/test-owner-profile"
          element={<UserProfile role="owner" />}
        />

        {/* ============================= */}
        {/* EDIT OWNER PROFILE */}
        {/* ============================= */}

        <Route
          path="/owner-profile/edit"
          element={
            <RequireRole role="owner">
              <UserProfile
                role="owner"
                editMode
              />
            </RequireRole>
          }
        />

        {/* TEMPORARY OWNER EDIT TESTING */}
        <Route
          path="/test-owner-profile/edit"
          element={
            <UserProfile
              role="owner"
              editMode
            />
          }
        />

        {/* ============================= */}
        {/* ADMIN DASHBOARD */}
        {/* ============================= */}

        <Route
          path="/admin-dashboard"
          element={
            <RequireRole role="admin">
              <AdminDashboard />
            </RequireRole>
          }
        />

        {/* TEMPORARY ADMIN DASHBOARD TESTING */}
        <Route
          path="/test-admin-dashboard"
          element={<AdminDashboard />}
        />

        {/* ============================= */}
        {/* ADMIN LISTING APPROVALS */}
        {/* ============================= */}

        <Route
          path="/listing-approvals"
          element={
            <RequireRole role="admin">
              <ListingApprovals />
            </RequireRole>
          }
        />

        {/* TEMPORARY ADMIN APPROVALS TESTING */}
        <Route
          path="/test-listing-approvals"
          element={<ListingApprovals />}
        />

        {/* ============================= */}
        {/* CREATE LISTING - SALHA'S CODE */}
        {/* ============================= */}

        <Route
          path="/create-listing"
          element={
            <RequireRole role="owner">
              <CreateListing />
            </RequireRole>
          }
        />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
