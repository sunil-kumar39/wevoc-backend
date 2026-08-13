import { useEffect, useState } from "react";

import Avatar from "../components/Avatar";
import PostCard from "../components/PostCard";

import { useApp } from "../context/AppContext";

import {
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
} from "../api/auth.api";

import {
    getFollowers,
    getFollowing,
    getUserProfile,
} from "../api/follow.api";

import {
    getAllVoices,
} from "../api/voice.api";

import {
    getLikedVoices,
} from "../api/like.api";

import { fmtDate } from "../utils/helpers";


export default function ProfilePage() {

    const {
        user,
        setUser,
    } = useApp();


    // =========================
    // STATES
    // =========================

    const [profile, setProfile] =
        useState(null);

    const [myPosts, setMyPosts] =
        useState([]);

    const [likedPosts, setLikedPosts] =
        useState([]);

    const [followers, setFollowers] =
        useState([]);

    const [following, setFollowing] =
        useState([]);

    const [tab, setTab] =
        useState("posts");

    const [editing, setEditing] =
        useState(false);

    const [form, setForm] = useState({
        fullname: "",
        email: "",
        bio: "",
    });

    const [avatarFile, setAvatarFile] =
        useState(null);

    const [coverFile, setCoverFile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [imageSaving, setImageSaving] =
        useState(false);

    const [connectionsLoading, setConnectionsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // Full image preview
    const [previewImage, setPreviewImage] =
        useState(null);


    // =========================
    // LOAD PROFILE
    // =========================

    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            // ---------------------------------
            // CURRENT USER
            // ---------------------------------

            const currentUserResponse =
                await getCurrentUser();

            const currentUser =
                currentUserResponse?.data;


            if (!currentUser) {
                throw new Error(
                    "User not found"
                );
            }


            // ---------------------------------
            // UPDATE GLOBAL USER
            // ---------------------------------

            setUser(currentUser);


            // ---------------------------------
            // SET FORM
            // ---------------------------------

            setForm({
                fullname:
                    currentUser.fullname || "",

                email:
                    currentUser.email || "",

                bio:
                    currentUser.bio || "",
            });


            // ---------------------------------
            // PROFILE INFORMATION
            // ---------------------------------

            const profileResponse =
                await getUserProfile(
                    currentUser._id
                );

            const profileData =
                profileResponse?.data || null;

            setProfile(profileData);


            // ---------------------------------
            // FOLLOWERS + FOLLOWING
            // ---------------------------------

            try {

                setConnectionsLoading(true);

                const [
                    followersResponse,
                    followingResponse,
                ] = await Promise.all([

                    getFollowers(
                        currentUser._id
                    ),

                    getFollowing(
                        currentUser._id
                    ),

                ]);


                setFollowers(
                    followersResponse?.data?.followers ||
                    []
                );


                setFollowing(
                    followingResponse?.data?.following ||
                    []
                );


            } catch (connectionError) {

                console.error(
                    "Failed to load connections:",
                    connectionError
                );

                setFollowers([]);
                setFollowing([]);

            } finally {

                setConnectionsLoading(false);

            }


            // ---------------------------------
            // GET USER'S VOICES
            // ---------------------------------

            const voicesResponse =
                await getAllVoices(
                    1,
                    100
                );

            const allVoices =
                voicesResponse?.data?.voices ||
                [];


            const userVoices =
                allVoices.filter(
                    (voice) =>
                        String(
                            voice.owner?._id
                        ) ===
                        String(
                            currentUser._id
                        )
                );


            setMyPosts(userVoices);


            // ---------------------------------
            // GET LIKED VOICES
            // ---------------------------------

            const likedResponse =
                await getLikedVoices();

            const likedData =
                likedResponse?.data || [];


            const likedVoices =
                likedData
                    .map(
                        (item) =>
                            item?.voice
                    )
                    .filter(Boolean);


            setLikedPosts(
                likedVoices
            );


        } catch (error) {

            console.error(
                "Profile loading failed:",
                error
            );

            setError(
                error.message ||
                "Failed to load profile"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        loadProfile();

    }, []);


    // =========================
    // SAVE PROFILE DETAILS
    // =========================

    const handleSave = async () => {

        if (!form.fullname.trim()) {

            setError(
                "Full name is required"
            );

            return;
        }


        if (!form.email.trim()) {

            setError(
                "Email is required"
            );

            return;
        }


        try {

            setSaving(true);

            setError("");
            setSuccess("");


            const response =
                await updateAccountDetails({

                    fullname:
                        form.fullname.trim(),

                    email:
                        form.email.trim(),

                    bio:
                        form.bio.trim(),

                });


            const updatedUser =
                response?.data;


            if (updatedUser) {

                setUser(updatedUser);

                setProfile(
                    (current) => ({
                        ...(current || {}),
                        ...updatedUser,
                    })
                );


                setForm({
                    fullname:
                        updatedUser.fullname ||
                        "",

                    email:
                        updatedUser.email ||
                        "",

                    bio:
                        updatedUser.bio ||
                        "",
                });

            }


            setEditing(false);

            setSuccess(
                "Profile updated successfully"
            );


        } catch (error) {

            console.error(
                "Profile update failed:",
                error
            );

            setError(
                error.message ||
                "Failed to update profile"
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================
    // CHANGE AVATAR
    // =========================

    const handleAvatarChange =
        async (e) => {

            const file =
                e.target.files?.[0];


            if (!file) return;


            try {

                setAvatarFile(file);

                setImageSaving(true);

                setError("");
                setSuccess("");


                const response =
                    await updateUserAvatar(
                        file
                    );


                const updatedUser =
                    response?.data;


                if (updatedUser) {

                    setUser(updatedUser);

                    setProfile(
                        (current) => ({
                            ...(current || {}),
                            ...updatedUser,
                        })
                    );

                }


                setSuccess(
                    "Avatar updated successfully"
                );


            } catch (error) {

                console.error(
                    "Avatar update failed:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to update avatar"
                );

            } finally {

                setImageSaving(false);

                setAvatarFile(null);

                e.target.value = "";

            }

        };


    // =========================
    // CHANGE COVER IMAGE
    // =========================

    const handleCoverChange =
        async (e) => {

            const file =
                e.target.files?.[0];


            if (!file) return;


            try {

                setCoverFile(file);

                setImageSaving(true);

                setError("");
                setSuccess("");


                const response =
                    await updateUserCoverImage(
                        file
                    );


                const updatedUser =
                    response?.data;


                if (updatedUser) {

                    setUser(updatedUser);

                    setProfile(
                        (current) => ({
                            ...(current || {}),
                            ...updatedUser,
                        })
                    );

                }


                setSuccess(
                    "Cover image updated successfully"
                );


            } catch (error) {

                console.error(
                    "Cover image update failed:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to update cover image"
                );

            } finally {

                setImageSaving(false);

                setCoverFile(null);

                e.target.value = "";

            }

        };


    // =========================
    // CANCEL EDIT
    // =========================

    const handleCancel = () => {

        setForm({

            fullname:
                user?.fullname || "",

            email:
                user?.email || "",

            bio:
                user?.bio || "",

        });


        setEditing(false);

        setError("");

    };


    // =========================
    // OPEN IMAGE PREVIEW
    // =========================

    const openImagePreview =
        (src) => {

            if (!src) return;

            setPreviewImage(src);

        };


    // =========================
    // CLOSE IMAGE PREVIEW
    // =========================

    const closeImagePreview =
        () => {

            setPreviewImage(null);

        };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="profile-page">

                <div className="feed-loading">

                    Loading profile...

                </div>

            </div>

        );

    }


    // =========================
    // ERROR
    // =========================

    if (!profile && error) {

        return (

            <div className="empty-state">

                <div className="empty-title">

                    {error}

                </div>


                <button
                    className="btn btn-primary"
                    onClick={loadProfile}
                >

                    Retry

                </button>

            </div>

        );

    }


    // =========================
    // DISPLAY USER
    // =========================

    const displayUser =
        user || profile;


    if (!displayUser) {

        return (

            <div className="empty-state">

                <div className="empty-title">

                    User not found

                </div>

            </div>

        );

    }


    // =========================
    // FOLLOWER USER OBJECT
    // =========================

    const getFollowerUser =
        (item) => {

            return (
                item?.follower ||
                item?.user ||
                item
            );

        };


    // =========================
    // FOLLOWING USER OBJECT
    // =========================

    const getFollowingUser =
        (item) => {

            return (
                item?.following ||
                item?.user ||
                item
            );

        };


    // =========================
    // RENDER
    // =========================

    return (

        <div className="profile-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="profile-header">

                <div>

                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: 20,
                        }}
                    >

                        My Profile

                    </div>


                    <div
                        style={{
                            fontSize: 13,
                            color: "var(--ink3)",
                        }}
                    >

                        @{displayUser.username}

                    </div>

                </div>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="auth-error">

                    {error}

                </div>

            )}


            {/* =========================
                SUCCESS
            ========================= */}

            {success && (

                <div className="auth-success">

                    {success}

                </div>

            )}


            {/* =========================
                COVER IMAGE
            ========================= */}

            <div
                style={{
                    position: "relative",
                    height: 180,
                    borderRadius: 14,
                    overflow: "hidden",
                    marginBottom: 20,
                    background:
                        "var(--surface2)",
                }}
            >

                {displayUser.coverImage ? (

                    <img
                        src={
                            displayUser.coverImage
                        }
                        alt="Cover"
                        onClick={() =>
                            openImagePreview(
                                displayUser.coverImage
                            )
                        }
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            cursor: "pointer",
                        }}
                    />

                ) : (

                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--ink3)",
                            fontSize: 14,
                        }}
                    >

                        No cover image

                    </div>

                )}


                {/* Cover upload */}

                <label
                    style={{
                        position: "absolute",
                        right: 14,
                        bottom: 14,
                        cursor: "pointer",
                        background:
                            "rgba(0,0,0,0.65)",
                        color: "#fff",
                        padding: "8px 12px",
                        borderRadius: 8,
                        fontSize: 13,
                    }}
                >

                    {imageSaving
                        ? "Uploading..."
                        : "📷 Change cover"}


                    <input
                        type="file"
                        accept="image/*"
                        onChange={
                            handleCoverChange
                        }
                        disabled={imageSaving}
                        style={{
                            display: "none",
                        }}
                    />

                </label>

            </div>


            {/* =========================
                PROFILE INFO
            ========================= */}

            <div className="profile-info-wrap">


                {/* =========================
                    AVATAR
                ========================= */}

                <div
                    className="profile-avatar-bump"
                    style={{
                        position: "relative",
                    }}
                >

                    <Avatar
                        name={
                            displayUser.fullname
                        }
                        src={
                            displayUser.avatar
                        }
                        size="2xl"
                        onClick={() =>
                            openImagePreview(
                                displayUser.avatar
                            )
                        }
                    />


                    {/* Avatar upload */}

                    <label
                        style={{
                            position: "absolute",
                            right: 0,
                            bottom: 0,
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                                "var(--crimson)",
                            color: "#fff",
                            cursor: "pointer",
                            border:
                                "3px solid var(--surface)",
                            fontSize: 15,
                        }}
                    >

                        📷


                        <input
                            type="file"
                            accept="image/*"
                            onChange={
                                handleAvatarChange
                            }
                            disabled={imageSaving}
                            style={{
                                display: "none",
                            }}
                        />

                    </label>

                </div>


                {/* =========================
                    EDIT MODE
                ========================= */}

                {editing ? (

                    <div
                        style={{
                            marginBottom: 16,
                            width: "100%",
                        }}
                    >


                        {/* FULL NAME */}

                        <div className="field-group">

                            <label className="field-label">

                                Full name

                            </label>


                            <input
                                className="field"
                                value={
                                    form.fullname
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        fullname:
                                            e.target.value,
                                    })
                                }
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="field-group">

                            <label className="field-label">

                                Email

                            </label>


                            <input
                                className="field"
                                type="email"
                                value={
                                    form.email
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email:
                                            e.target.value,
                                    })
                                }
                            />

                        </div>


                        {/* BIO */}

                        <div className="field-group">

                            <label className="field-label">

                                Bio (
                                {form.bio.length}
                                /200)

                            </label>


                            <textarea
                                className="field"
                                rows={3}
                                maxLength={200}
                                value={
                                    form.bio
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        bio:
                                            e.target.value,
                                    })
                                }
                            />

                        </div>


                        {/* BUTTONS */}

                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                            }}
                        >

                            <button
                                className="btn btn-primary btn-sm"
                                disabled={saving}
                                onClick={
                                    handleSave
                                }
                            >

                                {saving
                                    ? "Saving..."
                                    : "Save"}

                            </button>


                            <button
                                className="btn btn-ghost btn-sm"
                                disabled={saving}
                                onClick={
                                    handleCancel
                                }
                            >

                                Cancel

                            </button>

                        </div>

                    </div>

                ) : (

                    <>


                        {/* =========================
                            NAME + EDIT
                        ========================= */}

                        <div className="profile-title-row">

                            <div>

                                <div className="profile-name">

                                    {
                                        displayUser.fullname
                                    }

                                </div>

                            </div>


                            <button
                                className="btn btn-ghost btn-sm profile-edit-btn"
                                onClick={() =>
                                    setEditing(true)
                                }
                            >

                                Edit profile

                            </button>

                        </div>


                        {/* USERNAME */}

                        <div className="profile-handle">

                            @
                            {
                                displayUser.username
                            }

                        </div>


                        {/* BIO */}

                        {displayUser.bio && (

                            <div className="profile-bio">

                                {
                                    displayUser.bio
                                }

                            </div>

                        )}


                        {/* META */}

                        <div className="profile-meta-row">

                            <div className="profile-meta-item">

                                📅 Joined{" "}

                                {fmtDate(
                                    displayUser.createdAt
                                )}

                            </div>

                        </div>


                        {/* =========================
                            STATS
                        ========================= */}

                        <div className="profile-stats-row">


                            {/* POSTS */}

                            <button
                                type="button"
                                className="stat-link"
                                onClick={() =>
                                    setTab("posts")
                                }
                            >

                                <span className="stat-count">

                                    {
                                        myPosts.length
                                    }

                                </span>


                                <span className="stat-word">

                                    Posts

                                </span>

                            </button>


                            {/* FOLLOWERS */}

                            <button
                                type="button"
                                className="stat-link"
                                onClick={() =>
                                    setTab(
                                        "followers"
                                    )
                                }
                            >

                                <span className="stat-count">

                                    {
                                        profile?.followersCount ??
                                        followers.length
                                    }

                                </span>


                                <span className="stat-word">

                                    Followers

                                </span>

                            </button>


                            {/* FOLLOWING */}

                            <button
                                type="button"
                                className="stat-link"
                                onClick={() =>
                                    setTab(
                                        "following"
                                    )
                                }
                            >

                                <span className="stat-count">

                                    {
                                        profile?.followingCount ??
                                        following.length
                                    }

                                </span>


                                <span className="stat-word">

                                    Following

                                </span>

                            </button>


                            {/* LIKED */}

                            <button
                                type="button"
                                className="stat-link"
                                onClick={() =>
                                    setTab("liked")
                                }
                            >

                                <span className="stat-count">

                                    {
                                        likedPosts.length
                                    }

                                </span>


                                <span className="stat-word">

                                    Liked

                                </span>

                            </button>

                        </div>

                    </>

                )}

            </div>


            {/* =========================
                TABS
            ========================= */}

            <div className="tab-strip">


                {/* POSTS */}

                <button
                    className={`tab-strip-btn${
                        tab === "posts"
                            ? " active"
                            : ""
                    }`}
                    onClick={() =>
                        setTab("posts")
                    }
                >

                    Posts

                </button>


                {/* FOLLOWERS */}

                <button
                    className={`tab-strip-btn${
                        tab === "followers"
                            ? " active"
                            : ""
                    }`}
                    onClick={() =>
                        setTab("followers")
                    }
                >

                    Followers (
                    {followers.length}
                    )

                </button>


                {/* FOLLOWING */}

                <button
                    className={`tab-strip-btn${
                        tab === "following"
                            ? " active"
                            : ""
                    }`}
                    onClick={() =>
                        setTab("following")
                    }
                >

                    Following (
                    {following.length}
                    )

                </button>


                {/* LIKED */}

                <button
                    className={`tab-strip-btn${
                        tab === "liked"
                            ? " active"
                            : ""
                    }`}
                    onClick={() =>
                        setTab("liked")
                    }
                >

                    Liked

                </button>

            </div>


            {/* =========================
                POSTS
            ========================= */}

            {tab === "posts" && (

                myPosts.length === 0 ? (

                    <EmptyState
                        icon="🎙"
                        title="No posts yet"
                        sub="Your voice posts will appear here."
                    />

                ) : (

                    myPosts.map((post) => (

                        <PostCard
                            key={post._id}
                            post={post}
                        />

                    ))

                )

            )}


            {/* =========================
                FOLLOWERS
            ========================= */}

            {tab === "followers" && (

                connectionsLoading ? (

                    <div className="feed-loading">

                        Loading followers...

                    </div>

                ) : followers.length === 0 ? (

                    <EmptyState
                        icon="👥"
                        title="No followers yet"
                        sub="People who follow you will appear here."
                    />

                ) : (

                    <div className="connections-list">

                        {followers.map(
                            (item, index) => {

                                const person =
                                    getFollowerUser(
                                        item
                                    );


                                if (!person) {
                                    return null;
                                }


                                return (

                                    <div
                                        key={
                                            person._id ||
                                            index
                                        }
                                        className="connection-card"
                                    >

                                        <Avatar
                                            name={
                                                person.fullname
                                            }
                                            src={
                                                person.avatar
                                            }
                                            size="md"
                                            onClick={() =>
                                                openImagePreview(
                                                    person.avatar
                                                )
                                            }
                                        />


                                        <div className="connection-info">

                                            <div className="connection-name">

                                                {
                                                    person.fullname
                                                }

                                            </div>


                                            <div className="connection-handle">

                                                @
                                                {
                                                    person.username
                                                }

                                            </div>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )

            )}


            {/* =========================
                FOLLOWING
            ========================= */}

            {tab === "following" && (

                connectionsLoading ? (

                    <div className="feed-loading">

                        Loading following...

                    </div>

                ) : following.length === 0 ? (

                    <EmptyState
                        icon="➕"
                        title="Not following anyone"
                        sub="People you follow will appear here."
                    />

                ) : (

                    <div className="connections-list">

                        {following.map(
                            (item, index) => {

                                const person =
                                    getFollowingUser(
                                        item
                                    );


                                if (!person) {
                                    return null;
                                }


                                return (

                                    <div
                                        key={
                                            person._id ||
                                            index
                                        }
                                        className="connection-card"
                                    >

                                        <Avatar
                                            name={
                                                person.fullname
                                            }
                                            src={
                                                person.avatar
                                            }
                                            size="md"
                                            onClick={() =>
                                                openImagePreview(
                                                    person.avatar
                                                )
                                            }
                                        />


                                        <div className="connection-info">

                                            <div className="connection-name">

                                                {
                                                    person.fullname
                                                }

                                            </div>


                                            <div className="connection-handle">

                                                @
                                                {
                                                    person.username
                                                }

                                            </div>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )

            )}


            {/* =========================
                LIKED
            ========================= */}

            {tab === "liked" && (

                likedPosts.length === 0 ? (

                    <EmptyState
                        icon="🤍"
                        title="No liked voices"
                        sub="Voices you like will appear here."
                    />

                ) : (

                    likedPosts.map((post) => (

                        <PostCard
                            key={post._id}
                            post={post}
                        />

                    ))

                )

            )}


            {/* =========================
                FULL IMAGE PREVIEW
            ========================= */}

            {previewImage && (

                <div
                    className="image-preview-overlay"
                    onClick={
                        closeImagePreview
                    }
                >

                    <button
                        type="button"
                        className="image-preview-close"
                        onClick={
                            closeImagePreview
                        }
                        aria-label="Close image"
                    >

                        ×

                    </button>


                    <img
                        src={previewImage}
                        alt="Profile preview"
                        className="image-preview-image"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    />

                </div>

            )}

        </div>

    );

}


// =========================
// EMPTY STATE
// =========================

function EmptyState({
    icon,
    title,
    sub,
}) {

    return (

        <div className="empty-state">

            <div className="empty-ico">

                {icon}

            </div>


            <div className="empty-title">

                {title}

            </div>


            <div
                style={{
                    color: "var(--ink3)",
                    fontSize: 14,
                    marginTop: 4,
                }}
            >

                {sub}

            </div>

        </div>

    );

}