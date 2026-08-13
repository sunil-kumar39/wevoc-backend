import {
    useEffect,
    useRef,
    useState,
} from "react";

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
    markMessagesAsRead,
} from "../api/message.api";

import {
    socket,
    connectSocket,
    disconnectSocket,
} from "../socket";

import { timeAgo } from "../utils/helpers";

import { useApp } from "../context/AppContext";


// =====================================================
// DMS PAGE
// =====================================================

export default function DmsPage() {

    const {
        user: currentUser,
        pageData,
    } = useApp();


    const [threads, setThreads] =
        useState([]);

    const [active, setActive] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);


    const activeRef =
        useRef(null);


    // =====================================================
    // KEEP ACTIVE CHAT REF UPDATED
    // =====================================================

    useEffect(() => {

        activeRef.current =
            active;

    }, [active]);


    // =====================================================
    // LOAD CONVERSATIONS
    // =====================================================

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


    // =====================================================
    // OPEN DIRECT CHAT FROM PROFILE
    // =====================================================

    useEffect(() => {

        /*
         * IMPORTANT
         *
         * UserProfilePage now sends:
         *
         * navigate("dms", user)
         *
         * Therefore pageData itself is the user.
         */

        const userId =
            pageData?._id;


        if (
            !userId ||
            !currentUser?._id
        ) {
            return;
        }


        // Don't open own chat

        if (
            String(userId) ===
            String(currentUser._id)
        ) {
            return;
        }


        const openDirectChat =
            async () => {

                try {

                    const response =
                        await getMessagesWithUser(
                            userId
                        );


                    const chatUser =
                        response?.data?.user ||
                        pageData ||
                        null;


                    const messages =
                        response?.data?.messages ||
                        [];


                    if (!chatUser?._id) {

                        console.error(
                            "Chat user not found"
                        );

                        return;

                    }


                    // Open chat

                    setActive({

                        user:
                            chatUser,

                        messages:
                            messages,

                    });


                    // Mark messages read

                    try {

                        await markMessagesAsRead(
                            userId
                        );

                    } catch (readError) {

                        console.error(
                            "Mark read error:",
                            readError
                        );

                    }


                    // Clear unread count
                    // if conversation exists

                    setThreads(
                        previous =>
                            previous.map(
                                thread =>

                                    String(
                                        thread.user?._id
                                    ) ===
                                    String(userId)

                                        ? {
                                            ...thread,
                                            unreadCount: 0,
                                        }

                                        : thread
                            )
                    );

                } catch (error) {

                    console.error(
                        "Failed to open direct chat:",
                        error
                    );

                }

            };


        openDirectChat();

    }, [
        pageData?._id,
        currentUser?._id,
    ]);


    // =====================================================
    // SOCKET CONNECTION
    // =====================================================

    useEffect(() => {

        if (!currentUser?._id) {
            return;
        }


        connectSocket();


        // =================================================
        // NEW MESSAGE
        // =================================================

        const handleNewMessage =
            (message) => {

                if (!message?._id) {
                    return;
                }


                const senderId =
                    message.sender?._id ||
                    message.sender;


                const receiverId =
                    message.receiver?._id ||
                    message.receiver;


                const currentUserId =
                    String(
                        currentUser._id
                    );


                const senderIdString =
                    senderId?.toString();


                const receiverIdString =
                    receiverId?.toString();


                if (
                    !senderIdString ||
                    !receiverIdString
                ) {
                    return;
                }


                // Current user must be involved

                if (
                    senderIdString !==
                        currentUserId &&
                    receiverIdString !==
                        currentUserId
                ) {
                    return;
                }


                // We only process
                // incoming socket messages

                if (
                    receiverIdString !==
                    currentUserId
                ) {
                    return;
                }


                const currentActive =
                    activeRef.current;


                const activeUserId =
                    currentActive
                        ?.user?._id
                        ?.toString();


                // =================================================
                // ACTIVE CHAT
                // =================================================

                if (
                    activeUserId &&
                    senderIdString ===
                        activeUserId
                ) {

                    setActive(
                        previous => {

                            if (!previous) {
                                return previous;
                            }


                            const alreadyExists =
                                previous.messages.some(
                                    item =>
                                        String(
                                            item._id
                                        ) ===
                                        String(
                                            message._id
                                        )
                                );


                            if (
                                alreadyExists
                            ) {
                                return previous;
                            }


                            return {

                                ...previous,

                                messages: [
                                    ...previous.messages,
                                    message,
                                ],

                            };

                        }
                    );


                    markMessagesAsRead(
                        senderIdString
                    ).catch(
                        error => {

                            console.error(
                                "Failed to mark message as read:",
                                error
                            );

                        }
                    );


                    setThreads(
                        previous =>
                            previous.map(
                                item =>

                                    String(
                                        item.user?._id
                                    ) ===
                                    senderIdString

                                        ? {
                                            ...item,
                                            unreadCount: 0,
                                        }

                                        : item
                            )
                    );


                    return;

                }


                // =================================================
                // MESSAGE FROM OTHER USER
                // =================================================

                const incomingUser =
                    message.sender;


                if (
                    !incomingUser?._id
                ) {
                    return;
                }


                const incomingUserId =
                    incomingUser._id.toString();


                setThreads(
                    previous => {

                        const existingIndex =
                            previous.findIndex(
                                item =>
                                    String(
                                        item.user?._id
                                    ) ===
                                    incomingUserId
                            );


                        // =================================================
                        // NEW CONVERSATION
                        // =================================================

                        if (
                            existingIndex === -1
                        ) {

                            return [

                                {
                                    user:
                                        incomingUser,

                                    lastMessage: {

                                        _id:
                                            message._id,

                                        voiceFile:
                                            message.voiceFile,

                                        duration:
                                            message.duration,

                                        createdAt:
                                            message.createdAt,

                                        sender:
                                            senderId,

                                        isRead:
                                            false,

                                    },

                                    unreadCount:
                                        1,

                                },

                                ...previous,

                            ];

                        }


                        // =================================================
                        // UPDATE EXISTING
                        // =================================================

                        const updated =
                            [
                                ...previous,
                            ];


                        const oldThread =
                            updated[
                                existingIndex
                            ];


                        const updatedThread = {

                            ...oldThread,

                            user:
                                incomingUser,

                            lastMessage: {

                                _id:
                                    message._id,

                                voiceFile:
                                    message.voiceFile,

                                duration:
                                    message.duration,

                                createdAt:
                                    message.createdAt,

                                sender:
                                    senderId,

                                isRead:
                                    false,

                            },

                            unreadCount:
                                (
                                    oldThread.unreadCount ||
                                    0
                                ) + 1,

                        };


                        updated.splice(
                            existingIndex,
                            1
                        );


                        return [
                            updatedThread,
                            ...updated,
                        ];

                    }
                );

            };


        // =================================================
        // MESSAGES READ
        // =================================================

        const handleMessagesRead =
            ({ userId }) => {

                if (!userId) {
                    return;
                }


                setThreads(
                    previous =>
                        previous.map(
                            item =>

                                String(
                                    item.user?._id
                                ) ===
                                String(userId)

                                    ? {
                                        ...item,
                                        unreadCount: 0,
                                    }

                                    : item
                        )
                );

            };


        socket.on(
            "message:new",
            handleNewMessage
        );


        socket.on(
            "messages:read",
            handleMessagesRead
        );


        return () => {

            socket.off(
                "message:new",
                handleNewMessage
            );


            socket.off(
                "messages:read",
                handleMessagesRead
            );


            disconnectSocket();

        };

    }, [
        currentUser?._id,
    ]);


    // =====================================================
    // SEARCH
    // =====================================================

    const shownThreads =
        threads.filter(
            thread => {

                const name =
                    thread.user?.fullname
                        ?.toLowerCase() || "";


                const username =
                    thread.user?.username
                        ?.toLowerCase() || "";


                const query =
                    search
                        .toLowerCase()
                        .trim();


                return (
                    name.includes(query) ||
                    username.includes(query)
                );

            }
        );


    // =====================================================
    // OPEN EXISTING CHAT
    // =====================================================

    const openChat =
        async (thread) => {

            if (
                !thread?.user?._id
            ) {
                return;
            }


            try {

                const response =
                    await getMessagesWithUser(
                        thread.user._id
                    );


                const user =
                    response?.data?.user ||
                    thread.user;


                const messages =
                    response?.data?.messages ||
                    [];


                setActive({

                    user,

                    messages,

                });


                setThreads(
                    previous =>
                        previous.map(
                            item =>

                                String(
                                    item.user?._id
                                ) ===
                                String(
                                    thread.user?._id
                                )

                                    ? {
                                        ...item,
                                        unreadCount: 0,
                                    }

                                    : item
                        )
                );


                try {

                    await markMessagesAsRead(
                        thread.user._id
                    );

                } catch (error) {

                    console.error(
                        "Failed to mark messages as read:",
                        error
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to open conversation:",
                    error
                );

            }

        };


    // =====================================================
    // LOADING
    // =====================================================

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
                                onChange={
                                    e =>
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


    // =====================================================
    // ACTIVE CHAT
    // =====================================================

    if (active) {

        return (

            <ChatView

                currentUser={
                    currentUser
                }

                user={
                    active.user
                }

                initialMessages={
                    active.messages
                }

                onBack={() => {
                    setActive(null);
                }}

            />

        );

    }


    // =====================================================
    // DM LIST
    // =====================================================

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
                            onChange={
                                e =>
                                    setSearch(
                                        e.target.value
                                    )
                            }
                        />

                    </div>

                </div>

            </div>


            {shownThreads.length === 0 ? (

                <div className="empty-state">

                    <div className="empty-ico">
                        💬
                    </div>

                    <div className="empty-title">
                        No conversations yet
                    </div>

                    <div className="empty-sub">

                        Open someone's profile and
                        press <b>💬 Message</b> to
                        start a conversation.

                    </div>

                </div>

            ) : (

                shownThreads.map(
                    thread => {

                        const person =
                            thread.user;


                        const last =
                            thread.lastMessage;


                        if (!person?._id) {
                            return null;
                        }


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

                                    {
                                        last?.createdAt && (

                                            <span className="dm-time">

                                                {
                                                    timeAgo(
                                                        last.createdAt
                                                    )
                                                }

                                            </span>

                                        )
                                    }


                                    {
                                        thread.unreadCount >
                                            0 && (

                                            <span className="dm-unread-badge">

                                                {
                                                    thread.unreadCount
                                                }

                                            </span>

                                        )
                                    }

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
        useState(
            initialMessages || []
        );

    const [recording, setRecording] =
        useState(false);

    const [sending, setSending] =
        useState(false);

    const [audioBlob, setAudioBlob] =
        useState(null);

    const [audioUrl, setAudioUrl] =
        useState("");

    const mediaRecorderRef =
        useRef(null);

    const chunksRef =
        useRef([]);


    // =====================================================
    // SYNC INITIAL MESSAGES
    // =====================================================

    useEffect(() => {

        setMessages(
            initialMessages || []
        );

    }, [initialMessages]);


    // =====================================================
    // RECORD VOICE
    // =====================================================

    const startRecording = async () => {

        try {

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });


            const recorder =
                new MediaRecorder(stream);


            mediaRecorderRef.current =
                recorder;


            chunksRef.current =
                [];


            recorder.ondataavailable =
                (event) => {

                    if (
                        event.data &&
                        event.data.size > 0
                    ) {

                        chunksRef.current.push(
                            event.data
                        );

                    }

                };


            recorder.onstop =
                () => {

                    const blob =
                        new Blob(
                            chunksRef.current,
                            {
                                type:
                                    "audio/webm",
                            }
                        );


                    setAudioBlob(
                        blob
                    );


                    setAudioUrl(
                        URL.createObjectURL(
                            blob
                        )
                    );


                    stream
                        .getTracks()
                        .forEach(
                            track =>
                                track.stop()
                        );

                };


            recorder.start();

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


    // =====================================================
    // STOP RECORDING
    // =====================================================

    const stopRecording = () => {

        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !==
                "inactive"
        ) {

            mediaRecorderRef.current.stop();

        }

        setRecording(false);

    };


    // =====================================================
    // CANCEL RECORDING
    // =====================================================

    const cancelRecording = () => {

        setRecording(false);

        setAudioBlob(null);

        if (audioUrl) {

            URL.revokeObjectURL(
                audioUrl
            );

        }

        setAudioUrl("");

    };


    // =====================================================
    // SEND VOICE
    // =====================================================

    const handleSend = async () => {

        if (
            !audioBlob ||
            !user?._id ||
            sending
        ) {
            return;
        }


        try {

            setSending(true);


            const file =
                new File(
                    [audioBlob],
                    `voice-${Date.now()}.webm`,
                    {
                        type:
                            audioBlob.type ||
                            "audio/webm",
                    }
                );


            const response =
                await sendVoiceMessage(
                    user._id,
                    file
                );


            const newMessage =
                response?.data;


            if (newMessage?._id) {

                setMessages(
                    previous => [
                        ...previous,
                        newMessage,
                    ]
                );

            }


            cancelRecording();

        } catch (error) {

            console.error(
                "Send voice message error:",
                error
            );

            alert(
                error?.message ||
                "Failed to send voice message"
            );

        } finally {

            setSending(false);

        }

    };


    // =====================================================
    // FORMAT DURATION
    // =====================================================

    const formatDuration =
        (seconds) => {

            const total =
                Math.max(
                    0,
                    Math.round(
                        Number(seconds) || 0
                    )
                );


            const minutes =
                Math.floor(
                    total / 60
                );


            const secs =
                total % 60;


            return `${minutes}:${String(
                secs
            ).padStart(2, "0")}`;

        };


    // =====================================================
    // CHAT UI
    // =====================================================

    return (

        <div
            className="page-anim"
            style={{
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >

            {/* HEADER */}

            <div className="feed-header dm-header">

                <div
                    className="feed-header-inner"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                >

                    <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={onBack}
                    >
                        ←
                    </button>


                    <Avatar
                        name={
                            user?.fullname
                        }
                        src={
                            user?.avatar
                        }
                        size="md"
                    />


                    <div>

                        <div
                            style={{
                                fontWeight: 700,
                            }}
                        >
                            {
                                user?.fullname
                            }
                        </div>

                        <div
                            style={{
                                fontSize: 12,
                                color:
                                    "var(--ink3)",
                            }}
                        >
                            @
                            {
                                user?.username
                            }
                        </div>

                    </div>

                </div>

            </div>


            {/* MESSAGES */}

            <div
                style={{
                    flex: 1,
                    padding: "20px 16px",
                    overflowY: "auto",
                }}
            >

                {messages.length === 0 ? (

                    <div
                        className="empty-state"
                        style={{
                            minHeight: 300,
                        }}
                    >

                        <div className="empty-ico">
                            🎙
                        </div>

                        <div className="empty-title">
                            Start the conversation
                        </div>

                        <div className="empty-sub">
                            Send a voice message to{" "}
                            {
                                user?.fullname
                            }.
                        </div>

                    </div>

                ) : (

                    messages.map(
                        message => {

                            const senderId =
                                message.sender?._id ||
                                message.sender;


                            const isMine =
                                String(
                                    senderId
                                ) ===
                                String(
                                    currentUser?._id
                                );


                            return (

                                <div
                                    key={
                                        message._id
                                    }
                                    style={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            isMine
                                                ? "flex-end"
                                                : "flex-start",
                                        marginBottom:
                                            12,
                                    }}
                                >

                                    <div
                                        style={{
                                            maxWidth:
                                                "75%",
                                            padding:
                                                12,
                                            borderRadius:
                                                14,
                                            background:
                                                isMine
                                                    ? "var(--accent)"
                                                    : "var(--paper2)",
                                            color:
                                                isMine
                                                    ? "#fff"
                                                    : "var(--ink)",
                                        }}
                                    >

                                        <audio
                                            controls
                                            src={
                                                message.voiceFile
                                            }
                                            style={{
                                                maxWidth:
                                                    "100%",
                                            }}
                                        />

                                        <div
                                            style={{
                                                fontSize:
                                                    11,
                                                marginTop:
                                                    5,
                                                opacity:
                                                    0.7,
                                            }}
                                        >
                                            {
                                                formatDuration(
                                                    message.duration
                                                )
                                            }
                                        </div>

                                    </div>

                                </div>

                            );

                        }
                    )

                )}

            </div>


            {/* RECORDER */}

            <div
                style={{
                    padding: 16,
                    borderTop:
                        "1px solid var(--line)",
                }}
            >

                {audioUrl && (

                    <div
                        style={{
                            marginBottom: 12,
                        }}
                    >

                        <audio
                            controls
                            src={audioUrl}
                            style={{
                                width: "100%",
                            }}
                        />

                    </div>

                )}


                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >

                    {!recording ? (

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={
                                startRecording
                            }
                        >
                            🎙 Record
                        </button>

                    ) : (

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={
                                stopRecording
                            }
                        >
                            ⏹ Stop
                        </button>

                    )}


                    {recording && (

                        <LiveBars />

                    )}


                    {audioBlob && !recording && (

                        <>

                            <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={
                                    cancelRecording
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                disabled={
                                    sending
                                }
                                onClick={
                                    handleSend
                                }
                            >
                                {sending
                                    ? "Sending..."
                                    : "Send 🎙"
                                }
                            </button>

                        </>

                    )}

                </div>

            </div>

        </div>

    );

}