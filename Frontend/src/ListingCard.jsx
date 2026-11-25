import { useState } from "react";
import { FiHeart, FiMapPin } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

import {
  useFavourites,
  toggleFavourite,
} from "./favouritesStorage.js";

const badgeStyles = {
  Active:
    "border-[#4CAF50] bg-[#C8F0C8] text-[#1B7A1B]",

  Occupied:
    "border-[#E08A00] bg-[#F5A524] text-white",

  Featured:
    "border-[#C98A4B] bg-[#F7D9B8] text-[#7A4A12]",

  Inactive:
    "border-black bg-[#D9D9D9] text-black",
};

export default function ListingCard({
  item,
  variant = "browse",
  student = false,
}) {
  const [ownerLiked, setOwnerLiked] = useState(false);

  const favourites = useFavourites();

  const location = useLocation();

  const mine = variant === "mine";

  const liked = student
    ? favourites.includes(item.id)
    : ownerLiked;

  const isTesting =
    location.pathname.startsWith("/test-");

  const detailsPath = isTesting
    ? `/test-boarding-details/${item.id}`
    : `/boarding-details/${item.id}`;

  function handleFavourite() {
    if (student) {
      toggleFavourite(item.id);
    } else {
      setOwnerLiked((previous) => !previous);
    }
  }

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-3xl bg-[#D9D9D9] text-black ${
        mine
          ? "w-[250px] shrink-0"
          : "w-full"
      }`}
    >

      {/* OWNER STATUS BADGE */}

      {mine && (
        <span
          className={`absolute left-2 top-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            badgeStyles[item.status]
          }`}
        >
          {item.status}
        </span>
      )}

      {/* BOARDING IMAGE */}

      {student && !mine ? (
        <Link to={detailsPath}>
          <img
            src={item.img}
            alt={item.type}
            className="h-[190px] w-full object-cover transition-opacity hover:opacity-90"
          />
        </Link>
      ) : (
        <img
          src={item.img}
          alt={item.type}
          className="h-[190px] w-full object-cover"
        />
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

            <p className="mt-1 flex items-start gap-1.5 text-sm text-gray-500">

              <FiMapPin
                className="mt-0.5 shrink-0"
                size={16}
              />

              <span>{item.place}</span>

            </p>

            <button className="mt-auto w-full bg-[#2F7FD0] py-2.5 text-lg font-semibold text-white hover:bg-[#2569b0]">
              Edit
            </button>

          </>
        ) : (
          <>

            <div className="flex items-start justify-between gap-2">

              <div>

                {student ? (
                  <Link
                    to={detailsPath}
                    className="text-xl font-bold hover:text-[#1565B8]"
                  >
                    {item.type}
                  </Link>
                ) : (
                  <h3 className="text-xl font-bold">
                    {item.type}
                  </h3>
                )}

                <p className="mt-1 flex items-start gap-1.5 text-sm text-gray-500">

                  <FiMapPin
                    className="mt-0.5 shrink-0"
                    size={16}
                  />

                  <span>{item.place}</span>

                </p>

              </div>

              {/* FAVOURITE HEART */}

              <button
                type="button"
                onClick={handleFavourite}
                aria-pressed={liked}
                aria-label={
                  liked
                    ? "Remove from favourites"
                    : "Add to favourites"
                }
                title={
                  liked
                    ? "Remove from favourites"
                    : "Add to favourites"
                }
                className="mt-1 shrink-0"
              >

                <FiHeart
                  size={26}
                  className={
                    liked
                      ? "fill-red-500 text-red-500"
                      : "text-black"
                  }
                />

              </button>

            </div>

            <p className="mb-4 mt-4 text-xl font-semibold">
              {item.price}
            </p>

            {/* VIEW DETAILS */}

            {student ? (
              <Link
                to={detailsPath}
                className="mx-auto mt-auto w-[85%] rounded-full bg-[#3A86D8] py-2.5 text-center text-lg font-semibold text-white hover:bg-[#2f74c0]"
              >
                View Details
              </Link>
            ) : (
              <button className="mx-auto mt-auto w-[85%] rounded-full bg-[#3A86D8] py-2.5 text-lg font-semibold text-white hover:bg-[#2f74c0]">
                View Details
              </button>
            )}

          </>
        )}

      </div>

    </article>
  );
}