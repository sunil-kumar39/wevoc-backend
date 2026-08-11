import apiClient from "./apiClient";

// Get suggested users
export const getSuggestedUsers = async () => {
    return apiClient("/users/suggested", {
        method: "GET",
    });
};