import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { Users } from "../models/UserModule.models.js";
import { NgoUsers } from "../models/Ngo.model.js";
export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await Users.findById(decodedToken?._id).select("-password -refreshToken")
        const ngoUser=await NgoUsers.findById(decodedToken?._id).select("-password -refereshToken")
        if (!user && !ngoUser) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user || ngoUser;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})