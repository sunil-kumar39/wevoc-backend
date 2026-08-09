import apiClient from "./apiClient";

// Create a new playlist
export const createPlaylist = async ({ name, description }) => {
    return apiClient("/playlists", {
        method: "POST",
        body: JSON.stringify({
            name,
            description,
        }),
    });
};


// Get all playlists of current user
export const getUserPlaylists = async () => {
    return apiClient("/playlists", {
        method: "GET",
    });
};


// Get playlist by ID
export const getPlaylistById = async (playlistId) => {
    return apiClient(`/playlists/${playlistId}`, {
        method: "GET",
    });
};


// Add voice to playlist
export const addVoiceToPlaylist = async (playlistId, voiceId) => {
    return apiClient(`/playlists/${playlistId}/voices/${voiceId}`, {
        method: "POST",
    });
};


// Remove voice from playlist
export const removeVoiceFromPlaylist = async (playlistId, voiceId) => {
    return apiClient(`/playlists/${playlistId}/voices/${voiceId}`, {
        method: "DELETE",
    });
};


// Update playlist
export const updatePlaylist = async ({
    playlistId,
    name,
    description,
}) => {
    return apiClient(`/playlists/${playlistId}`, {
        method: "PATCH",
        body: JSON.stringify({
            name,
            description,
        }),
    });
};


// Delete playlist
export const deletePlaylist = async (playlistId) => {
    return apiClient(`/playlists/${playlistId}`, {
        method: "DELETE",
    });
};