import { useEffect, useMemo, useState } from "react";

import { useApp } from "../context/AppContext";

import PostCard from "../components/PostCard";
import ComposeBox from "../components/ComposeBox";

import { SearchIcon, FlameIcon } from "../components/Icons";

import { getAllVoices } from "../api/voice.api";
import { getFollowing } from "../api/follow.api";


export default function FeedPage() {

    const {
        searchQuery,
        setSearchQuery,
        user,
    } = useApp();


    // =========================
    // STATES
    // =========================

    const [tab, setTab] = useState("trending");

    const [voices, setVoices] = useState([]);

    const [followingUsers, setFollowingUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [followingLoading, setFollowingLoading] = useState(false);

    const [error, setError] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);


    // =========================
    // FETCH VOICES
    // =========================

    const fetchVoices = async (pageNumber = 1) => {

        try {

            setLoading(true);
            setError("");

            const response = await getAllVoices(
                pageNumber,
                10
            );

            const data = response?.data;

            setVoices(data?.voices || []);

            setPage(
                data?.page || pageNumber
            );

            setTotalPages(
                data?.totalPages || 1
            );

        } catch (error) {

            console.error(
                "Failed to fetch voices:",
                error
            );

            setError(
                error.message ||
                "Failed to load voices"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // FETCH FOLLOWING USERS
    // =========================

    const fetchFollowing = async () => {

        if (!user?._id) return;

        try {

            setFollowingLoading(true);

            const response =
                await getFollowing(user._id);

            const data = response?.data;

            /*
                Backend response:

                data.following = [
                    {
                        following: {
                            _id,
                            fullname,
                            username,
                            avatar
                        }
                    }
                ]
            */

            const users =
                (data?.following || [])
                    .map(item => item.following)
                    .filter(Boolean);

            setFollowingUsers(users);

        } catch (error) {

            console.error(
                "Failed to fetch following users:",
                error
            );

            setFollowingUsers([]);

        } finally {

            setFollowingLoading(false);

        }

    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchVoices(1);

    }, []);


    // =========================
    // LOAD FOLLOWING
    // =========================

    useEffect(() => {

        if (user?._id) {
            fetchFollowing();
        }

    }, [user?._id]);


    // =========================
    // SEARCH
    // =========================

    const filteredVoices = useMemo(() => {

        if (!searchQuery.trim()) {
            return voices;
        }

        const query =
            searchQuery
                .toLowerCase()
                .trim();

        return voices.filter((voice) => {

            const title =
                voice.title
                    ?.toLowerCase() || "";

            const description =
                voice.description
                    ?.toLowerCase() || "";

            const username =
                voice.owner?.username
                    ?.toLowerCase() || "";

            const fullname =
                voice.owner?.fullname
                    ?.toLowerCase() || "";

            return (
                title.includes(query) ||
                description.includes(query) ||
                username.includes(query) ||
                fullname.includes(query)
            );

        });

    }, [
        voices,
        searchQuery,
    ]);


    // =========================
    // FOLLOWING VOICES
    // =========================

    const followingVoices = useMemo(() => {

        if (!followingUsers.length) {
            return [];
        }

        const followingIds =
            new Set(
                followingUsers.map(
                    followingUser =>
                        followingUser._id?.toString()
                )
            );

        return filteredVoices.filter(
            voice =>
                voice.owner?._id &&
                followingIds.has(
                    voice.owner._id.toString()
                )
        );

    }, [
        filteredVoices,
        followingUsers,
    ]);


    // =========================
    // SORT
    // =========================

    const sortedVoices = useMemo(() => {

        let list = [];

        // -------------------------
        // FOLLOWING
        // -------------------------

        if (tab === "following") {

            list = [...followingVoices];

            return list.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

        }


        // -------------------------
        // RECENT
        // -------------------------

        if (tab === "recent") {

            list = [...filteredVoices];

            return list.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

        }


        // -------------------------
        // TRENDING
        // -------------------------

        list = [...filteredVoices];

        return list.sort((a, b) => {

            const scoreA =
                (a.likesCount || 0) * 3 +
                (a.views || 0);

            const scoreB =
                (b.likesCount || 0) * 3 +
                (b.views || 0);

            return scoreB - scoreA;

        });

    }, [
        filteredVoices,
        followingVoices,
        tab,
    ]);


    // =========================
    // LIKE CHANGE
    // =========================

    const handleLikeChange = (
        voiceId,
        liked
    ) => {

        setVoices(
            currentVoices =>
                currentVoices.map(
                    voice => {

                        if (
                            voice._id !== voiceId
                        ) {
                            return voice;
                        }

                        const currentCount =
                            voice.likesCount || 0;

                        return {
                            ...voice,

                            likesCount: liked
                                ? currentCount + 1
                                : Math.max(
                                    0,
                                    currentCount - 1
                                ),
                        };

                    }
                )
        );

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="feed-page">

                <div className="feed-loading">
                    Loading voices...
                </div>

            </div>

        );

    }


    // =========================
    // RENDER
    // =========================

    return (

        <div className="feed-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="feed-header">

                <div className="feed-search">

                    <SearchIcon />

                    <input
                        placeholder="Search Wevoc"
                        value={searchQuery}
                        onChange={(e) =>
                            setSearchQuery(
                                e.target.value
                            )
                        }
                    />

                </div>


                {/* =====================
                    TABS
                ===================== */}

                <div className="tab-strip">

                    {/* TRENDING */}

                    <button
                        className={`tab-strip-btn${
                            tab === "trending"
                                ? " active"
                                : ""
                        }`}
                        onClick={() =>
                            setTab("trending")
                        }
                    >

                        <FlameIcon />

                        Trending

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

                        Following

                    </button>


                    {/* RECENT */}

                    <button
                        className={`tab-strip-btn${
                            tab === "recent"
                                ? " active"
                                : ""
                        }`}
                        onClick={() =>
                            setTab("recent")
                        }
                    >

                        Recent

                    </button>

                </div>

            </div>


            {/* =========================
                COMPOSE
            ========================= */}

            <ComposeBox
                onPublished={() =>
                    fetchVoices(1)
                }
            />


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="auth-error">

                    {error}

                    <button
                        className="btn btn-sm"
                        onClick={() =>
                            fetchVoices(1)
                        }
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =========================
                FOLLOWING LOADING
            ========================= */}

            {tab === "following" &&
                followingLoading && (

                    <div className="feed-loading">
                        Loading following...
                    </div>

                )
            }


            {/* =========================
                EMPTY
            ========================= */}

            {!error &&
                !followingLoading &&
                sortedVoices.length === 0 && (

                    <div className="feed-empty">

                        {tab === "following" ? (

                            <>
                                <h3>
                                    No voices from people you follow
                                </h3>

                                <p>
                                    Follow some people to see
                                    their voice posts here.
                                </p>
                            </>

                        ) : (

                            <>
                                <h3>
                                    No voices found
                                </h3>

                                <p>
                                    Be the first person
                                    to share a voice.
                                </p>
                            </>

                        )}

                    </div>

                )
            }


            {/* =========================
                POSTS
            ========================= */}

            {!error &&
                !followingLoading &&
                sortedVoices.map(
                    (voice, index) => (

                        <PostCard
                            key={voice._id}
                            post={voice}
                            onLikeChange={
                                handleLikeChange
                            }
                            style={{
                                animationDelay:
                                    `${index * 0.04}s`,
                            }}
                        />

                    )
                )
            }


            {/* =========================
                PAGINATION
            ========================= */}

            {!error &&
                tab !== "following" &&
                totalPages > 1 && (

                    <div className="feed-pagination">

                        <button
                            className="btn"
                            disabled={
                                page <= 1
                            }
                            onClick={() =>
                                fetchVoices(
                                    page - 1
                                )
                            }
                        >
                            Previous
                        </button>


                        <span>
                            Page {page} of{" "}
                            {totalPages}
                        </span>


                        <button
                            className="btn"
                            disabled={
                                page >=
                                totalPages
                            }
                            onClick={() =>
                                fetchVoices(
                                    page + 1
                                )
                            }
                        >
                            Next
                        </button>

                    </div>

                )
            }

        </div>

    );

}