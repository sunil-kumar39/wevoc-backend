import { Router } from "express";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import {
    sendVoiceMessage,
    getConversations,
    getMessagesWithUser,
    getUnreadMessageCount,
} from "../controllers/message.controller.js";


const router = Router();


// Everything below requires login
router.use(verifyJWT);


// ======================================
// Conversations
// ======================================

router.get(
    "/conversations",
    getConversations
);


// ======================================
// Unread count
// ======================================

router.get(
    "/unread-count",
    getUnreadMessageCount
);


// ======================================
// Messages with specific user
// ======================================

router.get(
    "/:userId",
    getMessagesWithUser
);


// ======================================
// Send voice message
// ======================================

router.post(
    "/:receiverId",
    upload.single("voiceFile"),
    sendVoiceMessage
);


export default router;