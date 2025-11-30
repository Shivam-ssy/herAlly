import { Router } from "express";
import {
    createReport,
    getUserReports,
    getReportById,
    getNgoReports,
    updateReportStatus,
    getNgoReportById,
    getAllReports,
    getReportStats,
    getNgoReportCounts,
    deleteReport
} from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/verifyRole.middleware.js";

const router = Router();

// Middleware to check if user is NGO
// const isNgo = (req, res, next) => {
//     if (req.user.role !== 'ngo') {
//         return res.status(403).json({
//             success: false,
//             message: "Access denied. Only NGOs can access this resource."
//         });
//     }
//     next();
// };

// // Middleware to check if user is admin
// const isAdmin = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//         return res.status(403).json({
//             success: false,
//             message: "Access denied. Only admins can access this resource."
//         });
//     }
//     next();
// };

// USER ROUTES
router.route("/create").post(verifyJWT, createReport);
router.route("/user/my-reports").get(verifyJWT, getUserReports);
// router.route("/user/:reportId").get(verifyJWT, getReportById);

// NGO ROUTES
router.route("/ngo/reports").get(verifyJWT, verifyRole(["ngo"]), getNgoReports);
router.route("/ngo/:reportId").get(verifyJWT, verifyRole(["ngo"]), getNgoReportById);
router.route("/ngo/:reportId/status").patch(verifyJWT, verifyRole(["ngo"]), updateReportStatus);

// ADMIN ROUTES
router.route("/admin/all").get(verifyJWT, verifyRole(["admin"]), getAllReports);
router.route("/admin/stats").get(verifyJWT, verifyRole(["admin"]), getReportStats);
router.route("/admin/ngo-counts").get(verifyJWT, verifyRole(["admin"]), getNgoReportCounts);
router.route("/admin/:reportId").delete(verifyJWT, verifyRole(["admin"]), deleteReport);

export default router;