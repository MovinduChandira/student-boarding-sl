import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  getAdminApprovalListings,
  updateListingStatus,
} from "../controllers/listing.controller.js";

const router = Router();

// All listing approval routes require an authenticated admin
router.use(requireAuth, requireRole("admin"));

// GET /api/admin/listings - lists pending, approved, and rejected listings
router.get("/", getAdminApprovalListings);

// PATCH or PUT /api/admin/listings/:id/status - approve or reject
router.patch("/:id/status", updateListingStatus);
router.put("/:id/status", updateListingStatus);

export default router;
