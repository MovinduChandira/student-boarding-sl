/**
 * Adds (or updates) an administrator directly in the database.
 * Admins can NOT be created through the public /register endpoint.
 *
 * Usage:
 *   npm run create-admin                       -> admin@gmail.com / admin (dev test account)
 *   npm run create-admin -- --email movindu@boarding.lk --password "S3cure!" --name "Movindu Chandira" --phone 0771234567 --area Nugegoda
 *
 * If the e-mail already exists, its password is reset, its role is set to
 * 'admin', and an active row is ensured in the admin table.
 */
import bcrypt from "bcryptjs";
import { parseArgs } from "node:util";
import pool, { withTransaction } from "../src/db.js";
import config from "../src/config.js";
import { isEmail, normaliseEmail, normalisePhone } from "../src/utils/validators.js";

const { values } = parseArgs({
  options: {
    email: { type: "string", default: "admin@gmail.com" },
    password: { type: "string", default: "admin" },
    name: { type: "string", default: "System Administrator" },
    phone: { type: "string" },
    "employee-id": { type: "string" },
    area: { type: "string", default: "Nugegoda" },
    "admin-role": { type: "string", default: "admin" },
  },
});

const email = normaliseEmail(values.email);
if (!isEmail(email)) {
  console.error(`"${values.email}" is not a valid e-mail address.`);
  process.exit(1);
}
const phone = values.phone ? normalisePhone(values.phone) : null;
if (values.phone && !phone) {
  console.error(`"${values.phone}" is not a valid Sri Lankan phone number.`);
  process.exit(1);
}
if (values.password === "admin" && config.isProduction) {
  console.error('Refusing to create an admin with the password "admin" in production.');
  process.exit(1);
}

const hash = await bcrypt.hash(values.password, config.bcryptRounds);

try {
  const result = await withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO user_account
         (email, password_hash, full_name, phone, role, account_status, strike_count, email_verified, created_at)
       VALUES ($1, $2, $3, $4, 'admin', 'active', 0, true, now())
       ON CONFLICT (email) DO UPDATE
         SET password_hash = EXCLUDED.password_hash,
             full_name     = EXCLUDED.full_name,
             phone         = coalesce(EXCLUDED.phone, user_account.phone),
             role          = 'admin',
             account_status = 'active'
       RETURNING user_id, (xmax = 0) AS inserted`,
      [email, hash, values.name, phone]
    );
    const { user_id, inserted } = rows[0];

    const existingAdmin = await client.query(`SELECT admin_id FROM admin WHERE user_id = $1`, [user_id]);
    if (existingAdmin.rowCount) {
      await client.query(`UPDATE admin SET account_status = 'active' WHERE user_id = $1`, [user_id]);
    } else {
      const employeeId = values["employee-id"]
        ? Number(values["employee-id"])
        : (await client.query(`SELECT coalesce(max(employee_id), 990000) + 1 AS next FROM admin`)).rows[0].next;
      await client.query(
        `INSERT INTO admin (user_id, employee_id, admin_role, assigned_area, joined_date, account_status)
         VALUES ($1, $2, $3, $4, current_date, 'active')`,
        [user_id, employeeId, values["admin-role"], values.area]
      );
    }
    return { user_id, inserted };
  });

  console.log(
    `${result.inserted ? "Created" : "Updated"} admin ${email} (user_id ${result.user_id}). ` +
      "They can now log in at /login and will be sent to the admin dashboard."
  );
} catch (err) {
  console.error("Could not create admin:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
