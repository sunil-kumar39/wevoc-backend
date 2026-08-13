import { useRef, useState } from "react";

import { publishVoice } from "../api/voice.api";
import { MicIcon } from "../components/Icons";


export default function ComposeBox({
    communityId = null,
    onPublished,
}) {

    // ========================================
    // STATES
    // ========================================

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [voiceFile, setVoiceFile] =
        useState(null);

    const [thumbnail, setThumbnail] =
        useState(null);

    const [isAnonymous, setIsAnonymous] =
        useState(false);

    const [recording, setRecording] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ========================================
    // REFS
    // ========================================

    const audioInputRef =
        useRef(null);

    const thumbnailInputRef =
        useRef(null);


    // ========================================
    // AUDIO FILE
    // ========================================

    const handleVoiceFile =
        (e) => {

            const file =
                e.target.files?.[0];

            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "audio/"
                )
            ) {

                setError(
                    "Please select a valid audio file."
                );

                return;

            }


            setVoiceFile(file);
            setError("");
            setSuccess("");

        };


    // ========================================
    // THUMBNAIL
    // ========================================

    const handleThumbnail =
        (e) => {

            const file =
                e.target.files?.[0];

            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                setError(
                    "Please select a valid image."
                );

                return;

            }


            setThumbnail(file);
            setError("");
            setSuccess("");

        };


    // ========================================
    // PUBLISH
    // ========================================

    const handlePublish =
        async (e) => {

            e.preventDefault();


            setError("");
            setSuccess("");


            // --------------------------------
            // Validation
            // --------------------------------

            if (!title.trim()) {

                setError(
                    "Please enter a title."
                );

                return;

            }


            if (!description.trim()) {

                setError(
                    "Please enter a description."
                );

                return;

            }


            if (!voiceFile) {

                setError(
                    "Please select a voice file."
                );

                return;

            }


            if (!thumbnail) {

                setError(
                    "Please select a thumbnail."
                );

                return;

            }


            try {

                setLoading(true);


                // --------------------------------
                // Publish
                // --------------------------------

                await publishVoice({

                    title:
                        title.trim(),

                    description:
                        description.trim(),

                    voiceFile,

                    thumbnail,

                    isAnonymous,

                    communityId,

                });


                // --------------------------------
                // Reset
                // --------------------------------

                setTitle("");
                setDescription("");
                setVoiceFile(null);
                setThumbnail(null);
                setIsAnonymous(false);


                if (
                    audioInputRef.current
                ) {

                    audioInputRef.current.value =
                        "";

                }


                if (
                    thumbnailInputRef.current
                ) {

                    thumbnailInputRef.current.value =
                        "";

                }


                setSuccess(
                    communityId
                        ? "Voice posted in community successfully!"
                        : "Voice posted successfully!"
                );


                // --------------------------------
                // Refresh parent
                // --------------------------------

                if (onPublished) {

                    await onPublished();

                }

            } catch (error) {

                console.error(
                    "Publish voice error:",
                    error
                );


                setError(
                    error?.message ||
                    "Failed to publish voice."
                );

            } finally {

                setLoading(false);

            }

        };


    // ========================================
    // RECORDING UI
    // ========================================

    const handleRecording =
        () => {

            setRecording(
                current => !current
            );

        };


    // ========================================
    // RENDER
    // ========================================

    return (

        <form
            className="compose-box"
            onSubmit={handlePublish}
        >

            {/* ==================================
                HEADER
            ================================== */}

            <div
                className="compose-header"
            >

                <div
                    className="compose-title"
                >

                    <MicIcon />

                    {communityId
                        ? "Post in Community"
                        : "Create Voice Post"}

                </div>

            </div>


            {/* ==================================
                TITLE
            ================================== */}

            <input
                type="text"
                className="compose-title-input"
                placeholder="Voice title..."
                value={title}
                maxLength={100}
                onChange={(e) =>
                    setTitle(
                        e.target.value
                    )
                }
            />


            {/* ==================================
                DESCRIPTION
            ================================== */}

            <textarea
                className="compose-textarea"
                placeholder={
                    communityId
                        ? "What do you want to share with your community?"
                        : "What's on your mind?"
                }
                value={description}
                maxLength={500}
                rows={4}
                onChange={(e) =>
                    setDescription(
                        e.target.value
                    )
                }
            />


            {/* ==================================
                FILE INPUTS
            ================================== */}

            <div
                className="compose-file-row"
            >

                {/* AUDIO */}

                <div>

                    <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/*"
                        id="voice-file-input"
                        onChange={
                            handleVoiceFile
                        }
                        hidden
                    />


                    <label
                        htmlFor="voice-file-input"
                        className="btn btn-outline btn-sm"
                    >

                        🎙 Choose Voice

                    </label>


                    {voiceFile && (

                        <span
                            className="compose-file-name"
                        >

                            {voiceFile.name}

                        </span>

                    )}

                </div>


                {/* THUMBNAIL */}

                <div>

                    <input
                        ref={
                            thumbnailInputRef
                        }
                        type="file"
                        accept="image/*"
                        id="thumbnail-file-input"
                        onChange={
                            handleThumbnail
                        }
                        hidden
                    />


                    <label
                        htmlFor="thumbnail-file-input"
                        className="btn btn-outline btn-sm"
                    >

                        🖼 Thumbnail

                    </label>


                    {thumbnail && (

                        <span
                            className="compose-file-name"
                        >

                            {thumbnail.name}

                        </span>

                    )}

                </div>

            </div>


            {/* ==================================
                RECORDING
            ================================== */}

            <div
                className="compose-record-row"
            >

                <button
                    type="button"
                    className={`rec-btn${
                        recording
                            ? " recording"
                            : ""
                    }`}
                    onClick={
                        handleRecording
                    }
                >

                    🎙

                </button>


                <span>

                    {recording
                        ? "Recording..."
                        : "You can also record a voice"}

                </span>

            </div>


            {/* ==================================
                ANONYMOUS
            ================================== */}

            <label
                className="compose-anonymous"
            >

                <input
                    type="checkbox"
                    checked={
                        isAnonymous
                    }
                    onChange={(e) =>
                        setIsAnonymous(
                            e.target.checked
                        )
                    }
                />

                <span>
                    Post anonymously
                </span>

            </label>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <div
                    className="compose-error"
                >

                    {error}

                </div>

            )}


            {/* ==================================
                SUCCESS
            ================================== */}

            {success && (

                <div
                    className="compose-success"
                >

                    {success}

                </div>

            )}


            {/* ==================================
                FOOTER
            ================================== */}

            <div
                className="compose-footer"
            >

                <div
                    style={{
                        fontSize: 12,
                        color:
                            "var(--ink4)",
                    }}
                >

                    {communityId
                        ? "Only this community will see this post."
                        : "Share your voice with WeVoc."}

                </div>


                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >

                    {loading
                        ? "Publishing..."
                        : communityId
                            ? "Post to Community"
                            : "Publish Voice"}

                </button>

            </div>

        </form>

    );

}