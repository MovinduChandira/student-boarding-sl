import { useRef, useState } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout.jsx";
import ListingCard from "./ListingCard.jsx";
import { allListings, myListings } from "./listingsData.js";

export default function OwnerHome() {
  const [query, setQuery] = useState("");
  const scroller = useRef(null);
  const q = query.trim().toLowerCase();
  const match = (l) => `${l.type} ${l.place}`.toLowerCase().includes(q);
  const mine = myListings.filter(match);
  const all = allListings.filter(match);

  const scrollBy = (dir) => scroller.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  return (
    <DashboardLayout role="owner">
      <form onSubmit={(e) => e.preventDefault()} className="flex max-w-[900px] flex-wrap gap-4">
        <label className="flex min-w-[220px] flex-1 items-center gap-3 rounded-lg border border-black bg-white px-4 py-2.5">
          <FiSearch className="shrink-0 text-2xl text-black" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search my listing or general listings...."
            aria-label="Search listings"
            className="w-full text-lg text-gray-800 outline-none placeholder:text-gray-500"
          />
        </label>
        <button className="rounded-lg border border-[#1B73C4] bg-[#2F7FD0] px-8 py-2.5 text-lg font-bold text-white hover:bg-[#2569b0]">
          Search Listings
        </button>
      </form>

      {/* My Listings */}
      <div className="mb-5 mt-12 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-4xl font-bold text-[#E5B95C]">My Listings</h2>
        <div className="flex items-center gap-4">
          <button className="bg-[#2F7FD0] px-5 py-2 text-lg font-semibold text-white hover:bg-[#2569b0]">
            + Add New Listings
          </button>
          <button onClick={() => scrollBy(-1)} aria-label="Previous listings" className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D9D9D9] text-black hover:bg-white">
            <FiChevronLeft size={24} />
          </button>
          <button onClick={() => scrollBy(1)} aria-label="Next listings" className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D9D9D9] text-black hover:bg-white">
            <FiChevronRight size={24} />
          </button>
        </div>
      </div>

      {mine.length === 0 ? (
        <p className="text-lg">You have no listings matching this search.</p>
      ) : (
        <div ref={scroller} className="flex gap-6 overflow-x-auto pb-2">
          {mine.map((l) => <ListingCard key={l.id} item={l} variant="mine" />)}
        </div>
      )}

      {/* All Listings */}
      <h2 className="mb-6 mt-14 text-4xl font-bold text-[#E5B95C]">All Listings</h2>
      {all.length === 0 ? (
        <p className="text-lg">No listings match your search. Try a different location or room type.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {all.map((l) => <ListingCard key={l.id} item={l} />)}
        </div>
      )}
    </DashboardLayout>
  );
}
