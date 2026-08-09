import { useEffect, useState } from "react";

import Avatar from "../components/Avatar";
import PostCard from "../components/PostCard";

import { useApp } from "../context/AppContext";

import {
    getUserProfile,
    toggleFollow,
} from "../api/follow.api";

import {
    getAllVoices,
} from "../api/voice.api";

import { fmtDate } from "../utils/helpers";


export default function UserProfilePage() {

    const {
        pageData,
        goBack,
        user: currentUser,
    } = useApp();


    // =========================
    // STATES
    // =========================

    const [profile, setProfile] =
        useState(null);

    const [posts, setPosts] =
        useState([]);

    const [tab, setTab] =
        useState("posts");

    const [loading, setLoading] =
        useState(true);

    const [followLoading, setFollowLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================
    // USER ID
    // =========================

    const userId =
        pageData?._id;


    // =========================
    // FETCH PROFILE
    // =========================

    const fetchProfile = async () => {

        if (!userId) {
            return;
        }


        try {

            setLoading(true);

            setError("");


            const response =
                await getUserProfile(
                    userId
                );


            setProfile(
                response?.data || null
            );


        } catch (error) {

            console.error(
                "Failed to fetch profile:",
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
    // FETCH USER POSTS
    // =========================

    const fetchUserPosts = async () => {

        if (!userId) {
            return;
        }


        try {

            const response =
                await getAllVoices(
                    1,
                    100
                );


            const allVoices =
                response?.data?.voices ||
                [];


            const userVoices =
                allVoices.filter(
                    (voice) =>
                        voice.owner?._id ===
                        userId
                );


            setPosts(
                userVoices
            );


        } catch (error) {

            console.error(
                "Failed to fetch user posts:",
                error
            );

        }

    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchProfile();

        fetchUserPosts();

    }, [userId]);


    // =========================
    // FOLLOW / UNFOLLOW
    // =========================

    const handleFollow = async () => {

        if (
            !profile ||
            followLoading
        ) {
            return;
        }


        try {

            setFollowLoading(true);


            const response =
                await toggleFollow(
                    userId
                );


            const message =
                response?.message
                    ?.toLowerCase() || "";


            const nowFollowing =
                message.includes(
                    "followed"
                ) &&
                !message.includes(
                    "unfollowed"
                );


            setProfile(
                (current) => {

                    if (!current) {
                        return current;
                    }


                    return {
                        ...current,

                        isFollowing:
                            nowFollowing,

                        followersCount:
                            nowFollowing
                                ? current.followersCount + 1
                                : Math.max(
                                    0,
                                    current.followersCount - 1
                                ),
                    };

                }
            );


        } catch (error) {

            console.error(
                "Follow action failed:",
                error
            );


            setError(
                error.message ||
                "Failed to update follow"
            );

        } finally {

            setFollowLoading(false);

        }

    };


    // =========================
    // INVALID USER
    // =========================

    if (!userId) {

        return (

            <div className="empty-state">

                <div className="empty-title">

                    User not found

                </div>


                <button
                    className="btn btn-primary"
                    onClick={goBack}
                >

                    Go back

                </button>

            </div>

        );

    }


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

    if (error && !profile) {

        return (

            <div className="empty-state">

                <div className="empty-title">

                    {error}

                </div>


                <button
                    className="btn btn-primary"
                    onClick={fetchProfile}
                >

                    Retry

                </button>

            </div>

        );

    }


    if (!profile) {

        return null;

    }


    // =========================
    // IS OWN PROFILE
    // =========================

    const isOwnProfile =
        currentUser?._id === userId;


    return (

        <div className="profile-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="profile-header">

                <button
                    className="btn btn-ghost"
                    onClick={goBack}
                >

                    ←

                </button>


                <div>

                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: 18,
                        }}
                    >

                        {profile.fullname}

                    </div>


                    <div
                        style={{
                            fontSize: 13,
                            color:
                                "var(--ink3)",
                        }}
                    >

                        {posts.length} posts

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
                PROFILE INFO
            ========================= */}

            <div className="profile-info-wrap">


                {/* AVATAR */}

                <div className="profile-avatar-bump">

                    <Avatar
                        name={
                            profile.fullname
                        }
                        size="2xl"
                        src={
                            profile.avatar
                        }
                    />

                </div>


                {/* NAME */}

                <div className="profile-name">

                    {profile.fullname}

                </div>


                {/* USERNAME */}

                <div className="profile-handle">

                    @{profile.username}

                </div>


                {/* BIO */}

                {profile.bio && (

                    <div className="profile-bio">

                        {profile.bio}

                    </div>

                )}


                {/* =====================
                    FOLLOW BUTTON
                ===================== */}

                {!isOwnProfile && (

                    <div
                        style={{
                            marginTop: 12,
                        }}
                    >

                        <button
                            className={
                                profile.isFollowing
                                    ? "btn btn-secondary btn-sm"
                                    : "btn btn-primary btn-sm"
                            }
                            disabled={
                                followLoading
                            }
                            onClick={
                                handleFollow
                            }
                        >

                            {followLoading
                                ? "..."
                                : profile.isFollowing
                                    ? "✓ Following"
                                    : "+ Follow"
                            }

                        </button>

                    </div>

                )}


                {/* =====================
                    META
                ===================== */}

                <div className="profile-meta-row">

                    <div className="profile-meta-item">

                        📅 Joined{" "}

                        {fmtDate(
                            pageData?.createdAt
                        )}

                    </div>

                </div>


                {/* =====================
                    STATS
                ===================== */}

                <div className="profile-stats-row">


                    <div className="stat-link">

                        <span className="stat-count">

                            {posts.length}

                        </span>

                        <span className="stat-word">

                            Posts

                        </span>

                    </div>


                    <div className="stat-link">

                        <span className="stat-count">

                            {
                                profile.followersCount ||
                                0
                            }

                        </span>

                        <span className="stat-word">

                            Followers

                        </span>

                    </div>


                    <div className="stat-link">

                        <span className="stat-count">

                            {
                                profile.followingCount ||
                                0
                            }

                        </span>

                        <span className="stat-word">

                            Following

                        </span>

                    </div>

                </div>

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


            {/* =========================
                POSTS
            ========================= */}

            {tab === "posts" && (

                posts.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-ico">

                            🎙

                        </div>


                        <div className="empty-title">

                            No posts yet

                        </div>

                    </div>

                ) : (

                    posts.map(
                        (post) => (

                            <PostCard
                                key={
                                    post._id
                                }
                                post={
                                    post
                                }
                            />

                        )
                    )

                )

            )}


            {/* =========================
                LIKED TAB
            ========================= */}

            {tab === "liked" && (

                <div className="empty-state">

                    <div className="empty-ico">

                        🤍

                    </div>


                    <div className="empty-title">

                        Liked voices will
                        appear here

                    </div>


                    <p>

                        We'll connect the
                        liked voices API next.

                    </p>

                </div>

            )}

        </div>

    );

}