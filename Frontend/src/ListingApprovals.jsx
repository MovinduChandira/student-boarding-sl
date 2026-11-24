
import { useEffect, useState } from "react";

import {
  FiHome,
  FiCheckCircle,
  FiXCircle,
  FiImage,
} from "react-icons/fi";

import DashboardLayout from "./DashboardLayout.jsx";
import { listingsApi } from "./api.js";

import {
  getApprovalListings,
  updateListingStatus,
} from "./listingApprovalStorage.js";

// ====================================
// ROOM IMAGE COMPONENT
// ====================================

function ListingImage({ src, title }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden bg-[#0A4682] sm:h-28 sm:w-28">

      {src && !imageError ? (
        <img
          src={src}
          alt={title}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <FiImage
          className="text-4xl text-white/60"
          aria-label="Room image unavailable"
        />
      )}

    </div>
  );
}

// ====================================
// ADMIN LISTING APPROVALS PAGE
// ====================================

export default function ListingApprovals() {
  const [listings, setListings] = useState(getApprovalListings);
  const [filter, setFilter] = useState("pending");
  const [message, setMessage] = useState("");

  async function loadListings() {
    try {
      const data = await listingsApi.getAdminListings();
      if (Array.isArray(data)) {
        setListings(data);
      }
    } catch {
      // Keep sample fallback if backend is unreachable
    }
  }

  useEffect(() => {
    loadListings();
  }, []);

  // ====================================
  // LISTING COUNTS
  // ====================================

  const pendingCount = listings.filter(
    (listing) => listing.status === "pending"
  ).length;

  const approvedCount = listings.filter(
    (listing) => listing.status === "approved"
  ).length;

  const rejectedCount = listings.filter(
    (listing) => listing.status === "rejected"
  ).length;

  const visibleListings = listings.filter(
    (listing) => listing.status === filter
  );

  // ====================================
  // APPROVE LISTING
  // ====================================

  async function handleApprove(id) {
    const confirmed = window.confirm(
      "Are you sure you want to approve this listing?"
    );

    if (!confirmed) return;

    try {
      await listingsApi.updateApprovalStatus(id, "approved");
      setListings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "approved" } : item
        )
      );
      setMessage("Listing approved successfully.");
    } catch (err) {
      alert(err.message || "Failed to approve listing.");
    }
  }

  // ====================================
  // REJECT LISTING
  // ====================================

  async function handleReject(id) {
    const reason = window.prompt(
      "Enter the reason for rejecting this listing:"
    );

    if (reason === null) return;

    if (!reason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    try {
      await listingsApi.updateApprovalStatus(id, "rejected", reason.trim());
      setListings((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: "rejected", rejectionReason: reason.trim() }
            : item
        )
      );
      setMessage("Listing rejected successfully.");
    } catch (err) {
      alert(err.message || "Failed to reject listing.");
    }
  }

  // ====================================
  // PAGE HEADING
  // ====================================

  const heading =
    filter === "pending"
      ? `Pending Approval (${pendingCount})`
      : filter === "approved"
      ? `Approved Listings (${approvedCount})`
      : `Rejected Listings (${rejectedCount})`;

  return (
    <DashboardLayout role="admin">

      <div className="mx-auto w-full max-w-6xl text-white">

        {/* PAGE HEADING */}
        <h1 className="mb-7 text-3xl font-bold text-[#E5B95C]">
          {heading}
        </h1>

        {/* ====================================
            STATUS FILTER BUTTONS
        ==================================== */}

        <div className="mb-6 flex flex-wrap gap-3">

          {[
            {
              value: "pending",
              label: "Pending",
              count: pendingCount,
            },
            {
              value: "approved",
              label: "Approved",
              count: approvedCount,
            },
            {
              value: "rejected",
              label: "Rejected",
              count: rejectedCount,
            },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setFilter(item.value);
                setMessage("");
              }}
              className={`rounded px-5 py-2 text-sm font-semibold transition ${
                filter === item.value
                  ? "bg-[#F5B800] text-black"
                  : "bg-[#1B73C4] text-white hover:bg-[#3C85C5]"
              }`}
            >
              {item.label} ({item.count})
            </button>
          ))}

        </div>

        {/* ====================================
            SUCCESS MESSAGE
        ==================================== */}

        {message && (
          <p
            role="status"
            className="mb-5 rounded bg-[#1B73C4] px-5 py-3 text-sm font-semibold"
          >
            {message}
          </p>
        )}

        {/* ====================================
            LISTING CARDS
        ==================================== */}

        <div className="space-y-4">

          {visibleListings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col gap-5 bg-[#3C85C5] p-4 shadow-md sm:flex-row sm:items-center"
            >

              {/* ROOM IMAGE */}
              <ListingImage
                src={listing.image}
                title={listing.title}
              />

              {/* LISTING INFORMATION */}
              <div className="min-w-0 flex-1">

                <h2 className="mb-2 text-lg font-bold text-[#E5B95C]">
                  {listing.title}
                </h2>

                <p className="text-sm">
                  Owner : {listing.owner}
                </p>

                <p className="text-sm">
                  Rent : Rs{" "}
                  {Number(listing.rent).toLocaleString()}
                  /{listing.rentPeriod || "Monthly"}
                </p>

                <p className="text-sm">
                  Location : {listing.address}
                </p>

                {listing.status === "rejected" &&
                  listing.rejectionReason && (
                    <p className="mt-2 text-sm text-yellow-200">
                      Reason : {listing.rejectionReason}
                    </p>
                  )}

              </div>

              {/* ====================================
                  APPROVE / REJECT BUTTONS
              ==================================== */}

              {listing.status === "pending" ? (

                <div className="flex shrink-0 gap-3 sm:ml-auto">

                  <button
                    type="button"
                    onClick={() =>
                      handleApprove(listing.id)
                    }
                    className="min-w-24 bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleReject(listing.id)
                    }
                    className="min-w-24 bg-[#E5E5E5] px-5 py-2 text-sm font-semibold text-black transition hover:bg-white"
                  >
                    Reject
                  </button>

                </div>

              ) : (

                <div className="shrink-0 sm:ml-auto">

                  <span
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold ${
                      listing.status === "approved"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >

                    {listing.status === "approved" ? (
                      <FiCheckCircle />
                    ) : (
                      <FiXCircle />
                    )}

                    {listing.status === "approved"
                      ? "Approved"
                      : "Rejected"}

                  </span>

                </div>

              )}

            </div>
          ))}

          {/* ====================================
              EMPTY STATE
          ==================================== */}

          {visibleListings.length === 0 && (

            <div className="flex flex-col items-center gap-3 bg-[#3C85C5] px-6 py-12 text-center">

              <FiHome className="text-4xl text-[#E5B95C]" />

              <p className="text-lg font-semibold">
                {filter === "pending"
                  ? "No pending listings."
                  : filter === "approved"
                  ? "No approved listings yet."
                  : "No rejected listings yet."}
              </p>

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
}
