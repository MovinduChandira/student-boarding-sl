import jwt from "jsonwebtoken";
import config from "../config.js";

/**
 * Reads the JWT from the httpOnly cookie (or an "Authorization: Bearer" header,
 * which is handy when testing with Postman) and attaches the payload to req.user.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : null;
  const token = req.cookies?.[config.cookieName] || bearer;

  if (!token) {
    return res.status(401).json({ message: "Please log in to continue." });
  }

  try {
    req.user = jwt.verify(token, config.jwt.secret);
    return next();
  } catch {
    return res.status(401).json({ message: "Your session has expired. Please log in again." });
  }
}

/**
 * Role-based access control. Use after requireAuth, e.g.
 *   router.get("/admin/stats", requireAuth, requireRole("admin"), handler)
 */
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to do that." });
    }
    return next();
  };
