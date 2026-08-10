import { useEffect, useState } from "react";

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

import { toggleVoiceLike } from "../api/like.api";

import {
    addComment,
    getVoiceComments,
    updateComment,
    deleteComment,
} from "../api/comment.api";

import { timeAgo } from "../utils/helpers";


export default function PostCard({
    post,
    style,
    className = "",
}) {

    const {
        navigate,
        bookmarks,
        toggleBookmark,
        user,
    } = useApp();


    // =========================
    // AUTHOR
    // =========================

    const isAnon =
        post?.isAnonymous === true;

    const author = isAnon
        ? null
        : post?.owner || post?.user;

    const displayName = isAnon
        ? null
        : author?.fullname ||
          author?.name ||
          "Unknown User";

    const displayHandle = isAnon
        ? null
        : `@${author?.username || ""}`;


    // =========================
    // LIKE
    // =========================

    const [liked, setLiked] =
        useState(post?.isLiked || false);

    const [likeCount, setLikeCount] =
        useState(post?.likesCount || 0);

    const [likeLoading, setLikeLoading] =
        useState(false);


    // =========================
    // AUDIO
    // =========================

    const [playing, setPlaying] =
        useState(false);

    const [audio] =
        useState(() => {

            if (!post?.voiceFile) {
                return null;
            }

            return new Audio(
                post.voiceFile
            );

        });


    // =========================
    // COMMENTS
    // =========================

    const [showComments, setShowComments] =
        useState(false);

    const [comments, setComments] =
        useState([]);

    const [commentsLoading, setCommentsLoading] =
        useState(false);

    const [commentLoading, setCommentLoading] =
        useState(false);

    const [commentText, setCommentText] =
        useState("");

    const [commentError, setCommentError] =
        useState("");

    const [editingCommentId, setEditingCommentId] =
        useState(null);

    const [editText, setEditText] =
        useState("");


    // =========================
    // BOOKMARK
    // =========================

    const isBkd =
        bookmarks.includes(post?._id);


    // =========================
    // LOAD COMMENTS
    // =========================

    const loadComments = async () => {

        try {

            setCommentsLoading(true);
            setCommentError("");

            const response =
                await getVoiceComments(
                    post._id
                );

            setComments(
                response?.data || []
            );

        } catch (error) {

            console.error(
                "Comments error:",
                error
            );

            setCommentError(
                error.message ||
                "Failed to load comments"
            );

        } finally {

            setCommentsLoading(false);

        }

    };


    // =========================
    // OPEN COMMENTS
    // =========================

    const handleReply = async (e) => {

        e.stopPropagation();

        const next =
            !showComments;

        setShowComments(next);

        if (
            next &&
            comments.length === 0
        ) {
            await loadComments();
        }

    };


    // =========================
    // ADD COMMENT
    // =========================

    const handleAddComment = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        const content =
            commentText.trim();

        if (!content) {
            return;
        }

        try {

            setCommentLoading(true);
            setCommentError("");

            const response =
                await addComment(
                    post._id,
                    content
                );

            const newComment =
                response?.data;

            if (newComment) {

                /*
                 * Backend addComment currently
                 * returns only the comment owner ID.
                 *
                 * So reload comments after adding
                 * to get full owner information.
                 */

                setCommentText("");

                await loadComments();

            }

        } catch (error) {

            console.error(
                "Add comment error:",
                error
            );

            setCommentError(
                error.message ||
                "Failed to add comment"
            );

        } finally {

            setCommentLoading(false);

        }

    };


    // =========================
    // START EDIT
    // =========================

    const startEdit = (
        comment
    ) => {

        setEditingCommentId(
            comment._id
        );

        setEditText(
            comment.content
        );

    };


    // =========================
    // CANCEL EDIT
    // =========================

    const cancelEdit = () => {

        setEditingCommentId(null);

        setEditText("");

    };


    // =========================
    // UPDATE COMMENT
    // =========================

    const handleUpdateComment =
        async (commentId) => {

            const content =
                editText.trim();

            if (!content) {
                return;
            }

            try {

                setCommentLoading(true);
                setCommentError("");

                await updateComment(
                    commentId,
                    content
                );

                setEditingCommentId(null);
                setEditText("");

                await loadComments();

            } catch (error) {

                console.error(
                    "Update comment error:",
                    error
                );

                setCommentError(
                    error.message ||
                    "Failed to update comment"
                );

            } finally {

                setCommentLoading(false);

            }

        };


    // =========================
    // DELETE COMMENT
    // =========================

    const handleDeleteComment =
        async (commentId) => {

            const confirmed =
                window.confirm(
                    "Delete this comment?"
                );

            if (!confirmed) {
                return;
            }

            try {

                setCommentLoading(true);
                setCommentError("");

                await deleteComment(
                    commentId
                );

                await loadComments();

            } catch (error) {

                console.error(
                    "Delete comment error:",
                    error
                );

                setCommentError(
                    error.message ||
                    "Failed to delete comment"
                );

            } finally {

                setCommentLoading(false);

            }

        };


    // =========================
    // LIKE VOICE
    // =========================

    const handleLike = async (e) => {

        e.stopPropagation();

        if (likeLoading) {
            return;
        }

        try {

            setLikeLoading(true);

            const response =
                await toggleVoiceLike(
                    post._id
                );

            const likedNow =
                response?.data?.liked ??
                response?.data?.isLiked ??
                !liked;

            setLiked(likedNow);

            setLikeCount((count) => {

                if (likedNow && !liked) {
                    return count + 1;
                }

                if (!likedNow && liked) {
                    return Math.max(
                        0,
                        count - 1
                    );
                }

                return count;

            });

        } catch (error) {

            console.error(
                "Like error:",
                error
            );

        } finally {

            setLikeLoading(false);

        }

    };


    // =========================
    // AUDIO PLAY
    // =========================

    const handlePlay = async (e) => {

        e.stopPropagation();

        if (!audio) {
            return;
        }

        try {

            if (playing) {

                audio.pause();

                setPlaying(false);

            } else {

                await audio.play();

                setPlaying(true);

                audio.onended = () => {
                    setPlaying(false);
                };

            }

        } catch (error) {

            console.error(
                "Audio playback error:",
                error
            );

        }

    };


    // =========================
    // BOOKMARK
    // =========================

    const handleBookmark = (e) => {

        e.stopPropagation();

        toggleBookmark(
            post._id
        );

    };


    // =========================
    // USER PROFILE
    // =========================

    const goUser = (e) => {

        e.stopPropagation();

        if (!isAnon && author) {

            navigate(
                "user",
                author
            );

        }

    };


    // =========================
    // SHARE
    // =========================

    const handleShare = async (e) => {

        e.stopPropagation();

        try {

            const url =
                `${window.location.origin}/voice/${post._id}`;

            if (navigator.share) {

                await navigator.share({
                    title:
                        post.title ||
                        "WeVoc Voice",

                    text:
                        post.description ||
                        "Check out this voice on WeVoc",

                    url,
                });

            } else {

                await navigator.clipboard
                    .writeText(url);

                alert(
                    "Voice link copied!"
                );

            }

        } catch (error) {

            console.log(
                "Share cancelled"
            );

        }

    };


    // =========================
    // DURATION
    // =========================

    const formatDuration = (
        seconds
    ) => {

        if (
            !seconds ||
            isNaN(seconds)
        ) {
            return "0:00";
        }

        const mins =
            Math.floor(
                seconds / 60
            );

        const secs =
            Math.floor(
                seconds % 60
            );

        return `${mins}:${secs
            .toString()
            .padStart(2, "0")}`;

    };


    // =========================
    // COMMENT COUNT
    // =========================

    const commentCount =
        showComments
            ? comments.length
            : (
                post?.commentsCount ||
                post?.commentCount ||
                0
            );


    // =========================
    // SCORE
    // =========================

    const score =
        post?.score ??
        (
            (post?.views || 0) +
            likeCount * 5
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
                    isAnon
                        ? "?"
                        : displayName
                }
                src={
                    isAnon
                        ? undefined
                        : author?.avatar
                }
                size="md"
                onClick={
                    isAnon
                        ? undefined
                        : goUser
                }
            />


            {/* =========================
                BODY
            ========================= */}

            <div className="post-body-col">


                {/* HEADER */}

                <div className="post-header">

                    <div className="post-meta">

                        {isAnon ? (

                            <span className="anon-pill">

                                <ProfileIcon />

                                Anonymous

                            </span>

                        ) : (

                            <>

                                <span
                                    className="post-name"
                                    onClick={goUser}
                                >
                                    {displayName}
                                </span>

                                <span className="post-handle">
                                    {displayHandle}
                                </span>

                                <span className="post-sep">
                                    ·
                                </span>

                            </>

                        )}

                        <span className="post-time">

                            {post?.createdAt
                                ? timeAgo(
                                    post.createdAt
                                )
                                : ""}

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


                {/* TITLE */}

                {post?.title && (

                    <h3
                        className="post-title"
                        style={{
                            margin:
                                "4px 0 6px",
                        }}
                    >
                        {post.title}
                    </h3>

                )}


                {/* DESCRIPTION */}

                {post?.description && (

                    <p className="post-text">

                        {post.description}

                    </p>

                )}


                {/* AUDIO */}

                <div className="audio-player">

                    <button
                        className="play-btn"
                        onClick={handlePlay}
                    >

                        {playing
                            ? <PauseIcon />
                            : <PlayIcon />}

                    </button>


                    <Waveform
                        playing={playing}
                    />


                    <span className="audio-dur">

                        {formatDuration(
                            post?.duration
                        )}

                    </span>

                </div>


                {/* ACTIONS */}

                <div className="post-actions">


                    {/* COMMENTS */}

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

                            {commentCount}

                        </span>

                    </button>


                    {/* LIKE */}

                    <button
                        className={`act-btn${
                            liked
                                ? " liked"
                                : ""
                        }`}
                        onClick={
                            handleLike
                        }
                        disabled={
                            likeLoading
                        }
                    >

                        <span className="act-ico">

                            {liked
                                ? <HeartIcon />
                                : <HeartOutlineIcon />}

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
                        onClick={
                            handleShare
                        }
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


                {/* =========================
                    COMMENTS
                ========================= */}

                {showComments && (

                    <div
                        style={{
                            marginTop: 12,
                        }}
                    >

                        {/* Add comment */}

                        <form
                            onSubmit={
                                handleAddComment
                            }
                            style={{
                                display:
                                    "flex",
                                gap: 8,
                                marginBottom:
                                    12,
                            }}
                        >

                            <input
                                className="field"
                                type="text"
                                placeholder="Write a comment..."
                                value={
                                    commentText
                                }
                                onChange={(e) =>
                                    setCommentText(
                                        e.target.value
                                    )
                                }
                                disabled={
                                    commentLoading
                                }
                            />

                            <button
                                type="submit"
                                className="btn btn-primary btn-sm"
                                disabled={
                                    commentLoading ||
                                    !commentText.trim()
                                }
                            >
                                {commentLoading
                                    ? "..."
                                    : "Send"}
                            </button>

                        </form>


                        {/* Error */}

                        {commentError && (

                            <div
                                className="auth-error"
                                style={{
                                    marginBottom:
                                        10,
                                }}
                            >
                                {commentError}
                            </div>

                        )}


                        {/* Loading */}

                        {commentsLoading && (

                            <div
                                className="empty-sub"
                                style={{
                                    padding:
                                        "10px 0",
                                }}
                            >
                                Loading comments...
                            </div>

                        )}


                        {/* Empty */}

                        {!commentsLoading &&
                            comments.length === 0 && (

                                <div
                                    className="empty-sub"
                                    style={{
                                        padding:
                                            "10px 0",
                                    }}
                                >
                                    No comments yet.
                                    Be the first to comment.
                                </div>

                            )}


                        {/* Comment list */}

                        {!commentsLoading &&
                            comments.map(
                                (comment) => {

                                    const commentOwner =
                                        comment.owner;


                                    const isOwner =
                                        user?._id &&
                                        commentOwner?._id &&
                                        String(
                                            user._id
                                        ) === String(
                                            commentOwner._id
                                        );


                                    return (

                                        <div
                                            key={
                                                comment._id
                                            }
                                            style={{
                                                display:
                                                    "flex",
                                                gap: 10,
                                                padding:
                                                    "10px 0",
                                                borderBottom:
                                                    "1px solid var(--border)",
                                            }}
                                        >

                                            <Avatar
                                                name={
                                                    commentOwner?.fullname ||
                                                    "User"
                                                }
                                                src={
                                                    commentOwner?.avatar
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    navigate(
                                                        "user",
                                                        commentOwner
                                                    )
                                                }
                                            />


                                            <div
                                                style={{
                                                    flex: 1,
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        gap: 8,
                                                    }}
                                                >

                                                    <div>

                                                        <strong>
                                                            {
                                                                commentOwner?.fullname ||
                                                                "Unknown User"
                                                            }
                                                        </strong>

                                                        <span
                                                            style={{
                                                                marginLeft:
                                                                    6,
                                                                color:
                                                                    "var(--ink3)",
                                                                fontSize:
                                                                    12,
                                                            }}
                                                        >
                                                            @
                                                            {
                                                                commentOwner?.username
                                                            }
                                                        </span>

                                                    </div>


                                                    {isOwner && (

                                                        <div
                                                            style={{
                                                                display:
                                                                    "flex",
                                                                gap: 5,
                                                            }}
                                                        >

                                                            <button
                                                                type="button"
                                                                className="btn btn-ghost btn-sm"
                                                                onClick={() =>
                                                                    startEdit(
                                                                        comment
                                                                    )
                                                                }
                                                                disabled={
                                                                    commentLoading
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() =>
                                                                    handleDeleteComment(
                                                                        comment._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    commentLoading
                                                                }
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    )}

                                                </div>


                                                {editingCommentId ===
                                                comment._id ? (

                                                    <div
                                                        style={{
                                                            marginTop:
                                                                8,
                                                            display:
                                                                "flex",
                                                            gap: 8,
                                                        }}
                                                    >

                                                        <input
                                                            className="field"
                                                            value={
                                                                editText
                                                            }
                                                            onChange={(e) =>
                                                                setEditText(
                                                                    e.target.value
                                                                )
                                                            }
                                                        />

                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() =>
                                                                handleUpdateComment(
                                                                    comment._id
                                                                )
                                                            }
                                                            disabled={
                                                                commentLoading ||
                                                                !editText.trim()
                                                            }
                                                        >
                                                            Save
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-ghost btn-sm"
                                                            onClick={
                                                                cancelEdit
                                                            }
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>

                                                ) : (

                                                    <p
                                                        style={{
                                                            margin:
                                                                "5px 0 0",
                                                        }}
                                                    >
                                                        {
                                                            comment.content
                                                        }
                                                    </p>

                                                )}


                                                <div
                                                    style={{
                                                        fontSize:
                                                            11,
                                                        color:
                                                            "var(--ink3)",
                                                        marginTop:
                                                            4,
                                                    }}
                                                >
                                                    {comment.createdAt
                                                        ? timeAgo(
                                                            comment.createdAt
                                                        )
                                                        : ""}
                                                </div>

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                    </div>

                )}

            </div>

        </article>

    );

}