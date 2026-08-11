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
    getAllVoices,
} from "../api/voice.api";

import {
    getLikedVoices,
} from "../api/like.api";

import {
    getUserProfile,
} from "../api/follow.api";

import { fmtDate } from "../utils/helpers";


export default function ProfilePage() {

    const {
        user,
        setUser,
    } = useApp();


    // =========================
    // STATES
    // =========================

    const [profile, setProfile] = useState(null);

    const [myPosts, setMyPosts] = useState([]);

    const [likedPosts, setLikedPosts] = useState([]);

    const [tab, setTab] = useState("posts");

    const [editing, setEditing] = useState(false);

    const [form, setForm] = useState({
        fullname: "",
        email: "",
        bio: "",
    });

    const [avatarFile, setAvatarFile] = useState(null);

    const [coverFile, setCoverFile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [imageSaving, setImageSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =========================
    // LOAD PROFILE
    // =========================

    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const currentUserResponse =
                await getCurrentUser();

            const currentUser =
                currentUserResponse?.data;


            if (!currentUser) {
                throw new Error("User not found");
            }


            // Update global user
            setUser(currentUser);


            // Set form
            setForm({
                fullname: currentUser.fullname || "",
                email: currentUser.email || "",
                bio: currentUser.bio || "",
            });


            // Get profile statistics
            const profileResponse =
                await getUserProfile(currentUser._id);

            setProfile(
                profileResponse?.data || null
            );


            // Get user's voices
            const voicesResponse =
                await getAllVoices(1, 100);

            const allVoices =
                voicesResponse?.data?.voices || [];


            const userVoices =
                allVoices.filter(
                    (voice) =>
                        voice.owner?._id ===
                        currentUser._id
                );

            setMyPosts(userVoices);


            // Get liked voices
            const likedResponse =
                await getLikedVoices();

            const likedData =
                likedResponse?.data || [];


            const likedVoices =
                likedData
                    .map((item) => item.voice)
                    .filter(Boolean);


            setLikedPosts(likedVoices);


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

            setError("Full name is required");
            return;

        }


        if (!form.email.trim()) {

            setError("Email is required");
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

                setForm({
                    fullname:
                        updatedUser.fullname || "",

                    email:
                        updatedUser.email || "",

                    bio:
                        updatedUser.bio || "",
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

    const handleAvatarChange = async (e) => {

        const file =
            e.target.files?.[0];


        if (!file) return;


        try {

            setImageSaving(true);

            setError("");
            setSuccess("");


            const response =
                await updateUserAvatar(file);


            const updatedUser =
                response?.data;


            if (updatedUser) {

                setUser(updatedUser);

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

            // Reset file input
            e.target.value = "";

        }

    };


    // =========================
    // CHANGE COVER IMAGE
    // =========================

    const handleCoverChange = async (e) => {

        const file =
            e.target.files?.[0];


        if (!file) return;


        try {

            setImageSaving(true);

            setError("");
            setSuccess("");


            const response =
                await updateUserCoverImage(file);


            const updatedUser =
                response?.data;


            if (updatedUser) {

                setUser(updatedUser);

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
    // RENDER
    // =========================

    return (

        <div className="profile-page">


            {/* HEADER */}

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


            {/* ERROR */}

            {error && (

                <div className="auth-error">
                    {error}
                </div>

            )}


            {/* SUCCESS */}

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
                        src={displayUser.coverImage}
                        alt="Cover"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
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
                        onChange={handleCoverChange}
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


                {/* AVATAR */}

                <div
                    className="profile-avatar-bump"
                    style={{
                        position: "relative",
                    }}
                >

                    <Avatar
                        name={displayUser.fullname}
                        src={displayUser.avatar}
                        size="2xl"
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
                            onChange={handleAvatarChange}
                            disabled={imageSaving}
                            style={{
                                display: "none",
                            }}
                        />

                    </label>

                </div>


                {/* EDIT MODE */}

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
                                value={form.fullname}
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
                                value={form.email}
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
                                value={form.bio}
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
                                onClick={handleSave}
                            >

                                {saving
                                    ? "Saving..."
                                    : "Save"}

                            </button>


                            <button
                                className="btn btn-ghost btn-sm"
                                disabled={saving}
                                onClick={handleCancel}
                            >

                                Cancel

                            </button>

                        </div>

                    </div>

                ) : (

                    <>


                        {/* NAME + EDIT */}

                        <div className="profile-title-row">

                            <div>

                                <div className="profile-name">

                                    {displayUser.fullname}

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

                            @{displayUser.username}

                        </div>


                        {/* BIO */}

                        {displayUser.bio && (

                            <div className="profile-bio">

                                {displayUser.bio}

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


                        {/* STATS */}

                        <div className="profile-stats-row">

                            <div className="stat-link">

                                <span className="stat-count">
                                    {myPosts.length}
                                </span>

                                <span className="stat-word">
                                    Posts
                                </span>

                            </div>


                            <div className="stat-link">

                                <span className="stat-count">

                                    {profile?.followersCount ||
                                        0}

                                </span>

                                <span className="stat-word">
                                    Followers
                                </span>

                            </div>


                            <div className="stat-link">

                                <span className="stat-count">

                                    {profile?.followingCount ||
                                        0}

                                </span>

                                <span className="stat-word">
                                    Following
                                </span>

                            </div>


                            <div className="stat-link">

                                <span className="stat-count">
                                    {likedPosts.length}
                                </span>

                                <span className="stat-word">
                                    Liked
                                </span>

                            </div>

                        </div>

                    </>

                )}

            </div>


            {/* =========================
                TABS
            ========================= */}

            <div className="tab-strip">

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


            {/* POSTS */}

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


            {/* LIKED */}

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