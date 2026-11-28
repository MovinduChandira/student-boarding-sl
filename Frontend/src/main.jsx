import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import StudentFilters from "./StudentFilters.jsx";
import UserProfile from "./UserProfile.jsx";
import ListingApprovals from "./ListingApprovals.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student-home" element={<RequireRole role="student"><StudentHome /></RequireRole>} />
        <Route path="/test-student" element={<StudentHome />} />
        <Route path="/student-filters" element={<StudentFilters />} />
        <Route path="/student-profile" element={<RequireRole role="student"><UserProfile role="student" /></RequireRole>} />
        <Route path="/test-student-profile" element={<UserProfile role="student" />} />
        <Route path="/student-profile/edit" element={<RequireRole role="student"><UserProfile role="student" editMode /></RequireRole>} />
        <Route path="/test-student-profile/edit" element={<UserProfile role="student" editMode />} />

        <Route path="/owner-home" element={<RequireRole role="owner"><OwnerHome /></RequireRole>} />
        <Route path="/test-owner" element={<OwnerHome />} />
        <Route path="/owner-profile" element={<RequireRole role="owner"><UserProfile role="owner" /></RequireRole>} />
        <Route path="/test-owner-profile" element={<UserProfile role="owner" />} />
        <Route path="/owner-profile/edit" element={<RequireRole role="owner"><UserProfile role="owner" editMode /></RequireRole>} />
        <Route path="/test-owner-profile/edit" element={<UserProfile role="owner" editMode />} />
        <Route path="/favourites" element={<RequireRole role="student"><StudentFavourites /></RequireRole>} />
        <Route path="/test-favourites" element={<StudentFavourites />} />
        <Route path="/boarding-details/:id" element={<RequireRole role="student"><BoardingDetails /></RequireRole>} />
        <Route path="/test-boarding-details/:id" element={<BoardingDetails />} />
        <Route path="/listing-approvals" element={<RequireRole role="admin"><ListingApprovals /></RequireRole>} />
        <Route path="/test-listing-approvals" element={<ListingApprovals />} />
        <Route path="/owner-verification" element={<RequireRole role="admin"><OwnerVerification /></RequireRole>} />
        <Route path="/test-owner-verification" element={<OwnerVerification />} />
        <Route path="/create-listing" element={<RequireRole role="owner"><CreateListing /></RequireRole>} />
        <Route path="/edit-listing/:id" element={<RequireRole role="owner"><CreateListing /></RequireRole>} />
        <Route path="/my-listings" element={<RequireRole role="owner"><MyListings /></RequireRole>} />

        <Route path="/admin-dashboard" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
        <Route path="/test-admin-dashboard" element={<AdminDashboard />} />
        <Route path="/listing-approvals" element={<RequireRole role="admin"><ListingApprovals /></RequireRole>} />
        <Route path="/test-listing-approvals" element={<ListingApprovals />} />
        <Route path="/create-listing" element={<RequireRole role="owner"><CreateListing /></RequireRole>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
