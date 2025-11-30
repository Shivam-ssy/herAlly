import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
    {
        phone: {
            type: String,
            required: true,
            match: /^\d{10}$/
        },
        otp: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 600 // OTP expires after 10 minutes
        }
    },
    { timestamps: true }
);

// Index for faster queries
otpSchema.index({ phone: 1, createdAt: 1 });

export const OTP = mongoose.model("OTP", otpSchema);
