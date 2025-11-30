import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { OTP } from "../models/otp.model.js";
import { sendOTPViaSMS } from "../utils/twillioService.js";

const options = {
    httpOnly: true,
    secure: true,
    maxAge: 7200000,
    sameSite: "None"
};

// Generate tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Error while generating tokens");
    }
};

// ---------------- REGISTER ----------------
const registerUser = asyncHandler(async (req, res) => {
    const { phone, password, role, ngoDetails } = req.body;
    // console.log(req.body);
    
    // Validate required fields
    if (!phone || !password) {
        throw new ApiError(400, "Phone and password are required");
    }

    // Validate phone format (basic validation)
    if (!/^\d{10}$/.test(phone)) {
        throw new ApiError(400, "Phone number must be 10 digits");
    }

    // Check if user already exists
    const existedUser = await User.findOne({ phone });

    if (existedUser) {
        throw new ApiError(409, "User with this phone already exists");
    }

    // Auto-generate name only for normal users
    const generateRandomId = () => Math.floor(10000 + Math.random() * 90000);
    const autoName = `USER${generateRandomId()}`;

    let data = {
        name: role === "user" ? autoName : ngoDetails?.name || autoName,
        phone,
        password,
        role: role || "user" // Default to "user" if not provided
    };

    // If NGO → ensure required fields
    if (role === "ngo") {
        if (!ngoDetails?.uniqueId) {
            throw new ApiError(400, "NGO uniqueId is required for NGO registration");
        }
        
        // Validate NGO details structure
        if (!ngoDetails.state || !ngoDetails.district) {
            throw new ApiError(400, "NGO state and district are required");
        }
        
        // Check if NGO uniqueId already exists
        const existingNgo = await User.findOne({ "ngoDetails.uniqueId": ngoDetails.uniqueId });
        if (existingNgo) {
            throw new ApiError(409, "NGO with this uniqueId already exists");
        }
        
        data.ngoDetails = ngoDetails;
    }

    const user = await User.create(data);

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "Registered successfully")
    );
});

// ---------------- LOGIN ----------------
const loginUser = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;

    // Validate required fields
    if (!identifier || !password) {
        throw new ApiError(400, "Email/Phone and password are required");
    }

    let query = {};

    // Check if identifier is email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(identifier)) {
        query.email = identifier;
    } 
    // Otherwise treat as phone number
    else if (/^\d{10}$/.test(identifier)) {
        query.phone = identifier;
    } 
    else {
        throw new ApiError(400, "Invalid email or phone format");
    }

    // Find user
    const user = await User.findOne(query);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Validate password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { 
                    user: loggedInUser, 
                    accessToken, 
                    refreshToken 
                }, 
                "Login successful"
            )
        );
});

// ---------------- LOGOUT ----------------
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } }, // Changed "" to 1 for proper MongoDB unset
        { new: true }
    );

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// ---------------- REFRESH TOKEN ----------------
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token missing");
    }

    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Expired or invalid refresh token");
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed")
            );

    } catch (err) {
        throw new ApiError(401, err?.message || "Invalid refresh token");
    }
});

// ---------------- CHANGE PASSWORD ----------------
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    // Validate required fields
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required");
    }

    // Validate new password strength
    if (newPassword.length < 6) {
        throw new ApiError(400, "New password must be at least 6 characters long");
    }

    const user = await User.findById(req.user._id);

    const isCorrect = await user.isPasswordCorrect(oldPassword);
    
    if (!isCorrect) {
        throw new ApiError(400, "Incorrect old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    );
});

// ---------------- GET CURRENT USER ----------------
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    );
});

// ---------------- UPDATE USER PROFILE ----------------
const updateUserProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name && !email) {
        throw new ApiError(400, "At least one field (name or email) is required");
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ApiError(400, "Invalid email format");
        }
        
        // Check if email already exists
        const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
        if (existingUser) {
            throw new ApiError(409, "Email already in use");
        }
        updateData.email = email;
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Profile updated successfully")
    );
});

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ---------------- SEND OTP ----------------
const sendOTP = asyncHandler(async (req, res) => {
    const { phone } = req.body;

    // Validate phone number
    if (!phone || !/^\d{10}$/.test(phone)) {
        throw new ApiError(400, "Valid 10-digit phone number is required");
    }

    // Check if user exists
    const user = await User.findOne({ phone });
    if (!user) {
        throw new ApiError(404, "User with this phone number not found");
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTPs for this phone
    await OTP.deleteMany({ phone });

    // Save new OTP to database
    await OTP.create({ phone, otp });

    // Send OTP via Twilio
    const smsResult = await sendOTPViaSMS(phone, otp);

    if (!smsResult.success) {
        throw new ApiError(500, "Failed to send OTP. Please try again.");
    }

    return res.status(200).json(
        new ApiResponse(200, { phone }, "OTP sent successfully")
    );
});

// ---------------- VERIFY OTP & RESET PASSWORD ----------------
const resetPassword = asyncHandler(async (req, res) => {
    const { phone, otp, newPassword } = req.body;

    // Validate inputs
    if (!phone || !/^\d{10}$/.test(phone)) {
        throw new ApiError(400, "Valid 10-digit phone number is required");
    }

    if (!otp || otp.length !== 6) {
        throw new ApiError(400, "Valid 6-digit OTP is required");
    }

    if (!newPassword || newPassword.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long");
    }

    // Find the OTP record
    const otpRecord = await OTP.findOne({ phone, otp }).sort({ createdAt: -1 });

    if (!otpRecord) {
        throw new ApiError(401, "Invalid or expired OTP");
    }

    // Check if OTP is still valid (within 10 minutes)
    const currentTime = new Date();
    const otpTime = new Date(otpRecord.createdAt);
    const timeDiff = (currentTime - otpTime) / 1000 / 60; // in minutes

    if (timeDiff > 10) {
        await OTP.deleteOne({ _id: otpRecord._id });
        throw new ApiError(401, "OTP has expired. Please request a new one.");
    }

    // Find user and update password
    const user = await User.findOne({ phone });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Update password
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset successfully")
    );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserProfile,
    generateAccessAndRefreshTokens,
    sendOTP,
    resetPassword,
};