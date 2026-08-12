import apiClient from "./apiClient";

export const getCommunities = async (search = "") => {
    const query = search
        ? `?search=${encodeURIComponent(search)}`
        : "";

    return apiClient(`/communities${query}`, {
        method: "GET",
    });
};

export const getCommunity = async (communityId) => {
    return apiClient(`/communities/${communityId}`, {
        method: "GET",
    });
};

export const createCommunity = async ({
    name,
    description,
    college,
    icon,
    tags,
}) => {
    return apiClient("/communities", {
        method: "POST",
        body: JSON.stringify({
            name,
            description,
            college,
            icon,
            tags,
        }),
    });
};

export const joinCommunity = async (communityId) => {
    return apiClient(
        `/communities/${communityId}/join`,
        {
            method: "POST",
        }
    );
};

export const leaveCommunity = async (communityId) => {
    return apiClient(
        `/communities/${communityId}/leave`,
        {
            method: "POST",
        }
    );
};

export const getCommunityMembers = async (
    communityId
) => {
    return apiClient(
        `/communities/${communityId}/members`,
        {
            method: "GET",
        }
    );
};

export const updateCommunity = async ({
    communityId,
    name,
    description,
    college,
    icon,
    tags,
}) => {
    return apiClient(
        `/communities/${communityId}`,
        {
            method: "PATCH",
            body: JSON.stringify({
                name,
                description,
                college,
                icon,
                tags,
            }),
        }
    );
};

export const deleteCommunity = async (
    communityId
) => {
    return apiClient(
        `/communities/${communityId}`,
        {
            method: "DELETE",
        }
    );
};

export const getCommunityPosts = async (
    communityId
) => {

    return apiClient(
        `/communities/${communityId}/posts`,
        {
            method: "GET",
        }
    );
};