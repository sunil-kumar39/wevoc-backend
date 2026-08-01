import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { publishVoice } from "../controllers/voice.controller.js";

const router = Router();

router.route("/publish").post(
    verifyJWT,
    upload.fields([
        {
            name: "voiceFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishVoice
);

export default router;