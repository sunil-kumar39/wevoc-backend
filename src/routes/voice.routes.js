import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

import {
    publishVoice,
    getAllVoices,
    getVoiceById,
    updateVoice,
    deleteVoice,
} from "../controllers/voice.controller.js";

const router = Router();


// Public routes
router.route("/")
    .get(getAllVoices);

router.route("/:voiceId")
    .get(getVoiceById);


// Protected routes
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

router.route("/:voiceId").patch(
    verifyJWT,
    upload.single("thumbnail"),
    updateVoice
);

router.route("/:voiceId").delete(
    verifyJWT,
    deleteVoice
);

export default router;