import apiClient from "./apiClient";

// Like / unlike a voice
export const toggleVoiceLike = async (voiceId) => {
    return apiClient(`/likes/toggle/voice/${voiceId}`, {
        method: "POST",
    });
};


// Get all voices liked by current user
export const getLikedVoices = async () => {
    return apiClient("/likes/voices", {
        method: "GET",
    });
};


// Like / unlike a comment
export const toggleCommentLike = async (commentId) => {
    return apiClient(`/likes/toggle/comment/${commentId}`, {
        method: "POST",
    });
};


// Get all comments liked by current user
export const getLikedComments = async () => {
    return apiClient("/likes/comments", {
        method: "GET",
    });
};