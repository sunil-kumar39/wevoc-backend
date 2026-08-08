import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleVoiceLike } from "../controllers/like.controller.js";

const router = Router();

router.route("/toggle/voice/:voiceId").post(
    verifyJWT,
    toggleVoiceLike
);

export default router;