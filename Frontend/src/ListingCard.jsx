import { useState } from "react";
import { FiHeart, FiMapPin } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import {
  useFavourites,
  toggleFavourite,
} from "./favouritesStorage.js";

const badgeStyles = {
  Active: "border-[#4CAF50] bg-[#C8F0C8] text-[#1B7A1B]",
  Approved: "border-[#4CAF50] bg-[#C8F0C8] text-[#1B7A1B]",
  Pending: "border-[#E08A00] bg-[#FFF3CD] text-[#856404]",
  Occupied: "border-[#E08A00] bg-[#F5A524] text-white",
  Featured: "border-[#C98A4B] bg-[#F7D9B8] text-[#7A4A12]",
  Inactive: "border-black bg-[#D9D9D9] text-black",
  Rejected: "border-[#dc3545] bg-[#F8D7DA] text-[#721c24]", 
};

/* variant "browse": heart + View Details (student and owner "All Listings")
   variant "mine":   status badge + Edit (owner "My Listings") */
export default function ListingCard({ item, variant = "browse" }) {
  const [liked, setLiked] = useState(false);
  const mine = variant === "mine";
  const picture = item.img || item.image;

  // Picture, or a grey box for listings saved without images
  const image = picture ? (
    <img
      src={picture}
      alt={item.type}
      className={`h-[190px] w-full object-cover ${
        student && !mine ? "transition-opacity hover:opacity-90" : ""
      }`}
    />
  ) : (
    <div className="flex h-[190px] w-full items-center justify-center bg-gray-300 text-gray-500">
      No image
    </div>
  );

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-3xl bg-[#D9D9D9] text-black ${
        mine ? "w-[250px] shrink-0" : "w-full"
      }`}
    >
      {mine && (
        <span
          className={`absolute left-2 top-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            badgeStyles[item.status] ?? badgeStyles.Inactive
          }`}
        >
          {item.status}
        </span>
      )}

      {/* BOARDING IMAGE */}

      {student && !mine ? (
        <Link to={detailsPath}>{image}</Link>
      ) : (
        image
      )}

      <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
        {mine ? (
          <>
            <h3 className="text-xl font-bold">
              {item.type}
            </h3>

            <p className="mt-1 text-lg font-semibold">
              {item.price}
            </p>

            <p className="mb-4 mt-1 flex items-start gap-1.5 text-sm text-gray-500">
              <FiMapPin className="mt-0.5 shrink-0" size={16} />
              <span>{item.place}</span>
            </p>

            {/* EDIT LISTING */}

            <Link
              to={`/edit-listing/${item.id}`}
              className="mt-auto block w-full bg-[#2F7FD0] py-2.5 text-center text-lg font-semibold text-white hover:bg-[#2569b0]"
            >
              Edit
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold">{item.type}</h3>
                <p className="mt-1 flex items-start gap-1.5 text-sm text-gray-500">
                  <FiMapPin className="mt-0.5 shrink-0" size={16} />
                  <span>{item.place}</span>
                </p>
              </div>
              <button
                onClick={() => setLiked(!liked)}
                aria-pressed={liked}
                aria-label="Save listing"
                className="mt-1 shrink-0"
              >
                <FiHeart size={26} className={liked ? "fill-[#e11d48] text-[#e11d48]" : "text-black"} />
              </button>
            </div>
            <p className="mb-4 mt-4 text-xl font-semibold">{item.price}</p>
            <button className="mx-auto mt-auto w-[85%] rounded-full bg-[#3A86D8] py-2.5 text-lg font-semibold text-white hover:bg-[#2f74c0]">
              View Details
            </button>
          </>
        )}
      </div>
    </article>
  );
}
