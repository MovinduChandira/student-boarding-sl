
const STORAGE_KEY = "boarding-admin-approvals-v2";

// Sample listings for frontend testing.
// Images are taken from Frontend/public/images.

const sampleListings = [
  {
    id: "BL001",
    title: "Modern Room near USJ",
    owner: "Nimal Perera",
    address: "Maharagama",
    propertyType: "Single Room",
    rent: 20000,
    rentPeriod: "Monthly",
    description: "Modern furnished room near the university.",
    facilities: ["WiFi", "Kitchen", "Parking"],
    genderPreference: ["Male", "Female"],
    image: "/images/single-room.jpg",
    status: "pending",
    submittedAt: "2026-11-18",
    rejectionReason: "",
  },
  {
    id: "BL002",
    title: "Special Shared Room",
    owner: "Nimal Perera",
    address: "Maharagama",
    propertyType: "Shared Room",
    rent: 20000,
    rentPeriod: "Monthly",
    description: "Comfortable shared boarding accommodation.",
    facilities: ["WiFi", "Meal provided"],
    genderPreference: ["Male"],
    image: "/images/shared-room.jpg",
    status: "pending",
    submittedAt: "2026-11-19",
    rejectionReason: "",
  },
  {
    id: "BL003",
    title: "Cozy Room for Girls",
    owner: "Nimal Perera",
    address: "Maharagama",
    propertyType: "Single Room",
    rent: 20000,
    rentPeriod: "Monthly",
    description: "Safe and comfortable boarding room for girls.",
    facilities: ["WiFi", "Kitchen"],
    genderPreference: ["Female"],
    image: "/images/twin-room.jpg",
    status: "pending",
    submittedAt: "2026-11-20",
    rejectionReason: "",
  },
  {
    id: "BL004",
    title: "Single Room",
    owner: "Nimal Perera",
    address: "Maharagama",
    propertyType: "Single Room",
    rent: 20000,
    rentPeriod: "Monthly",
    description: "Affordable single room with basic facilities.",
    facilities: ["WiFi", "Cooking allowed"],
    genderPreference: [],
    image: "/images/shared-dorm.jpg",
    status: "pending",
    submittedAt: "2026-11-21",
    rejectionReason: "",
  },
];

// ====================================
// GET ALL LISTINGS
// ====================================

export function getApprovalListings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        // Keep existing approval decisions,
        // but update the images for sample listings.
        return parsed.map((listing) => {
          const sample = sampleListings.find(
            (item) => item.id === listing.id
          );

          return {
            ...listing,
            image: sample
              ? sample.image
              : listing.image,
          };
        });
      }
    }
  } catch (error) {
    console.error("Error loading listings:", error);
  }

  return sampleListings.map((listing) => ({
    ...listing,
    facilities: [...listing.facilities],
    genderPreference: [...listing.genderPreference],
  }));
}

// ====================================
// SAVE ALL LISTINGS
// ====================================

export function saveApprovalListings(listings) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(listings)
  );
}

// ====================================
// APPROVE OR REJECT LISTING
// ====================================

export function updateListingStatus(
  id,
  status,
  rejectionReason = ""
) {
  const validStatuses = [
    "pending",
    "approved",
    "rejected",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid listing status");
  }

  const listings = getApprovalListings();

  const updated = listings.map((listing) => {
    if (
      listing.id !== id ||
      listing.status !== "pending"
    ) {
      return listing;
    }

    return {
      ...listing,
      status,
      rejectionReason:
        status === "rejected"
          ? rejectionReason
          : "",
    };
  });

  saveApprovalListings(updated);

  return updated;
}

// ====================================
// GET ADMIN APPROVAL STATISTICS
// ====================================

export function getApprovalStats() {
  const listings = getApprovalListings();

  return {
    total: listings.length,

    pending: listings.filter(
      (listing) => listing.status === "pending"
    ).length,

    approved: listings.filter(
      (listing) => listing.status === "approved"
    ).length,

    rejected: listings.filter(
      (listing) => listing.status === "rejected"
    ).length,
  };
}
