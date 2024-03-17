import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, res , next) => {
    try {
        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace(/^Bearer\s?["']?([^"']*)["']?$/, '$1');

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
            res.status(448)
                .json({message: "Token expired. Please send refresh token."})
        }
        res.status(401)
                .json({message: error?.message || "Invalid access token."})
    }
})