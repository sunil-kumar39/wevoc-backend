import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import AdminSidebar from "../components/AdminSidebar";

import {
    getAdminDashboard,
    getAdminUsers,
    getAdminUserDetails,
    deleteAdminUser,
    getAdminVoices,
    deleteAdminVoice,
} from "../api/admin.api";

import { useApp } from "../context/AppContext";


export default function AdminPage() {

    const {
        user,
        logout,
        navTo,
    } = useApp();

    const [active, setActive] = useState("dashboard");

    const [dashboard, setDashboard] = useState(null);
    const [users, setUsers] = useState([]);
    const [voices, setVoices] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [userDetailsLoading, setUserDetailsLoading] =
        useState(false);

    const [error, setError] = useState("");

    const [userSearch, setUserSearch] = useState("");
    const [voiceSearch, setVoiceSearch] = useState("");


    // =====================================
    // ADMIN PROTECTION
    // =====================================

    if (user?.role !== "admin") {
        return (
            <div className="admin-denied">

                <div className="admin-denied-icon">
                    🔒
                </div>

                <h2>
                    Access Denied
                </h2>

                <p>
                    You don't have permission to access
                    the admin panel.
                </p>

                <button
                    className="btn btn-primary"
                    onClick={() => navTo("feed")}
                >
                    Back to WeVoc
                </button>

            </div>
        );
    }


    // =====================================
    // DASHBOARD
    // =====================================

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAdminDashboard();

            setDashboard(response.data);

        } catch (err) {

            setError(
                err.message ||
                "Failed to load dashboard"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // USERS
    // =====================================

    const loadUsers = async (search = "") => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAdminUsers(
                    1,
                    20,
                    search
                );

            setUsers(
                response.data?.users || []
            );

        } catch (err) {

            setError(
                err.message ||
                "Failed to load users"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // VOICES
    // =====================================

    const loadVoices = async (search = "") => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAdminVoices(
                    1,
                    20,
                    search
                );

            setVoices(
                response.data?.voices || []
            );

        } catch (err) {

            setError(
                err.message ||
                "Failed to load voices"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // LOAD SECTION
    // =====================================

    useEffect(() => {

        if (active === "dashboard") {
            loadDashboard();
        }

        if (active === "users") {
            loadUsers();
        }

        if (active === "voices") {
            loadVoices();
        }

    }, [active]);


    // =====================================
    // USER DETAILS
    // =====================================

    const handleUserClick = async (userId) => {

        try {

            setUserDetailsLoading(true);
            setError("");

            const response =
                await getAdminUserDetails(userId);

            setSelectedUser(
                response.data
            );

        } catch (err) {

            setError(
                err.message ||
                "Failed to load user details"
            );

        } finally {

            setUserDetailsLoading(false);

        }
    };


    // =====================================
    // DELETE USER
    // =====================================

    const handleDeleteUser = async (userId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this user?"
            );

        if (!confirmed) return;

        try {

            await deleteAdminUser(userId);

            setUsers(prev =>
                prev.filter(
                    u => u._id !== userId
                )
            );

            if (
                selectedUser?._id === userId
            ) {
                setSelectedUser(null);
            }

        } catch (err) {

            alert(
                err.message ||
                "Failed to delete user"
            );

        }
    };


    // =====================================
    // DELETE VOICE
    // =====================================

    const handleDeleteVoice = async (voiceId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this voice?"
            );

        if (!confirmed) return;

        try {

            await deleteAdminVoice(
                voiceId
            );

            setVoices(prev =>
                prev.filter(
                    v => v._id !== voiceId
                )
            );

        } catch (err) {

            alert(
                err.message ||
                "Failed to delete voice"
            );

        }
    };


    // =====================================
    // LOGOUT
    // =====================================

    const handleLogout = async () => {

        try {
            await logout();
        } catch (err) {
            console.error(err);
        }

    };


    // =====================================
    // BACK BUTTON STYLE
    // =====================================

    const backButtonStyle = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        padding: "10px 15px",
        minHeight: "40px",

        background: "#ffffff",
        color: "#c0392b",

        border: "1px solid #c0392b",
        borderRadius: "10px",

        fontSize: "13px",
        fontWeight: 700,

        cursor: "pointer",

        opacity: 1,
        visibility: "visible",

        position: "relative",
        zIndex: 9999,

        whiteSpace: "nowrap",

        boxShadow:
            "0 4px 14px rgba(192,57,43,0.12)",

        transition:
            "all 0.22s ease",
    };


    // =====================================
    // USER DETAILS PAGE
    // =====================================

    if (selectedUser) {

        return (

            <div
                className="admin-layout"
                style={{
                    width: "100%",
                    minWidth: 0,
                }}
            >

                <AdminSidebar
                    active="users"
                    onChange={(section) => {
                        setSelectedUser(null);
                        setActive(section);
                    }}
                />


                <main
                    className="admin-main"
                    style={{
                        flex: 1,
                        minWidth: 0,
                        width: "100%",
                    }}
                >

                    {/* HEADER */}

                    <header className="admin-header">

                        <div>

                            <div className="admin-header-title">
                                User Details
                            </div>

                            <div className="admin-header-sub">
                                View account information
                            </div>

                        </div>


                        <div
                            className="admin-header-right"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                flexWrap: "wrap",
                            }}
                        >

                            {/* BACK TO WEVOC */}

                            <button
                                type="button"
                                style={backButtonStyle}
                                onClick={() =>
                                    navTo("feed")
                                }
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background =
                                        "#c0392b";

                                    e.currentTarget.style.color =
                                        "#ffffff";

                                    e.currentTarget.style.transform =
                                        "translateX(-3px)";

                                    e.currentTarget.style.boxShadow =
                                        "0 8px 22px rgba(192,57,43,0.25)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background =
                                        "#ffffff";

                                    e.currentTarget.style.color =
                                        "#c0392b";

                                    e.currentTarget.style.transform =
                                        "translateX(0)";

                                    e.currentTarget.style.boxShadow =
                                        "0 4px 14px rgba(192,57,43,0.12)";
                                }}
                            >
                                ← Back to WeVoc
                            </button>


                            <div className="admin-user">

                                <Avatar
                                    name={
                                        user.fullname
                                    }
                                    src={
                                        user.avatar
                                    }
                                    size="sm"
                                />

                                <div>

                                    <div className="admin-user-name">
                                        {user.fullname}
                                    </div>

                                    <div className="admin-user-role">
                                        Administrator
                                    </div>

                                </div>

                            </div>


                            <button
                                className="admin-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>

                    </header>


                    {/* CONTENT */}

                    <div className="admin-content">

                        {/* BACK TO USERS */}

                        <button
                            type="button"
                            style={{
                                ...backButtonStyle,
                                marginBottom: "20px",
                            }}
                            onClick={() =>
                                setSelectedUser(null)
                            }
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    "#c0392b";

                                e.currentTarget.style.color =
                                    "#ffffff";

                                e.currentTarget.style.transform =
                                    "translateX(-3px)";

                                e.currentTarget.style.boxShadow =
                                    "0 8px 22px rgba(192,57,43,0.25)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                    "#ffffff";

                                e.currentTarget.style.color =
                                    "#c0392b";

                                e.currentTarget.style.transform =
                                    "translateX(0)";

                                e.currentTarget.style.boxShadow =
                                    "0 4px 14px rgba(192,57,43,0.12)";
                            }}
                        >
                            ← Back to Users
                        </button>


                        {userDetailsLoading ? (

                            <div className="admin-loading">
                                Loading user...
                            </div>

                        ) : (

                            <UserDetails
                                user={selectedUser}
                                onDelete={handleDeleteUser}
                            />

                        )}

                    </div>

                </main>

            </div>
        );
    }


    // =====================================
    // NORMAL ADMIN PANEL
    // =====================================

    return (

        <div
            className="admin-layout"
            style={{
                width: "100%",
                minWidth: 0,
            }}
        >

            <AdminSidebar
                active={active}
                onChange={setActive}
            />


            <main
                className="admin-main"
                style={{
                    flex: 1,
                    minWidth: 0,
                    width: "100%",
                    overflowX: "hidden",
                }}
            >

                {/* =========================
                    HEADER
                ========================= */}

                <header className="admin-header">

                    <div>

                        <div className="admin-header-title">

                            {active === "dashboard" &&
                                "Dashboard"}

                            {active === "users" &&
                                "Users"}

                            {active === "voices" &&
                                "Voices"}

                            {active === "reports" &&
                                "Reports"}

                        </div>

                        <div className="admin-header-sub">
                            Manage your WeVoc platform
                        </div>

                    </div>


                    <div
                        className="admin-header-right"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                        }}
                    >

                        {/* =========================
                            BACK TO WEVOC
                        ========================= */}

                        <button
                            type="button"
                            style={backButtonStyle}
                            onClick={() =>
                                navTo("feed")
                            }
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    "#c0392b";

                                e.currentTarget.style.color =
                                    "#ffffff";

                                e.currentTarget.style.transform =
                                    "translateX(-3px)";

                                e.currentTarget.style.boxShadow =
                                    "0 8px 22px rgba(192,57,43,0.25)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                    "#ffffff";

                                e.currentTarget.style.color =
                                    "#c0392b";

                                e.currentTarget.style.transform =
                                    "translateX(0)";

                                e.currentTarget.style.boxShadow =
                                    "0 4px 14px rgba(192,57,43,0.12)";
                            }}
                        >
                            ← Back to WeVoc
                        </button>


                        <div className="admin-user">

                            <Avatar
                                name={
                                    user.fullname
                                }
                                src={
                                    user.avatar
                                }
                                size="sm"
                            />

                            <div>

                                <div className="admin-user-name">
                                    {user.fullname}
                                </div>

                                <div className="admin-user-role">
                                    Administrator
                                </div>

                            </div>

                        </div>


                        <button
                            className="admin-logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </header>


                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <div className="admin-error">
                        {error}
                    </div>

                )}


                {/* =========================
                    CONTENT
                ========================= */}

                {loading ? (

                    <div className="admin-loading">
                        Loading...
                    </div>

                ) : (

                    <>

                        {active === "dashboard" && (

                            <Dashboard
                                data={dashboard}
                            />

                        )}


                        {active === "users" && (

                            <UsersSection
                                users={users}
                                search={userSearch}
                                setSearch={setUserSearch}

                                onSearch={() =>
                                    loadUsers(
                                        userSearch
                                    )
                                }

                                onDelete={
                                    handleDeleteUser
                                }

                                onUserClick={
                                    handleUserClick
                                }
                            />

                        )}


                        {active === "voices" && (

                            <VoicesSection
                                voices={voices}
                                search={voiceSearch}
                                setSearch={setVoiceSearch}

                                onSearch={() =>
                                    loadVoices(
                                        voiceSearch
                                    )
                                }

                                onDelete={
                                    handleDeleteVoice
                                }
                            />

                        )}


                        {active === "reports" && (

                            <div className="admin-empty">

                                <div>
                                    🚧
                                </div>

                                <h3>
                                    Reports coming next
                                </h3>

                                <p>
                                    We'll connect the
                                    reporting system here.
                                </p>

                            </div>

                        )}

                    </>

                )}

            </main>

        </div>
    );
}


// =====================================
// USER DETAILS
// =====================================

function UserDetails({
    user,
    onDelete
}) {

    return (

        <div className="admin-content">

            <div className="admin-card">

                <div className="admin-profile-card">

                    <Avatar
                        name={
                            user.fullname
                        }
                        src={
                            user.avatar
                        }
                        size="lg"
                    />


                    <div className="admin-profile-info">

                        <h2>
                            {user.fullname}
                        </h2>

                        <p>
                            @{user.username}
                        </p>

                        <p>
                            {user.email}
                        </p>

                        <span
                            className={`admin-role ${
                                user.role === "admin"
                                    ? "admin"
                                    : ""
                            }`}
                        >
                            {user.role || "user"}
                        </span>

                    </div>

                </div>


                <div className="admin-user-stats">

                    <div>

                        <strong>
                            {user.followersCount ?? 0}
                        </strong>

                        <span>
                            Followers
                        </span>

                    </div>


                    <div>

                        <strong>
                            {user.followingCount ?? 0}
                        </strong>

                        <span>
                            Following
                        </span>

                    </div>


                    <div>

                        <strong>
                            {user.voiceCount ??
                                user.totalVoices ??
                                0}
                        </strong>

                        <span>
                            Voices
                        </span>

                    </div>

                </div>


                <div className="admin-detail-row">

                    <strong>
                        Full name
                    </strong>

                    <span>
                        {user.fullname || "—"}
                    </span>

                </div>


                <div className="admin-detail-row">

                    <strong>
                        Username
                    </strong>

                    <span>
                        @{user.username || "—"}
                    </span>

                </div>


                <div className="admin-detail-row">

                    <strong>
                        Email
                    </strong>

                    <span>
                        {user.email || "—"}
                    </span>

                </div>


                <div className="admin-detail-row">

                    <strong>
                        Bio
                    </strong>

                    <span>
                        {user.bio || "No bio"}
                    </span>

                </div>


                <div className="admin-detail-row">

                    <strong>
                        Role
                    </strong>

                    <span>
                        {user.role || "user"}
                    </span>

                </div>


                <div className="admin-detail-row">

                    <strong>
                        Joined
                    </strong>

                    <span>

                        {user.createdAt
                            ? new Date(
                                user.createdAt
                            ).toLocaleDateString()
                            : "—"}

                    </span>

                </div>


                {user.role !== "admin" && (

                    <button
                        className="admin-delete"
                        style={{
                            marginTop: 20
                        }}
                        onClick={() =>
                            onDelete(user._id)
                        }
                    >
                        Delete User
                    </button>

                )}

            </div>

        </div>
    );
}


// =====================================
// DASHBOARD
// =====================================

function Dashboard({
    data
}) {

    const stats =
        data?.stats || {};

    return (

        <div className="admin-content">

            <div className="admin-welcome">

                <div>

                    <h2>
                        Overview
                    </h2>

                    <p>
                        Here's what's happening
                        on WeVoc.
                    </p>

                </div>

            </div>


            <div className="admin-stats">

                <StatCard
                    icon="👥"
                    label="Total Users"
                    value={
                        stats.totalUsers ?? 0
                    }
                />

                <StatCard
                    icon="🎙️"
                    label="Total Voices"
                    value={
                        stats.totalVoices ?? 0
                    }
                />

                <StatCard
                    icon="🛡️"
                    label="Admin Status"
                    value="Active"
                />

            </div>


            <div className="admin-grid-2">

                <div className="admin-card">

                    <div className="admin-card-head">

                        <h3>
                            Recent Users
                        </h3>

                    </div>


                    {data?.recentUsers?.length ? (

                        data.recentUsers.map(
                            u => (

                                <div
                                    className="admin-user-row"
                                    key={u._id}
                                >

                                    <Avatar
                                        name={
                                            u.fullname
                                        }
                                        src={
                                            u.avatar
                                        }
                                        size="sm"
                                    />

                                    <div className="admin-row-info">

                                        <strong>
                                            {u.fullname}
                                        </strong>

                                        <span>
                                            @{u.username}
                                        </span>

                                    </div>

                                </div>

                            )
                        )

                    ) : (

                        <div className="admin-no-data">
                            No users yet
                        </div>

                    )}

                </div>


                <div className="admin-card">

                    <div className="admin-card-head">

                        <h3>
                            Recent Voices
                        </h3>

                    </div>


                    {data?.recentVoices?.length ? (

                        data.recentVoices.map(
                            voice => (

                                <div
                                    className="admin-voice-row"
                                    key={voice._id}
                                >

                                    <div className="admin-voice-icon">
                                        🎙️
                                    </div>

                                    <div className="admin-row-info">

                                        <strong>
                                            {voice.title}
                                        </strong>

                                        <span>
                                            {voice.owner?.fullname ||
                                                "Unknown user"}
                                        </span>

                                    </div>

                                </div>

                            )
                        )

                    ) : (

                        <div className="admin-no-data">
                            No voices yet
                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}


// =====================================
// STAT CARD
// =====================================

function StatCard({
    icon,
    label,
    value
}) {

    return (

        <div className="admin-stat-card">

            <div className="admin-stat-icon">
                {icon}
            </div>

            <div>

                <div className="admin-stat-label">
                    {label}
                </div>

                <div className="admin-stat-value">
                    {value}
                </div>

            </div>

        </div>
    );
}


// =====================================
// USERS
// =====================================

function UsersSection({
    users,
    search,
    setSearch,
    onSearch,
    onDelete,
    onUserClick
}) {

    return (

        <div className="admin-content">

            <div className="admin-section-top">

                <div>

                    <h2>
                        Users
                    </h2>

                    <p>
                        Manage registered WeVoc users.
                    </p>

                </div>


                <div className="admin-search">

                    <input
                        placeholder="Search users..."
                        value={search}
                        onChange={e =>
                            setSearch(
                                e.target.value
                            )
                        }
                        onKeyDown={e => {

                            if (
                                e.key === "Enter"
                            ) {
                                onSearch();
                            }

                        }}
                    />

                    <button
                        onClick={onSearch}
                    >
                        Search
                    </button>

                </div>

            </div>


            <div className="admin-card admin-table-card">

                <div className="admin-table">

                    <div className="admin-table-head">

                        <span>
                            User
                        </span>

                        <span>
                            Username
                        </span>

                        <span>
                            Email
                        </span>

                        <span>
                            Role
                        </span>

                        <span>
                            Action
                        </span>

                    </div>


                    {users.length === 0 ? (

                        <div className="admin-no-data">
                            No users found.
                        </div>

                    ) : (

                        users.map(u => (

                            <div
                                className="admin-table-row admin-user-clickable"
                                key={u._id}
                                onClick={() =>
                                    onUserClick(
                                        u._id
                                    )
                                }
                            >

                                <div className="admin-user-cell">

                                    <Avatar
                                        name={
                                            u.fullname
                                        }
                                        src={
                                            u.avatar
                                        }
                                        size="sm"
                                    />

                                    <strong>
                                        {u.fullname}
                                    </strong>

                                </div>


                                <span>
                                    @{u.username}
                                </span>


                                <span>
                                    {u.email}
                                </span>


                                <span>

                                    <span
                                        className={`admin-role ${
                                            u.role === "admin"
                                                ? "admin"
                                                : ""
                                        }`}
                                    >
                                        {u.role || "user"}
                                    </span>

                                </span>


                                <div>

                                    {u.role !== "admin" && (

                                        <button
                                            className="admin-delete"
                                            onClick={e => {

                                                e.stopPropagation();

                                                onDelete(
                                                    u._id
                                                );

                                            }}
                                        >
                                            Delete
                                        </button>

                                    )}

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>
    );
}


// =====================================
// VOICES
// =====================================

function VoicesSection({
    voices,
    search,
    setSearch,
    onSearch,
    onDelete
}) {

    return (

        <div className="admin-content">

            <div className="admin-section-top">

                <div>

                    <h2>
                        Voices
                    </h2>

                    <p>
                        Manage published voice posts.
                    </p>

                </div>


                <div className="admin-search">

                    <input
                        placeholder="Search voices..."
                        value={search}
                        onChange={e =>
                            setSearch(
                                e.target.value
                            )
                        }
                        onKeyDown={e => {

                            if (
                                e.key === "Enter"
                            ) {
                                onSearch();
                            }

                        }}
                    />

                    <button
                        onClick={onSearch}
                    >
                        Search
                    </button>

                </div>

            </div>


            <div className="admin-voice-list">

                {voices.length === 0 ? (

                    <div className="admin-empty">

                        <div>
                            🎙️
                        </div>

                        <h3>
                            No voices found
                        </h3>

                    </div>

                ) : (

                    voices.map(voice => (

                        <div
                            className="admin-voice-card"
                            key={voice._id}
                        >

                            {voice.thumbnail ? (

                                <img
                                    src={
                                        voice.thumbnail
                                    }
                                    alt={
                                        voice.title
                                    }
                                    className="admin-voice-thumb"
                                />

                            ) : (

                                <div className="admin-voice-thumb admin-thumb-empty">
                                    🎙️
                                </div>

                            )}


                            <div className="admin-voice-details">

                                <h3>
                                    {voice.title}
                                </h3>

                                <p>
                                    {voice.description}
                                </p>

                                <span>
                                    By{" "}
                                    {voice.owner?.fullname ||
                                        "Unknown"}
                                </span>

                            </div>


                            <button
                                className="admin-delete"
                                onClick={() =>
                                    onDelete(
                                        voice._id
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}