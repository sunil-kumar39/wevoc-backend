import apiClient from "./apiClient";

// Add a voice to history
export const addToHistory = async (voiceId) => {
    return apiClient(`/history/${voiceId}`, {
        method: "POST",
    });
};


// Get current user's listening history
export const getHistory = async () => {
    return apiClient("/history", {
        method: "GET",
    });
};


// Clear current user's history
export const clearHistory = async () => {
    return apiClient("/history", {
        method: "DELETE",
    });
};