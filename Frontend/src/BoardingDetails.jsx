import { useState } from "react";

import {
  Link,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  FiSearch,
  FiMapPin,
  FiWifi,
  FiPhone,
  FiUser,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";

import { allListings } from "./listingsData.js";
import { Footer } from "./App.jsx";

// OWNER VERIFICATION IMPORTS

import { owners } from "./ownersData.js";

import {
  isOwnerVerified,
} from "./ownerVerificationStorage.js";

export default function BoardingDetails() {

  const { id } = useParams();

  const location = useLocation();

  const isTesting =
    location.pathname.startsWith("/test-");

  const homePath = isTesting
    ? "/test-student"
    : "/student-home";

  const detailsPath = isTesting
    ? "/test-boarding-details"
    : "/boarding-details";

  const listing = allListings.find(
    (item) => String(item.id) === id
  );

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [query, setQuery] = useState("");

  // ====================================
  // BOARDING NOT FOUND
  // ====================================

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#0A4682] p-10 text-white">

        <h1 className="text-3xl font-bold">
          Boarding not found
        </h1>

        <Link
          to={homePath}
          className="mt-6 inline-block text-[#F5C400]"
        >
          Back to Home
        </Link>

      </div>
    );
  }

  // ====================================
  // IMAGE GALLERY
  // ====================================

  const gallery = [
    listing.img,
    ...allListings
      .filter(
        (item) =>
          item.id !== listing.id &&
          item.type === listing.type
      )
      .map((item) => item.img),
  ].slice(0, 4);

  const mainImage =
    selectedImage?.id === listing.id
      ? selectedImage.src
      : listing.img;

  // ====================================
  // SIMILAR LISTINGS
  // ====================================

  const similarListings = allListings
    .filter((item) => item.id !== listing.id)
    .sort(
      (a, b) =>
        Number(b.type === listing.type) -
        Number(a.type === listing.type)
    )
    .slice(0, 3);

  // ====================================
  // SEARCH FUNCTIONALITY
  // ====================================

  const searchResults = query.trim()
    ? allListings.filter((item) =>
        `${item.title} ${item.type} ${item.place}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      )
    : [];

  // ====================================
  // OWNER INFORMATION AND VERIFICATION
  // ====================================

  const owner = owners.find(
    (item) => item.id === listing.ownerId
  );

  const verified = owner
    ? isOwnerVerified(owner.id)
    : false;

  // ====================================
  // GOOGLE MAP LOCATION
  // ====================================

  const mapLocation = encodeURIComponent(
    `${listing.place}, Sri Lanka`
  );

  return (

    <div className="min-h-screen bg-linear-to-b from-[#0A4682] to-[#1B73C4] font-['Albert_Sans',sans-serif] text-white">

      <div className="mx-auto max-w-[1500px] px-5 py-6 md:px-8">

        {/* ====================================
            HEADER
        ==================================== */}

        <header className="relative mb-8 flex flex-wrap items-center gap-5 rounded-full border border-white/40 bg-[#104D87] px-5 py-3">

          <Link to={homePath}>

            <img
              src="/images/logo.png"
              alt="Boarding.lk"
              className="w-36 object-contain"
            />

          </Link>

          <label className="flex min-w-[200px] flex-1 items-center gap-3 rounded-full bg-white px-4 py-2 text-gray-800">

            <input
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search by university or location"
              className="w-full outline-none"
            />

            <FiSearch />

          </label>

          {/* SEARCH RESULTS */}

          {query.trim() && (

            <div className="absolute left-5 right-5 top-full z-20 mt-2 rounded-lg bg-white p-3 text-black shadow-xl">

              {searchResults.length === 0 && (

                <p className="p-3">
                  No listings found.
                </p>

              )}

              {searchResults.map((item) => (

                <Link
                  key={item.id}
                  to={`${detailsPath}/${item.id}`}
                  onClick={() => setQuery("")}
                  className="block rounded p-3 hover:bg-blue-100"
                >

                  {item.title} — {item.place}

                </Link>

              ))}

            </div>

          )}

        </header>

        {/* ====================================
            MAIN CONTENT
        ==================================== */}

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_260px]">

          {/* ====================================
              LEFT COLUMN - BOARDING DETAILS
          ==================================== */}

          <section className="min-w-0">

            {/* MAIN BOARDING IMAGE */}

            <img
              src={mainImage}
              alt={listing.title}
              className="h-[320px] w-full object-cover"
            />

            {/* IMAGE GALLERY */}

            <div className="mt-3 flex flex-wrap gap-3">

              {gallery.map((image) => (

                <button
                  key={image}
                  type="button"
                  onClick={() =>
                    setSelectedImage({
                      id: listing.id,
                      src: image,
                    })
                  }
                  className={`border-2 ${
                    mainImage === image
                      ? "border-[#F5C400]"
                      : "border-transparent"
                  }`}
                >

                  <img
                    src={image}
                    alt="Sample boarding room"
                    className="h-16 w-24 object-cover"
                  />

                </button>

              ))}

            </div>

            <p className="mt-2 text-xs text-white/70">
              Sample room photographs
            </p>

            {/* BOARDING TITLE */}

            <h1 className="mt-5 text-2xl font-bold md:text-3xl">

              {listing.title || listing.type}

            </h1>

            {/* BOARDING PRICE */}

            <p className="mt-3 text-2xl text-[#E5B95C]">

              {listing.price}

            </p>

            {/* BOARDING LOCATION */}

            <p className="mt-4 flex items-center gap-2">

              <FiMapPin className="text-[#F5C400]" />

              {listing.place}

            </p>

            {/* DISTANCE FROM UNIVERSITY */}

            <p className="mt-2 text-sm text-white/80">

              {listing.distanceKm} km from university

            </p>

            {/* ====================================
                FACILITIES
            ==================================== */}

            <h2 className="mb-4 mt-6 text-xl font-bold">

              Facilities

            </h2>

            <div className="grid grid-cols-2 gap-4">

              {(listing.facilities || []).map(
                (facility) => (

                  <div
                    key={facility}
                    className="flex items-center gap-2"
                  >

                    {facility === "Wi-Fi" ? (

                      <FiWifi className="text-[#F5C400]" />

                    ) : (

                      <FiCheckCircle className="text-[#F5C400]" />

                    )}

                    {facility}

                  </div>

                )
              )}

            </div>

            {/* ====================================
                DESCRIPTION
            ==================================== */}

            <h2 className="mb-3 mt-7 text-xl font-bold">

              Description

            </h2>

            <p className="text-sm leading-7 text-white/90">

              {listing.title} is a {listing.type.toLowerCase()}
              {" "}located in {listing.place}.
              This boarding is approximately{" "}
              {listing.distanceKm} km from the university.
              The listed rental price is {listing.price}.
              Available facilities include{" "}
              {(listing.facilities || []).join(", ")}.
              Contact the property owner for more
              information about availability.

            </p>

            {/* BACK TO HOME BUTTON */}

            <Link
              to={homePath}
              className="mt-8 inline-flex items-center gap-2 bg-[#8CBBEB] px-6 py-3 font-semibold text-[#0A4682] hover:bg-[#B5D8F5]"
            >

              <FiArrowLeft />

              Back to Home

            </Link>

          </section>

          {/* ====================================
              MIDDLE COLUMN - GOOGLE MAP
          ==================================== */}

          <section className="overflow-hidden border border-white/30">

            <iframe
              key={listing.id}
              title={`Map of ${listing.place}`}
              src={`https://maps.google.com/maps?q=${mapLocation}&z=14&output=embed`}
              className="h-[500px] w-full border-0 lg:h-[750px]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            <p className="bg-[#0A3F78] p-3 text-center text-xs">

              Approximate boarding area

            </p>

          </section>

          {/* ====================================
              RIGHT COLUMN
          ==================================== */}

          <aside className="space-y-6">

            {/* ====================================
                CONTACT OWNER
            ==================================== */}

            <h2 className="bg-[#8CBBEB] px-4 py-3 text-center text-lg font-bold text-[#1565B8]">

              Contact Owner

            </h2>

            <div className="border border-white/30 bg-linear-to-b from-[#0A4682] to-[#031D36] p-6 text-center">

              {/* OWNER PROFILE ICON */}

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#F5B800]">

                <FiUser size={55} />

              </div>

              {/* OWNER NAME */}

              <h3 className="mt-4 text-xl font-bold">

                {owner?.displayName || "Owner unavailable"}

              </h3>

              {/* ====================================
                  DYNAMIC OWNER VERIFICATION BADGE
              ==================================== */}

              {verified ? (

                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-1.5 text-sm font-semibold text-white">

                  <FiCheckCircle size={16} />

                  Verified

                </span>

              ) : (

                <span className="mt-2 inline-block rounded-full bg-[#E5B95C] px-4 py-1.5 text-xs font-semibold text-black">

                  Not Verified

                </span>

              )}

              {/* OWNER PHONE NUMBER */}

              <p className="mt-4 flex items-center justify-center gap-2 text-sm">

                <FiPhone className="text-[#F5C400]" />

                {owner?.phone || "Contact unavailable"}

              </p>

              <p className="mt-2 text-xs text-white/70">

                Demo contact information

              </p>

            </div>

            {/* ====================================
                SIMILAR LISTINGS
            ==================================== */}

            <div className="border border-white/30 bg-linear-to-b from-[#0A4682] to-[#031D36] p-4">

              <h2 className="mb-6 text-center text-xl font-bold text-[#E5B95C]">

                Similar Listings

              </h2>

              <div className="space-y-5">

                {similarListings.map((item) => (

                  <Link
                    key={item.id}
                    to={`${detailsPath}/${item.id}`}
                    className="flex items-center gap-3 hover:bg-white/10"
                  >

                    <img
                      src={item.img}
                      alt={item.title}
                      className="h-20 w-20 shrink-0 object-cover"
                    />

                    <div>

                      <h3 className="text-sm font-bold">

                        {item.type}

                      </h3>

                      <p className="mt-1 text-xs text-white/70">

                        {item.place}

                      </p>

                      <p className="mt-2 text-xs font-semibold text-[#E5B95C]">

                        {item.price}

                      </p>

                    </div>

                  </Link>

                ))}

              </div>

            </div>

          </aside>

        </div>

      </div>

      {/* ====================================
          EXISTING FOOTER - SALHA'S CODE
      ==================================== */}

      <Footer />

    </div>

  );
}