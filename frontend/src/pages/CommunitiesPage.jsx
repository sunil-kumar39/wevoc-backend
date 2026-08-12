import { useEffect, useState } from "react";

import Avatar from "../components/Avatar";

import {
    getCommunities,
    getCommunity,
    joinCommunity,
    leaveCommunity,
    createCommunity,
} from "../api/community.api";


export default function CommunitiesPage() {

    const [communities, setCommunities] =
        useState([]);

    const [tab, setTab] =
        useState("discover");

    const [active, setActive] =
        useState(null);

    const [posts, setPosts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [postsLoading, setPostsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [postsError, setPostsError] =
        useState("");

    const [showCreate, setShowCreate] =
        useState(false);


    // =====================================================
    // FETCH COMMUNITIES
    // =====================================================

    const fetchCommunities = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getCommunities();

            setCommunities(
                response.data || []
            );

        } catch (err) {

            console.error(
                "Fetch communities error:",
                err
            );

            setError(
                err.message ||
                "Failed to load communities"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchCommunities();

    }, []);


    // =====================================================
    // JOIN / LEAVE COMMUNITY
    // =====================================================

    const toggleCommunity = async (
        community
    ) => {

        try {

            if (community.joined) {

                await leaveCommunity(
                    community._id
                );

            } else {

                await joinCommunity(
                    community._id
                );

            }


            const joined =
                !community.joined;


            setCommunities(
                current =>
                    current.map(c => {

                        if (
                            c._id !==
                            community._id
                        ) {
                            return c;
                        }


                        return {
                            ...c,

                            joined,

                            membersCount:
                                Math.max(
                                    0,
                                    (c.membersCount || 0) +
                                    (joined ? 1 : -1)
                                ),
                        };

                    })
            );


            // Update active community
            setActive(
                current => {

                    if (
                        !current ||
                        current._id !==
                        community._id
                    ) {
                        return current;
                    }


                    return {
                        ...current,

                        joined,

                        membersCount:
                            Math.max(
                                0,
                                (current.membersCount || 0) +
                                (joined ? 1 : -1)
                            ),
                    };

                }
            );

        } catch (err) {

            console.error(
                "Join/leave error:",
                err
            );

            alert(
                err.message ||
                "Something went wrong"
            );

        }
    };


    // =====================================================
    // OPEN COMMUNITY
    // =====================================================

   const openCommunity = async (communityId) => {
    try {
        setLoading(true);
        setPosts([]);
        setPostsError("");

        const response = await getCommunity(communityId);

        setActive(response.data);

    } catch (err) {
        console.error("Open community error:", err);

        setError(
            err.message || "Failed to open community"
        );
    } finally {
        setLoading(false);
    }
};
    // =====================================================
    // CLOSE COMMUNITY
    // =====================================================

    const closeCommunity = () => {

        setActive(null);
        setPosts([]);
        setPostsError("");

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (
        loading &&
        communities.length === 0
    ) {

        return (

            <div className="page-anim">

                <div className="empty-state">

                    <div className="empty-ico">
                        ⏳
                    </div>

                    <div className="empty-title">
                        Loading communities...
                    </div>

                </div>

            </div>

        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        error &&
        communities.length === 0
    ) {

        return (

            <div className="page-anim">

                <div className="empty-state">

                    <div className="empty-ico">
                        ⚠️
                    </div>

                    <div className="empty-title">
                        {error}
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={fetchCommunities}
                    >
                        Try again
                    </button>

                </div>

            </div>

        );
    }


    // =====================================================
    // ACTIVE COMMUNITY
    // =====================================================

    if (active) {

        return (

            <div className="page-anim">

                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="feed-header">

                    <div className="feed-header-inner">

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                minWidth: 0,
                            }}
                        >

                            <button
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

                                <div className="feed-header-title">

                                    {active.icon || "👥"}{" "}

                                    {active.name}

                                </div>


                                <div
                                    style={{
                                        fontSize: 13,
                                        color:
                                            "var(--ink3)",
                                        marginTop: 3,
                                    }}
                                >

                                    {(
                                        active.membersCount ||
                                        0
                                    ).toLocaleString()}{" "}

                                    members

                                </div>

                            </div>

                        </div>


                      <button
    className={`btn btn-sm ${
        active.joined
            ? "btn-secondary"
            : "btn-primary"
    }`}
    onClick={() => toggleCommunity(active)}
>
    {active.joined ? "Leave" : "Join"}
</button>
                    </div>

                </div>


                {/* =========================================
                    COMMUNITY INFO
                ========================================= */}

                <div
                    style={{
                        padding:
                            "20px 24px 10px",
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 12,
                        }}
                    >

                        <div
                            style={{
                                width: 52,
                                height: 52,
                                borderRadius: 16,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background:
                                    "var(--bg3)",
                                border:
                                    "1px solid var(--bg4)",
                                fontSize: 27,
                            }}
                        >
                            {active.icon || "👥"}
                        </div>


                        <div>

                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: 21,
                                }}
                            >
                                {active.name}
                            </h2>

                            <div
                                style={{
                                    marginTop: 4,
                                    fontSize: 13,
                                    color:
                                        "var(--ink3)",
                                }}
                            >
                                🎓 {active.college}
                            </div>

                        </div>

                    </div>


                    <p
                        style={{
                            margin: 0,
                            color:
                                "var(--ink3)",
                            lineHeight: 1.6,
                        }}
                    >
                        {active.description}
                    </p>


                    {active.tags?.length > 0 && (

                        <div
                            className="comm-tags"
                            style={{
                                marginTop: 14,
                            }}
                        >

                            {active.tags.map(
                                tag => (

                                    <span
                                        key={tag}
                                        className="comm-tag"
                                    >
                                        #{tag}
                                    </span>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =========================================
                    POSTS
                ========================================= */}

                <div
                    className="section-lbl"
                    style={{
                        marginTop: 12,
                    }}
                >
                    Recent posts
                </div>


                {postsLoading ? (

                    <div className="empty-state">

                        <div className="empty-ico">
                            🎙️
                        </div>

                        <div className="empty-title">
                            Loading posts...
                        </div>

                    </div>

                ) : postsError ? (

                    <div className="empty-state">

                        <div className="empty-ico">
                            ⚠️
                        </div>

                        <div className="empty-title">
                            {postsError}
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                openCommunity(
                                    active._id
                                )
                            }
                        >
                            Try again
                        </button>

                    </div>

                ) : posts.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-ico">
                            🎙️
                        </div>

                        <div className="empty-title">
                            No posts yet
                        </div>

                        <div className="empty-sub">
                            Be the first to share a
                            voice in this community.
                        </div>

                    </div>

                ) : (

                    <div
                        style={{
                            paddingBottom: 30,
                        }}
                    >

                        {posts.map(
                            post => (

                                <CommunityVoicePost
                                    key={post._id}
                                    post={post}
                                />

                            )
                        )}

                    </div>

                )}

            </div>

        );
    }


    // =====================================================
    // DISCOVER / JOINED
    // =====================================================

    const shown =
        tab === "joined"
            ? communities.filter(
                c => c.joined
            )
            : communities;


    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <div className="page-anim">

            {/* =========================================
                HEADER
            ========================================= */}

            <div
                className="feed-header communities-header"
            >

                <div className="feed-header-inner">

                    <button
                        className="community-create-bar"
                        onClick={() =>
                            setShowCreate(true)
                        }
                    >

                        <span
                            className="community-create-plus"
                            aria-hidden="true"
                        />

                        <span>
                            Create community
                        </span>

                    </button>

                </div>


                <div
                    className="tab-strip page-tab-strip"
                >

                    <button
                        className={`tab-strip-btn${
                            tab === "discover"
                                ? " active"
                                : ""
                        }`}
                        onClick={() =>
                            setTab("discover")
                        }
                    >
                        Discover
                    </button>


                    <button
                        className={`tab-strip-btn${
                            tab === "joined"
                                ? " active"
                                : ""
                        }`}
                        onClick={() =>
                            setTab("joined")
                        }
                    >

                        Joined (
                        {
                            communities.filter(
                                c => c.joined
                            ).length
                        }
                        )

                    </button>

                </div>

            </div>


            {/* =========================================
                COMMUNITY LIST
            ========================================= */}

            {shown.length === 0 ? (

                <div className="empty-state">

                    <div className="empty-ico">
                        👥
                    </div>

                    <div className="empty-title">
                        No communities joined
                    </div>

                    <div className="empty-sub">
                        Browse and join communities
                        that interest you.
                    </div>

                </div>

            ) : (

                shown.map(c => (

                    <div
                        key={c._id}
                        className="comm-row"
                        onClick={() =>
                            openCommunity(
                                c._id
                            )
                        }
                    >

                        {/* Icon */}

                        <div className="comm-icon">

                            {c.icon || "👥"}

                        </div>


                        {/* Info */}

                        <div className="comm-info">

                            <div className="comm-name">
                                {c.name}
                            </div>


                            <div className="comm-meta">

                                {
                                    (
                                        c.membersCount ||
                                        0
                                    ).toLocaleString()
                                }{" "}
                                members

                                {" · "}

                                {
                                    c.postsCount ||
                                    0
                                }{" "}
                                posts

                            </div>


                            <div
                                className="comm-tags"
                            >

                                {c.tags?.map(
                                    tag => (

                                        <span
                                            key={tag}
                                            className="comm-tag"
                                        >
                                            #{tag}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>


                        {/* Join */}

                        <button
    className={`btn btn-sm ${
        c.joined
            ? "btn-secondary"
            : "btn-outline"
    }`}
    onClick={e => {
        e.stopPropagation();
        toggleCommunity(c);
    }}
>
    {c.joined ? "Leave" : "Join"}
</button>

                    </div>

                ))

            )}


            {/* =========================================
                CREATE MODAL
            ========================================= */}

            {showCreate && (

                <CreateCommunityModal

                    onClose={() =>
                        setShowCreate(false)
                    }

                    onCreated={async () => {

                        setShowCreate(false);

                        await fetchCommunities();

                    }}

                />

            )}

        </div>

    );
}


// =====================================================
// COMMUNITY VOICE POST
// =====================================================

function CommunityVoicePost({
    post
}) {

    const [playing, setPlaying] =
        useState(false);


    const [audio] =
        useState(
            () => new Audio(
                post.voiceFile
            )
        );


    useEffect(() => {

        const ended =
            () => setPlaying(false);

        audio.addEventListener(
            "ended",
            ended
        );

        return () => {

            audio.pause();

            audio.removeEventListener(
                "ended",
                ended
            );

        };

    }, [audio]);


    const togglePlay = () => {

        if (playing) {

            audio.pause();

            setPlaying(false);

        } else {

            audio.play()
                .then(() =>
                    setPlaying(true)
                )
                .catch(err =>
                    console.error(
                        "Audio play error:",
                        err
                    )
                );

        }

    };


    const owner =
        post.isAnonymous
            ? null
            : post.owner;


    return (

        <article
            style={{
                margin:
                    "0 20px 14px",
                padding: 18,
                borderRadius: 18,
                background:
                    "var(--surface)",
                border:
                    "1px solid var(--bg4)",
                boxShadow:
                    "0 6px 20px rgba(0,0,0,0.04)",
            }}
        >

            {/* =========================================
                AUTHOR
            ========================================= */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                }}
            >

                {owner ? (

                    <Avatar
                        name={
                            owner.fullname ||
                            "User"
                        }
                        src={
                            owner.avatar
                        }
                        size="sm"
                    />

                ) : (

                    <Avatar
                        name="Anonymous"
                        size="sm"
                    />

                )}


                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >

                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: 14,
                        }}
                    >

                        {owner
                            ? owner.fullname
                            : "Anonymous"}

                    </div>


                    <div
                        style={{
                            fontSize: 12,
                            color:
                                "var(--ink3)",
                            marginTop: 2,
                        }}
                    >

                        {owner
                            ? `@${owner.username}`
                            : "Community member"}

                    </div>

                </div>

            </div>


            {/* =========================================
                TITLE
            ========================================= */}

            {post.title && (

                <div
                    style={{
                        fontSize: 17,
                        fontWeight: 750,
                        color:
                            "var(--ink)",
                        marginBottom: 7,
                    }}
                >
                    {post.title}
                </div>

            )}


            {/* =========================================
                DESCRIPTION
            ========================================= */}

            {post.description && (

                <div
                    style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color:
                            "var(--ink2)",
                        marginBottom: 14,
                    }}
                >
                    {post.description}
                </div>

            )}


            {/* =========================================
                AUDIO PLAYER
            ========================================= */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding:
                        "12px 14px",
                    borderRadius: 14,
                    background:
                        "var(--bg2)",
                    border:
                        "1px solid var(--bg4)",
                }}
            >

                <button
                    type="button"
                    onClick={
                        togglePlay
                    }
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        border: "none",
                        background:
                            "var(--crimson)",
                        color: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        fontSize: 16,
                        flexShrink: 0,
                    }}
                >

                    {playing
                        ? "Ⅱ"
                        : "▶"}

                </button>


                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >

                    <div
                        style={{
                            fontSize: 12,
                            color:
                                "var(--ink3)",
                            marginBottom: 6,
                        }}
                    >
                        {playing
                            ? "Playing..."
                            : "Voice post"}
                    </div>


                    <div
                        style={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: 4,
                            height: 22,
                            overflow:
                                "hidden",
                        }}
                    >

                        {Array.from(
                            {
                                length: 30
                            }
                        ).map(
                            (_, index) => (

                                <span
                                    key={
                                        index
                                    }
                                    style={{
                                        width: 3,
                                        minWidth: 3,
                                        height:
                                            `${8 + ((index * 17) % 16)}px`,
                                        borderRadius:
                                            5,
                                        background:
                                            playing
                                                ? "var(--crimson)"
                                                : "var(--ink4)",
                                        opacity:
                                            playing
                                                ? 0.85
                                                : 0.45,
                                    }}
                                />

                            )
                        )}

                    </div>

                </div>

            </div>


            {/* =========================================
                DATE
            ========================================= */}

            <div
                style={{
                    marginTop: 10,
                    fontSize: 11,
                    color:
                        "var(--ink4)",
                }}
            >

                {post.createdAt
                    ? new Date(
                        post.createdAt
                    ).toLocaleString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                        }
                    )
                    : ""}

            </div>

        </article>

    );
}


// =====================================================
// CREATE COMMUNITY MODAL
// =====================================================

function CreateCommunityModal({
    onClose,
    onCreated,
}) {

    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [college, setCollege] =
        useState("");

    const [icon, setIcon] =
        useState("👥");

    const [tags, setTags] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const submit = async e => {

        e.preventDefault();

        setError("");


        if (
            !name.trim() ||
            !description.trim() ||
            !college.trim()
        ) {

            setError(
                "Name, description and college are required."
            );

            return;

        }


        try {

            setLoading(true);


            await createCommunity({

                name:
                    name.trim(),

                description:
                    description.trim(),

                college:
                    college.trim(),

                icon:
                    icon.trim() ||
                    "👥",

                tags:
                    tags
                        .split(",")
                        .map(
                            x =>
                                x.trim()
                        )
                        .filter(Boolean),

            });


            await onCreated();

        } catch (err) {

            console.error(
                "Create community error:",
                err
            );

            setError(
                err.message ||
                "Failed to create community"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div
            style={{
                position: "fixed",
                inset: 0,
                background:
                    "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems:
                    "center",
                justifyContent:
                    "center",
                zIndex: 9999,
                padding: 20,
            }}
            onClick={
                onClose
            }
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: 520,
                    background:
                        "var(--surface)",
                    borderRadius: 20,
                    padding: 24,
                    boxShadow:
                        "0 25px 80px rgba(0,0,0,0.2)",
                }}
                onClick={e =>
                    e.stopPropagation()
                }
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        marginBottom: 20,
                    }}
                >

                    <div>

                        <h2
                            style={{
                                margin: 0,
                            }}
                        >
                            Create community
                        </h2>

                        <p
                            style={{
                                margin:
                                    "6px 0 0",
                                color:
                                    "var(--ink3)",
                            }}
                        >
                            Create a space for
                            your college.
                        </p>

                    </div>


                    <button
                        className="back-btn"
                        onClick={
                            onClose
                        }
                    >
                        ×
                    </button>

                </div>


                {error && (

                    <div
                        className="auth-error"
                        style={{
                            marginBottom: 14,
                        }}
                    >
                        {error}
                    </div>

                )}


                <form
                    onSubmit={
                        submit
                    }
                >

                    <input
                        className="compose-textarea"
                        style={{
                            height: 48,
                            marginBottom: 12,
                        }}
                        placeholder="Community name"
                        value={name}
                        onChange={e =>
                            setName(
                                e.target.value
                            )
                        }
                    />


                    <input
                        className="compose-textarea"
                        style={{
                            height: 48,
                            marginBottom: 12,
                        }}
                        placeholder="College / University"
                        value={college}
                        onChange={e =>
                            setCollege(
                                e.target.value
                            )
                        }
                    />


                    <textarea
                        className="compose-textarea"
                        style={{
                            height: 90,
                            marginBottom: 12,
                        }}
                        placeholder="What is this community about?"
                        value={description}
                        onChange={e =>
                            setDescription(
                                e.target.value
                            )
                        }
                    />


                    <div
                        style={{
                            display: "flex",
                            gap: 10,
                            marginBottom: 12,
                        }}
                    >

                        <input
                            className="compose-textarea"
                            style={{
                                width: 70,
                                height: 48,
                                margin: 0,
                                textAlign:
                                    "center",
                            }}
                            value={icon}
                            onChange={e =>
                                setIcon(
                                    e.target.value
                                )
                            }
                        />


                        <input
                            className="compose-textarea"
                            style={{
                                height: 48,
                                margin: 0,
                            }}
                            placeholder="Tags: coding, music, study"
                            value={tags}
                            onChange={e =>
                                setTags(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                            gap: 10,
                            marginTop: 18,
                        }}
                    >

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={
                                onClose
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating..."
                                : "Create community"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}