import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { Voice } from "../models/voice.model.js";
import { isValidObjectId } from "mongoose";

const publishVoice = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const voiceFileLocalPath = req.files?.voiceFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
}

    if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Title and description are required");
}

if (!voiceFileLocalPath) {
    throw new ApiError(400, "Voice file is required");
}

if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
}

const voiceFile = await uploadOnCloudinary(voiceFileLocalPath)
const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
if(!voiceFile || !voiceFile.url){
    throw new ApiError(400,"Error while uploading voice")
}
if(!thumbnail || !thumbnail.url){
    throw new ApiError(400,"Error while uploading thumbnail")
}

const voice = await Voice.create({
    title,
    description,
    voiceFile:voiceFile.url,
    thumbnail:thumbnail.url,
    owner:req.user._id,
    duration:voiceFile.duration || 0
})

return res.status(201).json(new ApiResponse(201,voice,"Voice uploaded Successfully"))
    
});

const getAllVoices = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const skip = (page-1)*limit
    const voices = await Voice.find({
        isPublished:true
    }).populate("owner", "fullname username avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const totalVoices = await Voice.countDocuments({
        isPublished:true
    })

    return res.status(200).json(new ApiResponse(200,{
        voices,page,limit,totalVoices,totalPages:Math.ceil(totalVoices / limit),
    },"Voices fetched successfully"))
})

const getVoiceById = asyncHandler(async(req,res)=>{
    const {voiceId} = req.params
    if(!isValidObjectId(voiceId)){
        throw new ApiError(400,"Invalid voice id")
    }

    const voice = await Voice.findByIdAndUpdate(voiceId,{
        $inc:{
            views:1
        }
    },
{new:true}).populate("owner", "fullname username avatar");

    if (!voice) {
    throw new ApiError(404, "Voice not found");
}

    return res.status(200).json(new ApiResponse(200,voice,"Voice fetched successfully"))
})

const updateVoice = asyncHandler(async (req, res) => {
    const {voiceId} = req.params
    if(!isValidObjectId(voiceId)){
        throw new ApiError(400,"Invalid voiceId")
    }

    const {title,description} = req.body

    const thumbnailLocalPath = req.file?.path
    const voice = await Voice.findById(voiceId)

    if(!voice){
        throw new ApiError(404,"Voice not found")
    }

    if(voice.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"You are not allowed to update this voice")
    }

    let thumbnailUrl = voice.thumbnail
    if(thumbnailLocalPath){
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        if(!thumbnail || !thumbnail.url){
            throw new ApiError(400,"Error while uploading thumbnail")
        }
        thumbnailUrl = thumbnail.url
    }
    const updatedVoice = await Voice.findByIdAndUpdate(voiceId,{
        $set:{
            title:title || voice.title,
            description:description || voice.description,
            thumbnail:thumbnailUrl
        }
    },{new:true}).populate("owner","fullname username avatar")

    return res.status(200).json(new ApiResponse(200,updatedVoice,"Voice updated successfully"))
})

const deleteVoice = asyncHandler(async (req, res) => {
    const { voiceId } = req.params;

    if (!isValidObjectId(voiceId)) {
        throw new ApiError(400, "Invalid voice id");
    }

    const voice = await Voice.findById(voiceId);

    if (!voice) {
        throw new ApiError(404, "Voice not found");
    }

    if (voice.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this voice");
    }

    await Voice.findByIdAndDelete(voiceId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Voice deleted successfully")
    );
});

export { publishVoice,getAllVoices,getVoiceById,updateVoice,deleteVoice };