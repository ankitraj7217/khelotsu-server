import {model, Schema } from "mongoose";

const roomSchema = new Schema({
    roomId: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    generatorUserID: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    joineeUserIDs: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true }
)

export const Room = model("Room", roomSchema);