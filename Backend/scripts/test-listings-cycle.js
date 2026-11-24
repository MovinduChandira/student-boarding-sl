import jwt from "jsonwebtoken";
import config from "../src/config.js";
import app from "../src/app.js";
import pool from "../src/db.js";

function makeToken(userId, role) {
  return jwt.sign({ sub: userId, role }, config.jwt.secret, { expiresIn: "1h" });
}

async function run() {
  console.log("Starting backend listing cycle tests...\n");

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  const ownerToken = makeToken(2, "owner"); // Ruwan Silva
  const adminToken = makeToken(3, "admin"); // Amali Jayawardena
  const studentToken = makeToken(1, "student"); // Kavindu Perera

  try {
    // 1. Owner creates a new listing
    console.log("1. Testing Owner creating listing...");
    const createRes = await fetch(`${baseUrl}/api/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        title: "Sunset View Student Annex",
        address: "123 Campus Road, Nugegoda",
        description: "Spacious room with study table and high speed internet.",
        propertyType: "Single Room",
        rent: 22000,
        rentPeriod: "Monthly",
        facilities: ["WiFi", "Kitchen", "Attached washroom"],
        genderPreference: ["Male"],
        status: "published",
      }),
    });

    const createData = await createRes.json();
    console.log("Create status:", createRes.status, createData.message);
    if (createRes.status !== 201) throw new Error("Failed to create listing: " + JSON.stringify(createData));
    const listingId = createData.listing.listing_id;
    console.log("Created Listing ID:", listingId, "Initial status:", createData.listing.status);

    // 2. Admin retrieves listings for approval
    console.log("\n2. Testing Admin retrieving approval listings...");
    const adminListRes = await fetch(`${baseUrl}/api/admin/listings`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminList = await adminListRes.json();
    console.log("Admin listings count:", adminList.length);
    const pendingFound = adminList.find((l) => l.id === listingId);
    if (!pendingFound) throw new Error("Created listing not found in admin approval list!");
    console.log("Found in admin pending approvals:", {
      id: pendingFound.id,
      title: pendingFound.title,
      owner: pendingFound.owner,
      status: pendingFound.status,
      rent: pendingFound.rent,
      facilities: pendingFound.facilities,
    });
    if (pendingFound.status !== "pending") {
      throw new Error("Expected status 'pending', got: " + pendingFound.status);
    }

    // 3. Check public listings BEFORE approval
    console.log("\n3. Verifying listing is NOT yet published to students/owners...");
    const publicBeforeRes = await fetch(`${baseUrl}/api/listings`);
    const publicBefore = await publicBeforeRes.json();
    const isPublicBefore = publicBefore.some((l) => l.id === listingId);
    console.log("Is listing published before approval?", isPublicBefore);
    if (isPublicBefore) throw new Error("Pending listing should not be in public listings!");

    // 4. Admin approves the listing
    console.log("\n4. Testing Admin approving listing...");
    const approveRes = await fetch(`${baseUrl}/api/admin/listings/${listingId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "approved" }),
    });
    const approveData = await approveRes.json();
    console.log("Approve response:", approveData);
    if (approveRes.status !== 200) throw new Error("Failed to approve listing");

    // 5. Check public listings AFTER approval
    console.log("\n5. Verifying listing is now published on Home interface of student & owner...");
    const publicAfterRes = await fetch(`${baseUrl}/api/listings`);
    const publicAfter = await publicAfterRes.json();
    const publishedListing = publicAfter.find((l) => l.id === listingId);
    if (!publishedListing) throw new Error("Approved listing NOT found in public published listings!");
    console.log("Found in published listings:", {
      id: publishedListing.id,
      title: publishedListing.title,
      place: publishedListing.place,
      price: publishedListing.price,
      status: publishedListing.status,
    });

    // 6. Check Owner's own listings
    console.log("\n6. Verifying listing appears in Owner's My Listings...");
    const mineRes = await fetch(`${baseUrl}/api/listings/mine`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const mineList = await mineRes.json();
    const myListing = mineList.find((l) => l.id === listingId);
    if (!myListing) throw new Error("Approved listing not found in owner's listings!");
    console.log("Found in owner's listings:", {
      id: myListing.id,
      title: myListing.title,
      status: myListing.status,
    });

    // 7. Testing rejection flow
    console.log("\n7. Testing rejection flow with a second listing...");
    const createRejectRes = await fetch(`${baseUrl}/api/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        title: "Test Reject Listing",
        address: "Nowhere street",
        description: "Test description",
        propertyType: "Twin Room",
        rent: 15000,
        rentPeriod: "Monthly",
        facilities: ["WiFi"],
        genderPreference: ["Female"],
        status: "published",
      }),
    });
    const rejectItem = (await createRejectRes.json()).listing;

    const rejectRes = await fetch(`${baseUrl}/api/admin/listings/${rejectItem.listing_id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: "rejected",
        rejectionReason: "Address could not be verified by admin.",
      }),
    });
    console.log("Reject response status:", rejectRes.status);
    if (rejectRes.status !== 200) throw new Error("Failed to reject listing");

    const adminCheckRes = await fetch(`${baseUrl}/api/admin/listings?status=rejected`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const rejectedListings = await adminCheckRes.json();
    const foundRejected = rejectedListings.find((l) => l.id === rejectItem.listing_id);
    if (!foundRejected || foundRejected.rejectionReason !== "Address could not be verified by admin.") {
      throw new Error("Rejected listing or rejection reason not verified!");
    }
    console.log("Rejected listing verified:", {
      id: foundRejected.id,
      status: foundRejected.status,
      rejectionReason: foundRejected.rejectionReason,
    });

    console.log("\n All backend listing approval cycle tests PASSED successfully!");
  } finally {
    server.close();
    await pool.end();
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
