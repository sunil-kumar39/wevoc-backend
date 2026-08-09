import apiClient from "./apiClient";

// Follow / unfollow a user
export const toggleFollow = async (userId) => {
    return apiClient(`/follows/${userId}`, {
        method: "POST",
    });
};


// Get user's followers
export const getFollowers = async (userId) => {
    return apiClient(`/follows/${userId}/followers`, {
        method: "GET",
    });
};


// Get users this user is following
export const getFollowing = async (userId) => {
    return apiClient(`/follows/${userId}/following`, {
        method: "GET",
    });
};


// Get user profile with follow information
export const getUserProfile = async (userId) => {
    return apiClient(`/follows/${userId}/profile`, {
        method: "GET",
    });
};