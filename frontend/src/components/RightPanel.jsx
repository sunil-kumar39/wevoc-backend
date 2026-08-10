import { useEffect, useState } from "react";

import Avatar from "./Avatar";
import PostCard from "./PostCard";

import { MoonIcon, SunIcon } from "./Icons";

import { useApp } from "../context/AppContext";

import {
    searchUsers,
    searchVoices,
} from "../api/search.api";

import { toggleFollow } from "../api/follow.api";

import { USERS } from "../data/mockData";


export default function RightPanel() {

    const {
        navigate,
        theme,
        toggleTheme,
        searchQuery,
        user,
    } = useApp();


    // =========================================
    // STATE
    // =========================================

    const [following, setFollowing] =
        useState({});

    const [searchResults, setSearchResults] =
        useState([]);

    const [voiceResults, setVoiceResults] =
        useState([]);

    const [searchLoading, setSearchLoading] =
        useState(false);

    const [searchError, setSearchError] =
        useState("");


    // =========================================
    // SEARCH USERS + VOICES
    // =========================================

    useEffect(() => {

        const query =
            searchQuery.trim();


        // -----------------------------------------
        // No search
        // -----------------------------------------

        if (query.length <= 1) {

            setSearchResults([]);
            setVoiceResults([]);
            setSearchLoading(false);
            setSearchError("");

            return;
        }


        // -----------------------------------------
        // Debounce
        // -----------------------------------------

        const timer =
            setTimeout(
                async () => {

                    try {

                        setSearchLoading(true);
                        setSearchError("");


                        // Search users + voices together
                        const [
                            usersResponse,
                            voicesResponse,
                        ] = await Promise.all([

                            searchUsers(query),

                            searchVoices(query),

                        ]);


                        console.log(
                            "RIGHT PANEL USERS:",
                            usersResponse
                        );

                        console.log(
                            "RIGHT PANEL VOICES:",
                            voicesResponse
                        );


                        // ---------------------------------
                        // Users
                        // ---------------------------------

                        setSearchResults(

                            Array.isArray(
                                usersResponse?.data
                            )
                                ? usersResponse.data
                                : []

                        );


                        // ---------------------------------
                        // Voices
                        // ---------------------------------

                        setVoiceResults(

                            Array.isArray(
                                voicesResponse?.data
                            )
                                ? voicesResponse.data
                                : []

                        );


                    } catch (error) {

                        console.error(
                            "Right panel search error:",
                            error
                        );


                        setSearchError(
                            error.message ||
                            "Failed to search"
                        );


                        setSearchResults([]);
                        setVoiceResults([]);


                    } finally {

                        setSearchLoading(false);

                    }

                },
                400
            );


        return () =>
            clearTimeout(timer);


    }, [searchQuery]);


    // =========================================
    // FOLLOW / UNFOLLOW
    // =========================================

    const handleFollow =
        async (targetUser) => {

            if (!targetUser?._id) {
                return;
            }


            // Don't follow yourself
            if (
                user?._id &&
                String(user._id) ===
                String(targetUser._id)
            ) {
                return;
            }


            const userId =
                targetUser._id;


            try {

                const response =
                    await toggleFollow(userId);


                const message =
                    response?.message || "";


                const nowFollowing =
                    message
                        .toLowerCase()
                        .includes("followed");


                setFollowing(
                    (previous) => ({
                        ...previous,

                        [userId]:
                            nowFollowing,
                    })
                );


            } catch (error) {

                console.error(
                    "Follow error:",
                    error
                );

            }

        };


    // =========================================
    // DEFAULT SUGGESTIONS
    // =========================================

    const defaultUsers =
        USERS.slice(0, 5);


    const isSearching =
        searchQuery.trim().length > 1;


    const shownUsers =
        isSearching
            ? searchResults
            : defaultUsers;


    // =========================================
    // NORMALIZE USER
    // =========================================

    const normalizeUser =
        (rawUser) => {

            return {

                ...rawUser,

                name:
                    rawUser.fullname ||
                    rawUser.name ||
                    "Unknown User",

                username:
                    rawUser.username ||
                    "",

                college:
                    rawUser.college ||
                    "",

                avatar:
                    rawUser.avatar ||
                    undefined,

            };

        };


    // =========================================
    // RENDER
    // =========================================

    return (

        <aside className="right-panel">


            {/* =================================
                THEME TOGGLE
            ================================= */}

            <button
                className="theme-toggle"
                onClick={toggleTheme}
            >

                {theme === "dark" ? (

                    <>
                        <SunIcon />
                        Light Mode
                    </>

                ) : (

                    <>
                        <MoonIcon />
                        Dark Mode
                    </>

                )}

            </button>


            {/* =================================
                TRENDING
            ================================= */}

            {!isSearching && (

                <div
                    className="rp-box"
                    style={{
                        marginBottom: 16,
                    }}
                >

                    <div className="rp-box-title">
                        What's trending
                    </div>


                    <div
                        style={{
                            padding:
                                "16px 20px",

                            fontSize: 14,

                            color:
                                "var(--ink3)",

                            lineHeight: 1.6,
                        }}
                    >

                        Explore trending
                        voices from the
                        campus.

                    </div>

                </div>

            )}


            {/* =================================
                SEARCH / SUGGESTIONS BOX
            ================================= */}

            <div className="rp-box">


                {/* ---------------------------------
                    TITLE
                --------------------------------- */}

                <div className="rp-box-title">

                    {isSearching
                        ? "Search results"
                        : "People you may know"}

                </div>


                {/* =================================
                    SEARCH LOADING
                ================================= */}

                {isSearching &&
                    searchLoading && (

                        <div
                            style={{
                                padding:
                                    "16px 20px",

                                fontSize: 14,

                                color:
                                    "var(--ink3)",
                            }}
                        >
                            Searching...
                        </div>

                    )}


                {/* =================================
                    SEARCH ERROR
                ================================= */}

                {isSearching &&
                    !searchLoading &&
                    searchError && (

                        <div
                            style={{
                                padding:
                                    "16px 20px",

                                fontSize: 14,

                                color:
                                    "var(--crimson)",
                            }}
                        >
                            {searchError}
                        </div>

                    )}


                {/* =================================
                    USERS
                ================================= */}

                {!searchLoading &&
                    !searchError &&
                    shownUsers.length > 0 && (

                        <>

                            {isSearching && (

                                <div
                                    style={{
                                        padding:
                                            "10px 20px 4px",
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color:
                                            "var(--ink3)",
                                    }}
                                >
                                    👤 People
                                </div>

                            )}


                            {shownUsers.map(
                                (rawUser) => {

                                    const u =
                                        normalizeUser(
                                            rawUser
                                        );


                                    const isCurrentUser =
                                        user?._id &&
                                        String(
                                            user._id
                                        ) ===
                                        String(
                                            u._id
                                        );


                                    return (

                                        <div
                                            key={u._id}
                                            className="rp-row"
                                        >

                                            <div
                                                className="suggest-row"
                                            >

                                                {/* Avatar */}

                                                <Avatar
                                                    name={
                                                        u.name
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        navigate(
                                                            "user",
                                                            u
                                                        )
                                                    }
                                                />


                                                {/* User info */}

                                                <div
                                                    className="suggest-names"
                                                    style={{
                                                        cursor:
                                                            "pointer",
                                                        minWidth: 0,
                                                    }}
                                                    onClick={() =>
                                                        navigate(
                                                            "user",
                                                            u
                                                        )
                                                    }
                                                >

                                                    <div
                                                        className="suggest-name"
                                                    >
                                                        {u.name}
                                                    </div>


                                                    <div
                                                        className="suggest-college"
                                                    >
                                                        @{u.username}
                                                    </div>

                                                </div>


                                                {/* Follow */}

                                                {!isCurrentUser && (

                                                    <button
                                                        className={`btn btn-sm ${
                                                            following[
                                                                u._id
                                                            ]
                                                                ? "btn-secondary"
                                                                : "btn-outline"
                                                        }`}
                                                        onClick={() =>
                                                            handleFollow(
                                                                u
                                                            )
                                                        }
                                                    >

                                                        {following[
                                                            u._id
                                                        ]
                                                            ? "Following"
                                                            : "+ Follow"}

                                                    </button>

                                                )}

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </>

                    )}


                {/* =================================
                    VOICES
                ================================= */}

                {isSearching &&
                    !searchLoading &&
                    !searchError &&
                    voiceResults.length > 0 && (

                        <>

                            <div
                                style={{
                                    padding:
                                        "14px 20px 6px",

                                    fontSize: 12,

                                    fontWeight: 700,

                                    color:
                                        "var(--ink3)",
                                }}
                            >
                                🎙 Voices
                            </div>


                            {voiceResults
                                .slice(0, 4)
                                .map(
                                    (voice) => (

                                        <div
                                            key={
                                                voice._id
                                            }
                                            className="rp-row"
                                        >

                                            <div
                                                style={{
                                                    width:
                                                        "100%",
                                                    cursor:
                                                        "pointer",
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        "user",
                                                        voice.owner
                                                    )
                                                }
                                            >

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 10,
                                                    }}
                                                >

                                                    {/* Thumbnail */}

                                                    {voice.thumbnail ? (

                                                        <img
                                                            src={
                                                                voice.thumbnail
                                                            }
                                                            alt={
                                                                voice.title
                                                            }
                                                            style={{
                                                                width:
                                                                    44,
                                                                height:
                                                                    44,
                                                                borderRadius:
                                                                    8,
                                                                objectFit:
                                                                    "cover",
                                                                flexShrink:
                                                                    0,
                                                            }}
                                                        />

                                                    ) : (

                                                        <div
                                                            style={{
                                                                width:
                                                                    44,
                                                                height:
                                                                    44,
                                                                borderRadius:
                                                                    8,
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                background:
                                                                    "var(--surface2)",
                                                                flexShrink:
                                                                    0,
                                                            }}
                                                        >
                                                            🎙
                                                        </div>

                                                    )}


                                                    {/* Voice info */}

                                                    <div
                                                        style={{
                                                            minWidth:
                                                                0,
                                                            flex: 1,
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    14,
                                                                fontWeight:
                                                                    700,
                                                                color:
                                                                    "var(--ink)",
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            {
                                                                voice.title
                                                            }
                                                        </div>


                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    12,
                                                                color:
                                                                    "var(--ink3)",
                                                                marginTop:
                                                                    3,
                                                            }}
                                                        >
                                                            @
                                                            {
                                                                voice
                                                                    .owner
                                                                    ?.username
                                                            }

                                                            {" · "}

                                                            ❤️
                                                            {" "}
                                                            {
                                                                voice.likesCount ??
                                                                0
                                                            }

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                        </>

                    )}


                {/* =================================
                    NO RESULTS
                ================================= */}

                {isSearching &&
                    !searchLoading &&
                    !searchError &&
                    searchResults.length === 0 &&
                    voiceResults.length === 0 && (

                        <div
                            style={{
                                padding:
                                    "18px 20px",

                                fontSize: 14,

                                color:
                                    "var(--ink3)",

                                textAlign:
                                    "center",
                            }}
                        >

                            <div
                                style={{
                                    fontSize: 24,
                                    marginBottom: 6,
                                }}
                            >
                                😕
                            </div>

                            No results found

                        </div>

                    )}


            </div>


            {/* =================================
                FOOTER
            ================================= */}

            <p
                style={{
                    fontSize: 12,
                    color: "var(--ink4)",
                    lineHeight: 1.7,
                    padding: "8px 4px",
                }}
            >
                WeVoc · Terms · Privacy ·
                Campus Voice Platform © 2026
            </p>


        </aside>

    );

}