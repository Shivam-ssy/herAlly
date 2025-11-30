import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Report from "../models/report.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// USER CONTROLLERS

// Create a new report (User)
const createReport = asyncHandler(async (req, res) => {
    const { toReportedNgo, type, description, location, urgency, isVisibleToAllNgo } = req.body;
    const userId = req.user._id;
    // console.log("report", req.body);
    
    if (!type) {
        throw new ApiError(400, "Report type is required");
    }

    // Validate NGO if specified
    if (toReportedNgo && !mongoose.Types.ObjectId.isValid(toReportedNgo)) {
        throw new ApiError(400, "Invalid NGO ID");
    }

    if (toReportedNgo) {
        const ngo = await User.findOne({ _id: toReportedNgo, role: "ngo" });
        if (!ngo) {
            throw new ApiError(404, "NGO not found");
        }
    }

    const report = await Report.create({
        reporter: userId,
        toReportedNgo: toReportedNgo || null,
        type,
        description,
        location,
        urgencyLevel: urgency || 'medium',
        isVisibleToAllNgo: isVisibleToAllNgo || false
    });

    return res.status(201).json(
        new ApiResponse(201, report, "Report created successfully")
    );
});

// Get user's own reports
const getUserReports = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { status, type, urgencyLevel } = req.query;

    const filter = { reporter: userId };
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (urgencyLevel) filter.urgencyLevel = urgencyLevel;

    const reports = await Report.find(filter)
        .populate('toReportedNgo', 'name email ngoDetails')
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, reports, "Reports fetched successfully")
    );
});

// Get single report details (User)
const getReportById = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
        throw new ApiError(400, "Invalid report ID");
    }

    const report = await Report.findOne({
        _id: reportId,
        reporter: userId
    }).populate('toReportedNgo', 'username email ngoDetails');

    if (!report) {
        throw new ApiError(404, "Report not found");
    }

    return res.status(200).json(
        new ApiResponse(200, report, "Report fetched successfully")
    );
});

// NGO CONTROLLERS

// Get reports for NGO
const getNgoReports = asyncHandler(async (req, res) => {
    const ngoId = req.user._id;
    const { status, type, urgencyLevel } = req.query;

    const filter = {
        $or: [
            { toReportedNgo: ngoId },
            { isVisibleToAllNgo: true, toReportedNgo: null }
        ]
    };

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (urgencyLevel) filter.urgencyLevel = urgencyLevel;

    const reports = await Report.find(filter)
        .populate('reporter', 'username email')
        .sort({ urgencyLevel: -1, createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, reports, "Reports fetched successfully")
    );
});

// Update report status (NGO)
const updateReportStatus = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { status, reasonForRejection } = req.body;
    const ngoId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
        throw new ApiError(400, "Invalid report ID");
    }

    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    const validStatuses = ['pending', 'reviewed', 'processing', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    if (status === 'rejected' && !reasonForRejection) {
        throw new ApiError(400, "Reason for rejection is required when rejecting a report");
    }

    const report = await Report.findOne({
        _id: reportId,
        $or: [
            { toReportedNgo: ngoId },
            { isVisibleToAllNgo: true, toReportedNgo: null }
        ]
    });

    if (!report) {
        throw new ApiError(404, "Report not found or you don't have access to this report");
    }

    report.status = status;
    if (status === 'rejected') {
        report.reasonForRejection = reasonForRejection;
    }

    await report.save();

    const updatedReport = await Report.findById(reportId)
        .populate('reporter', 'username email')
        .populate('toReportedNgo', 'username email ngoDetails');

    return res.status(200).json(
        new ApiResponse(200, updatedReport, "Report status updated successfully")
    );
});

// Get single report details for NGO
const getNgoReportById = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const ngoId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
        throw new ApiError(400, "Invalid report ID");
    }

    const report = await Report.findOne({
        _id: reportId,
        $or: [
            { toReportedNgo: ngoId },
            { isVisibleToAllNgo: true, toReportedNgo: null }
        ]
    })
        .populate('reporter', 'username email')
        .populate('toReportedNgo', 'username email ngoDetails');

    if (!report) {
        throw new ApiError(404, "Report not found or you don't have access to this report");
    }

    return res.status(200).json(
        new ApiResponse(200, report, "Report fetched successfully")
    );
});

// NGO ADMIN CONTROLLERS

// Get all reports (Admin)
const getAllReports = asyncHandler(async (req, res) => {
    const { status, type, urgencyLevel, ngoId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (urgencyLevel) filter.urgencyLevel = urgencyLevel;
    if (ngoId && mongoose.Types.ObjectId.isValid(ngoId)) {
        filter.toReportedNgo = ngoId;
    }

    const reports = await Report.find(filter)
        .populate('reporter', 'username email')
        .populate('toReportedNgo', 'username email ngoDetails')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalReports = await Report.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, {
            reports,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalReports / limit),
                totalReports,
                limit
            }
        }, "Reports fetched successfully")
    );
});

// Get report statistics (Admin)
const getReportStats = asyncHandler(async (req, res) => {
    const { ngoId } = req.query;

    const matchFilter = ngoId && mongoose.Types.ObjectId.isValid(ngoId)
        ? { toReportedNgo: new mongoose.Types.ObjectId(ngoId) }
        : {};

    const stats = await Report.aggregate([
        { $match: matchFilter },
        {
            $facet: {
                statusStats: [
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 }
                        }
                    }
                ],
                typeStats: [
                    {
                        $group: {
                            _id: "$type",
                            count: { $sum: 1 }
                        }
                    }
                ],
                urgencyStats: [
                    {
                        $group: {
                            _id: "$urgencyLevel",
                            count: { $sum: 1 }
                        }
                    }
                ],
                totalReports: [
                    {
                        $count: "count"
                    }
                ],
                recentReports: [
                    { $sort: { createdAt: -1 } },
                    { $limit: 5 },
                    {
                        $lookup: {
                            from: "users",
                            localField: "reporter",
                            foreignField: "_id",
                            as: "reporter"
                        }
                    },
                    { $unwind: { path: "$reporter", preserveNullAndEmptyArrays: true } }
                ]
            }
        }
    ]);

    const result = {
        totalReports: stats[0].totalReports[0]?.count || 0,
        byStatus: stats[0].statusStats,
        byType: stats[0].typeStats,
        byUrgency: stats[0].urgencyStats,
        recentReports: stats[0].recentReports
    };

    return res.status(200).json(
        new ApiResponse(200, result, "Report statistics fetched successfully")
    );
});

// Get NGO-wise report count (Admin)
const getNgoReportCounts = asyncHandler(async (req, res) => {
    const ngoReportCounts = await Report.aggregate([
        {
            $match: {
                toReportedNgo: { $ne: null }
            }
        },
        {
            $group: {
                _id: "$toReportedNgo",
                totalReports: { $sum: 1 },
                pending: {
                    $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                },
                reviewed: {
                    $sum: { $cond: [{ $eq: ["$status", "reviewed"] }, 1, 0] }
                },
                processing: {
                    $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] }
                },
                resolved: {
                    $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] }
                },
                rejected: {
                    $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
                }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "ngoDetails"
            }
        },
        {
            $unwind: "$ngoDetails"
        },
        {
            $project: {
                _id: 1,
                ngoName: "$ngoDetails.username",
                ngoEmail: "$ngoDetails.email",
                totalReports: 1,
                pending: 1,
                reviewed: 1,
                processing: 1,
                resolved: 1,
                rejected: 1
            }
        },
        { $sort: { totalReports: -1 } }
    ]);

    return res.status(200).json(
        new ApiResponse(200, ngoReportCounts, "NGO report counts fetched successfully")
    );
});

// Delete report (Admin only)
const deleteReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
        throw new ApiError(400, "Invalid report ID");
    }

    const report = await Report.findByIdAndDelete(reportId);

    if (!report) {
        throw new ApiError(404, "Report not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Report deleted successfully")
    );
});

export {
    // User controllers
    createReport,
    getUserReports,
    getReportById,
    
    // NGO controllers
    getNgoReports,
    updateReportStatus,
    getNgoReportById,
    
    // Admin controllers
    getAllReports,
    getReportStats,
    getNgoReportCounts,
    deleteReport
};