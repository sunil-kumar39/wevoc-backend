import apiClient from "./apiClient";


// Get all bookmarked voices
export const getBookmarkedVoices = async () => {
    return apiClient("/bookmarks", {
        method: "GET",
    });
};


// Bookmark / unbookmark voice
export const toggleBookmark = async (voiceId) => {
    return apiClient(
        `/bookmarks/toggle/${voiceId}`,
        {
            method: "POST",
        }
    );
};


// Check bookmark status
export const checkBookmark = async (voiceId) => {
    return apiClient(
        `/bookmarks/${voiceId}`,
        {
            method: "GET",
        }
    );
};