import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/user.routes.js";
import RoomRouter from "./routes/room.routes.js";

const app = express();

app.use(cors({
    origin: process.env.ALLOWED_CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/rooms", RoomRouter);

export { app }