import { useEffect, useState } from "react";

import {
    BellIcon,
    CheckIcon,
    HeartIcon,
    ReplyIcon,
    UsersIcon,
} from "../components/Icons";

import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from "../api/notification.api";

import { timeAgo } from "../utils/helpers";


const ICONS = {
    like: HeartIcon,
    comment: ReplyIcon,
    follow: UsersIcon,
};


const getNotificationText = (notification) => {

    const name =
        notification?.sender?.fullname ||
        notification?.sender?.username ||
        "Someone";


    if (notification.type === "like") {

        return (
            <>
                <strong>{name}</strong>{" "}
                liked your voice
            </>
        );

    }


    if (notification.type === "comment") {

        return (
            <>
                <strong>{name}</strong>{" "}
                commented on your voice
            </>
        );

    }


    if (notification.type === "follow") {

        return (
            <>
                <strong>{name}</strong>{" "}
                started following you
            </>
        );

    }


    return (
        <>
            <strong>{name}</strong>{" "}
            sent you a notification
        </>
    );

};


export default function NotificationsPage() {

    const [notifs, setNotifs] =
        useState([]);

    const [tab, setTab] =
        useState("all");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================
    // LOAD NOTIFICATIONS
    // =========================

    const loadNotifications = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getNotifications();

            setNotifs(
                response?.data || []
            );

        } catch (error) {

            console.error(
                "Notification error:",
                error
            );

            setError(
                error.message ||
                "Failed to load notifications"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadNotifications();

    }, []);


    // =========================
    // MARK SINGLE AS READ
    // =========================

    const handleMarkAsRead = async (
        notification
    ) => {

        if (notification.isRead) {
            return;
        }


        try {

            await markAsRead(
                notification._id
            );


            setNotifs(
                (items) =>
                    items.map((item) =>
                        item._id ===
                        notification._id
                            ? {
                                ...item,
                                isRead: true,
                            }
                            : item
                    )
            );

        } catch (error) {

            console.error(
                "Mark as read error:",
                error
            );

        }

    };


    // =========================
    // MARK ALL AS READ
    // =========================

    const handleMarkAll = async () => {

        if (unreadCount === 0) {
            return;
        }


        try {

            await markAllAsRead();


            setNotifs(
                (items) =>
                    items.map(
                        (item) => ({
                            ...item,
                            isRead: true,
                        })
                    )
            );

        } catch (error) {

            console.error(
                "Mark all read error:",
                error
            );

        }

    };


    // =========================
    // DELETE
    // =========================

    const handleDelete = async (
        e,
        notificationId
    ) => {

        e.stopPropagation();


        try {

            await deleteNotification(
                notificationId
            );


            setNotifs(
                (items) =>
                    items.filter(
                        (item) =>
                            item._id !==
                            notificationId
                    )
            );

        } catch (error) {

            console.error(
                "Delete notification error:",
                error
            );

        }

    };


    const unreadCount =
        notifs.filter(
            (notification) =>
                !notification.isRead
        ).length;


    const shown =
        tab === "unread"
            ? notifs.filter(
                (notification) =>
                    !notification.isRead
            )
            : notifs;


    return (

        <div>


            {/* =========================
                HEADER
            ========================= */}

            <div
                style={{
                    marginBottom: 16,
                }}
            >

                <h1
                    style={{
                        margin: 0,
                    }}
                >
                    Notifications
                </h1>

            </div>


            {/* =========================
                TABS
            ========================= */}

            <div className="tab-strip">

                <button
                    className={`tab-strip-btn${
                        tab === "all"
                            ? " active"
                            : ""
                    }`}
                    onClick={() =>
                        setTab("all")
                    }
                >
                    All
                </button>


                <button
                    className={`tab-strip-btn${
                        tab === "unread"
                            ? " active"
                            : ""
                    }`}
                    onClick={() =>
                        setTab("unread")
                    }
                >

                    Unread

                    {unreadCount > 0 && (
                        <span
                            style={{
                                marginLeft: 5,
                            }}
                        >
                            ({unreadCount})
                        </span>
                    )}

                </button>

            </div>


            {/* =========================
                TOOLBAR
            ========================= */}

            <div className="notif-toolbar">

                <span className="notif-summary">

                    {unreadCount > 0

                        ? `${unreadCount} unread notification${
                            unreadCount === 1
                                ? ""
                                : "s"
                        }`

                        : "No unread notifications"}

                </span>


                <button
                    className="btn btn-ghost btn-sm"
                    onClick={
                        handleMarkAll
                    }
                    disabled={
                        unreadCount === 0
                    }
                >
                    Mark all read
                </button>

            </div>


            {/* =========================
                LOADING
            ========================= */}

            {loading && (

                <div
                    className="empty-state"
                >

                    <div className="empty-ico">

                        <BellIcon />

                    </div>

                    <div className="empty-title">

                        Loading notifications...

                    </div>

                </div>

            )}


            {/* =========================
                ERROR
            ========================= */}

            {!loading &&
                error && (

                    <div
                        className="empty-state"
                    >

                        <div className="empty-ico">

                            ⚠️

                        </div>

                        <div className="empty-title">

                            Something went wrong

                        </div>

                        <div className="empty-sub">

                            {error}

                        </div>


                        <button
                            className="btn btn-primary btn-sm"
                            style={{
                                marginTop: 12,
                            }}
                            onClick={
                                loadNotifications
                            }
                        >
                            Try again
                        </button>

                    </div>

                )}


            {/* =========================
                EMPTY
            ========================= */}

            {!loading &&
                !error &&
                shown.length === 0 && (

                    <div
                        className="empty-state"
                    >

                        <div className="empty-ico">

                            <BellIcon />

                        </div>

                        <div className="empty-title">

                            {tab === "unread"
                                ? "All caught up!"
                                : "No notifications yet"}

                        </div>

                        <div className="empty-sub">

                            {tab === "unread"
                                ? "You have no unread notifications."
                                : "Your notifications will appear here."}

                        </div>

                    </div>

                )}


            {/* =========================
                NOTIFICATIONS
            ========================= */}

            {!loading &&
                !error &&
                shown.length > 0 && (

                    <div>

                        {shown.map(
                            (notification) => {

                                const Icon =
                                    ICONS[
                                        notification.type
                                    ] ||
                                    BellIcon;


                                return (

                                    <div
                                        key={
                                            notification._id
                                        }
                                        className={`notif-item${
                                            !notification.isRead
                                                ? " unread"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleMarkAsRead(
                                                notification
                                            )
                                        }
                                    >

                                        {/* Unread dot */}

                                        <div
                                            className={`notif-dot${
                                                notification.isRead
                                                    ? " read"
                                                    : ""
                                            }`}
                                        />


                                        {/* Icon */}

                                        <div className="notif-icon">

                                            <Icon />

                                        </div>


                                        {/* Content */}

                                        <div
                                            className="notif-content"
                                        >

                                            <div
                                                className="notif-text"
                                            >

                                                {getNotificationText(
                                                    notification
                                                )}

                                            </div>


                                            <div
                                                className="notif-time"
                                            >

                                                {notification.createdAt
                                                    ? timeAgo(
                                                        notification.createdAt
                                                    )
                                                    : ""}

                                            </div>

                                        </div>


                                        {/* Delete */}

                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm"
                                            onClick={(
                                                e
                                            ) =>
                                                handleDelete(
                                                    e,
                                                    notification._id
                                                )
                                            }
                                        >
                                            ×
                                        </button>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

        </div>

    );

}