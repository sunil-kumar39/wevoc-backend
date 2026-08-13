import apiClient from "./apiClient";


// =====================================================
// GET CONVERSATIONS
// =====================================================

export const getConversations =
    async () => {

        return apiClient(
            "/messages/conversations",
            {
                method: "GET",
            }
        );
    };


// =====================================================
// GET MESSAGES WITH USER
// =====================================================

export const getMessagesWithUser =
    async (userId) => {

        return apiClient(
            `/messages/${userId}`,
            {
                method: "GET",
            }
        );
    };


// =====================================================
// SEND VOICE MESSAGE
// =====================================================

export const sendVoiceMessage =
    async (
        receiverId,
        voiceFile
    ) => {

        const formData =
            new FormData();

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


// =====================================================
// UNREAD COUNT
// =====================================================

export const getUnreadMessageCount =
    async () => {

        return apiClient(
            "/messages/unread-count",
            {
                method: "GET",
            }
        );
    };


// =====================================================
// MARK READ
// =====================================================

export const markMessagesAsRead =
    async (userId) => {

        return apiClient(
            `/messages/read/${userId}`,
            {
                method: "PATCH",
            }
        );
    };