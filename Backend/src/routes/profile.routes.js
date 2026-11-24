import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";

const router = Router();

// Profile endpoints require an authenticated user
router.use(requireAuth);

router.get("/", getProfile);
router.put("/", updateProfile);

export default router;
