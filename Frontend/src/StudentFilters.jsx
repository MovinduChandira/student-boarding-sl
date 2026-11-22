
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiWifi, FiArrowLeft } from "react-icons/fi";
import SearchFilters from "./SearchFilters.jsx";
import { allListings } from "./listingsData.js";
import { Footer } from "./App.jsx";

const initialFilters = {
  distance: 10,
  roomTypes: [],
  genders: [],
  maxRent: 20000,
  facilities: [],
};

export default function StudentFilters() {
  const [filters, setFilters] = useState(initialFilters);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const getPrice = (listing) =>
    Number(String(listing.price).replace(/[^0-9]/g, ""));

  const results = allListings
    .filter((listing) => {
      const matchesSearch =
        `${listing.type} ${listing.place}`
          .toLowerCase()
          .includes(query.trim().toLowerCase());

      const matchesRoom =
        filters.roomTypes.length === 0 ||
        filters.roomTypes.includes(listing.type);

      const matchesRent =
        getPrice(listing) <= filters.maxRent;

      // Missing metadata must not be treated as a match.
      const matchesDistance =
        typeof listing.distanceKm === "number" &&
        listing.distanceKm <= filters.distance;

      const matchesGender =
        filters.genders.length === 0 ||
        (Array.isArray(listing.genders) &&
          filters.genders.some((gender) =>
            listing.genders.includes(gender)
          ));

      const matchesFacilities =
        filters.facilities.length === 0 ||
        (Array.isArray(listing.facilities) &&
          filters.facilities.every((facility) =>
            listing.facilities.includes(facility)
          ));

      return (
        matchesSearch &&
        matchesRoom &&
        matchesRent &&
        matchesDistance &&
        matchesGender &&
        matchesFacilities
      );
    })
    .sort((a, b) => {
      if (sortBy === "low") return getPrice(a) - getPrice(b);
      if (sortBy === "high") return getPrice(b) - getPrice(a);
      if (sortBy === "nearest")
        return a.distanceKm - b.distanceKm;
      return 0;
    });

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0A4682] to-[#1B73C4] font-['Albert_Sans',sans-serif] text-white">
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">

        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center gap-5 rounded-full border border-white/40 bg-[#104D87] px-5 py-3">
          <Link to="/test-student">
            <img
              src="/images/logo.png"
              alt="Boarding.lk"
              className="w-36 object-contain"
            />
          </Link>

          <label className="flex min-w-[200px] flex-1 items-center gap-3 rounded-full bg-white px-4 py-2 text-gray-800">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by university or location"
              className="w-full outline-none"
            />
            <FiSearch />
          </label>
        </header>

        {/* Title and sorting */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-[#E5B95C]">
            Filters
          </h1>

          <label className="flex items-center gap-3">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded bg-white px-4 py-2 text-gray-800"
            >
              <option value="recommended">Recommended</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="nearest">Nearest First</option>
            </select>
          </label>
        </div>

        {/* Main content */}
        <div className="grid items-start gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
          <SearchFilters
            filters={filters}
            setFilters={setFilters}
          />

          <section className="min-w-0 space-y-4">
            <p className="text-sm text-white/80">
              {results.length} boarding listings found
            </p>

            {results.length === 0 && (
              <div className="rounded-lg bg-[#3886C8] p-6">
                No listings match your selected filters.
                Try clearing some filters.
              </div>
            )}

            {results.map((listing) => (
              <article
                key={listing.id}
                className="flex flex-col gap-4 rounded-md bg-[#3886C8] p-4 sm:flex-row"
              >
                <img
                  src={listing.img}
                  alt={listing.type}
                  className="h-40 w-full rounded object-cover sm:h-36 sm:w-40"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold">
                    {listing.title || listing.type}
                  </h3>

                  <p className="mt-2 font-semibold text-[#F5C400]">
                    {listing.price}
                  </p>

                  <p className="mt-1 text-sm">
                    {listing.place}
                  </p>

                  <p className="mt-1 text-sm">
                    {listing.distanceKm} km from university
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    {(listing.facilities || []).map((facility) => (
                      <span
                        key={facility}
                        className="flex items-center gap-1"
                      >
                        {facility === "Wi-Fi" && <FiWifi />}
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            to="/test-student"
            className="inline-flex items-center gap-2 rounded bg-[#64A8E1] px-6 py-3 font-semibold text-white hover:bg-[#3886C8]"
          >
            <FiArrowLeft />
            Back to Home
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
