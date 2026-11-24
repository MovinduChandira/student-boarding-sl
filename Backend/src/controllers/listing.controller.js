import { query, withTransaction } from "../db.js";
import { ROLES } from "../utils/validators.js";

const DEFAULT_IMAGES_BY_TYPE = {
  "Single Room": "/images/single-room.jpg",
  "Twin Room": "/images/twin-room.jpg",
  "Shared Room": "/images/shared-room.jpg",
  "Shared Dorm": "/images/shared-dorm.jpg",
  single: "/images/single-room.jpg",
  twin: "/images/twin-room.jpg",
  shared: "/images/shared-room.jpg",
  dorm: "/images/shared-dorm.jpg",
};

function normaliseGenderPreference(pref) {
  if (Array.isArray(pref)) {
    if (pref.includes("Male") && pref.includes("Female")) return "any";
    if (pref.includes("Male")) return "male";
    if (pref.includes("Female")) return "female";
    return "any";
  }
  const s = String(pref || "").toLowerCase();
  if (s.includes("male") && s.includes("female")) return "any";
  if (s.includes("female")) return "female";
  if (s.includes("male")) return "male";
  return "any";
}

function parseFacilities(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return input.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

/* ------------------------------------------------------------------ */
/* POST /api/listings                                                 */
/* Owner creates a new listing. Status 'published' becomes 'pending'   */
/* ------------------------------------------------------------------ */
export async function createListing(req, res) {
  const title = String(req.body.title || "").trim();
  const address = String(req.body.address || "").trim();
  const description = String(req.body.description || "").trim();
  const propertyType = String(req.body.propertyType || req.body.room_type || "Single Room").trim();
  const rent = Number(req.body.rent || req.body.monthly_rent);
  const statusInput = String(req.body.status || "published").toLowerCase();
  const facilities = parseFacilities(req.body.facilities);
  const genderPreference = normaliseGenderPreference(req.body.genderPreference);

  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }
  if (!address) {
    return res.status(400).json({ message: "Address is required." });
  }
  if (!rent || isNaN(rent) || rent <= 0) {
    return res.status(400).json({ message: "Rent must be a positive number." });
  }

  // When owner clicks publish, listing goes to pending admin approval.
  const status = statusInput === "draft" ? "draft" : "pending";

  const listing = await withTransaction(async (client) => {
    // 1. Resolve owner profile
    let ownerRes = await client.query(
      `SELECT owner_id FROM owner_profile WHERE user_id = $1`,
      [req.user.sub]
    );
    let ownerId;
    if (ownerRes.rowCount > 0) {
      ownerId = ownerRes.rows[0].owner_id;
    } else {
      const ins = await client.query(
        `INSERT INTO owner_profile (user_id, nic_number, free_listing_used, created_at)
         VALUES ($1, 'UNKNOWN', false, now())
         RETURNING owner_id`,
        [req.user.sub]
      );
      ownerId = ins.rows[0].owner_id;
    }

    // 2. Insert into listing
    const listingRes = await client.query(
      `INSERT INTO listing
         (owner_id, university_id, title, description, room_type, gender_preference, monthly_rent, address, status, created_at)
       VALUES ($1, 1, $2, $3, $4, $5, $6, $7, $8, now())
       RETURNING *`,
      [ownerId, title, description, propertyType, genderPreference, rent, address, status]
    );
    const createdListing = listingRes.rows[0];
    const listingId = createdListing.listing_id;

    // 3. Insert facilities
    for (const facName of facilities) {
      const trimmed = String(facName).trim();
      if (!trimmed) continue;
      const facRes = await client.query(
        `INSERT INTO facility (name, category)
         VALUES ($1, 'convenience')
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING facility_id`,
        [trimmed]
      );
      const facilityId = facRes.rows[0].facility_id;
      await client.query(
        `INSERT INTO listing_facility (listing_id, facility_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [listingId, facilityId]
      );
    }

    // 4. Handle images
    const uploadedFiles = req.files || [];
    if (uploadedFiles.length > 0) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const imageUrl = `/uploads/${file.filename}`;
        const isCover = i === 0;
        await client.query(
          `INSERT INTO listing_image (listing_id, image_url, is_cover, uploaded_at)
           VALUES ($1, $2, $3, now())`,
          [listingId, imageUrl, isCover]
        );
      }
    } else {
      // If no file uploaded, assign default placeholder image based on property type
      const defaultImg = DEFAULT_IMAGES_BY_TYPE[propertyType] || "/images/single-room.jpg";
      await client.query(
        `INSERT INTO listing_image (listing_id, image_url, is_cover, uploaded_at)
         VALUES ($1, $2, true, now())`,
        [listingId, defaultImg]
      );
    }

    return createdListing;
  });

  return res.status(201).json({
    message:
      status === "pending"
        ? "Listing submitted successfully and delivered for admin approval."
        : "Listing saved as draft.",
    listing,
  });
}

/* ------------------------------------------------------------------ */
/* GET /api/listings                                                  */
/* Public & student/owner home: returns approved listings              */
/* ------------------------------------------------------------------ */
export async function getApprovedListings(req, res) {
  const queryParam = String(req.query.q || req.query.query || "").trim().toLowerCase();

  let filterClause = "WHERE l.status = 'approved'";
  const values = [];

  if (queryParam) {
    values.push(`%${queryParam}%`);
    filterClause += ` AND (
      lower(l.title) LIKE $1
      OR lower(l.address) LIKE $1
      OR lower(l.room_type) LIKE $1
      OR lower(coalesce(l.description, '')) LIKE $1
    )`;
  }

  const { rows } = await query(
    `SELECT
       l.listing_id AS id,
       l.title,
       l.room_type AS type,
       l.address AS place,
       l.monthly_rent AS rent,
       ('Rs. ' || to_char(l.monthly_rent, 'FM999,999,999') || '/ month') AS price,
       COALESCE(
         (SELECT image_url FROM listing_image li WHERE li.listing_id = l.listing_id ORDER BY is_cover DESC, image_id ASC LIMIT 1),
         '/images/single-room.jpg'
       ) AS img,
       l.distance_km AS "distanceKm",
       l.gender_preference AS genders,
       COALESCE(
         (SELECT json_agg(f.name) FROM listing_facility lf JOIN facility f ON f.facility_id = lf.facility_id WHERE lf.listing_id = l.listing_id),
         '[]'::json
       ) AS facilities,
       'Active' AS status,
       l.created_at AS "createdAt"
     FROM listing l
     ${filterClause}
     ORDER BY l.created_at DESC`,
    values
  );

  return res.json(rows);
}

/* ------------------------------------------------------------------ */
/* GET /api/listings/mine                                             */
/* Authenticated owner: returns owner's listings (pending, active...) */
/* ------------------------------------------------------------------ */
export async function getMyListings(req, res) {
  const { rows } = await query(
    `SELECT
       l.listing_id AS id,
       l.title,
       l.room_type AS type,
       l.address AS place,
       l.monthly_rent AS rent,
       ('Rs. ' || to_char(l.monthly_rent, 'FM999,999,999') || '/ month') AS price,
       COALESCE(
         (SELECT image_url FROM listing_image li WHERE li.listing_id = l.listing_id ORDER BY is_cover DESC, image_id ASC LIMIT 1),
         '/images/single-room.jpg'
       ) AS img,
       CASE
         WHEN l.status = 'approved' THEN 'Active'
         WHEN l.status = 'pending' THEN 'Pending'
         WHEN l.status = 'rejected' THEN 'Rejected'
         ELSE 'Inactive'
       END AS status,
       l.status AS "rawStatus",
       la.remarks AS "rejectionReason",
       l.created_at AS "createdAt"
     FROM listing l
     JOIN owner_profile op ON op.owner_id = l.owner_id
     LEFT JOIN LATERAL (
       SELECT remarks, decision, decided_at
       FROM listing_approval
       WHERE listing_id = l.listing_id
       ORDER BY decided_at DESC, approval_id DESC
       LIMIT 1
     ) la ON true
     WHERE op.user_id = $1
     ORDER BY l.created_at DESC`,
    [req.user.sub]
  );

  return res.json(rows);
}

/* ------------------------------------------------------------------ */
/* GET /api/admin/listings                                            */
/* Admin portal: all listings for approval (pending, approved, rejected)*/
/* ------------------------------------------------------------------ */
export async function getAdminApprovalListings(req, res) {
  const filterStatus = req.query.status ? String(req.query.status).toLowerCase() : null;

  const values = [];
  let filterClause = "";
  if (filterStatus && ["pending", "approved", "rejected"].includes(filterStatus)) {
    values.push(filterStatus);
    filterClause = "WHERE l.status = $1";
  }

  const { rows } = await query(
    `SELECT
       l.listing_id AS id,
       l.title,
       COALESCE(u.full_name, 'Boarding Owner') AS owner,
       l.monthly_rent AS rent,
       'Monthly' AS "rentPeriod",
       l.address,
       l.room_type AS "propertyType",
       l.description,
       l.gender_preference AS "genderPreference",
       l.status,
       to_char(l.created_at, 'YYYY-MM-DD') AS "submittedAt",
       COALESCE(
         (SELECT image_url FROM listing_image li WHERE li.listing_id = l.listing_id ORDER BY is_cover DESC, image_id ASC LIMIT 1),
         '/images/single-room.jpg'
       ) AS image,
       COALESCE(
         (SELECT json_agg(f.name) FROM listing_facility lf JOIN facility f ON f.facility_id = lf.facility_id WHERE lf.listing_id = l.listing_id),
         '[]'::json
       ) AS facilities,
       la.remarks AS "rejectionReason"
     FROM listing l
     LEFT JOIN owner_profile op ON op.owner_id = l.owner_id
     LEFT JOIN user_account u ON u.user_id = op.user_id
     LEFT JOIN LATERAL (
       SELECT remarks, decision, decided_at
       FROM listing_approval
       WHERE listing_id = l.listing_id
       ORDER BY decided_at DESC, approval_id DESC
       LIMIT 1
     ) la ON true
     ${filterClause}
     ORDER BY l.created_at DESC`,
    values
  );

  return res.json(rows);
}

/* ------------------------------------------------------------------ */
/* PATCH /api/admin/listings/:id/status                              */
/* Admin approves or rejects listing                                  */
/* ------------------------------------------------------------------ */
export async function updateListingStatus(req, res) {
  const listingId = Number(req.params.id);
  const status = String(req.body.status || req.body.decision || "").toLowerCase();
  const remarks = String(req.body.rejectionReason || req.body.remarks || "").trim();

  if (isNaN(listingId)) {
    return res.status(400).json({ message: "Invalid listing ID." });
  }

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be 'approved' or 'rejected'." });
  }

  if (status === "rejected" && !remarks) {
    return res.status(400).json({ message: "Rejection reason is required." });
  }

  const result = await withTransaction(async (client) => {
    // 1. Verify listing exists
    const check = await client.query(`SELECT listing_id, status FROM listing WHERE listing_id = $1`, [listingId]);
    if (check.rowCount === 0) {
      return null;
    }

    // 2. Resolve admin_id for current user
    let adminRes = await client.query(`SELECT admin_id FROM admin WHERE user_id = $1`, [req.user.sub]);
    let adminId = adminRes.rows[0]?.admin_id;
    if (!adminId) {
      // Pick existing admin or insert
      const fallback = await client.query(`SELECT admin_id FROM admin LIMIT 1`);
      adminId = fallback.rows[0]?.admin_id || 1;
    }

    // 3. Update listing status
    await client.query(`UPDATE listing SET status = $1 WHERE listing_id = $2`, [status, listingId]);

    // 4. Record approval audit decision
    const note = status === "approved" ? (remarks || "Listing approved by administrator.") : remarks;
    await client.query(
      `INSERT INTO listing_approval (listing_id, verifier_id, decision, remarks, decided_at)
       VALUES ($1, $2, $3, $4, now())`,
      [listingId, adminId, status, note]
    );

    return { listingId, status, remarks: note };
  });

  if (!result) {
    return res.status(404).json({ message: "Listing not found." });
  }

  return res.json({
    message: status === "approved" ? "Listing approved successfully." : "Listing rejected successfully.",
    ...result,
  });
}
