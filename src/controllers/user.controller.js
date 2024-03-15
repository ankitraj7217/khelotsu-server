import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshToken = async (userid = "", currUser) => {
    try {
        let user;
        if (currUser) {
            user = currUser;
        } else {
            // We get a better stack trace if any error happened using exec and get an actual promise.
            // Read about it here: https://stackoverflow.com/a/68469848
            user = await User.findOne().where("userid").equals(userid);
        }
        if (!user) {
            throw new ApiError(401, "No such id exists. Unauthorised access.")
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { username, email, password } = req?.body;

        if (
            [username, email, password].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required.");
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existedUser) {
            throw new ApiError(400, "User already exists.");
        }

        const createdUser = await User.create({
            username: username.toLowerCase(),
            email,
            password
        })

        if (!createdUser) {
            throw new ApiError(502, "Error while creating user.");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken("", createdUser);

        const options = {
            httpOnly: true,
            secure: true
        }

       res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                201,
                createdUser,
                "User registered successfully."
            )
        )
    } catch (err) {
        const errorDetails = new ApiError(err.statusCode ? err.statusCode : 500, err.message ? err.message : "Error while creating user.")
        res.status(err.statusCode ? err.statusCode : 500)
           .json({message: errorDetails.message});
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req?.body;

    if (
        [username, password].some((ele) => ele.trim() === "")
    ) {
        throw new ApiError(400, "Both username and password are required.")
    }

    const user = User.findOne({ username }).select("-password -refreshToken");

    if (!user) {
        throw ApiError(404, "User doesn't exist.")
    }

    const isPwdValid = await user.isPasswordMatching(password);

    if (!isPwdValid) {
        throw new ApiError(401, "Invalid user credentials.")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken("", user);

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                user,
                "User logged in successfully."
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findOneAndUpdate({
        userid: req.user.userid
    }, {
        $unset: {
            refreshToken: 1
        }
    }, {
        new: true
    }).select("-password");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully."))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const requestRefreshToken = req.cookies.refreshToken || req?.body?.refreshToken?.replace("Bearer ", "");

        if (!requestRefreshToken) {
            throw new ApiError(401, "Refresh Token not available.")
        }

        const decodedToken = jwt.verify(requestRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        if (!decodedToken || !"userid" in decodedToken) {
            throw new ApiError(401, "Unauthorised Access. Refresh token has expired or is malformed.")
        }

        const user = User.findOne({ userid: decodedToken.userid })

        if (!user || user?.refreshToken !== requestRefreshToken) {
            throw new ApiError(401, "Invalid refresh token")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken("", user);

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token generated successfully."))

    } catch (error) {
        throw new ApiError(500, "Error while generating access token.")
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}