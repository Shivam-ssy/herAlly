import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// ---- Get NGOs with Query Filter (pending/verified/all) ----
const getNGOs = asyncHandler(async (req, res) => {
    const { status } = req.query;

    let query = { role: "ngo" };

    if (status === "pending") {
        query["ngoDetails.isVerified"] = false;
    } else if (status === "verified") {
        query["ngoDetails.isVerified"] = true;
    }

    const ngos = await User.find(query).select("-password -refreshToken -accessToken");

    if (!ngos) {
        throw new ApiError(500, "Something went wrong while fetching NGOs");
    }

    return res.status(200).json(
        new ApiResponse(200, ngos, `${status || 'All'} NGOs fetched successfully`)
    );
});

// ---- Get Single NGO Details ----
const getNGOById = asyncHandler(async (req, res) => {
    const { ngoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ngoId)) {
        throw new ApiError(400, "Invalid NGO ID");
    }

    const ngo = await User.findOne({
        _id: ngoId,
        role: "ngo"
    }).select("-password -refreshToken -accessToken");

    if (!ngo) {
        throw new ApiError(404, "NGO not found");
    }

    return res.status(200).json(
        new ApiResponse(200, ngo, "NGO details fetched successfully")
    );
});

// ---- Approve NGO ----
const approveNGO = asyncHandler(async (req, res) => {
    const { ngoId } = req.params;
    const { uniqueId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(ngoId)) {
        throw new ApiError(400, "Invalid NGO ID");
    }

    const ngo = await User.findOne({
        _id: ngoId,
        role: "ngo"
    });

    if (!ngo) {
        throw new ApiError(404, "NGO not found");
    }

    if (ngo.ngoDetails.isVerified) {
        throw new ApiError(400, "NGO is already verified");
    }

    ngo.ngoDetails.isVerified = true;
    
    if (uniqueId) {
        ngo.ngoDetails.uniqueId = uniqueId;
    }

    await ngo.save();

    const responseData = {
        _id: ngo._id,
        organizationName: ngo.ngoDetails.organizationName,
        isVerified: ngo.ngoDetails.isVerified,
        uniqueId: ngo.ngoDetails.uniqueId
    };

    return res.status(200).json(
        new ApiResponse(200, responseData, "NGO approved successfully")
    );
});

// ---- Reject NGO ----
const rejectNGO = asyncHandler(async (req, res) => {
    const { ngoId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(ngoId)) {
        throw new ApiError(400, "Invalid NGO ID");
    }

    const ngo = await User.findOne({
        _id: ngoId,
        role: "ngo"
    });

    if (!ngo) {
        throw new ApiError(404, "NGO not found");
    }

    await User.findByIdAndDelete(ngoId);

    return res.status(200).json(
        new ApiResponse(200, null, `NGO rejected and removed${reason ? `: ${reason}` : ""}`)
    );
});

// ---- Revoke NGO Verification ----
const revokeNGOVerification = asyncHandler(async (req, res) => {
    const { ngoId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(ngoId)) {
        throw new ApiError(400, "Invalid NGO ID");
    }

    const ngo = await User.findOne({
        _id: ngoId,
        role: "ngo"
    });

    if (!ngo) {
        throw new ApiError(404, "NGO not found");
    }

    if (!ngo.ngoDetails.isVerified) {
        throw new ApiError(400, "NGO is not verified");
    }

    ngo.ngoDetails.isVerified = false;
    await ngo.save();

    const responseData = {
        _id: ngo._id,
        organizationName: ngo.ngoDetails.organizationName,
        isVerified: ngo.ngoDetails.isVerified
    };

    return res.status(200).json(
        new ApiResponse(200, responseData, `Verification revoked${reason ? `: ${reason}` : ""}`)
    );
});

// ---- Get Verification Statistics ----
const getVerificationStats = asyncHandler(async (req, res) => {
    const totalNGOs = await User.countDocuments({ role: "ngo" });
    const verifiedNGOs = await User.countDocuments({ 
        role: "ngo", 
        "ngoDetails.isVerified": true 
    });
    const pendingNGOs = await User.countDocuments({ 
        role: "ngo", 
        "ngoDetails.isVerified": false 
    });

    const stats = {
        total: totalNGOs,
        verified: verifiedNGOs,
        pending: pendingNGOs,
        verificationRate: totalNGOs > 0 
            ? ((verifiedNGOs / totalNGOs) * 100).toFixed(2) 
            : 0
    };

    return res.status(200).json(
        new ApiResponse(200, stats, "Verification statistics fetched successfully")
    );
});

// ---- Update NGO Details ----
const updateNGODetails = asyncHandler(async (req, res) => {
    const { ngoId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(ngoId)) {
        throw new ApiError(400, "Invalid NGO ID");
    }

    delete updates.password;
    delete updates.refreshToken;
    delete updates.accessToken;
    delete updates.role;

    const ngo = await User.findOneAndUpdate(
        { _id: ngoId, role: "ngo" },
        { $set: updates },
        { new: true, runValidators: true }
    ).select("-password -refreshToken -accessToken");

    if (!ngo) {
        throw new ApiError(404, "NGO not found");
    }

    return res.status(200).json(
        new ApiResponse(200, ngo, "NGO details updated successfully")
    );
});

export {
    getNGOs,
    getNGOById,
    approveNGO,
    rejectNGO,
    revokeNGOVerification,
    getVerificationStats,
    updateNGODetails
};