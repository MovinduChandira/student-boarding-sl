
import { useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";
import { Link } from "react-router-dom";
import DashboardLayout from "./DashboardLayout.jsx";
import ListingCard from "./ListingCard.jsx";
import { allListings } from "./listingsData.js";

export default function StudentHome() {
  const [query, setQuery] = useState("");

  const results = allListings.filter((listing) =>
    `${listing.type} ${listing.place}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  return (
    <DashboardLayout role="student">
      <div className="flex flex-wrap gap-3">
        <label className="flex min-w-[200px] flex-1 items-center gap-3 rounded-lg bg-white px-4 py-3 text-black">
          <FiSearch size={22} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search listings..."
            className="w-full outline-none"
          />
        </label>

        <Link
          to="/student-filters"
          className="flex items-center gap-2 rounded-lg bg-[#2F7FD0] px-5 py-3 font-semibold text-white hover:bg-[#2569B0]"
        >
          <FiSliders />
          Filters
        </Link>
      </div>

      <h2 className="mb-6 mt-8 text-4xl font-bold text-[#E5B95C]">
        All Listings
      </h2>

      {results.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((listing) => (
            <ListingCard key={listing.id} item={listing} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
