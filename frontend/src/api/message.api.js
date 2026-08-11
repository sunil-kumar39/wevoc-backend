import apiClient from "./apiClient";

// Get all conversations
export const getConversations = async () => {
    return apiClient("/messages/conversations", {
        method: "GET",
    });
};


// Get messages with a specific user
export const getMessagesWithUser = async (userId) => {
    return apiClient(`/messages/${userId}`, {
        method: "GET",
    });
};


// Send voice message
export const sendVoiceMessage = async (
    receiverId,
    voiceFile
) => {

    const formData = new FormData();

    formData.append(
        "voiceFile",
        voiceFile
    );

    return apiClient(
        `/messages/${receiverId}`,
        {
            method: "POST",
            body: formData,
        }
    );
};


// Get unread message count
export const getUnreadMessageCount = async () => {
    return apiClient("/messages/unread-count", {
        method: "GET",
    });
};