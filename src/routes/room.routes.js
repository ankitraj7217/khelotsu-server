import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addPersonsInRoom, createRoom, removePersonInRoom } from "../controllers/room.controller";

const router = Router();

router.post("/createRoom").post(verifyJWT, createRoom);
router.post("/addUsersInRoom").post(verifyJWT, addPersonsInRoom);
router.post("/removePersonInRoom").post(verifyJWT, removePersonInRoom);

export default router;