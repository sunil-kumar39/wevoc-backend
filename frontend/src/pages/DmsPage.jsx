import { useEffect, useState } from "react";

import Avatar from "../components/Avatar";

import {
    Waveform,
    LiveBars,
} from "../components/Waveform";

import { SearchIcon } from "../components/Icons";

import {
    getConversations,
    getMessagesWithUser,
    sendVoiceMessage,
} from "../api/message.api";

import { timeAgo } from "../utils/helpers";
import { useApp } from "../context/AppContext";


export default function DmsPage() {

    const { user: currentUser } = useApp();

    const [threads, setThreads] =
        useState([]);

    const [active, setActive] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);


    // =========================================
    // LOAD CONVERSATIONS
    // =========================================

    useEffect(() => {

        const loadConversations =
            async () => {

                try {

                    setLoading(true);

                    const response =
                        await getConversations();

                    setThreads(
                        response?.data || []
                    );

                } catch (error) {

                    console.error(
                        "Failed to load conversations:",
                        error
                    );

                } finally {

                    setLoading(false);

                }

            };


        loadConversations();

    }, []);


    // =========================================
    // SEARCH
    // =========================================

    const shownThreads =
        threads.filter(thread => {

            const name =
                thread.user?.fullname
                    ?.toLowerCase() || "";

            const username =
                thread.user?.username
                    ?.toLowerCase() || "";

            const query =
                search.toLowerCase();

            return (
                name.includes(query) ||
                username.includes(query)
            );

        });


    // =========================================
    // OPEN CHAT
    // =========================================

    const openChat =
        async (thread) => {

            try {

                const response =
                    await getMessagesWithUser(
                        thread.user._id
                    );


                setActive({

                    user:
                        response?.data?.user ||
                        thread.user,

                    messages:
                        response?.data?.messages ||
                        [],

                });


                // Remove unread count locally
                setThreads(
                    previous =>
                        previous.map(item =>
                            item.user?._id ===
                            thread.user?._id
                                ? {
                                    ...item,
                                    unreadCount: 0,
                                }
                                : item
                        )
                );


            } catch (error) {

                console.error(
                    "Failed to open conversation:",
                    error
                );

            }

        };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="page-anim">

                <div className="feed-header dm-header">

                    <div className="feed-header-inner">

                        <div className="rp-search header-search dm-search">

                            <span className="rp-search-icon">
                                <SearchIcon />
                            </span>

                            <input
                                placeholder="Search messages"
                                value={search}
                                onChange={e =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                </div>


                <div
                    style={{
                        padding: 30,
                        textAlign: "center",
                        color: "var(--ink3)",
                    }}
                >
                    Loading messages...
                </div>

            </div>

        );

    }


    // =========================================
    // ACTIVE CHAT
    // =========================================

    if (active) {

        return (

            <ChatView

                currentUser={currentUser}
                user={active.user}

                initialMessages={
                    active.messages
                }

                onBack={() => {

                    setActive(null);

                }}

            />

        );

    }


    // =========================================
    // DM LIST
    // =========================================

    return (

        <div className="page-anim">

            <div className="feed-header dm-header">

                <div className="feed-header-inner">

                    <div className="rp-search header-search dm-search">

                        <span className="rp-search-icon">
                            <SearchIcon />
                        </span>

                        <input
                            placeholder="Search messages"
                            value={search}
                            onChange={e =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

            </div>


            {/* =================================
                CONVERSATIONS
            ================================= */}

            {shownThreads.length === 0 ? (

                <div className="empty-state">

                    <div className="empty-ico">
                        💬
                    </div>

                    <div className="empty-title">
                        No conversations yet
                    </div>

                    <div className="empty-sub">
                        Start a conversation with someone
                        you follow.
                    </div>

                </div>

            ) : (

                shownThreads.map(
                    thread => {

                        const person =
                            thread.user;

                        const last =
                            thread.lastMessage;


                        return (

                            <div
                                key={
                                    person._id
                                }
                                className="dm-thread"
                                onClick={() =>
                                    openChat(
                                        thread
                                    )
                                }
                            >

                                <Avatar
                                    name={
                                        person.fullname
                                    }
                                    src={
                                        person.avatar
                                    }
                                    size="md"
                                />


                                <div className="dm-info">

                                    <div className="dm-name">

                                        {
                                            person.fullname
                                        }

                                    </div>


                                    <div className="dm-preview">

                                        🎙 Voice message

                                    </div>

                                </div>


                                <div className="dm-meta">

                                    {last?.createdAt && (

                                        <span className="dm-time">

                                            {timeAgo(
                                                last.createdAt
                                            )}

                                        </span>

                                    )}


                                    {thread.unreadCount >
                                        0 && (

                                        <span className="dm-unread-badge">

                                            {
                                                thread.unreadCount
                                            }

                                        </span>

                                    )}

                                </div>

                            </div>

                        );

                    }
                )

            )}

        </div>

    );

}


// =====================================================
// CHAT VIEW
// =====================================================

function ChatView({
    currentUser,
    user,
    initialMessages,
    onBack,
}) {

    const [messages, setMessages] =
        useState(initialMessages);


    const [recording, setRecording] =
        useState(false);


    const [mediaRecorder, setMediaRecorder] =
        useState(null);


    const [recordingSeconds, setRecordingSeconds] =
        useState(0);


    const [sending, setSending] =
        useState(false);


    const [playingId, setPlayingId] =
        useState(null);


    // =========================================
    // RECORDING TIMER
    // =========================================

    useEffect(() => {

        if (!recording) {

            setRecordingSeconds(0);

            return;

        }


        const interval =
            setInterval(() => {

                setRecordingSeconds(
                    seconds => seconds + 1
                );

            }, 1000);


        return () =>
            clearInterval(interval);

    }, [recording]);


    // =========================================
    // START RECORDING
    // =========================================

    const startRecording =
        async () => {

            try {

                const stream =
                    await navigator.mediaDevices
                        .getUserMedia({
                            audio: true,
                        });


                const recorder =
                    new MediaRecorder(
                        stream
                    );


                const chunks = [];


                recorder.ondataavailable =
                    event => {

                        if (
                            event.data.size > 0
                        ) {

                            chunks.push(
                                event.data
                            );

                        }

                    };


                recorder.onstop =
                    async () => {

                        stream
                            .getTracks()
                            .forEach(
                                track =>
                                    track.stop()
                            );


                        const blob =
                            new Blob(
                                chunks,
                                {
                                    type:
                                        recorder
                                            .mimeType ||
                                        "audio/webm",
                                }
                            );


                        const file =
                            new File(
                                [blob],
                                `voice-${Date.now()}.webm`,
                                {
                                    type:
                                        blob.type,
                                }
                            );


                        await sendMessage(
                            file
                        );

                    };


                recorder.start();

                setMediaRecorder(
                    recorder
                );

                setRecording(true);

            } catch (error) {

                console.error(
                    "Microphone error:",
                    error
                );

                alert(
                    "Microphone permission is required."
                );

            }

        };


    // =========================================
    // STOP RECORDING
    // =========================================

    const stopRecording =
        () => {

            if (
                mediaRecorder &&
                mediaRecorder.state !==
                    "inactive"
            ) {

                mediaRecorder.stop();

            }

            setRecording(false);

            setMediaRecorder(null);

        };


    // =========================================
    // SEND MESSAGE
    // =========================================

    const sendMessage =
        async (file) => {

            try {

                setSending(true);


                const response =
                    await sendVoiceMessage(
                        user._id,
                        file
                    );


                const newMessage =
                    response?.data;


                if (newMessage) {

                    setMessages(
                        previous => [
                            ...previous,
                            newMessage,
                        ]
                    );

                }

            } catch (error) {

                console.error(
                    "Send voice message error:",
                    error
                );

                alert(
                    error.message ||
                    "Failed to send voice message"
                );

            } finally {

                setSending(false);

            }

        };


    // =========================================
    // FORMAT DURATION
    // =========================================

    const formatDuration =
        seconds => {

            const mins =
                Math.floor(
                    seconds / 60
                );

            const secs =
                seconds % 60;

            return `${mins}:${secs
                .toString()
                .padStart(2, "0")}`;

        };


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="chat-view">


            {/* TOP BAR */}

            <div className="feed-header">

                <div className="chat-topbar">

                    <button
                        className="back-btn"
                        onClick={onBack}
                    >
                        Back
                    </button>


                    <Avatar
                        name={
                            user.fullname
                        }
                        src={
                            user.avatar
                        }
                        size="sm"
                    />


                    <div className="chat-topbar-info">

                        <div className="chat-topbar-name">

                            {
                                user.fullname
                            }

                        </div>


                        <div className="chat-topbar-sub">

                            @
                            {
                                user.username
                            }

                        </div>

                    </div>

                </div>

            </div>


            {/* MESSAGES */}

            <div className="chat-messages">

                {messages.length === 0 ? (

                    <div
                        style={{
                            textAlign:
                                "center",
                            padding: 30,
                            color:
                                "var(--ink3)",
                        }}
                    >
                        No messages yet.
                        <br />
                        Send the first voice.
                    </div>

                ) : (

                    messages.map(
                        message => {

                            const senderId =
                                message.sender?._id ||
                                message.sender;


                            const mine =
                                String(senderId) ===
                                String(currentUser?._id);


                            return (

                                <VoiceMessage
                                    key={
                                        message._id
                                    }
                                    message={
                                        message
                                    }
                                    mine={
                                        mine
                                    }
                                    playingId={
                                        playingId
                                    }
                                    setPlayingId={
                                        setPlayingId
                                    }
                                />

                            );

                        }
                    )

                )}

            </div>


            {/* INPUT */}

            <div className="chat-input-bar">

                {recording ? (

                    <div
                        style={{
                            flex: 1,
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap: 10,
                        }}
                    >

                        <LiveBars
                            count={10}
                        />

                        <span
                            style={{
                                fontSize: 13,
                                color:
                                    "var(--crimson)",
                                fontWeight: 600,
                            }}
                        >
                            Recording{" "}
                            {
                                formatDuration(
                                    recordingSeconds
                                )
                            }
                        </span>

                    </div>

                ) : (

                    <span
                        style={{
                            flex: 1,
                            fontSize: 14,
                            color:
                                "var(--ink4)",
                        }}
                    >
                        Tap mic to record
                        voice message
                    </span>

                )}


                <button
                    className={`rec-btn${
                        recording
                            ? " recording"
                            : ""
                    }`}
                    style={{
                        width: 48,
                        height: 48,
                        fontSize: 18,
                    }}
                    disabled={sending}
                    onClick={
                        recording
                            ? stopRecording
                            : startRecording
                    }
                >

                    {recording
                        ? "Stop"
                        : "Mic"}

                </button>

            </div>

        </div>

    );

}


// =====================================================
// VOICE MESSAGE
// =====================================================

function VoiceMessage({
    message,
    mine,
    playingId,
    setPlayingId,
}) {

    const [audio] =
        useState(
            () =>
                new Audio(
                    message.voiceFile
                )
        );


    const [duration, setDuration] =
        useState(
            message.duration || 0
        );


    const [currentTime, setCurrentTime] =
        useState(0);


    useEffect(() => {

        const loaded =
            () => {

                if (
                    Number.isFinite(
                        audio.duration
                    )
                ) {

                    setDuration(
                        audio.duration
                    );

                }

            };


        const update =
            () => {

                setCurrentTime(
                    audio.currentTime
                );

            };


        const ended =
            () => {

                setPlayingId(null);

                setCurrentTime(0);

            };


        audio.addEventListener(
            "loadedmetadata",
            loaded
        );

        audio.addEventListener(
            "timeupdate",
            update
        );

        audio.addEventListener(
            "ended",
            ended
        );


        return () => {

            audio.pause();

            audio.removeEventListener(
                "loadedmetadata",
                loaded
            );

            audio.removeEventListener(
                "timeupdate",
                update
            );

            audio.removeEventListener(
                "ended",
                ended
            );

        };

    }, [audio, setPlayingId]);


    useEffect(() => {

        if (
            playingId &&
            playingId !== message._id
        ) {

            audio.pause();

        }

    }, [
        playingId,
        message._id,
        audio,
    ]);


    const togglePlay =
        async () => {

            try {

                if (
                    audio.paused
                ) {

                    await audio.play();

                    setPlayingId(
                        message._id
                    );

                } else {

                    audio.pause();

                    setPlayingId(
                        null
                    );

                }

            } catch (error) {

                console.error(
                    "Audio playback error:",
                    error
                );

            }

        };


    const formatTime =
        value => {

            if (
                !Number.isFinite(
                    value
                )
            ) {
                return "0:00";
            }


            const mins =
                Math.floor(
                    value / 60
                );

            const secs =
                Math.floor(
                    value % 60
                );


            return `${mins}:${secs
                .toString()
                .padStart(2, "0")}`;

        };


    return (

        <div
            className={`msg-row${
                mine
                    ? " mine"
                    : ""
            }`}
        >

            {!mine && (

                <Avatar
                    name={
                        message.sender
                            ?.fullname ||
                        "User"
                    }
                    src={
                        message.sender
                            ?.avatar
                    }
                    size="xs"
                />

            )}


            <div
                className="msg-bubble"
                style={{
                    cursor:
                        "pointer",
                }}
                onClick={
                    togglePlay
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

                    <span
                        style={{
                            fontSize: 16,
                        }}
                    >
                        {playingId ===
                        message._id
                            ? "⏸"
                            : "▶"}
                    </span>


                    <Waveform
                        playing={
                            playingId ===
                            message._id
                        }
                        bars={14}
                    />

                </div>


                <span
                    style={{
                        fontSize: 12,
                        opacity: 0.75,
                    }}
                >
                    {formatTime(
                        currentTime
                    )}
                    {" / "}
                    {formatTime(
                        duration
                    )}
                </span>

            </div>

        </div>

    );

}