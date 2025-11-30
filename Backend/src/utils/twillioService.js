import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const sendOTPViaSMS = async (phone, otp) => {
    try {
        const message = await client.messages.create({
            body: `Your OTP for password reset is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`,
            from: twilioPhone,
            to: `+91${phone}` // Adjust country code as needed
        });

        return {
            success: true,
            messageSid: message.sid
        };
    } catch (error) {
        console.error("Twilio Error:", error);
        return {
            success: false,
            error: error.message
        };
    }
};
