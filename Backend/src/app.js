import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "./config.js";
import { query } from "./db.js";
import authRoutes from "./routes/auth.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import adminListingRoutes from "./routes/admin.listing.routes.js";
import profileRoutes from "./routes/profile.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors({ origin: config.clientOrigins, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

// Static file serving for uploaded room images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", async (_req, res) => {
  try {
    await query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "error", database: "unreachable" });
  }
});

// Application routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/admin/listings", adminListingRoutes);
app.use("/api/profile", profileRoutes);

// Unknown routes
app.use((_req, res) => res.status(404).json({ message: "Not found." }));

// Central error handler (Express 5 forwards rejected promises here automatically)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body must be valid JSON." });
  }
  if (err.message === "Only image files are allowed.") {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  return res.status(500).json({ message: "Something went wrong. Please try again." });
});

export default app;
