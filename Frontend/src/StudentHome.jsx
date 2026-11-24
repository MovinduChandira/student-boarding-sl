import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout.jsx";
import ListingCard from "./ListingCard.jsx";
import { allListings } from "./listingsData.js";

export default function StudentHome() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = allListings.filter((l) => `${l.type} ${l.place}`.toLowerCase().includes(q));

  return (
    <DashboardLayout role="student">
      <form onSubmit={(e) => e.preventDefault()} className="flex max-w-[900px] flex-wrap gap-4">
        <label className="flex min-w-[220px] flex-1 items-center gap-3 rounded-lg border border-black bg-white px-4 py-2.5">
          <FiSearch className="shrink-0 text-2xl text-black" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search listings...."
            aria-label="Search listings"
            className="w-full text-lg text-gray-800 outline-none placeholder:text-gray-500"
          />
        </label>
        <button className="rounded-lg border border-[#1B73C4] bg-[#2F7FD0] px-8 py-2.5 text-lg font-bold text-white hover:bg-[#2569b0]">
          Search Listings
        </button>
      </form>

      <h2 className="mb-6 mt-10 text-4xl font-bold text-[#E5B95C]">All Listings</h2>

      {results.length === 0 ? (
        <p className="text-lg">No listings match your search. Try a different location or room type.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((l) => <ListingCard key={l.id} item={l} />)}
        </div>
      )}
    </DashboardLayout>
  );
}
