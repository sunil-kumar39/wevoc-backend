import { useEffect, useState } from "react";

import ComposeBox from "../components/ComposeBox";
import PostCard from "../components/PostCard";

import {
    getCommunities,
    joinCommunity,
    leaveCommunity,
} from "../api/community.api";

import {
    getCommunityVoices,
} from "../api/voice.api";


export default function CommunitiesPage() {

    const [communities, setCommunities] =
        useState([]);

    const [tab, setTab] =
        useState("discover");

    const [active, setActive] =
        useState(null);

    const [communityVoices, setCommunityVoices] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [voicesLoading, setVoicesLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ========================================
    // LOAD COMMUNITIES
    // ========================================

    const loadCommunities =
        async () => {

            try {

                setLoading(true);
                setError("");


                const response =
                    await getCommunities();


                setCommunities(
                    response?.data || []
                );

            } catch (error) {

                console.error(
                    "Load communities error:",
                    error
                );


                setError(
                    error?.message ||
                    "Failed to load communities."
                );

            } finally {

                setLoading(false);

            }

        };


    // ========================================
    // INITIAL LOAD
    // ========================================

    useEffect(() => {

        loadCommunities();

    }, []);


    // ========================================
    // LOAD COMMUNITY VOICES
    // ========================================

    const loadCommunityVoices =
        async (communityId) => {

            if (!communityId) {
                return;
            }


            try {

                setVoicesLoading(true);


                const response =
                    await getCommunityVoices(
                        communityId
                    );


                setCommunityVoices(
                    response?.data || []
                );

            } catch (error) {

                console.error(
                    "Load community voices error:",
                    error
                );


                setCommunityVoices([]);

            } finally {

                setVoicesLoading(false);

            }

        };


    // ========================================
    // OPEN COMMUNITY
    // ========================================

    const openCommunity =
        async (community) => {

            setActive(
                community
            );

            setCommunityVoices([]);

            await loadCommunityVoices(
                community._id
            );

        };


    // ========================================
    // BACK
    // ========================================

    const closeCommunity =
        () => {

            setActive(null);

            setCommunityVoices([]);

        };


    // ========================================
    // JOIN
    // ========================================

    const handleJoin =
        async (communityId) => {

            try {

                await joinCommunity(
                    communityId
                );


                setCommunities(
                    current =>
                        current.map(
                            community => {

                                if (
                                    community._id !==
                                    communityId
                                ) {

                                    return community;

                                }


                                return {
                                    ...community,

                                    joined:
                                        true,

                                    membersCount:
                                        Number(
                                            community.membersCount ||
                                            community.members ||
                                            0
                                        ) + 1,
                                };

                            }
                        )
                );


                if (
                    active?._id ===
                    communityId
                ) {

                    setActive(
                        current => ({
                            ...current,
                            joined: true,
                            membersCount:
                                Number(
                                    current.membersCount ||
                                    current.members ||
                                    0
                                ) + 1,
                        })
                    );

                }

            } catch (error) {

                console.error(
                    "Join community error:",
                    error
                );


                alert(
                    error?.message ||
                    "Unable to join community."
                );

            }

        };


    // ========================================
    // LEAVE
    // ========================================

    const handleLeave =
        async (communityId) => {

            try {

                await leaveCommunity(
                    communityId
                );


                setCommunities(
                    current =>
                        current.map(
                            community => {

                                if (
                                    community._id !==
                                    communityId
                                ) {

                                    return community;

                                }


                                return {
                                    ...community,

                                    joined:
                                        false,

                                    membersCount:
                                        Math.max(
                                            0,
                                            Number(
                                                community.membersCount ||
                                                community.members ||
                                                0
                                            ) - 1
                                        ),
                                };

                            }
                        )
                );


                if (
                    active?._id ===
                    communityId
                ) {

                    setActive(
                        current => ({
                            ...current,
                            joined: false,
                            membersCount:
                                Math.max(
                                    0,
                                    Number(
                                        current.membersCount ||
                                        current.members ||
                                        0
                                    ) - 1
                                ),
                        })
                    );

                }

            } catch (error) {

                console.error(
                    "Leave community error:",
                    error
                );


                alert(
                    error?.message ||
                    "Unable to leave community."
                );

            }

        };


    // ========================================
    // FILTER
    // ========================================

    const shownCommunities =
        tab === "joined"
            ? communities.filter(
                community =>
                    community.joined
            )
            : communities;


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <div className="page-anim">

                <div
                    className="feed-loading"
                >

                    Loading communities...

                </div>

            </div>

        );

    }


    // ========================================
    // ACTIVE COMMUNITY
    // ========================================

    if (active) {

        return (

            <div className="page-anim">

                {/* ==================================
                    HEADER
                ================================== */}

                <div className="feed-header">

                    <div className="feed-header-inner">

                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: 14,
                                minWidth: 0,
                            }}
                        >

                            <button
                                type="button"
                                className="back-btn"
                                onClick={
                                    closeCommunity
                                }
                            >

                                ←

                            </button>


                            <div
                                style={{
                                    minWidth: 0,
                                }}
                            >

                                <div
                                    className="feed-header-title"
                                >

                                    {active.icon || "👥"}{" "}

                                    {active.name}

                                </div>


                                <div
                                    style={{
                                        fontSize: 13,
                                        color:
                                            "var(--ink3)",
                                    }}
                                >

                                    {active.membersCount ??
                                        active.members ??
                                        0}{" "}
                                    members

                                    {" · "}

                                    {active.postsCount ??
                                        active.posts ??
                                        0}{" "}
                                    posts

                                </div>

                            </div>

                        </div>


                        {/* ==================================
                            JOIN / LEAVE
                        ================================== */}

                        {active.joined ? (

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    handleLeave(
                                        active._id
                                    )
                                }
                            >

                                Leave

                            </button>

                        ) : (

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() =>
                                    handleJoin(
                                        active._id
                                    )
                                }
                            >

                                Join

                            </button>

                        )}

                    </div>

                </div>


                {/* ==================================
                    COMMUNITY DESCRIPTION
                ================================== */}

                {active.description && (

                    <div
                        style={{
                            padding:
                                "16px 20px",
                            color:
                                "var(--ink3)",
                            fontSize:
                                14,
                            lineHeight:
                                1.6,
                        }}
                    >

                        {active.description}

                    </div>

                )}


                {/* ==================================
                    COMPOSER
                ================================== */}

                {active.joined && (

                    <ComposeBox

                        communityId={
                            active._id
                        }

                        onPublished={
                            async () => {

                                await loadCommunityVoices(
                                    active._id
                                );

                            }
                        }

                    />

                )}


                {/* ==================================
                    NOT JOINED
                ================================== */}

                {!active.joined && (

                    <div
                        className="empty-state"
                    >

                        <div
                            className="empty-ico"
                        >

                            🔒

                        </div>


                        <div
                            className="empty-title"
                        >

                            Join this community

                        </div>


                        <div
                            className="empty-sub"
                        >

                            Join this community
                            to share your own
                            voice posts.

                        </div>


                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                                handleJoin(
                                    active._id
                                )
                            }
                        >

                            Join Community

                        </button>

                    </div>

                )}


                {/* ==================================
                    COMMUNITY VOICES
                ================================== */}

                <div
                    className="section-lbl"
                    style={{
                        marginTop: 20,
                    }}
                >

                    Community Voices

                </div>


                {voicesLoading ? (

                    <div
                        className="feed-loading"
                    >

                        Loading voices...

                    </div>

                ) : communityVoices.length === 0 ? (

                    <div
                        className="empty-state"
                    >

                        <div
                            className="empty-ico"
                        >

                            🎙️

                        </div>


                        <div
                            className="empty-title"
                        >

                            No voices yet

                        </div>


                        <div
                            className="empty-sub"
                        >

                            Be the first to share
                            a voice in this
                            community.

                        </div>

                    </div>

                ) : (

                    communityVoices.map(
                        (voice) => (

                            <PostCard
                                key={
                                    voice._id
                                }
                                post={
                                    voice
                                }
                            />

                        )
                    )

                )}

            </div>

        );

    }


    // ========================================
    // COMMUNITY LIST
    // ========================================

    return (

        <div className="page-anim">

            {/* ==================================
                HEADER
            ================================== */}

            <div
                className="feed-header communities-header"
            >

                <div
                    className="feed-header-inner"
                >

                    <div>

                        <div
                            className="feed-header-title"
                        >

                            Communities

                        </div>


                        <div
                            style={{
                                fontSize: 13,
                                color:
                                    "var(--ink3)",
                                marginTop: 3,
                            }}
                        >

                            Find your campus
                            communities

                        </div>

                    </div>

                </div>


                <div
                    className="tab-strip page-tab-strip"
                >

                    <button
                        type="button"
                        className={`tab-strip-btn${
                            tab === "discover"
                                ? " active"
                                : ""
                        }`}
                        onClick={() =>
                            setTab(
                                "discover"
                            )
                        }
                    >

                        Discover

                    </button>


                    <button
                        type="button"
                        className={`tab-strip-btn${
                            tab === "joined"
                                ? " active"
                                : ""
                        }`}
                        onClick={() =>
                            setTab(
                                "joined"
                            )
                        }
                    >

                        Joined (
                        {
                            communities.filter(
                                community =>
                                    community.joined
                            ).length
                        }
                        )

                    </button>

                </div>

            </div>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <div
                    className="auth-error"
                >

                    {error}

                    <button
                        type="button"
                        className="btn btn-sm"
                        onClick={
                            loadCommunities
                        }
                    >

                        Retry

                    </button>

                </div>

            )}


            {/* ==================================
                EMPTY
            ================================== */}

            {shownCommunities.length === 0 ? (

                <div
                    className="empty-state"
                >

                    <div
                        className="empty-ico"
                    >

                        👥

                    </div>


                    <div
                        className="empty-title"
                    >

                        No communities joined

                    </div>


                    <div
                        className="empty-sub"
                    >

                        Browse communities
                        and join the ones
                        you like.

                    </div>

                </div>

            ) : (

                shownCommunities.map(
                    (community) => (

                        <div
                            key={
                                community._id
                            }
                            className="comm-row"
                            onClick={() =>
                                openCommunity(
                                    community
                                )
                            }
                        >

                            {/* ICON */}

                            <div
                                className="comm-icon"
                            >

                                {
                                    community.icon ||
                                    "👥"
                                }

                            </div>


                            {/* INFO */}

                            <div
                                className="comm-info"
                            >

                                <div
                                    className="comm-name"
                                >

                                    {
                                        community.name
                                    }

                                </div>


                                <div
                                    className="comm-meta"
                                >

                                    {
                                        community.membersCount ??
                                        community.members ??
                                        0
                                    }{" "}
                                    members

                                    {" · "}

                                    {
                                        community.postsCount ??
                                        community.posts ??
                                        0
                                    }{" "}
                                    posts

                                </div>


                                {community.college && (

                                    <div
                                        className="comm-meta"
                                    >

                                        🎓{" "}
                                        {
                                            community.college
                                        }

                                    </div>

                                )}


                                {community.tags?.length >
                                    0 && (

                                    <div
                                        className="comm-tags"
                                    >

                                        {
                                            community.tags.map(
                                                tag => (

                                                    <span
                                                        key={
                                                            tag
                                                        }
                                                        className="comm-tag"
                                                    >

                                                        #
                                                        {tag}

                                                    </span>

                                                )
                                            )
                                        }

                                    </div>

                                )}

                            </div>


                            {/* JOIN */}

                            <button
                                type="button"
                                className={`btn btn-sm ${
                                    community.joined
                                        ? "btn-secondary"
                                        : "btn-outline"
                                }`}
                                onClick={(
                                    e
                                ) => {

                                    e.stopPropagation();


                                    if (
                                        community.joined
                                    ) {

                                        handleLeave(
                                            community._id
                                        );

                                    } else {

                                        handleJoin(
                                            community._id
                                        );

                                    }

                                }}
                            >

                                {
                                    community.joined
                                        ? "✓ Joined"
                                        : "Join"
                                }

                            </button>

                        </div>

                    )
                )

            )}

        </div>

    );

}