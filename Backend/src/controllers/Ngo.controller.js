import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/Message.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
const options = {

    httpOnly: true,
    secure: true,
    maxAge: 7200000,
    sameSite: 'None'
}

const listNgos = asyncHandler(async (req, res) => {
    const ngoList = await User.find({
        role: "ngo",
        "ngoDetails.isVerified": true
    }).select("-password -accessToken -refreshToken");
    if (!ngoList)
        throw new ApiError(500, "Something went wrong while fetching")
    return res.status(200).json(
        new ApiResponse(200, ngoList, "Fetched successfully")
    )

})

const getNgoById = asyncHandler(async (req, res) => {
    const ngoId = req.params.id;

    const ngo = await User.findById(ngoId).select("-password -accessToken -refreshToken");
    if (!ngo)
        throw new ApiError(404, "NGO not found")
    return res.status(200).json(
        new ApiResponse(200, ngo, "NGO fetched successfully")
    )
})

const listConnectedUser = asyncHandler(async (req, res) => {
    const NgoUser = req.user;

    // console.log("ngo", NgoUser);

    if (!NgoUser || !mongoose.Types.ObjectId.isValid(NgoUser._id)) {
        throw new ApiError(400, "Invalid NGO ID");
    }

    const ngoObjectId = new mongoose.Types.ObjectId(NgoUser._id);

    const messages = await Message.aggregate([
        { $match: { recipient: ngoObjectId } },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: "$sender",
                latestMessage: { $first: "$$ROOT" }
            }
        },
        { $replaceRoot: { newRoot: "$latestMessage" } }
    ]);

    if (!messages.length) {
        throw new ApiError(404, "No users found");
    }

    const uniqueSenderIds = [...new Set(messages.map(m => m.sender.toString()))];

    const users = await User.find({ _id: { $in: uniqueSenderIds } })
        .select("-password -accessToken -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, users, "Unique users fetched successfully"));
});

export { listNgos, listConnectedUser ,getNgoById};