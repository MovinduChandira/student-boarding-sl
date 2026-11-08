// Small, dependency-free input helpers for the auth endpoints.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Old NIC: 9 digits + V/X (e.g. 200012345V). New NIC: 12 digits (e.g. 200012345678).
const NIC_RE = /^(\d{9}[VvXx]|\d{12})$/;

export const ROLES = Object.freeze({ STUDENT: "student", OWNER: "owner", ADMIN: "admin" });

// Only these roles can be created through public registration.
// Admins are added directly to the database (see scripts/create-admin.js).
export const SELF_REGISTER_ROLES = [ROLES.STUDENT, ROLES.OWNER];

export const normaliseEmail = (email) => String(email || "").trim().toLowerCase();

export const isEmail = (value) => EMAIL_RE.test(String(value || "").trim());

/**
 * Normalises a Sri Lankan mobile number to +94XXXXXXXXX.
 * Accepts 0771234567, 771234567, 94771234567, +94 77 123 4567, etc.
 * Returns null if it is not a valid 9-digit local number.
 */
export function normalisePhone(phone) {
  let digits = String(phone || "").replace(/[\s\-()]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (!/^\d+$/.test(digits)) return null;

  if (digits.startsWith("94") && digits.length === 11) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 10) digits = digits.slice(1);

  return digits.length === 9 ? `+94${digits}` : null;
}

export const normaliseNic = (nic) => String(nic || "").trim().toUpperCase();
export const isNic = (nic) => NIC_RE.test(normaliseNic(nic));

/**
 * Validates the registration body. Returns { errors, data }.
 * `errors` is an object of field -> message (empty when valid).
 */
export function validateRegistration(body = {}) {
  const errors = {};

  const role = String(body.role || "").trim().toLowerCase();
  const fullName = String(body.name ?? body.fullName ?? "").trim();
  const email = normaliseEmail(body.email);
  const phone = normalisePhone(body.phone);
  const password = String(body.password || "");
  const nic = normaliseNic(body.nic);

  if (!SELF_REGISTER_ROLES.includes(role)) {
    errors.role = "You can only register as a student or a boarding owner.";
  }
  if (fullName.length < 2 || fullName.length > 100) {
    errors.name = "Full name must be between 2 and 100 characters.";
  }
  if (!isEmail(email) || email.length > 100) {
    errors.email = "Enter a valid e-mail address.";
  }
  if (!phone) {
    errors.phone = "Enter a valid Sri Lankan phone number (e.g. 0771234567).";
  }
  if (password.length < 6 || password.length > 72) {
    errors.password = "Password must be between 6 and 72 characters.";
  }
  if (role === ROLES.OWNER && !isNic(nic)) {
    errors.nic = "Enter a valid NIC number (e.g. 200012345678 or 991234567V).";
  }

  return { errors, data: { role, fullName, email, phone, password, nic } };
}
