import { useEffect, useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";

import {
  Link,
  useLocation,
} from "react-router-dom";

import DashboardLayout from "./DashboardLayout.jsx";
import ListingCard from "./ListingCard.jsx";
import { allListings } from "./listingsData.js";
import { listingsApi } from "./api.js";

export default function StudentHome() {
  const [query, setQuery] = useState("");
  const [listings, setListings] = useState(allListings);

  useEffect(() => {
    listingsApi
      .getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setListings(data);
      })
      .catch(() => {});
  }, []);

  const location = useLocation();
  const isTesting = location.pathname.startsWith("/test-");
  const filtersPath = isTesting ? "/test-student-filters" : "/student-filters";

  const results = listings.filter((listing) =>
    `${listing.title || ""} ${listing.type || ""} ${listing.place || ""}`

      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  return (
    <DashboardLayout role="student">

      {/* SEARCH BAR */}

      <div className="flex flex-wrap gap-3">

        <label className="flex min-w-[200px] flex-1 items-center gap-3 rounded-lg bg-white px-4 py-3 text-black">

          <FiSearch size={22} />

          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search listings..."
            className="w-full outline-none"
          />

        </label>

        <Link
          to={filtersPath}
          className="flex items-center gap-2 rounded-lg bg-[#2F7FD0] px-5 py-3 font-semibold text-white hover:bg-[#2569B0]"
        >

          <FiSliders />

          Filters

        </Link>

      </div>

      {/* ALL LISTINGS */}

      <h2 className="mb-6 mt-8 text-4xl font-bold text-[#E5B95C]">
        All Listings
      </h2>

      {results.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {results.map((listing) => (
            <ListingCard
              key={listing.id}
              item={listing}
              student
            />
          ))}

        </div>
      )}

    </DashboardLayout>
  );
}