import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { registerUser, loginUser, logoutUser,refreshAccessToken } from "../controllers/user.controller";

const router = Router();

router.post("/register").post(registerUser)
router.post("/login").post(loginUser)
router.post("/logout").post(verifyJWT, logoutUser)
router.post("/refreshToken ").post(verifyJWT, refreshAccessToken)


export default router;