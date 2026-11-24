# Boarding.lk – Backend (Auth)

Node.js + Express + PostgreSQL API for Boarding.lk.
Current scope: **register, login, logout** (and `GET /me` to check the session).

## 1. Setup

1. **Restore the database** – in pgAdmin create a database called `boarding_lk`, then
   right-click it → *Restore…* → choose `boarding_lk_final_2026_11_07.backup`.
2. **Configure** – copy `.env.example` to `.env` and set `DB_PASSWORD` and `JWT_SECRET`.
3. **Install** – `npm install`
4. **Add the test admin** (`admin@gmail.com` / `admin`):
   ```
   npm run create-admin
   ```
5. **Run** – `npm run dev` → API on http://localhost:5000
6. In another terminal start the frontend (`cd ../Frontend && npm run dev`). Vite forwards
   `/api` requests to the backend, so just open http://localhost:5173.

## 2. Endpoints

| Method | Path                 | Body                                                         | Notes |
|--------|----------------------|--------------------------------------------------------------|-------|
| POST   | `/api/auth/register` | `{ role, name, email, phone, password, nic? }`               | `role` must be `student` or `owner`. `nic` is required for owners. Logs the user in. |
| POST   | `/api/auth/login`    | `{ email, password }`                                        | `email` can also be a phone number (`0771234567`). |
| POST   | `/api/auth/logout`   | –                                                            | Clears the login cookie. |
| GET    | `/api/auth/me`       | –                                                            | Returns the logged-in user, or 401. |
| GET    | `/api/health`        | –                                                            | Checks the database connection. |

Successful login/register returns `{ user: { id, name, email, phone, role } }` and sets an
**httpOnly cookie** (`boarding_token`) containing a JWT. The browser sends it automatically;
JavaScript can't read it, which protects it from XSS. For Postman you can also send
`Authorization: Bearer <token>`.

## 3. How admin access works

- `/register` **rejects** `role: "admin"` – nobody can sign up as an admin.
- A user can log in as admin only if **both** are true:
  1. their `user_account.role` is `'admin'`, and
  2. there is a row in the `admin` table for that `user_id` with `account_status = 'active'`.
- Add real admins with the script (it hashes the password and creates both rows):
  ```
  npm run create-admin -- --email someone@boarding.lk --password "StrongPass!" --name "Full Name" --phone 0771234567 --area Nugegoda
  ```
  Running it again for an existing e-mail resets that admin's password.
- Passwords are stored as bcrypt hashes, so you can't just type a plain password into
  `password_hash` in pgAdmin – use the script.
- To block an admin, set `admin.account_status` to anything other than `'active'`.

## 4. Rules applied

- E-mails are stored lower-case; phone numbers are stored as `+94XXXXXXXXX`.
- E-mail, phone and NIC must be unique.
- New accounts get `account_status = 'active'`, `strike_count = 0`, `email_verified = false`,
  plus a `student_profile` or `owner_profile` row (created in one transaction).
- Accounts whose `account_status` isn't `'active'` (e.g. `'suspended'` after three strikes)
  can't log in, and `/me` signs them out.
- `last_login_at` is updated on every login.
- Login is rate-limited to 10 failed attempts per 15 minutes per IP.
- The demo users in the backup (`kavindu.perera@example.com`, etc.) have the placeholder hash
  `DEMO_NOT_A_REAL_HASH`, so they can't log in until you register real accounts or reset them.

## 5. Protecting future routes

```js
import { requireAuth, requireRole } from "../middleware/auth.js";

router.get("/admin/summary", requireAuth, requireRole("admin"), handler);
router.post("/listings", requireAuth, requireRole("owner"), handler);
```
Inside the handler, `req.user.sub` is the `user_id` and `req.user.role` is the role.

## 6. Folder structure

```
Backend/
├── scripts/create-admin.js        add/update an admin in the DB
└── src/
    ├── server.js                  starts the server
    ├── app.js                     express app, middleware, routes
    ├── config.js                  reads .env
    ├── db.js                      PostgreSQL pool + transaction helper
    ├── routes/auth.routes.js
    ├── controllers/auth.controller.js
    ├── middleware/auth.js         requireAuth / requireRole
    └── utils/validators.js
```
