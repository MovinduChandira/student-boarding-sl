import { query, withTransaction } from "../db.js";
import { ROLES, isEmail, normaliseEmail, normalisePhone } from "../utils/validators.js";

const YEAR_MAP_TO_STRING = {
  1: "1st Year",
  2: "2nd Year",
  3: "3rd Year",
  4: "4th Year",
  5: "5th Year",
};

function formatYear(yearVal) {
  if (!yearVal) return "";
  const num = Number(yearVal);
  return YEAR_MAP_TO_STRING[num] || `${num} Year`;
}

function parseYear(yearInput) {
  if (!yearInput) return null;
  const match = String(yearInput).match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

/* ------------------------------------------------------------------ */
/* GET /api/profile                                                   */
/* Returns the logged-in student's or owner's profile details          */
/* ------------------------------------------------------------------ */
export async function getProfile(req, res) {
  const userId = req.user.sub;

  const userRes = await query(
    `SELECT user_id, email, full_name, phone, role, account_status
     FROM user_account WHERE user_id = $1`,
    [userId]
  );
  const user = userRes.rows[0];
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  if (user.role === ROLES.STUDENT) {
    const studentRes = await query(
      `SELECT sp.student_id, sp.age, sp.student_reg_no, sp.gender, sp.faculty,
              sp.year_of_study, u.name AS university_name
       FROM student_profile sp
       LEFT JOIN university u ON u.university_id = sp.university_id
       WHERE sp.user_id = $1`,
      [userId]
    );
    const sp = studentRes.rows[0] || {};

    return res.json({
      role: "student",
      name: user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      age: sp.age != null ? String(sp.age) : "",
      university: sp.university_name || "",
      year: formatYear(sp.year_of_study),
      faculty: sp.faculty || "",
    });
  }

  if (user.role === ROLES.OWNER) {
    const ownerRes = await query(
      `SELECT op.owner_id, op.nic_number, op.business_address, op.free_listing_used,
              COALESCE(
                (SELECT status = 'approved' FROM account_verification av WHERE av.user_id = op.user_id ORDER BY decided_at DESC LIMIT 1),
                false
              ) AS verified
       FROM owner_profile op
       WHERE op.user_id = $1`,
      [userId]
    );
    const op = ownerRes.rows[0] || {};

    return res.json({
      role: "owner",
      name: user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      nic: op.nic_number || "",
      location: op.business_address || "",
      verified: Boolean(op.verified),
      plan: "Basic Plan",
    });
  }

  // Admin / other role fallback
  return res.json({
    role: user.role,
    name: user.full_name || "",
    email: user.email || "",
    phone: user.phone || "",
  });
}

/* ------------------------------------------------------------------ */
/* PUT /api/profile                                                   */
/* Updates user details and profile in the database                    */
/* ------------------------------------------------------------------ */
export async function updateProfile(req, res) {
  const userId = req.user.sub;
  const userRole = req.user.role;

  const name = String(req.body.name || req.body.fullName || "").trim();
  const rawEmail = String(req.body.email || "").trim();
  const rawPhone = String(req.body.phone || "").trim();

  if (!name) {
    return res.status(400).json({ message: "Full Name is required." });
  }
  if (!rawEmail || !isEmail(rawEmail)) {
    return res.status(400).json({ message: "A valid email is required." });
  }

  const email = normaliseEmail(rawEmail);
  const phone = normalisePhone(rawPhone) || rawPhone;

  // Check email uniqueness if email is changed
  const checkEmail = await query(
    `SELECT user_id FROM user_account WHERE lower(email) = $1 AND user_id <> $2`,
    [email, userId]
  );
  if (checkEmail.rowCount > 0) {
    return res.status(409).json({ message: "This email is already in use by another account." });
  }

  await withTransaction(async (client) => {
    // 1. Update basic user account info
    await client.query(
      `UPDATE user_account
       SET full_name = $1, email = $2, phone = $3
       WHERE user_id = $4`,
      [name, email, phone, userId]
    );

    // 2. Role-specific profile updates
    if (userRole === ROLES.STUDENT) {
      const ageVal = req.body.age ? parseInt(req.body.age, 10) : null;
      const yearVal = parseYear(req.body.year);
      const faculty = req.body.faculty ? String(req.body.faculty).trim() : null;
      const uniName = req.body.university ? String(req.body.university).trim() : null;

      let universityId = null;
      if (uniName) {
        const uniCheck = await client.query(
          `SELECT university_id FROM university WHERE lower(name) = lower($1) LIMIT 1`,
          [uniName]
        );
        if (uniCheck.rowCount > 0) {
          universityId = uniCheck.rows[0].university_id;
        } else {
          const newUni = await client.query(
            `INSERT INTO university (name) VALUES ($1) RETURNING university_id`,
            [uniName]
          );
          universityId = newUni.rows[0].university_id;
        }
      }

      // Ensure student_profile exists
      const profExists = await client.query(
        `SELECT student_id FROM student_profile WHERE user_id = $1`,
        [userId]
      );
      if (profExists.rowCount > 0) {
        await client.query(
          `UPDATE student_profile
           SET age = $1, university_id = $2, year_of_study = $3, faculty = $4
           WHERE user_id = $5`,
          [ageVal, universityId, yearVal, faculty, userId]
        );
      } else {
        await client.query(
          `INSERT INTO student_profile (user_id, age, university_id, year_of_study, faculty)
           VALUES ($1, $2, $3, $4, $5)`,
          [userId, ageVal, universityId, yearVal, faculty]
        );
      }
    } else if (userRole === ROLES.OWNER) {
      const nic = req.body.nic ? String(req.body.nic).trim() : null;
      const location = req.body.location ? String(req.body.location).trim() : null;

      // Ensure owner_profile exists
      const profExists = await client.query(
        `SELECT owner_id FROM owner_profile WHERE user_id = $1`,
        [userId]
      );
      if (profExists.rowCount > 0) {
        await client.query(
          `UPDATE owner_profile
           SET nic_number = COALESCE($1, nic_number), business_address = $2
           WHERE user_id = $3`,
          [nic, location, userId]
        );
      } else {
        await client.query(
          `INSERT INTO owner_profile (user_id, nic_number, business_address, free_listing_used, created_at)
           VALUES ($1, COALESCE($2, 'UNKNOWN'), $3, false, now())`,
          [userId, nic, location]
        );
      }
    }
  });

  // Re-fetch updated profile
  return getProfile(req, res);
}
