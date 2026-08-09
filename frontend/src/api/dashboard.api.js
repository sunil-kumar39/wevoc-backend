import apiClient from "./apiClient";

// Get current user's dashboard statistics
export const getDashboard = async () => {
    return apiClient("/dashboard", {
        method: "GET",
    });
};