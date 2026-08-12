import mongoose, { Schema } from "mongoose";

const voiceSchema = new Schema(
    {
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    voiceFile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
        required:true,
        default:0
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    community: {
    type: Schema.Types.ObjectId,
    ref: "Community",
    default: null,
},
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    isAnonymous: {
    type: Boolean,
    default: false
}
},
{
    timestamps:true
}
)

export const Voice = mongoose.model("Voice", voiceSchema);