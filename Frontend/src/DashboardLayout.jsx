import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiHome, FiBarChart2, FiHeart, FiInbox, FiUser, FiPower, FiList, FiStar,
  FiChevronsLeft, FiChevronDown, FiCheckSquare, FiUsers,
} from "react-icons/fi";
import { Footer } from "./App.jsx";
import { authApi } from "./api.js";

// Change the "to" paths when you build those pages.
const menus = {
  student: [
    { label: "Home", to: "/student-home", icon: FiHome },
    { label: "Dashboard", to: "/student-dashboard", icon: FiBarChart2 },
    { label: "Favourites", to: "/favourites", icon: FiHeart },
    { label: "Inbox", to: "/inbox", icon: FiInbox },
    { label: "Profile", to: "/profile", icon: FiUser },
  ],
  owner: [
    { label: "Home", to: "/owner-home", icon: FiHome },
    { label: "Dashboard", to: "/owner-dashboard", icon: FiBarChart2 },
    { label: "My Listings", to: "/my-listings", icon: FiList },
    { label: "Inbox", to: "/inbox", icon: FiInbox },
    { label: "Reviews", to: "/reviews", icon: FiStar },
    { label: "Profile", to: "/profile", icon: FiUser },
  ],
  admin: [
    { label: "Home", to: "/", icon: FiHome },
    { label: "Dashboard", to: "/admin-dashboard", icon: FiBarChart2 },
    { label: "Listing Approvals", to: "/listing-approvals", icon: FiCheckSquare },
    { label: "Users", to: "/users", icon: FiUsers },
  ],
};

const roleLabels = { student: "Student", owner: "Owner", admin: "Admin" };

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export default function DashboardLayout({ role, children }) {
  const navigate = useNavigate();
  const user = getUser();
  const roleLabel = roleLabels[role];
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);

  const showAvatar = role === "student" || role === "owner";
  const showTopBar = role !== "admin";

  async function logout() {
    try {
      await authApi.logout(); // clears the login cookie on the server
    } catch {
      // Even if the server can't be reached, sign out locally.
    }
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }
  const itemClass = "flex w-full items-center gap-4 px-6 py-4 text-left text-base font-semibold transition-colors";

  return (
    <div className="bg-linear-to-b from-[#0A4682] from-40% to-[#1B73C4] font-['Albert_Sans',sans-serif] text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`flex shrink-0 flex-col bg-[#0A3F78] transition-[width] duration-300 ${
            collapsed ? "w-[72px]" : "w-60 lg:w-72"
          }`}
        >
          <Link to="/" className={`block px-5 pb-6 pt-8 ${collapsed ? "invisible h-24" : ""}`}>
            <img src="/images/logo.png" alt="boarding.lk" className="h-auto w-[200px] object-contain" />
          </Link>

          <nav className="flex flex-col">
            {(menus[role] ?? []).map(({ label, to, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                end
                title={label}
                className={({ isActive }) =>
                  `${itemClass} ${isActive && to !== "/" ? "bg-[#1565B8] text-white" : "text-[#D9D9D9] hover:bg-[#1565B8]/50"}`
                }
              >
                <Icon className="shrink-0 text-2xl text-[#F5C400]" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
            <button onClick={logout} title="Logout" className={`${itemClass} text-[#D9D9D9] hover:bg-[#1565B8]/50`}>
              <FiPower className="shrink-0 text-2xl text-[#F5C400]" />
              {!collapsed && <span>Logout</span>}
            </button>
          </nav>

          <div className="mt-auto border-t border-white/30 px-6 py-6 text-right">
            <button
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="text-3xl text-white/80 hover:text-white"
            >
              <FiChevronsLeft className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
            </button>
          </div>
        </aside>

        {/* Main column */}
        <div className="min-w-0 flex-1">
          {showTopBar && (
            <div className="flex items-center justify-end gap-8 px-6 pt-8 md:px-12">
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-expanded={menuOpen}
                  className={`flex items-center gap-4 ${showAvatar ? "" : "text-[#F5C400]"}`}
                >
                  {showAvatar && (
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5B800]">
                      <FiUser className="text-3xl text-white" />
                    </span>
                  )}
                  <span className="text-xl">{roleLabel}</span>
                  <FiChevronDown />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-lg bg-white text-black shadow-lg">
                    <p className="border-b px-4 py-3 text-sm font-semibold">{user?.name || roleLabel}</p>
                    <button onClick={logout} className="block w-full px-4 py-2 text-left hover:bg-gray-100">Logout</button>
                  </div>
                )}
              </div>
            </div>
          )}

          <main className="px-6 pb-12 pt-6 md:px-12">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
