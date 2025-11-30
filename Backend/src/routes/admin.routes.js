import { Router } from "express";
import {
    getNGOs,
    getNGOById,
    approveNGO,
    rejectNGO,
    revokeNGOVerification,
    getVerificationStats,
    updateNGODetails
} from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/verifyRole.middleware.js";

const router = Router();

// Get NGOs with query filter (pending/verified)
router.route("/admin/ngos").get(verifyJWT, verifyRole(["admin"]), getNGOs);

// Get verification statistics
router.route("/admin/ngos/stats").get(verifyJWT, verifyRole(["admin"]), getVerificationStats);

// Get single NGO by ID
router.route("/admin/ngos/:ngoId").get(verifyJWT, verifyRole(["admin"]), getNGOById);

// Approve NGO
router.route("/admin/ngos/:ngoId/approve").post(verifyJWT, verifyRole(["admin"]), approveNGO);

// Reject NGO
router.route("/admin/ngos/:ngoId/reject").post(verifyJWT, verifyRole(["admin"]), rejectNGO);

// Revoke verification
router.route("/admin/ngos/:ngoId/revoke").post(verifyJWT, verifyRole(["admin"]), revokeNGOVerification);

// Update NGO details
router.route("/admin/ngos/:ngoId").patch(verifyJWT, verifyRole(["admin"]), updateNGODetails);

export default router;