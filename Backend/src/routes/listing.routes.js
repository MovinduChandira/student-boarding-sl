import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { uploadImages } from "../middleware/upload.js";
import {
  createListing,
  getApprovedListings,
  getMyListings,
} from "../controllers/listing.controller.js";

const router = Router();

// Public / student & owner feed of approved listings
router.get("/", getApprovedListings);

// Owner's own listings (Active, Pending, Rejected, Draft)
router.get("/mine", requireAuth, requireRole("owner"), getMyListings);

// Owner creates a new listing (delivers to admin approval as 'pending')
router.post(
  "/",
  requireAuth,
  requireRole("owner"),
  uploadImages.array("images", 10),
  createListing
);

export default router;
