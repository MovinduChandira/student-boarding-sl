import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

// SALHA'S EXISTING PROJECT PAGES

import { Home } from "./App.jsx";
import Login from "./Login.jsx";
import ResetPassword from "./ResetPassword.jsx";
import Register from "./Register.jsx";

import StudentHome from "./StudentHome.jsx";
import OwnerHome from "./OwnerHome.jsx";

import AdminDashboard from "./AdminDashboard.jsx";
import RequireRole from "./RequireRole.jsx";
import CreateListing from "./CreateListing.jsx";

// STUDENT FILTERS

import StudentFilters from "./StudentFilters.jsx";

// STUDENT AND OWNER PROFILE

import UserProfile from "./UserProfile.jsx";

// ADMIN LISTING APPROVALS

import ListingApprovals from "./ListingApprovals.jsx";

// STUDENT FAVOURITES AND BOARDING DETAILS

import StudentFavourites from "./StudentFavourites.jsx";
import BoardingDetails from "./BoardingDetails.jsx";

// NEW ADMIN OWNER VERIFICATION MODULE

import OwnerVerification from "./OwnerVerification.jsx";

// ====================================
// APPLICATION ROUTES
// ====================================

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <BrowserRouter>

      <Routes>

        {/* PUBLIC PAGES */}

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

        {/* STUDENT HOME */}

        <Route
          path="/student-home"
          element={
            <RequireRole role="student">
              <StudentHome />
            </RequireRole>
          }
        />

        <Route
          path="/test-student"
          element={<StudentHome />}
        />

        {/* STUDENT FILTERS */}

        <Route
          path="/student-filters"
          element={<StudentFilters />}
        />

        <Route
          path="/test-student-filters"
          element={<StudentFilters />}
        />

        {/* STUDENT PROFILE */}

        <Route
          path="/student-profile"
          element={
            <RequireRole role="student">
              <UserProfile role="student" />
            </RequireRole>
          }
        />

        <Route
          path="/test-student-profile"
          element={
            <UserProfile role="student" />
          }
        />

        {/* EDIT STUDENT PROFILE */}

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

        <Route
          path="/test-student-profile/edit"
          element={
            <UserProfile
              role="student"
              editMode
            />
          }
        />

        {/* STUDENT FAVOURITES */}

        <Route
          path="/favourites"
          element={
            <RequireRole role="student">
              <StudentFavourites />
            </RequireRole>
          }
        />

        <Route
          path="/test-favourites"
          element={<StudentFavourites />}
        />

        {/* BOARDING DETAILS */}

        <Route
          path="/boarding-details/:id"
          element={
            <RequireRole role="student">
              <BoardingDetails />
            </RequireRole>
          }
        />

        <Route
          path="/test-boarding-details/:id"
          element={<BoardingDetails />}
        />

        {/* OWNER HOME */}

        <Route
          path="/owner-home"
          element={
            <RequireRole role="owner">
              <OwnerHome />
            </RequireRole>
          }
        />

        <Route
          path="/test-owner"
          element={<OwnerHome />}
        />

        {/* OWNER PROFILE */}

        <Route
          path="/owner-profile"
          element={
            <RequireRole role="owner">
              <UserProfile role="owner" />
            </RequireRole>
          }
        />

        <Route
          path="/test-owner-profile"
          element={
            <UserProfile role="owner" />
          }
        />

        {/* EDIT OWNER PROFILE */}

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

        <Route
          path="/test-owner-profile/edit"
          element={
            <UserProfile
              role="owner"
              editMode
            />
          }
        />

        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin-dashboard"
          element={
            <RequireRole role="admin">
              <AdminDashboard />
            </RequireRole>
          }
        />

        <Route
          path="/test-admin-dashboard"
          element={<AdminDashboard />}
        />

        {/* ADMIN LISTING APPROVALS */}

        <Route
          path="/listing-approvals"
          element={
            <RequireRole role="admin">
              <ListingApprovals />
            </RequireRole>
          }
        />

        <Route
          path="/test-listing-approvals"
          element={<ListingApprovals />}
        />

        {/* ==================================== */}
        {/* NEW ADMIN OWNER VERIFICATION MODULE */}
        {/* ==================================== */}

        <Route
          path="/owner-verification"
          element={
            <RequireRole role="admin">
              <OwnerVerification />
            </RequireRole>
          }
        />

        {/* TEMPORARY OWNER VERIFICATION TESTING */}

        <Route
          path="/test-owner-verification"
          element={<OwnerVerification />}
        />

        {/* CREATE LISTING - SALHA'S CODE */}

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