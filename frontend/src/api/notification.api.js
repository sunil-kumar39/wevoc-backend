import apiClient from "./apiClient";

// Get all notifications
export const getNotifications = async () => {
    return apiClient("/notifications", {
        method: "GET",
    });
};


// Mark a single notification as read
export const markAsRead = async (notificationId) => {
    return apiClient(`/notifications/${notificationId}/read`, {
        method: "PATCH",
    });
};


// Mark all notifications as read
export const markAllAsRead = async () => {
    return apiClient("/notifications/read-all", {
        method: "PATCH",
    });
};


// Delete a notification
export const deleteNotification = async (notificationId) => {
    return apiClient(`/notifications/${notificationId}`, {
        method: "DELETE",
    });
};