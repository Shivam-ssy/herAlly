import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const ngoDetailSchema = new mongoose.Schema({
    uniqueId: { type: String, unique: true, sparse: true },
    
    // Location
    state: { type: String },
    district: { type: String },
    address: {
        street: { type: String },
        area: { type: String },
        city: { type: String },
        pincode: { type: String }
    },
    
    // Organization Info
    organizationName: { type: String },
    overview: { type: String },
    
    // Contact Information
    contactInfo: {
        phone: { type: String },
        helpline: { type: String },
        email: { type: String },
        website: { type: String },
        workingHours: { type: String, default: "Monday - Sunday: 24/7" }
    },
    
    // Services Offered
    services: [{
        type: String,
        enum: [
            "24/7 Emergency Helpline",
            "Legal Aid & Counseling",
            "Shelter & Rehabilitation",
            "Medical Assistance",
            "Police Complaint Support",
            "Skill Development Programs"
        ]
    }],
    
    // Statistics
    statistics: {
        volunteers: { type: Number, default: 0 },
        casesHandled: { type: Number, default: 0 },
        successRate: { type: Number, default: 0, min: 0, max: 100 }
    },
    
    // Verification
    isVerified: { type: Boolean, default: false },
    verificationDocuments: [{ type: String }] // URLs to uploaded documents
}, { _id: false });
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        lowercase: true,
        unique: true,
        sparse: true
    },

    phone: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["user", "ngo", "admin"],
        default: "user"
    },

    // Only applicable when role = ngo
    ngoDetails: ngoDetailSchema,
    accessToken:{
        type: String
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});


// ---- Password Hashing ----
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ---- Password Compare ----
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// ---- Access Token ----
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// ---- Refresh Token ----
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

const User = mongoose.model("User", userSchema);
export { User };
