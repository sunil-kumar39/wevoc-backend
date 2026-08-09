import { useEffect, useMemo, useState } from "react";

import { useApp } from "../context/AppContext";

import PostCard from "../components/PostCard";
import ComposeBox from "../components/ComposeBox";

import { SearchIcon, FlameIcon } from "../components/Icons";

import {
    getAllVoices,
} from "../api/voice.api";


export default function FeedPage() {

    const {
        searchQuery,
        setSearchQuery,
    } = useApp();


    // =========================
    // STATES
    // =========================

    const [tab, setTab] =
        useState("trending");


    const [voices, setVoices] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    const [page, setPage] =
        useState(1);


    const [totalPages, setTotalPages] =
        useState(1);


    // =========================
    // FETCH VOICES
    // =========================

    const fetchVoices = async (
        pageNumber = 1
    ) => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getAllVoices(
                    pageNumber,
                    10
                );


            const data =
                response?.data;


            setVoices(
                data?.voices || []
            );


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
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchVoices(1);

    }, []);


    // =========================
    // SEARCH
    // =========================

    const filteredVoices =
        useMemo(() => {

            if (!searchQuery.trim()) {

                return voices;

            }


            const query =
                searchQuery
                    .toLowerCase()
                    .trim();


            return voices.filter(
                (voice) => {

                    const title =
                        voice.title
                            ?.toLowerCase() ||
                        "";


                    const description =
                        voice.description
                            ?.toLowerCase() ||
                        "";


                    const username =
                        voice.owner?.username
                            ?.toLowerCase() ||
                        "";


                    const fullname =
                        voice.owner?.fullname
                            ?.toLowerCase() ||
                        "";


                    return (
                        title.includes(query) ||
                        description.includes(query) ||
                        username.includes(query) ||
                        fullname.includes(query)
                    );

                }
            );

        }, [
            voices,
            searchQuery,
        ]);


    // =========================
    // SORT
    // =========================

    const sortedVoices =
        useMemo(() => {

            const list =
                [...filteredVoices];


            if (tab === "recent") {

                return list.sort(
                    (a, b) =>
                        new Date(
                            b.createdAt
                        ) -
                        new Date(
                            a.createdAt
                        )
                );

            }


            if (tab === "trending") {

                return list.sort(
                    (a, b) => {

                        const scoreA =
                            (a.likesCount || 0) * 3 +
                            (a.views || 0);


                        const scoreB =
                            (b.likesCount || 0) * 3 +
                            (b.views || 0);


                        return scoreB - scoreA;

                    }
                );

            }


            // Following will be properly
            // connected with Follow API later.

            return list;

        }, [
            filteredVoices,
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
            (currentVoices) =>
                currentVoices.map(
                    (voice) => {

                        if (
                            voice._id !==
                            voiceId
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


    return (

        <div className="feed-page">


            {/* =========================
                STICKY HEADER
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

            <ComposeBox />


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
                EMPTY
            ========================= */}

            {!error &&
                sortedVoices.length === 0 && (

                    <div className="feed-empty">

                        <h3>
                            No voices found
                        </h3>

                        <p>
                            Be the first person
                            to share a voice.
                        </p>

                    </div>

                )
            }


            {/* =========================
                POSTS
            ========================= */}

            {!error &&
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