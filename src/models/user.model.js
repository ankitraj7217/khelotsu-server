import {model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const userSchema = new Schema(
    {
        userid: {
            type: String,
            unique: true,
            index: true
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowecase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type: String,
            unique: true  // although, w/o this is also fine.
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if (!this.userid) this.userid = uuidv4();
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 8)
})

userSchema.methods.generateAccessToken = async function() {
    return jwt.sign(
        {
            userid: this.userid,
            username: this.username,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign(
        {
            userid: this.userid
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.isPasswordMatching = async function(pwd) {
    return await bcrypt.compare(pwd, this.password);
}

// Create index on username
userSchema.index({ username: 1 })

export const User = model("User", userSchema)