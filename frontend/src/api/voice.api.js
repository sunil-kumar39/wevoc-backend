import apiClient from "./apiClient";

// Publish a new voice
export const publishVoice = async ({
    title,
    description,
    voiceFile,
    thumbnail,
    isAnonymous
}) => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("voiceFile", voiceFile);
    formData.append("thumbnail", thumbnail);
    formData.append("isAnonymous", isAnonymous);

    return apiClient("/voices/publish", {
        method: "POST",
        body: formData,
    });
};


// Get all published voices
export const getAllVoices = async (page = 1, limit = 10) => {
    return apiClient(`/voices?page=${page}&limit=${limit}`, {
        method: "GET",
    });
};


// Get single voice by ID
export const getVoiceById = async (voiceId) => {
    return apiClient(`/voices/${voiceId}`, {
        method: "GET",
    });
};


// Update voice
export const updateVoice = async ({
    voiceId,
    title,
    description,
    thumbnail,
}) => {
    const formData = new FormData();

    if (title !== undefined) {
        formData.append("title", title);
    }

    if (description !== undefined) {
        formData.append("description", description);
    }

    if (thumbnail) {
        formData.append("thumbnail", thumbnail);
    }

    return apiClient(`/voices/${voiceId}`, {
        method: "PATCH",
        body: formData,
    });
};


// Delete voice
export const deleteVoice = async (voiceId) => {
    return apiClient(`/voices/${voiceId}`, {
        method: "DELETE",
    });
};