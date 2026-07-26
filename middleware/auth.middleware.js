import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
        
    }
    catch(error){
        throw new ApiError(401,error?.message || "Invalid access token")
    }
})
