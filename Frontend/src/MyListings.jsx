import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout.jsx";
import { getOwnerListings, saveListing, deleteListing } from "./listingsStore.js";

const badgeStyles = {
  Active: "border-[#4CAF50] bg-[#C8F0C8] text-[#1B7A1B]",
  Occupied: "border-[#E08A00] bg-[#F5A524] text-white",
  Featured: "border-[#C98A4B] bg-[#F7D9B8] text-[#7A4A12]",
  Inactive: "border-black bg-[#F7D9B8] text-black",
};

// "Rs. 15,000/ month" -> "15,000"
const plainPrice = (price = "") => price.replace(/Rs\.?\s*/i, "").replace(/\/.*$/, "").trim();

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function MyListings() {
  const navigate = useNavigate();
  const [list, setList] = useState(getOwnerListings());
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const q = query.trim().toLowerCase();
  const rows = list.filter((l) =>
    `${l.title ?? ""} ${l.type ?? ""} ${l.place ?? ""} ${l.status ?? ""}`.toLowerCase().includes(q)
  );

  function refresh() {
    setList(getOwnerListings());
  }

  function handleAction(item, action) {
    setError("");
    if (action === "edit") {
      navigate(`/edit-listing/${item.id}`);
      return;
    }
    if (action === "delete") {
      if (!window.confirm(`Delete "${item.title || item.type}"? This cannot be undone.`)) return;
      deleteListing(item.id);
      refresh();
      return;
    }
    // Active / Inactive / Occupied
    const ok = saveListing({ ...item, status: action });
    if (!ok) setError("Could not update the listing.");
    refresh();
  }

  return (
    <DashboardLayout role="owner">
      <h1 className="text-4xl font-bold text-[#E5B95C]">My Listings</h1>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/create-listing"
          className="inline-block bg-[#2F7FD0] px-5 py-2.5 text-lg font-semibold text-white hover:bg-[#2569b0]"
        >
          + Add New Listings
        </Link>

        <label className="flex w-full max-w-[420px] items-center gap-3 rounded-xl border border-black bg-white px-4 py-2.5">
          <FiSearch className="shrink-0 text-2xl text-black" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search my listings"
            className="w-full text-lg text-gray-800 outline-none placeholder:text-gray-500"
          />
        </label>
      </div>

      {error && <p role="alert" className="mt-4 font-semibold text-[#E5B95C]">{error}</p>}

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left">
          <thead>
            <tr className="bg-[#B3AFAF] text-lg font-bold text-[#2F7FD0]">
              <th className="rounded-l-xl border-y border-l border-black px-5 py-4">Property ID</th>
              <th className="border-y border-black px-3 py-4">Listing Title</th>
              <th className="border-y border-black px-3 py-4">Status</th>
              <th className="border-y border-black px-3 py-4">Price(Rs.)</th>
              <th className="border-y border-black px-3 py-4">Date Created</th>
              <th className="rounded-r-xl border-y border-r border-black px-3 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => {
              const picture = l.img || l.image;
              return (
                <tr key={l.id} className="text-lg">
                  <td className="border-b border-white/70 px-5 py-5 font-bold text-black">
                    {l.code ?? `#R${101 + list.indexOf(l)}`}
                  </td>
                  <td className="border-b border-white/70 px-3 py-5">
                    <div className="flex items-center gap-4">
                      {picture ? (
                        <img src={picture} alt={l.type} className="h-[90px] w-[110px] shrink-0 object-cover" />
                      ) : (
                        <div className="flex h-[90px] w-[110px] shrink-0 items-center justify-center bg-gray-300 text-sm text-gray-600">
                          No image
                        </div>
                      )}
                      <span className="max-w-[120px]">{l.title || l.type}</span>
                    </div>
                  </td>
                  <td className="border-b border-white/70 px-3 py-5">
                    <span className={`inline-block rounded-full border px-4 py-0.5 text-sm font-semibold ${badgeStyles[l.status] ?? badgeStyles.Inactive}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="border-b border-white/70 px-3 py-5">{plainPrice(l.price)}</td>
                  <td className="border-b border-white/70 px-3 py-5">{formatDate(l.createdAt)}</td>
                  <td className="border-b border-white/70 px-3 py-5">
                    <select
                      aria-label={`Actions for ${l.title || l.type}`}
                      value=""
                      onChange={(e) => handleAction(l, e.target.value)}
                      className="w-36 rounded-lg border border-black bg-white px-3 py-2.5 text-lg text-black"
                    >
                      <option value="" disabled>Actions</option>
                      <option value="edit">Edit</option>
                      {l.status !== "Active" && <option value="Active">Set Active</option>}
                      {l.status !== "Inactive" && <option value="Inactive">Set Inactive</option>}
                      {l.status !== "Occupied" && <option value="Occupied">Mark Occupied</option>}
                      <option value="delete">Delete</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {rows.length === 0 && (
          <p className="mt-6 text-lg">
            {list.length === 0 ? "You have no listings yet." : "No listings match your search."}
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
