import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        sender:{
            tye:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        receiver:{
            tye:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        type:{
            type:String,
            enum:["follow","like","comment"],
            required:true
        },
        voice:{
            type:Schema.Types.ObjectId,
            ref:"Voice"
        },
        comment:{
            type:Schema.Types.ObjectId,
            ref:"Comment"
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps:true
    }
)

export const Notification = mongoose.model(
    "Notification",
    notificationSchema
)