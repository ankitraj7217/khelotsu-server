import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addPersonsInRoom, createRoom, removePersonInRoom } from "../controllers/room.controller.js";

const router = Router();

router.get("/test", (req, res) => {
    res.status(200).send("OK");
});

router.post("/createRoom", verifyJWT, createRoom);
router.post("/addUsersInRoom", verifyJWT, addPersonsInRoom);
router.post("/removeUserInRoom", verifyJWT, removePersonInRoom);

export default router;