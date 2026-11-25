import { useState } from "react";

import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  FiHome,
  FiBarChart2,
  FiHeart,
  FiInbox,
  FiUser,
  FiPower,
  FiList,
  FiStar,
  FiChevronsLeft,
  FiChevronDown,
  FiCheckSquare,
  FiUsers,
  FiShield,
} from "react-icons/fi";

import { Footer } from "./App.jsx";
import { authApi } from "./api.js";

// ====================================
// SIDEBAR MENUS
// ====================================

const menus = {

  // STUDENT SIDEBAR

  student: [
    {
      label: "Home",
      to: "/student-home",
      icon: FiHome,
    },
    {
      label: "Dashboard",
      to: "/student-dashboard",
      icon: FiBarChart2,
    },
    {
      label: "Favourites",
      to: "/favourites",
      icon: FiHeart,
    },
    {
      label: "Inbox",
      to: "/inbox",
      icon: FiInbox,
    },
    {
      label: "Profile",
      to: "/student-profile",
      icon: FiUser,
    },
  ],

  // OWNER SIDEBAR

  owner: [
    {
      label: "Home",
      to: "/owner-home",
      icon: FiHome,
    },
    {
      label: "Dashboard",
      to: "/owner-dashboard",
      icon: FiBarChart2,
    },
    {
      label: "My Listings",
      to: "/my-listings",
      icon: FiList,
    },
    {
      label: "Inbox",
      to: "/inbox",
      icon: FiInbox,
    },
    {
      label: "Reviews",
      to: "/reviews",
      icon: FiStar,
    },
    {
      label: "Profile",
      to: "/owner-profile",
      icon: FiUser,
    },
  ],

  // ADMIN SIDEBAR

  admin: [
    {
      label: "Home",
      to: "/",
      icon: FiHome,
    },
    {
      label: "Dashboard",
      to: "/admin-dashboard",
      icon: FiBarChart2,
    },
    {
      label: "Listing Approvals",
      to: "/listing-approvals",
      icon: FiCheckSquare,
    },

    // NEW OWNER VERIFICATION MODULE

    {
      label: "Owner Verification",
      to: "/owner-verification",
      icon: FiShield,
    },

    {
      label: "Users",
      to: "/users",
      icon: FiUsers,
    },
  ],
};

const roleLabels = {
  student: "Student",
  owner: "Owner",
  admin: "Admin",
};

// ====================================
// GET LOGGED-IN USER
// ====================================

function getUser() {
  try {
    return JSON.parse(
      localStorage.getItem("user")
    );
  } catch {
    return null;
  }
}

// ====================================
// DASHBOARD LAYOUT
// ====================================

export default function DashboardLayout({
  role,
  children,
}) {

  const navigate = useNavigate();

  const location = useLocation();

  const user = getUser();

  const roleLabel =
    roleLabels[role] || "User";

  const [collapsed, setCollapsed] = useState(
    () => window.innerWidth < 768
  );

  const [menuOpen, setMenuOpen] =
    useState(false);

  const showAvatar =
    role === "student" || role === "owner";

  const showTopBar = role !== "admin";

  // ====================================
  // DETECT TEMPORARY TESTING PAGES
  // ====================================

  const isTesting =
    location.pathname.startsWith("/test-");

  // ====================================
  // NAVIGATION PATHS
  // ====================================

  function getNavigationPath(path) {

    if (!isTesting) return path;

    // STUDENT TESTING ROUTES

    if (role === "student") {

      if (path === "/student-home") {
        return "/test-student";
      }

      if (path === "/student-profile") {
        return "/test-student-profile";
      }

      if (path === "/favourites") {
        return "/test-favourites";
      }

    }

    // OWNER TESTING ROUTES

    if (role === "owner") {

      if (path === "/owner-home") {
        return "/test-owner";
      }

      if (path === "/owner-profile") {
        return "/test-owner-profile";
      }

    }

    // ADMIN TESTING ROUTES

    if (role === "admin") {

      if (path === "/admin-dashboard") {
        return "/test-admin-dashboard";
      }

      if (path === "/listing-approvals") {
        return "/test-listing-approvals";
      }

      // NEW OWNER VERIFICATION TESTING ROUTE

      if (path === "/owner-verification") {
        return "/test-owner-verification";
      }

    }

    return path;
  }

  // ====================================
  // HIGHLIGHT ACTIVE SIDEBAR ITEM
  // ====================================

  function isMenuActive(path) {

    const actualPath =
      getNavigationPath(path);

    // HIGHLIGHT PROFILE SUMMARY AND EDIT

    if (path.endsWith("-profile")) {

      return (
        location.pathname === actualPath ||
        location.pathname.startsWith(
          actualPath + "/"
        )
      );

    }

    // HIGHLIGHT STUDENT FAVOURITES

    if (path === "/favourites") {

      return (
        location.pathname === "/favourites" ||
        location.pathname === "/test-favourites"
      );

    }

    // HIGHLIGHT ADMIN LISTING APPROVALS

    if (path === "/listing-approvals") {

      return (
        location.pathname === "/listing-approvals" ||
        location.pathname === "/test-listing-approvals"
      );

    }

    // HIGHLIGHT ADMIN DASHBOARD

    if (path === "/admin-dashboard") {

      return (
        location.pathname === "/admin-dashboard" ||
        location.pathname === "/test-admin-dashboard"
      );

    }

    // HIGHLIGHT NEW OWNER VERIFICATION PAGE

    if (path === "/owner-verification") {

      return (
        location.pathname === "/owner-verification" ||
        location.pathname === "/test-owner-verification"
      );

    }

    return location.pathname === actualPath;
  }

  // ====================================
  // LOGOUT
  // ====================================

  async function logout() {

    try {

      await authApi.logout();

    } catch {

      // Sign out locally if server cannot be reached

    }

    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });

  }

  const itemClass =
    "flex w-full items-center gap-4 px-6 py-4 text-left text-base font-semibold transition-colors";

  return (

    <div className="bg-linear-to-b from-[#0A4682] from-40% to-[#1B73C4] font-['Albert_Sans',sans-serif] text-white">

      <div className="flex">

        {/* ====================================
            SIDEBAR
        ==================================== */}

        <aside
          className={`flex shrink-0 flex-col bg-[#0A3F78] transition-[width] duration-300 ${
            collapsed
              ? "w-[72px]"
              : "w-60 lg:w-72"
          }`}
        >

          {/* LOGO */}

          <Link
            to="/"
            className={`block px-5 pb-6 pt-8 ${
              collapsed
                ? "invisible h-24"
                : ""
            }`}
          >

            <img
              src="/images/logo.png"
              alt="boarding.lk"
              className="h-auto w-[200px] object-contain"
            />

          </Link>

          {/* ====================================
              SIDEBAR MENU
          ==================================== */}

          <nav className="flex flex-col">

            {(menus[role] ?? []).map(
              ({ label, to, icon: Icon }) => {

                const navigationPath =
                  getNavigationPath(to);

                return (

                  <NavLink
                    key={label}
                    to={navigationPath}
                    end
                    title={label}
                    className={() =>
                      `${itemClass} ${
                        isMenuActive(to) && to !== "/"
                          ? "bg-[#1565B8] text-white"
                          : "text-[#D9D9D9] hover:bg-[#1565B8]/50"
                      }`
                    }
                  >

                    <Icon className="shrink-0 text-2xl text-[#F5C400]" />

                    {!collapsed && (
                      <span>{label}</span>
                    )}

                  </NavLink>

                );
              }
            )}

            {/* LOGOUT */}

            <button
              onClick={logout}
              title="Logout"
              className={`${itemClass} text-[#D9D9D9] hover:bg-[#1565B8]/50`}
            >

              <FiPower className="shrink-0 text-2xl text-[#F5C400]" />

              {!collapsed && (
                <span>Logout</span>
              )}

            </button>

          </nav>

          {/* ====================================
              COLLAPSE SIDEBAR
          ==================================== */}

          <div className="mt-auto border-t border-white/30 px-6 py-6 text-right">

            <button
              onClick={() =>
                setCollapsed(!collapsed)
              }
              aria-label={
                collapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              className="text-3xl text-white/80 hover:text-white"
            >

              <FiChevronsLeft
                className={`transition-transform ${
                  collapsed
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>

          </div>

        </aside>

        {/* ====================================
            MAIN CONTENT COLUMN
        ==================================== */}

        <div className="min-w-0 flex-1">

          {/* TOP BAR */}

          {showTopBar && (

            <div className="flex items-center justify-end gap-8 px-6 pt-8 md:px-12">

              <div className="relative">

                <button
                  onClick={() =>
                    setMenuOpen(!menuOpen)
                  }
                  aria-expanded={menuOpen}
                  className={`flex items-center gap-4 ${
                    showAvatar
                      ? ""
                      : "text-[#F5C400]"
                  }`}
                >

                  {showAvatar && (

                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5B800]">

                      <FiUser className="text-3xl text-white" />

                    </span>

                  )}

                  <span className="text-xl">

                    {roleLabel}

                  </span>

                  <FiChevronDown />

                </button>

                {/* DROPDOWN MENU */}

                {menuOpen && (

                  <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-lg bg-white text-black shadow-lg">

                    <p className="border-b px-4 py-3 text-sm font-semibold">

                      {user?.name || roleLabel}

                    </p>

                    {(role === "student" ||
                      role === "owner") && (

                      <button
                        onClick={() => {

                          setMenuOpen(false);

                          navigate(
                            getNavigationPath(
                              role === "student"
                                ? "/student-profile"
                                : "/owner-profile"
                            )
                          );

                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >

                        My Profile

                      </button>

                    )}

                    <button
                      onClick={logout}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >

                      Logout

                    </button>

                  </div>

                )}

              </div>

            </div>

          )}

          {/* ====================================
              PAGE CONTENT
          ==================================== */}

          <main className="px-6 pb-12 pt-6 md:px-12">

            {children}

          </main>

        </div>

      </div>

      {/* ====================================
          SALHA'S EXISTING FOOTER
      ==================================== */}

      <Footer />

    </div>

  );
}