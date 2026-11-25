import { Link, useLocation } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

import DashboardLayout from "./DashboardLayout.jsx";
import { allListings } from "./listingsData.js";

import {
  useFavourites,
  toggleFavourite,
} from "./favouritesStorage.js";

export default function StudentFavourites() {
  const favouriteIds = useFavourites();
  const location = useLocation();

  const isTesting =
    location.pathname.startsWith("/test-");

  const favourites = allListings.filter((listing) =>
    favouriteIds.includes(listing.id)
  );

  const homePath = isTesting
    ? "/test-student"
    : "/student-home";

  const detailsPath = isTesting
    ? "/test-boarding-details"
    : "/boarding-details";

  return (
    <DashboardLayout role="student">
      <section className="mx-auto min-h-[550px] max-w-[1000px]">

        <h1 className="mb-8 text-3xl font-bold text-[#E5B95C] md:text-4xl">
          My Favorites ({favourites.length})
        </h1>

        {favourites.length === 0 ? (
          <div className="border border-white/30 bg-[#3886C8] p-10 text-center">

            <FiHeart
              size={48}
              className="mx-auto mb-4 text-white/80"
            />

            <h2 className="text-2xl font-bold">
              No favourites yet
            </h2>

            <p className="mt-3">
              Click the heart icon on a boarding
              to add it to your favourites.
            </p>

            <Link
              to={homePath}
              className="mt-6 inline-block bg-[#8CBBEB] px-8 py-3 font-semibold text-[#0A4682]"
            >
              Browse Listings
            </Link>

          </div>
        ) : (
          <div className="space-y-6">

            {favourites.map((listing) => (
              <article
                key={listing.id}
                className="relative flex flex-col gap-6 border border-white/30 bg-[#3886C8] p-5 sm:flex-row sm:items-center"
              >

                {/* BOARDING IMAGE */}

                <Link
                  to={`${detailsPath}/${listing.id}`}
                  className="shrink-0"
                >
                  <img
                    src={listing.img}
                    alt={listing.title}
                    className="h-44 w-full object-cover sm:w-36"
                  />
                </Link>

                {/* BOARDING INFORMATION */}

                <div className="flex-1 pr-10">

                  <h2 className="text-xl font-bold text-white md:text-2xl">
                    {listing.title || listing.type}
                  </h2>

                  <p className="mt-3 font-semibold text-[#E5B95C]">
                    {listing.price}
                  </p>

                  <Link
                    to={`${detailsPath}/${listing.id}`}
                    className="mt-8 inline-block bg-[#8CBBEB] px-10 py-2.5 font-semibold text-[#1565B8] hover:bg-[#B5D8F5]"
                  >
                    View details
                  </Link>

                </div>

                {/* REMOVE FAVOURITE */}

                <button
                  type="button"
                  onClick={() =>
                    toggleFavourite(listing.id)
                  }
                  title="Remove from favourites"
                  aria-label={`Remove ${listing.title} from favourites`}
                  className="absolute right-6 top-6 text-red-500 hover:scale-110"
                >
                  <FiHeart
                    size={28}
                    className="fill-red-500"
                  />
                </button>

              </article>
            ))}

          </div>
        )}

      </section>
    </DashboardLayout>
  );
}