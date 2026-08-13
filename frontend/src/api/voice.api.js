import apiClient from "./apiClient";

// ========================================
// PUBLISH VOICE
// ========================================

export const publishVoice = async ({
    title,
    description,
    voiceFile,
    thumbnail,
    isAnonymous = false,
    communityId = null,
}) => {

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("voiceFile", voiceFile);
    formData.append("thumbnail", thumbnail);
    formData.append(
        "isAnonymous",
        String(isAnonymous)
    );

    if (communityId) {
        formData.append(
            "communityId",
            communityId
        );
    }

    return apiClient(
        "/voices/publish",
        {
            method: "POST",
            body: formData,
        }
    );
};


// ========================================
// GET ALL VOICES
// ========================================

export const getAllVoices = async (
    page = 1,
    limit = 10
) => {

    return apiClient(
        `/voices?page=${page}&limit=${limit}`,
        {
            method: "GET",
        }
    );
};


// Backward compatibility
export const getVoices = getAllVoices;


// ========================================
// GET COMMUNITY VOICES
// ========================================

export const getCommunityVoices = async (
    communityId
) => {

    return apiClient(
        `/voices/community/${communityId}`,
        {
            method: "GET",
        }
    );
};


// ========================================
// GET SINGLE VOICE
// ========================================

export const getVoiceById = async (
    voiceId
) => {

    return apiClient(
        `/voices/${voiceId}`,
        {
            method: "GET",
        }
    );
};


// ========================================
// UPDATE VOICE
// ========================================

export const updateVoice = async ({
    voiceId,
    title,
    description,
    thumbnail,
}) => {

    const formData = new FormData();

    if (title !== undefined) {
        formData.append(
            "title",
            title
        );
    }

    if (description !== undefined) {
        formData.append(
            "description",
            description
        );
    }

    if (thumbnail) {
        formData.append(
            "thumbnail",
            thumbnail
        );
    }

    return apiClient(
        `/voices/${voiceId}`,
        {
            method: "PATCH",
            body: formData,
        }
    );
};


// ========================================
// DELETE VOICE
// ========================================

export const deleteVoice = async (
    voiceId
) => {

    return apiClient(
        `/voices/${voiceId}`,
        {
            method: "DELETE",
        }
    );
};