import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { query, withTransaction } from "../db.js";
import {
  ROLES,
  isEmail,
  normaliseEmail,
  normalisePhone,
  validateRegistration,
} from "../utils/validators.js";

// Used to keep response time the same when an account does not exist,
// so attackers cannot tell which e-mails are registered.
const DUMMY_HASH = bcrypt.hashSync("boarding.lk-dummy-password", config.bcryptRounds);

const cookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: "lax",
  path: "/",
};

// Turns a user_account row into the object the frontend stores.
const toPublicUser = (row) => ({
  id: row.user_id,
  name: row.full_name,
  email: row.email,
  phone: row.phone,
  role: row.role,
});

function issueSession(res, user) {
  const token = jwt.sign({ sub: user.user_id, role: user.role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
  const { exp } = jwt.decode(token);
  res.cookie(config.cookieName, token, { ...cookieOptions, expires: new Date(exp * 1000) });
  return token;
}

// bcrypt throws on malformed hashes (e.g. the demo rows' "DEMO_NOT_A_REAL_HASH").
async function passwordMatches(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* POST /api/auth/register                                             */
/* ------------------------------------------------------------------ */
export async function register(req, res) {
  const { errors, data } = validateRegistration(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: Object.values(errors)[0], errors });
  }

  const existing = await query(
    `SELECT
       EXISTS (SELECT 1 FROM user_account WHERE lower(email) = $1) AS email_taken,
       EXISTS (SELECT 1 FROM user_account WHERE phone = $2)        AS phone_taken`,
    [data.email, data.phone]
  );
  const { email_taken, phone_taken } = existing.rows[0];
  if (email_taken) {
    return res.status(409).json({ message: "An account with this e-mail already exists.", errors: { email: "Already registered." } });
  }
  if (phone_taken) {
    return res.status(409).json({ message: "An account with this phone number already exists.", errors: { phone: "Already registered." } });
  }

  const passwordHash = await bcrypt.hash(data.password, config.bcryptRounds);

  let user;
  try {
    user = await withTransaction(async (client) => {
      const { rows } = await client.query(
        `INSERT INTO user_account
           (email, password_hash, full_name, phone, role, account_status, strike_count, email_verified, created_at)
         VALUES ($1, $2, $3, $4, $5, 'active', 0, false, now())
         RETURNING user_id, email, full_name, phone, role`,
        [data.email, passwordHash, data.fullName, data.phone, data.role]
      );
      const created = rows[0];

      if (data.role === ROLES.STUDENT) {
        await client.query(`INSERT INTO student_profile (user_id) VALUES ($1)`, [created.user_id]);
      } else {
        await client.query(
          `INSERT INTO owner_profile (user_id, nic_number, free_listing_used, created_at)
           VALUES ($1, $2, false, now())`,
          [created.user_id, data.nic]
        );
      }
      return created;
    });
  } catch (err) {
    // unique_violation – e.g. two sign-ups racing, or a NIC already in use
    const duplicate = {
      user_account_email_key: ["email", "e-mail"],
      owner_profile_nic_number_key: ["nic", "NIC number"],
    }[err.code === "23505" ? err.constraint : ""];
    if (duplicate) {
      const [field, label] = duplicate;
      return res.status(409).json({ message: `An account with this ${label} already exists.`, errors: { [field]: "Already registered." } });
    }
    throw err;
  }

  issueSession(res, user);
  return res.status(201).json({ message: "Account created.", user: toPublicUser(user) });
}

/* ------------------------------------------------------------------ */
/* POST /api/auth/login                                                */
/* body: { email, password }  — "email" may also be a phone number     */
/* ------------------------------------------------------------------ */
export async function login(req, res) {
  const identifier = String(req.body?.email ?? req.body?.identifier ?? "").trim();
  const password = String(req.body?.password ?? "");

  if (!identifier || !password) {
    return res.status(400).json({ message: "Enter your e-mail (or phone number) and password." });
  }

  let rows = [];
  if (isEmail(identifier)) {
    ({ rows } = await query(
      `SELECT user_id, email, password_hash, full_name, phone, role, account_status
         FROM user_account WHERE lower(email) = $1`,
      [normaliseEmail(identifier)]
    ));
  } else {
    const phone = normalisePhone(identifier);
    if (phone) {
      ({ rows } = await query(
        `SELECT user_id, email, password_hash, full_name, phone, role, account_status
           FROM user_account WHERE phone = $1 ORDER BY user_id LIMIT 1`,
        [phone]
      ));
    }
  }

  const user = rows[0];
  const ok = await passwordMatches(password, user ? user.password_hash : DUMMY_HASH);
  if (!user || !ok) {
    return res.status(401).json({ message: "Incorrect e-mail/phone number or password." });
  }

  if ((user.account_status || "active") !== "active") {
    return res.status(403).json({ message: `Your account is ${user.account_status}. Please contact Boarding.lk support.` });
  }

  // Admin accounts are never created through /register. A user may only log in
  // as admin if their user_account row has role 'admin' AND a matching, active
  // row exists in the admin table (both are entered directly in the database).
  if (user.role === ROLES.ADMIN) {
    const admin = await query(
      `SELECT admin_id FROM admin
        WHERE user_id = $1 AND coalesce(account_status, 'active') = 'active'`,
      [user.user_id]
    );
    if (!admin.rowCount) {
      return res.status(403).json({ message: "This admin account is not active." });
    }
  } else if (![ROLES.STUDENT, ROLES.OWNER].includes(user.role)) {
    return res.status(403).json({ message: "This account cannot log in." });
  }

  await query(`UPDATE user_account SET last_login_at = now() WHERE user_id = $1`, [user.user_id]);

  issueSession(res, user);
  return res.json({ message: "Logged in.", user: toPublicUser(user) });
}

/* ------------------------------------------------------------------ */
/* POST /api/auth/logout                                               */
/* ------------------------------------------------------------------ */
export function logout(_req, res) {
  res.clearCookie(config.cookieName, cookieOptions);
  return res.json({ message: "Logged out." });
}

/* ------------------------------------------------------------------ */
/* GET /api/auth/me  (requires a valid session)                        */
/* Re-reads the account so a suspended user is signed out straight away */
/* ------------------------------------------------------------------ */
export async function me(req, res) {
  const { rows } = await query(
    `SELECT user_id, email, full_name, phone, role, account_status
       FROM user_account WHERE user_id = $1`,
    [req.user.sub]
  );
  const user = rows[0];
  if (!user || (user.account_status || "active") !== "active") {
    res.clearCookie(config.cookieName, cookieOptions);
    return res.status(401).json({ message: "Please log in again." });
  }
  return res.json({ user: toPublicUser(user) });
}
