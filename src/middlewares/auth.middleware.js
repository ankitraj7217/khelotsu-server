import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async(req, _ , next) => {
    try {
        const token = req.cookies?.accessToken || req.headers.get("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError("401", "Unauthorised Access.");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decodedToken) {
            throw new ApiError(401, "Unauthorised Access. Token not decoded successfully.")
        }

        const user = await User.findOne({userid: decodedToken?.userid}).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorised Access. User not available.")
        }

        req.user = user;

        next();

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            // 48 -> my favourite number :)
            throw new ApiError(448, "Token expired. Please send refresh token.")
        }
        throw new ApiError(401, error?.message || "Invalid access token.")
    }
})