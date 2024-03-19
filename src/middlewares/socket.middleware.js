import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Room } from "../models/room.model.js";

export const socketMiddlewareValidation = asyncHandler(async (socket, next) => {
    try {
        const accessToken = socket?.handshake?.auth?.token?.replace(/^Bearer\s?["']?([^"']*)["']?$/, '$1');
        const roomName = socket?.handshake?.query?.roomName

        if (!accessToken || !roomName) {
            throw new Error("Please send access token and room name.");
        }


        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if (!decodedToken) {
            throw new Error("Unauthorised access");
        }

        const user = await User.findOne({ userid: decodedToken?.userid }).select("-password -refreshToken");

        if (!user) {
            throw new Error("Unauthorised Access. User not available.")
        }

        // Check if the user has access to the room
        const room = await Room.findOne({ roomId: roomName }).populate("generatorUserID").exec();
    
        if (!room) {
            throw new ApiError(404, "Room doesn't exist.");
        }
        const isAllowed = room.joineeUserIDs.includes(user._id) || room.generatorUserID.username === user.username;


        if (!isAllowed) {
            throw new Error("Unauthorized access to the chat room.");
        }

        socket.user = user;
        socket.roomName = roomName;

        next();

    } catch (error) {
        next(error)
    }
})
