import { useEffect, useRef, useState } from "react";

import Avatar from "./Avatar";
import { Waveform } from "./Waveform";

import {
    BookmarkIcon,
    HeartIcon,
    HeartOutlineIcon,
    PauseIcon,
    PlayIcon,
    ProfileIcon,
    ReplyIcon,
    ShareIcon,
    FlameIcon,
} from "./Icons";

import { useApp } from "../context/AppContext";

import {
    toggleVoiceLike,
} from "../api/like.api";

import {
    timeAgo,
} from "../utils/helpers";


export default function PostCard({
    post,
    style,
    className = "",
}) {

    const {
        navigate,
        bookmarks,
        toggleBookmark,
    } = useApp();


    // =========================
    // BASIC DATA
    // =========================

    const owner =
        post?.owner || post?.user || null;


    const displayName =
        owner?.fullname ||
        owner?.name ||
        "Unknown User";


    const username =
        owner?.username || "";


    const avatar =
        owner?.avatar || null;


    const voiceId =
        post?._id;


    const title =
        post?.title || "";


    const description =
        post?.description ||
        post?.caption ||
        "";


    const voiceFile =
        post?.voiceFile ||
        null;


    const duration =
        Number(post?.duration || 0);


    const isBkd =
        bookmarks.includes(
            voiceId
        );


    // =========================
    // STATES
    // =========================

    const [liked, setLiked] =
        useState(
            Boolean(
                post?.isLiked
            )
        );


    const [likeCount, setLikeCount] =
        useState(
            Number(
                post?.likesCount || 0
            )
        );


    const [playing, setPlaying] =
        useState(false);


    const [loadingLike, setLoadingLike] =
        useState(false);


    const [showReply, setShowReply] =
        useState(false);


    const audioRef =
        useRef(null);


    // =========================
    // AUDIO
    // =========================

    useEffect(() => {

        const audio =
            audioRef.current;


        if (!audio) {
            return;
        }


        const handleEnded = () => {

            setPlaying(false);

        };


        audio.addEventListener(
            "ended",
            handleEnded
        );


        return () => {

            audio.removeEventListener(
                "ended",
                handleEnded
            );

        };

    }, []);


    // =========================
    // PLAY / PAUSE
    // =========================

    const handlePlay = async (e) => {

        e.stopPropagation();


        const audio =
            audioRef.current;


        if (!audio || !voiceFile) {
            return;
        }


        try {

            if (playing) {

                audio.pause();

                setPlaying(false);

            } else {

                await audio.play();

                setPlaying(true);

            }

        } catch (error) {

            console.error(
                "Audio playback failed:",
                error
            );

        }

    };


    // =========================
    // LIKE
    // =========================

    const handleLike = async (e) => {

        e.stopPropagation();


        if (
            !voiceId ||
            loadingLike
        ) {
            return;
        }


        // Optimistic UI

        const previousLiked =
            liked;


        const previousCount =
            likeCount;


        const nextLiked =
            !liked;


        setLiked(
            nextLiked
        );


        setLikeCount(
            nextLiked
                ? previousCount + 1
                : Math.max(
                    0,
                    previousCount - 1
                )
        );


        try {

            setLoadingLike(true);


            const response =
                await toggleVoiceLike(
                    voiceId
                );


            const message =
                response?.message
                    ?.toLowerCase() || "";


            const actuallyLiked =
                message.includes(
                    "liked"
                ) &&
                !message.includes(
                    "unliked"
                );


            /*
             * Backend is the final truth.
             */

            setLiked(
                actuallyLiked
            );


        } catch (error) {

            console.error(
                "Like failed:",
                error
            );


            // Rollback

            setLiked(
                previousLiked
            );


            setLikeCount(
                previousCount
            );

        } finally {

            setLoadingLike(false);

        }

    };


    // =========================
    // BOOKMARK
    // =========================

    const handleBookmark = (e) => {

        e.stopPropagation();

        toggleBookmark(
            voiceId
        );

    };


    // =========================
    // REPLY
    // =========================

    const handleReply = (e) => {

        e.stopPropagation();

        setShowReply(
            (value) => !value
        );

    };


    // =========================
    // USER PROFILE
    // =========================

    const goUser = (e) => {

        e.stopPropagation();


        if (!owner?._id) {
            return;
        }


        navigate(
            "user",
            owner
        );

    };


    // =========================
    // FORMAT DURATION
    // =========================

    const formatDuration = (
        seconds
    ) => {

        if (!seconds) {
            return "0:00";
        }


        const mins =
            Math.floor(
                seconds / 60
            );


        const secs =
            Math.floor(
                seconds % 60
            )
                .toString()
                .padStart(
                    2,
                    "0"
                );


        return `${mins}:${secs}`;

    };


    // =========================
    // SCORE
    // =========================

    const score =
        Number(
            post?.score ||
            likeCount +
            Number(post?.views || 0)
        );


    return (

        <article
            className={`post-card${
                className
                    ? ` ${className}`
                    : ""
            }`}
            style={style}
        >


            {/* =========================
                AVATAR
            ========================= */}

            <Avatar
                name={
                    displayName
                }
                src={
                    avatar
                }
                size="md"
                onClick={
                    goUser
                }
            />


            {/* =========================
                BODY
            ========================= */}

            <div className="post-body-col">


                {/* =====================
                    HEADER
                ===================== */}

                <div className="post-header">

                    <div className="post-meta">


                        <span
                            className="post-name"
                            onClick={
                                goUser
                            }
                        >

                            {displayName}

                        </span>


                        <span className="post-handle">

                            @{username}

                        </span>


                        <span className="post-sep">

                            ·

                        </span>


                        <span className="post-time">

                            {timeAgo(
                                post?.createdAt
                            )}

                        </span>

                    </div>


                    <button
                        className="post-more-btn"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        ···

                    </button>

                </div>


                {/* =====================
                    TITLE
                ===================== */}

                {title && (

                    <h3
                        className="post-title"
                        style={{
                            margin:
                                "8px 0 4px",
                        }}
                    >

                        {title}

                    </h3>

                )}


                {/* =====================
                    DESCRIPTION
                ===================== */}

                {description && (

                    <p className="post-text">

                        {description}

                    </p>

                )}


                {/* =====================
                    AUDIO
                ===================== */}

                {voiceFile && (

                    <>

                        <audio
                            ref={
                                audioRef
                            }
                            src={
                                voiceFile
                            }
                            preload="metadata"
                        />


                        <div className="audio-player">


                            <button
                                className="play-btn"
                                onClick={
                                    handlePlay
                                }
                            >

                                {playing
                                    ? (
                                        <PauseIcon />
                                    )
                                    : (
                                        <PlayIcon />
                                    )
                                }

                            </button>


                            <Waveform
                                playing={
                                    playing
                                }
                            />


                            <span className="audio-dur">

                                {formatDuration(
                                    duration
                                )}

                            </span>

                        </div>

                    </>

                )}


                {/* =====================
                    ACTIONS
                ===================== */}

                <div className="post-actions">


                    {/* REPLY */}

                    <button
                        className="act-btn act-reply"
                        onClick={
                            handleReply
                        }
                    >

                        <span className="act-ico">

                            <ReplyIcon />

                        </span>


                        <span className="act-num">

                            {post?.commentsCount ||
                                post?.replyCount ||
                                0}

                        </span>

                    </button>


                    {/* LIKE */}

                    <button
                        className={`act-btn${
                            liked
                                ? " liked"
                                : ""
                        }`}
                        disabled={
                            loadingLike
                        }
                        onClick={
                            handleLike
                        }
                    >

                        <span className="act-ico">

                            {liked
                                ? (
                                    <HeartIcon />
                                )
                                : (
                                    <HeartOutlineIcon />
                                )
                            }

                        </span>


                        <span className="act-num">

                            {likeCount}

                        </span>

                    </button>


                    {/* BOOKMARK */}

                    <button
                        className={`act-btn${
                            isBkd
                                ? " liked"
                                : ""
                        }`}
                        onClick={
                            handleBookmark
                        }
                    >

                        <span className="act-ico">

                            <BookmarkIcon />

                        </span>

                    </button>


                    {/* SHARE */}

                    <button
                        className="act-btn act-share"
                        onClick={async (e) => {

                            e.stopPropagation();


                            try {

                                await navigator.clipboard.writeText(
                                    window.location.origin +
                                    "/voice/" +
                                    voiceId
                                );

                            } catch (
                                error
                            ) {

                                console.error(
                                    error
                                );

                            }

                        }}
                    >

                        <span className="act-ico">

                            <ShareIcon />

                        </span>

                    </button>


                    {/* SCORE */}

                    <div className="score-badge">

                        <FlameIcon />

                        {score}

                    </div>

                </div>


                {/* =====================
                    REPLY AREA
                ===================== */}

                {showReply && (

                    <div
                        style={{
                            marginTop: 12,
                        }}
                    >

                        <div className="empty-state">

                            <div className="empty-ico">

                                💬

                            </div>


                            <div className="empty-title">

                                Comments

                            </div>


                            <div
                                style={{
                                    fontSize:
                                        13,
                                    color:
                                        "var(--ink3)",
                                }}
                            >

                                Comment system
                                is connected
                                next.

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </article>

    );

}

