import { useEffect, useState } from "react";

import Avatar from "../components/Avatar";
import PostCard from "../components/PostCard";

import { useApp } from "../context/AppContext";

import {
    toggleFollow,
    getUserProfile,
} from "../api/follow.api";

import { getAllVoices } from "../api/voice.api";

import { fmtDate, timeAgo } from "../utils/helpers";


export default function UserProfilePage() {

    const {
        pageData: selectedUser,
        goBack,
        navigate,
    } = useApp();


    // =========================
    // PROFILE
    // =========================

    const [user, setUser] =
        useState(selectedUser || null);


    const [loading, setLoading] =
        useState(true);


    const [followLoading, setFollowLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    // =========================
    // POSTS
    // =========================

    const [posts, setPosts] =
        useState([]);


    const [postsLoading, setPostsLoading] =
        useState(false);


    // =========================
    // TAB
    // =========================

    const [tab, setTab] =
        useState("posts");


    // =========================
    // LOAD PROFILE
    // =========================

    const loadProfile = async () => {

        if (!selectedUser?._id) {
            return;
        }


        try {

            setLoading(true);
            setError("");


            const response =
                await getUserProfile(
                    selectedUser._id
                );


            if (response?.data) {

                setUser(
                    response.data
                );

            }

        } catch (error) {

            console.error(
                "Profile error:",
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
    // LOAD USER POSTS
    // =========================

    const loadPosts = async () => {

        if (!selectedUser?._id) {
            return;
        }


        try {

            setPostsLoading(true);


            const response =
                await getAllVoices(
                    1,
                    100
                );


            const voices =
                response?.data?.voices ||
                [];


            const userPosts =
                voices.filter(
                    (voice) => {

                        const ownerId =
                            voice?.owner?._id;

                        return (
                            ownerId &&
                            String(ownerId) ===
                            String(
                                selectedUser._id
                            )
                        );

                    }
                );


            setPosts(
                userPosts
            );


        } catch (error) {

            console.error(
                "Posts error:",
                error
            );

        } finally {

            setPostsLoading(false);

        }

    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        loadProfile();
        loadPosts();

    }, [selectedUser?._id]);


    // =========================
    // FOLLOW / UNFOLLOW
    // =========================

    const handleFollow = async () => {

        if (
            !user?._id ||
            followLoading
        ) {
            return;
        }


        try {

            setFollowLoading(true);


            const response =
                await toggleFollow(
                    user._id
                );


            /*
             * Backend returns:
             *
             * followed
             * OR
             * unfollowed
             *
             * depending on current state.
             */


            const message =
                response?.message ||
                "";


            const isNowFollowing =
                message
                    .toLowerCase()
                    .includes("followed") &&
                !message
                    .toLowerCase()
                    .includes("unfollowed");


            setUser(
                (current) => {

                    if (!current) {
                        return current;
                    }


                    return {
                        ...current,

                        isFollowing:
                            isNowFollowing,

                        followersCount:
                            Math.max(
                                0,
                                (
                                    current.followersCount ||
                                    0
                                ) +
                                (
                                    isNowFollowing
                                        ? 1
                                        : -1
                                )
                            ),
                    };

                }
            );


        } catch (error) {

            console.error(
                "Follow error:",
                error
            );


            alert(
                error.message ||
                "Unable to follow user"
            );

        } finally {

            setFollowLoading(false);

        }

    };


    // =========================
    // NO USER
    // =========================

    if (!selectedUser) {

        return (

            <div className="empty-state">

                <div className="empty-ico">
                    👤
                </div>

                <div className="empty-title">
                    User not found
                </div>

            </div>

        );

    }


    // =========================
    // LOADING
    // =========================

    if (loading && !user) {

        return (

            <div className="empty-state">

                <div className="empty-ico">
                    👤
                </div>

                <div className="empty-title">
                    Loading profile...
                </div>

            </div>

        );

    }


    // =========================
    // ERROR
    // =========================

    if (error && !user) {

        return (

            <div className="empty-state">

                <div className="empty-ico">
                    ⚠️
                </div>

                <div className="empty-title">
                    Failed to load profile
                </div>

                <div className="empty-sub">
                    {error}
                </div>

                <button
                    className="btn btn-primary btn-sm"
                    style={{
                        marginTop: 12,
                    }}
                    onClick={
                        loadProfile
                    }
                >
                    Try again
                </button>

            </div>

        );

    }


    return (

        <div>


            {/* =========================
                HEADER
            ========================= */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 12,
                }}
            >

                <button
                    className="btn btn-ghost btn-sm"
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
                        {user.fullname}
                    </div>


                    <div
                        style={{
                            fontSize: 13,
                            color: "var(--ink3)",
                        }}
                    >
                        @{user.username}
                    </div>

                </div>

            </div>


            {/* =========================
                PROFILE INFO
            ========================= */}

            <div className="profile-info-wrap">


                {/* Avatar */}

                <div className="profile-avatar-bump">

                    <Avatar
                        name={
                            user.fullname
                        }
                        src={
                            user.avatar
                        }
                        size="2xl"
                    />

                </div>


                {/* Name + Follow */}

                <div
                    className="profile-title-row"
                >

                    <div>

                        <div className="profile-name">

                            {user.fullname}

                        </div>


                        <div className="profile-handle">

                            @{user.username}

                        </div>

                    </div>


                    <button
                        className={
                            user.isFollowing
                                ? "btn btn-secondary btn-sm"
                                : "btn btn-primary btn-sm"
                        }
                        onClick={
                            handleFollow
                        }
                        disabled={
                            followLoading
                        }
                    >

                        {followLoading

                            ? "..."

                            : user.isFollowing
                                ? "Following"
                                : "Follow"}

                    </button>

                </div>


                {/* Bio */}

                {user.bio && (

                    <div
                        className="profile-bio"
                    >
                        {user.bio}
                    </div>

                )}


                {/* Meta */}

                <div
                    className="profile-meta-row"
                >

                    <div className="profile-meta-item">

                        📅 Joined{" "}

                        {user.createdAt
                            ? fmtDate(
                                user.createdAt
                            )
                            : "Recently"}

                    </div>

                </div>


                {/* Stats */}

                <div
                    className="profile-stats-row"
                >

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

                            {user.followersCount ||
                                0}

                        </span>

                        <span className="stat-word">

                            Followers

                        </span>

                    </div>


                    <div className="stat-link">

                        <span className="stat-count">

                            {user.followingCount ||
                                0}

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
                    About
                </button>

            </div>


            {/* =========================
                POSTS
            ========================= */}

            {tab === "posts" && (

                <>

                    {postsLoading ? (

                        <div
                            className="empty-state"
                        >

                            <div className="empty-ico">
                                🎙
                            </div>

                            <div className="empty-title">
                                Loading posts...
                            </div>

                        </div>

                    ) : posts.length === 0 ? (

                        <div
                            className="empty-state"
                        >

                            <div className="empty-ico">
                                🎙
                            </div>

                            <div className="empty-title">
                                No posts yet
                            </div>

                            <div className="empty-sub">
                                This user hasn't
                                published any voices yet.
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

                    )}

                </>

            )}


            {/* =========================
                ABOUT
            ========================= */}

            {tab === "liked" && (

                <div
                    className="empty-state"
                >

                    <div className="empty-ico">
                        👤
                    </div>

                    <div className="empty-title">
                        About {user.fullname}
                    </div>

                    <div
                        className="empty-sub"
                        style={{
                            maxWidth: 450,
                            margin: "0 auto",
                        }}
                    >

                        @{user.username}

                        {user.bio && (
                            <>
                                <br />
                                <br />
                                {user.bio}
                            </>
                        )}

                    </div>

                </div>

            )}

        </div>

    );

}