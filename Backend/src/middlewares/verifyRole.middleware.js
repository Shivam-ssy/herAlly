import { ApiError } from "../utils/ApiError.js";
const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json(new ApiError(403, "Forbidden: No user role found"));
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json(new ApiError(403, "Forbidden: Insufficient role"));
        }
        next();
    };
};

export { verifyRole };