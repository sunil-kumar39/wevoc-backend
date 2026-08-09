import apiClient from "./apiClient";

export const searchUsers = async (query) => {
    return apiClient(
        `/search/users?query=${encodeURIComponent(query)}`,
        {
            method: "GET",
        }
    );
};

export const searchVoices = async (query) => {
    return apiClient(
        `/search/voices?query=${encodeURIComponent(query)}`,
        {
            method: "GET",
        }
    );
};