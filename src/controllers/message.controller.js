import mongoose, {
    isValidObjectId,
} from "mongoose";

import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

import { uploadOnCloudinary } from "../config/cloudinary.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// =====================================================
// SEND VOICE MESSAGE
// =====================================================

const sendVoiceMessage = asyncHandler(
    async (req, res) => {

        const { receiverId } = req.params;

        if (!isValidObjectId(receiverId)) {
            throw new ApiError(
                400,
                "Invalid receiver ID"
            );
        }


        // Cannot message yourself
        if (
            receiverId.toString() ===
            req.user._id.toString()
        ) {
            throw new ApiError(
                400,
                "You cannot send a message to yourself"
            );
        }


        // Check receiver
        const receiver = await User.findById(
            receiverId
        );

        if (!receiver) {
            throw new ApiError(
                404,
                "Receiver not found"
            );
        }


        // Get uploaded audio
        const voiceFileLocalPath =
            req.file?.path;


        if (!voiceFileLocalPath) {
            throw new ApiError(
                400,
                "Voice message file is required"
            );
        }


        // Upload audio to Cloudinary
        const voiceFile =
            await uploadOnCloudinary(
                voiceFileLocalPath
            );


        if (
            !voiceFile ||
            !voiceFile.url
        ) {
            throw new ApiError(
                400,
                "Failed to upload voice message"
            );
        }


        const message =
            await Message.create({

                sender:
                    req.user._id,

                receiver:
                    receiverId,

                voiceFile:
                    voiceFile.url,

                duration:
                    voiceFile.duration || 0,

                isRead: false,

            });


        const populatedMessage =
            await Message.findById(
                message._id
            )
            .populate(
                "sender",
                "fullname username avatar"
            )
            .populate(
                "receiver",
                "fullname username avatar"
            );


        return res.status(201).json(

            new ApiResponse(
                201,
                populatedMessage,
                "Voice message sent successfully"
            )

        );
    }
);


// =====================================================
// GET ALL CONVERSATIONS
// =====================================================

const getConversations = asyncHandler(
    async (req, res) => {

        const userId =
            new mongoose.Types.ObjectId(
                req.user._id
            );


        const messages =
            await Message.find({

                $or: [
                    {
                        sender: userId,
                    },
                    {
                        receiver: userId,
                    },
                ],

            })
            .sort({
                createdAt: -1,
            })
            .populate(
                "sender",
                "fullname username avatar"
            )
            .populate(
                "receiver",
                "fullname username avatar"
            );


        const conversations = new Map();


        for (const message of messages) {

            const isSender =
                message.sender._id.toString() ===
                userId.toString();


            const otherUser =
                isSender
                    ? message.receiver
                    : message.sender;


            if (!otherUser) {
                continue;
            }


            const otherUserId =
                otherUser._id.toString();


            // First message is latest because
            // messages are sorted descending
            if (
                !conversations.has(
                    otherUserId
                )
            ) {

                conversations.set(
                    otherUserId,
                    {
                        user: otherUser,

                        lastMessage: {
                            _id:
                                message._id,

                            voiceFile:
                                message.voiceFile,

                            duration:
                                message.duration,

                            createdAt:
                                message.createdAt,

                            sender:
                                message.sender._id,

                            isRead:
                                message.isRead,
                        },

                        unreadCount: 0,
                    }
                );

            }


            // Count unread incoming messages
            if (
                !isSender &&
                !message.isRead
            ) {

                const conversation =
                    conversations.get(
                        otherUserId
                    );

                conversation.unreadCount += 1;

            }
        }


        const result =
            Array.from(
                conversations.values()
            );


        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Conversations fetched successfully"
            )

        );
    }
);


// =====================================================
// GET MESSAGES WITH USER
// =====================================================

const getMessagesWithUser =
    asyncHandler(
        async (req, res) => {

            const { userId } =
                req.params;


            if (
                !isValidObjectId(
                    userId
                )
            ) {
                throw new ApiError(
                    400,
                    "Invalid user ID"
                );
            }


            const otherUser =
                await User.findById(
                    userId
                ).select(
                    "fullname username avatar bio"
                );


            if (!otherUser) {
                throw new ApiError(
                    404,
                    "User not found"
                );
            }


            const currentUserId =
                req.user._id;


            const messages =
                await Message.find({

                    $or: [

                        {
                            sender:
                                currentUserId,

                            receiver:
                                userId,
                        },

                        {
                            sender:
                                userId,

                            receiver:
                                currentUserId,
                        },

                    ],

                })
                .sort({
                    createdAt: 1,
                })
                .populate(
                    "sender",
                    "fullname username avatar"
                )
                .populate(
                    "receiver",
                    "fullname username avatar"
                );


            // Mark incoming messages as read
            await Message.updateMany(

                {
                    sender:
                        userId,

                    receiver:
                        currentUserId,

                    isRead: false,
                },

                {
                    $set: {
                        isRead: true,
                        readAt: new Date(),
                    },
                }

            );


            return res.status(200).json(

                new ApiResponse(
                    200,
                    {
                        user:
                            otherUser,

                        messages,
                    },

                    "Messages fetched successfully"
                )

            );
        }
    );


// =====================================================
// GET TOTAL UNREAD MESSAGE COUNT
// =====================================================

const getUnreadMessageCount =
    asyncHandler(
        async (req, res) => {

            const unreadCount =
                await Message.countDocuments({

                    receiver:
                        req.user._id,

                    isRead: false,

                });


            return res.status(200).json(

                new ApiResponse(
                    200,
                    {
                        unreadCount,
                    },

                    "Unread message count fetched successfully"
                )

            );
        }
    );


export {
    sendVoiceMessage,
    getConversations,
    getMessagesWithUser,
    getUnreadMessageCount,
};