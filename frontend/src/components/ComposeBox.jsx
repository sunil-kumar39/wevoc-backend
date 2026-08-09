import { useRef, useState } from "react";

import Avatar from "./Avatar";
import { Waveform, LiveBars } from "./Waveform";

import {
    MicIcon,
    PauseIcon,
    PlayIcon,
    SmileIcon,
} from "./Icons";

import { publishVoice } from "../api/voice.api";

import { useApp } from "../context/AppContext";


export default function ComposeBox() {

    const { user } = useApp();


    // =========================
    // STATES
    // =========================

    const [caption, setCaption] =
        useState("");

    const [title, setTitle] =
        useState("");


    const [anon, setAnon] =
        useState(false);


    const [showRec, setShowRec] =
        useState(false);


    const [recording, setRecording] =
        useState(false);


    const [recorded, setRecorded] =
        useState(false);


    const [audioBlob, setAudioBlob] =
        useState(null);


    const [audioUrl, setAudioUrl] =
        useState(null);


    const [duration, setDuration] =
        useState(0);


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    // =========================
    // MEDIA RECORDER
    // =========================

    const mediaRecorderRef =
        useRef(null);


    const audioChunksRef =
        useRef([]);


    const recordingStartRef =
        useRef(null);


    // =========================
    // START RECORDING
    // =========================

    const startRecording = async () => {

        try {

            setError("");

            setSuccess("");


            const stream =
                await navigator.mediaDevices
                    .getUserMedia({
                        audio: true,
                    });


            const mediaRecorder =
                new MediaRecorder(
                    stream
                );


            mediaRecorderRef.current =
                mediaRecorder;


            audioChunksRef.current = [];


            recordingStartRef.current =
                Date.now();


            mediaRecorder.ondataavailable =
                (event) => {

                    if (
                        event.data.size > 0
                    ) {

                        audioChunksRef.current
                            .push(event.data);

                    }

                };


            mediaRecorder.onstop = () => {

                const blob =
                    new Blob(
                        audioChunksRef.current,
                        {
                            type:
                                mediaRecorder
                                    .mimeType ||
                                "audio/webm",
                        }
                    );


                const url =
                    URL.createObjectURL(
                        blob
                    );


                const elapsed =
                    (
                        Date.now() -
                        recordingStartRef.current
                    ) / 1000;


                setAudioBlob(blob);

                setAudioUrl(url);

                setDuration(
                    Math.max(
                        1,
                        elapsed
                    )
                );

                setRecorded(true);

                setRecording(false);


                // Stop microphone

                stream
                    .getTracks()
                    .forEach(
                        (track) =>
                            track.stop()
                    );

            };


            mediaRecorder.start();

            setRecording(true);

            setRecorded(false);

        } catch (error) {

            console.error(
                "Microphone error:",
                error
            );


            setError(
                "Microphone permission is required"
            );

        }

    };


    // =========================
    // STOP RECORDING
    // =========================

    const stopRecording = () => {

        const recorder =
            mediaRecorderRef.current;


        if (
            recorder &&
            recorder.state !== "inactive"
        ) {

            recorder.stop();

        }

    };


    // =========================
    // RECORD BUTTON
    // =========================

    const handleRecord = () => {

        if (recording) {

            stopRecording();

        } else {

            startRecording();

        }

    };


    // =========================
    // RE-RECORD
    // =========================

    const handleReRecord = () => {

        if (audioUrl) {

            URL.revokeObjectURL(
                audioUrl
            );

        }


        setAudioBlob(null);

        setAudioUrl(null);

        setRecorded(false);

        setDuration(0);

        startRecording();

    };


    // =========================
    // FORMAT DURATION
    // =========================

    const formatDuration = (
        seconds
    ) => {

        const mins =
            Math.floor(
                seconds / 60
            );


        const secs =
            Math.floor(
                seconds % 60
            )
                .toString()
                .padStart(2, "0");


        return `${mins}:${secs}`;

    };


    // =========================
    // PUBLISH
    // =========================

    const handlePublish = async () => {

        setError("");

        setSuccess("");


        if (!title.trim()) {

            setError(
                "Title is required"
            );

            return;

        }


        if (!caption.trim()) {

            setError(
                "Description is required"
            );

            return;

        }


        if (!audioBlob) {

            setError(
                "Please record a voice first"
            );

            return;

        }


        try {

            setLoading(true);


            /*
             * Convert Blob → File
             */

            const voiceFile =
                new File(
                    [audioBlob],
                    "voice.webm",
                    {
                        type:
                            audioBlob.type ||
                            "audio/webm",
                    }
                );


            /*
             * Temporary thumbnail.
             *
             * Backend currently requires
             * thumbnail, so we create one
             * from a small canvas.
             */

            const thumbnailFile =
                await createThumbnail();


            await publishVoice({

                title: title.trim(),

                description:
                    caption.trim(),

                voiceFile,

                thumbnail:
                    thumbnailFile,

            });


            setSuccess(
                "Voice published successfully!"
            );


            // Clear form

            setTitle("");

            setCaption("");

            setAudioBlob(null);

            setAudioUrl(null);

            setRecorded(false);

            setDuration(0);


        } catch (error) {

            console.error(
                "Publish failed:",
                error
            );


            setError(
                error.message ||
                "Failed to publish voice"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // CREATE THUMBNAIL
    // =========================

    const createThumbnail = () => {

        return new Promise(
            (resolve, reject) => {

                const canvas =
                    document.createElement(
                        "canvas"
                    );


                canvas.width = 1200;

                canvas.height = 675;


                const ctx =
                    canvas.getContext(
                        "2d"
                    );


                if (!ctx) {

                    reject(
                        new Error(
                            "Canvas not supported"
                        )
                    );

                    return;

                }


                /*
                 * Simple thumbnail.
                 *
                 * Backend only needs an image.
                 */

                ctx.fillStyle =
                    "#111827";

                ctx.fillRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                ctx.fillStyle =
                    "#ffffff";

                ctx.font =
                    "bold 64px Arial";


                ctx.textAlign =
                    "center";

                ctx.textBaseline =
                    "middle";


                ctx.fillText(
                    title.trim() ||
                    "WeVoc Voice",
                    canvas.width / 2,
                    canvas.height / 2
                );


                canvas.toBlob(
                    (blob) => {

                        if (!blob) {

                            reject(
                                new Error(
                                    "Failed to create thumbnail"
                                )
                            );

                            return;

                        }


                        const file =
                            new File(
                                [blob],
                                "thumbnail.png",
                                {
                                    type:
                                        "image/png",
                                }
                            );


                        resolve(file);

                    },
                    "image/png"
                );

            }
        );

    };


    // =========================
    // CAN POST?
    // =========================

    const canPost =
        title.trim() &&
        caption.trim() &&
        recorded &&
        audioBlob &&
        !loading;


    return (

        <div className="compose-box">


            {/* =====================
                HEADER
            ===================== */}

            <div className="compose-header">

                <strong>
                    Create campus voice
                </strong>

                <span>
                    Capture your story with
                    text and a voice.
                </span>

            </div>


            {/* =====================
                ERROR
            ===================== */}

            {error && (

                <div className="auth-error">

                    {error}

                </div>

            )}


            {/* =====================
                SUCCESS
            ===================== */}

            {success && (

                <div className="auth-success">

                    {success}

                </div>

            )}


            <div className="compose-row">


                {/* =================
                    AVATAR
                ================= */}

                <Avatar
                    name={
                        anon
                            ? "?"
                            : user?.fullname ||
                              "You"
                    }
                    size="md"
                />


                <div className="compose-right">


                    {/* =================
                        TITLE
                    ================= */}

                    <input
                        className="compose-title-input"
                        type="text"
                        placeholder="Voice title..."
                        value={title}
                        onChange={(e) =>
                            setTitle(
                                e.target.value
                            )
                        }
                    />


                    {/* =================
                        DESCRIPTION
                    ================= */}

                    <textarea
                        className="compose-textarea"
                        placeholder="What's happening on campus?"
                        value={caption}
                        onChange={(e) =>
                            setCaption(
                                e.target.value
                            )
                        }
                        rows={
                            caption.length > 80
                                ? 3
                                : 2
                        }
                    />


                    {/* =================
                        RECORDER
                    ================= */}

                    {showRec && (

                        <div className="record-strip">


                            {recording && (
                                <LiveBars />
                            )}


                            {recorded &&
                                !recording &&
                                audioUrl && (

                                    <div
                                        className="audio-player"
                                        style={{
                                            width:
                                                "100%",
                                            marginBottom:
                                                0,
                                        }}
                                    >

                                        <button
                                            className="play-btn"
                                            onClick={() => {
                                                const audio =
                                                    new Audio(
                                                        audioUrl
                                                    );

                                                audio.play();
                                            }}
                                        >

                                            <PlayIcon />

                                        </button>


                                        <Waveform
                                            bars={22}
                                        />


                                        <span className="audio-dur">

                                            {formatDuration(
                                                duration
                                            )}

                                        </span>

                                    </div>

                                )}


                            <button
                                className={`rec-btn${
                                    recording
                                        ? " recording"
                                        : ""
                                }`}
                                onClick={
                                    recorded &&
                                    !recording
                                        ? handleReRecord
                                        : handleRecord
                                }
                            >

                                {recording
                                    ? (
                                        <PauseIcon />
                                    )
                                    : (
                                        <MicIcon />
                                    )
                                }

                            </button>


                            <span className="rec-hint">

                                {recording
                                    ? "Recording… tap to stop"
                                    : recorded
                                        ? "Tap to re-record"
                                        : "Tap to record"
                                }

                            </span>

                        </div>

                    )}


                    {/* =================
                        FOOTER
                    ================= */}

                    <div className="compose-footer">


                        <button
                            className="compose-icon-btn"
                            title="Record voice"
                            onClick={() =>
                                setShowRec(
                                    (value) =>
                                        !value
                                )
                            }
                        >

                            <MicIcon />

                        </button>


                        <button
                            className="compose-icon-btn"
                            title="Emoji"
                        >

                            <SmileIcon />

                        </button>


                        <div
                            className="anon-row"
                            style={{
                                marginLeft: 8,
                            }}
                        >

                            <button
                                className={`toggle-track${
                                    anon
                                        ? " on"
                                        : ""
                                }`}
                                onClick={() =>
                                    setAnon(
                                        (value) =>
                                            !value
                                    )
                                }
                                aria-label="Toggle anonymous"
                            />


                            <span className="toggle-text">

                                Anonymous

                            </span>

                        </div>


                        <button
                            className="compose-post-btn"
                            disabled={!canPost}
                            onClick={
                                handlePublish
                            }
                        >

                            {loading
                                ? "Publishing..."
                                : "Post"
                            }

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}