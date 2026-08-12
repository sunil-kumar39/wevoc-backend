import mongoose, {
    isValidObjectId
} from "mongoose";

import {
    asyncHandler
} from "../utils/asyncHandler.js";

import {
    ApiError
} from "../utils/ApiError.js";

import {
    ApiResponse
} from "../utils/ApiResponse.js";

import {
    uploadOnCloudinary
} from "../config/cloudinary.js";

import {
    Voice
} from "../models/voice.model.js";

import {
    Community
} from "../models/community.model.js";

import {
    CommunityMember
} from "../models/communityMember.model.js";


// =====================================================
// PUBLISH VOICE
// =====================================================

const publishVoice = asyncHandler(
    async (req, res) => {

        const {
            title,
            description,
            isAnonymous,
            communityId
        } = req.body;


        const voiceFileLocalPath =
            req.files?.voiceFile?.[0]?.path;

        const thumbnailLocalPath =
            req.files?.thumbnail?.[0]?.path;


        // -----------------------------------------
        // Required fields
        // -----------------------------------------

        if (!title?.trim()) {
            throw new ApiError(
                400,
                "Title is required"
            );
        }


        if (!description?.trim()) {
            throw new ApiError(
                400,
                "Description is required"
            );
        }


        // Voice file is mandatory
        if (!voiceFileLocalPath) {
            throw new ApiError(
                400,
                "Voice file is required"
            );
        }


        // -----------------------------------------
        // Community validation
        // -----------------------------------------

        let community = null;


        if (communityId) {

            if (
                !isValidObjectId(
                    communityId
                )
            ) {
                throw new ApiError(
                    400,
                    "Invalid community id"
                );
            }


            const communityExists =
                await Community.findById(
                    communityId
                );


            if (!communityExists) {
                throw new ApiError(
                    404,
                    "Community not found"
                );
            }


            // User must be a member
            const membership =
                await CommunityMember.findOne({
                    community: communityId,
                    user: req.user._id
                });


            if (!membership) {
                throw new ApiError(
                    403,
                    "You must join the community before posting"
                );
            }


            community =
                communityExists;
        }


        // -----------------------------------------
        // Upload voice
        // -----------------------------------------

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
                "Error while uploading voice"
            );
        }


        // -----------------------------------------
        // Upload thumbnail
        // Optional
        // -----------------------------------------

        let thumbnailUrl = "";


        if (thumbnailLocalPath) {

            const thumbnail =
                await uploadOnCloudinary(
                    thumbnailLocalPath
                );


            if (
                !thumbnail ||
                !thumbnail.url
            ) {
                throw new ApiError(
                    400,
                    "Error while uploading thumbnail"
                );
            }


            thumbnailUrl =
                thumbnail.url;
        }


        // -----------------------------------------
        // Create voice
        // -----------------------------------------

        const voice =
            await Voice.create({

                title:
                    title.trim(),

                description:
                    description.trim(),

                voiceFile:
                    voiceFile.url,

                thumbnail:
                    thumbnailUrl,

                owner:
                    req.user._id,

                community:
                    community
                        ? community._id
                        : null,

                duration:
                    voiceFile.duration || 0,

                isAnonymous:
                    isAnonymous === true ||
                    isAnonymous === "true",

                isPublished: true

            });


        // -----------------------------------------
        // Increase community posts count
        // -----------------------------------------

        if (community) {

            await Community.findByIdAndUpdate(
                community._id,
                {
                    $inc: {
                        postsCount: 1
                    }
                }
            );
        }


        // -----------------------------------------
        // Populate response
        // -----------------------------------------

        const createdVoice =
            await Voice.findById(
                voice._id
            )
                .populate(
                    "owner",
                    "fullname username avatar"
                )
                .populate(
                    "community",
                    "name icon college"
                );


        return res.status(201).json(

            new ApiResponse(
                201,
                createdVoice,
                "Voice uploaded successfully"
            )

        );
    }
);


// =====================================================
// GET ALL VOICES
// =====================================================

const getAllVoices = asyncHandler(
    async (req, res) => {

        const page =
            parseInt(req.query.page) || 1;

        const limit =
            parseInt(req.query.limit) || 10;

        const skip =
            (page - 1) * limit;


        const voices =
            await Voice.aggregate([

                {
                    $match: {
                        isPublished: true
                    }
                },


                // --------------------------------
                // Owner
                // --------------------------------

                {
                    $lookup: {
                        from: "users",

                        localField: "owner",

                        foreignField: "_id",

                        as: "owner",

                        pipeline: [
                            {
                                $project: {
                                    fullname: 1,
                                    username: 1,
                                    avatar: 1
                                }
                            }
                        ]
                    }
                },


                {
                    $addFields: {
                        owner: {
                            $first: "$owner"
                        }
                    }
                },


                // --------------------------------
                // Community
                // --------------------------------

                {
                    $lookup: {
                        from: "communities",

                        localField:
                            "community",

                        foreignField: "_id",

                        as: "community",

                        pipeline: [
                            {
                                $project: {
                                    name: 1,
                                    icon: 1,
                                    college: 1
                                }
                            }
                        ]
                    }
                },


                {
                    $addFields: {
                        community: {
                            $first:
                                "$community"
                        }
                    }
                },


                // --------------------------------
                // Likes count
                // --------------------------------

                {
                    $lookup: {
                        from: "likes",

                        localField: "_id",

                        foreignField: "voice",

                        as: "likes"
                    }
                },


                {
                    $addFields: {
                        likesCount: {
                            $size: "$likes"
                        }
                    }
                },


                // Remove likes array
                {
                    $project: {
                        likes: 0
                    }
                },


                // Latest first
                {
                    $sort: {
                        createdAt: -1
                    }
                },


                {
                    $skip: skip
                },


                {
                    $limit: limit
                }

            ]);


        const totalVoices =
            await Voice.countDocuments({
                isPublished: true
            });


        return res.status(200).json(

            new ApiResponse(
                200,
                {
                    voices,

                    page,

                    limit,

                    totalVoices,

                    totalPages:
                        Math.ceil(
                            totalVoices /
                            limit
                        )
                },

                "Voices fetched successfully"
            )

        );
    }
);


// =====================================================
// GET VOICE BY ID
// =====================================================

const getVoiceById =
    asyncHandler(
        async (req, res) => {

            const {
                voiceId
            } = req.params;


            if (
                !isValidObjectId(
                    voiceId
                )
            ) {
                throw new ApiError(
                    400,
                    "Invalid voice id"
                );
            }


            const voice =
                await Voice.findByIdAndUpdate(

                    voiceId,

                    {
                        $inc: {
                            views: 1
                        }
                    },

                    {
                        new: true
                    }

                )
                    .populate(
                        "owner",
                        "fullname username avatar"
                    )
                    .populate(
                        "community",
                        "name icon college"
                    );


            if (!voice) {
                throw new ApiError(
                    404,
                    "Voice not found"
                );
            }


            return res.status(200).json(

                new ApiResponse(
                    200,
                    voice,
                    "Voice fetched successfully"
                )

            );
        }
    );


// =====================================================
// UPDATE VOICE
// =====================================================

const updateVoice =
    asyncHandler(
        async (req, res) => {

            const {
                voiceId
            } = req.params;


            if (
                !isValidObjectId(
                    voiceId
                )
            ) {
                throw new ApiError(
                    400,
                    "Invalid voice id"
                );
            }


            const {
                title,
                description
            } = req.body;


            const thumbnailLocalPath =
                req.file?.path;


            const voice =
                await Voice.findById(
                    voiceId
                );


            if (!voice) {
                throw new ApiError(
                    404,
                    "Voice not found"
                );
            }


            if (
                voice.owner.toString() !==
                req.user._id.toString()
            ) {
                throw new ApiError(
                    403,
                    "You are not allowed to update this voice"
                );
            }


            let thumbnailUrl =
                voice.thumbnail;


            if (thumbnailLocalPath) {

                const thumbnail =
                    await uploadOnCloudinary(
                        thumbnailLocalPath
                    );


                if (
                    !thumbnail ||
                    !thumbnail.url
                ) {
                    throw new ApiError(
                        400,
                        "Error while uploading thumbnail"
                    );
                }


                thumbnailUrl =
                    thumbnail.url;
            }


            const updatedVoice =
                await Voice.findByIdAndUpdate(

                    voiceId,

                    {
                        $set: {

                            title:
                                title?.trim() ||
                                voice.title,

                            description:
                                description?.trim() ||
                                voice.description,

                            thumbnail:
                                thumbnailUrl

                        }
                    },

                    {
                        new: true
                    }

                )
                    .populate(
                        "owner",
                        "fullname username avatar"
                    )
                    .populate(
                        "community",
                        "name icon college"
                    );


            return res.status(200).json(

                new ApiResponse(
                    200,
                    updatedVoice,
                    "Voice updated successfully"
                )

            );
        }
    );


// =====================================================
// DELETE VOICE
// =====================================================

const deleteVoice =
    asyncHandler(
        async (req, res) => {

            const {
                voiceId
            } = req.params;


            if (
                !isValidObjectId(
                    voiceId
                )
            ) {
                throw new ApiError(
                    400,
                    "Invalid voice id"
                );
            }


            const voice =
                await Voice.findById(
                    voiceId
                );


            if (!voice) {
                throw new ApiError(
                    404,
                    "Voice not found"
                );
            }


            if (
                voice.owner.toString() !==
                req.user._id.toString()
            ) {
                throw new ApiError(
                    403,
                    "You are not allowed to delete this voice"
                );
            }


            // Save community id before deleting
            const communityId =
                voice.community;


            await Voice.findByIdAndDelete(
                voiceId
            );


            // Decrease community post count
            if (communityId) {

                await Community.findByIdAndUpdate(
                    communityId,
                    {
                        $inc: {
                            postsCount: -1
                        }
                    }
                );
            }


            return res.status(200).json(

                new ApiResponse(
                    200,
                    {},
                    "Voice deleted successfully"
                )

            );
        }
    );


export {
    publishVoice,
    getAllVoices,
    getVoiceById,
    updateVoice,
    deleteVoice
};