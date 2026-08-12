import apiClient from "./apiClient";

// Admin dashboard
export const getAdminDashboard = async () => {
    return apiClient("/admin/dashboard", {
        method: "GET",
    });
};


// Get all users
export const getAdminUsers = async (
    page = 1,
    limit = 20,
    search = ""
) => {

    const params = new URLSearchParams({
        page,
        limit,
    });

    if (search.trim()) {
        params.append("search", search.trim());
    }

    return apiClient(
        `/admin/users?${params.toString()}`,
        {
            method: "GET",
        }
    );
};


// Delete user
export const deleteAdminUser = async (userId) => {

    return apiClient(
        `/admin/users/${userId}`,
        {
            method: "DELETE",
        }
    );
};


// Get all voices
export const getAdminVoices = async (
    page = 1,
    limit = 20,
    search = ""
) => {

    const params = new URLSearchParams({
        page,
        limit,
    });

    if (search.trim()) {
        params.append("search", search.trim());
    }

    return apiClient(
        `/admin/voices?${params.toString()}`,
        {
            method: "GET",
        }
    );
};


// Delete voice
export const deleteAdminVoice = async (voiceId) => {

    return apiClient(
        `/admin/voices/${voiceId}`,
        {
            method: "DELETE",
        }
    );
};

export const getAdminUserDetails = async (userId) => {
    return apiClient(`/admin/users/${userId}`, {
        method: "GET",
    });
};