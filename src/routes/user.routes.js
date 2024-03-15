import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerUser, loginUser, logoutUser,refreshAccessToken } from "../controllers/user.controller.js";

const router = Router();

router.get("/test", (req, res) => {
    res.status(200).send("OK");
});
router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", verifyJWT, logoutUser)
router.post("/refreshToken", verifyJWT, refreshAccessToken)


export default router;