import { ApiError, getErrorStatusAndMessage } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Room } from "../models/room.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

//TODO: roomName is same as roomId -> Maybe, we can enhance this feature later on
const createRoom = asyncHandler(async (req, res) => {
    try {
        const { roomName } = req?.body;
        if (!roomName || roomName.length === 0) {
            return new ApiError(400, "Room Name is required.")
        }
        const existingRoom = await Room.findOne({ roomId: roomName })

        if (existingRoom) {
            throw new ApiError(400, "Room already exists. Select other room name.");
        }

        const createdRoom = await Room.create({
            roomId: roomName,
            generatorUserID: req.user,
            joineeUserIDs: []
        });

        if (!createdRoom) {
            throw new ApiError(500, "Error in creating room.");
        }

        return res.status(200)
            .json(
                new ApiResponse(200, roomName, "Room created successfully.")
            )
    } catch (err) {
        const errorDetails = getErrorStatusAndMessage(err)
        res.status(errorDetails.statusCode)
            .json({ message: errorDetails.message });
    }
})


// permittedUsers: username
const addPersonsInRoom = asyncHandler(async (req, res) => {
    try {
        const { roomName, permittedUsers } = req?.body;

        if (!roomName || roomName.length == 0) {
            throw new ApiError(404, "Please send valid room name")
        }
        if (!Array.isArray(permittedUsers) || permittedUsers.length === 0) {
            throw new ApiError(404, "Please send user ids list")
        }

        const room = await Room.findOne({roomId: roomName}).populate("generatorUserID").exec()
        if (!room) {
            throw new ApiError(404, "Room doesn't exist")
        }
        // user details always comes with accesToken
        if (room.generatorUserID.username !== req.user.username) {
            throw new ApiError(401, "Unauthorised Access. You can't edit someone else's room.")
        }

        //TODO: can be made more specific -> which user doesn't exist
        const existingUsers = await User.find({ username: {$in: permittedUsers}}).exec();
        if (existingUsers.length !== permittedUsers.length) {
            throw new ApiError(404, "Some users doesn't exist. Please check.")
        }

        room.joineeUserIDs = existingUsers.map(ele => ele._id)

        room.save()

        return res.status(201)
                  .json(new ApiResponse(201, {roomName}, "Users permitted."));

    } catch (err) {
        const errorDetails = getErrorStatusAndMessage(err)
        res.status(errorDetails.statusCode)
            .json({ message: errorDetails.message });
    }
})

// Send username
const removePersonInRoom = asyncHandler(async (req, res) => {
    try {
        const { roomName, userToRemove } = req?.body;

        if (!roomName || roomName.length == 0) {
            throw new ApiError(404, "Please send a valid room name.");
        }
        if (!userToRemove) {
            throw new ApiError(404, "Please send the user to remove.");
        }

        const room = await Room.findOne({ roomId: roomName }).populate("generatorUserID").exec();
        if (!room) {
            throw new ApiError(404, "Room doesn't exist.");
        }

        // Check if the user making the request is the generator of the room
        if (room.generatorUserID.username !== req.user.username) {
            throw new ApiError(401, "Unauthorized Access. You can't edit someone else's room.");
        }

        // Find the user to remove
        const user = await User.findOne({ username: userToRemove }).exec();
        if (!user) {
            throw new ApiError(404, "User to remove doesn't exist.");
        }

        // Check if the user to remove is already in the room
        const userIndex = room.joineeUserIDs.indexOf(user._id.toString());
        if (userIndex === -1) {
            throw new ApiError(404, "User to remove is not in the room.");
        }

        // Remove the user from the room
        room.joineeUserIDs.splice(userIndex, 1);

        // Save the updated room
        await room.save();

        return res.status(200)
                .json(new ApiResponse(200, { userToRemove }, "User removed successfully."));
    } catch (err) {
        const errorDetails = getErrorStatusAndMessage(err)
        res.status(errorDetails.statusCode)
            .json({ message: errorDetails.message });
    }
});

const personsAllowedInRoom = asyncHandler(async(req, res) => {
    try {
        const { roomName } = req.body;

        if (!roomName || roomName.length == 0) {
            throw new ApiError(404, "Please send a valid room name.");
        }

        // Find the room by its name and populate the generatorUserID and joineeUserIDs
        const room = await Room.findOne({ roomId: roomName }).populate("generatorUserID joineeUserIDs").exec();
        if (!room) {
            throw new ApiError(404, "Room doesn't exist.");
        }

        // // Check if the user making the request is the generator of the room
        // not required.
        // if (room.generatorUserID.username !== req.user.username) {
        //     throw new ApiError(401, "Unauthorized Access. You can't view users in someone else's room.");
        // }



        // Retrieve user IDs and usernames of permitted users
        const permittedUsers = room.joineeUserIDs.map(user => ({
            userId: user.userid,
            username: user.username
        }));

        // Include the generatorUserID in the response
        const generatorUser = {
            userId: room.generatorUserID.userid,
            username: room.generatorUserID.username
        };

        // Combine generatorUser and permittedUsers into a single list
        const allUsers = [generatorUser, ...permittedUsers];
        console.log(allUsers, generatorUser, permittedUsers);

        // Check if the user making the request is in the list of permitted users
        const isUserPermitted = allUsers.some(user => user.username === req.user.username);
        if (!isUserPermitted) {
            throw new ApiError(401, "Unauthorized Access. You are not permitted to view users in this room.");
        }

        return res.status(200)
                .json(new ApiResponse(200, allUsers, "Permitted users in the room."));
    } catch (err) {
        const errorDetails = getErrorStatusAndMessage(err);
        res.status(errorDetails.statusCode)
            .json({ message: errorDetails.message });
    }
});


const isPersonAllowedInRoom = asyncHandler(async(req, res) => {
    try {
        const { roomName } = req.body;

        if (!roomName) {
            throw new ApiError(400, "Please provide both username and room name.");
        }

        // Find the room by its name
        const room = await Room.findOne({ roomId: roomName }).populate("generatorUserID").exec();
        if (!room) {
            throw new ApiError(404, "Room doesn't exist.");
        }

        // // Check if the user making the request is the generator of the room
        // not required here
        // if (room.generatorUserID.username !== req.user.username) {
        //     throw new ApiError(401, "Unauthorized Access. You can't check users in someone else's room.");
        // }

        // Check if the user is in the room
        const isAllowed = room.joineeUserIDs.includes(req.user._id) || room.generatorUserID.username === req.user.username;

        return res.status(200).json(new ApiResponse(200, { isAllowed }, "User permission checked."));
    } catch (err) {
        const errorDetails = getErrorStatusAndMessage(err);
        res.status(errorDetails.statusCode)
            .json({ message: errorDetails.message });
    }
});


export { createRoom, addPersonsInRoom, removePersonInRoom, personsAllowedInRoom, isPersonAllowedInRoom }