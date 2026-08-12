import Avatar from "./Avatar";

import {
    BookmarkIcon,
    BellIcon,
    CommunityIcon,
    HomeIcon,
    MessageIcon,
    MicIcon,
    ProfileIcon,
    SearchIcon,
    UsersIcon,
} from "./Icons";

import { useApp } from "../context/AppContext";


const NAV_ITEMS = [
    {
        id: "feed",
        icon: HomeIcon,
        label: "Home",
    },
    {
        id: "explore",
        icon: SearchIcon,
        label: "Explore",
    },
    {
        id: "notifs",
        icon: BellIcon,
        label: "Notifications",
    },
    {
        id: "dms",
        icon: MessageIcon,
        label: "Messages",
    },
    {
        id: "communities",
        icon: CommunityIcon,
        label: "Communities",
    },
    {
        id: "bookmarks",
        icon: BookmarkIcon,
        label: "Saved",
    },
    {
        id: "friends",
        icon: UsersIcon,
        label: "Friends",
    },
    {
        id: "profile",
        icon: ProfileIcon,
        label: "Profile",
    },
];


export default function Sidebar() {

    const {
        page,
        navTo,
        user,
        logout,
    } = useApp();


    const handleLogout = async () => {

        try {

            await logout();

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    };


    return (

        <aside className="sidebar">


            {/* =========================
                LOGO
            ========================= */}

            <div
                className="sidebar-logo"
                onClick={() =>
                    navTo("feed")
                }
            >
                WeVoc
            </div>


            {/* =========================
    NAVIGATION
========================= */}

<nav>

    <ul className="nav-list">

        {NAV_ITEMS.map(
            (item) => {

                const Icon =
                    item.icon;


                return (

                    <li
                        key={item.id}
                        className="nav-item"
                    >

                        <button
                            className={`nav-btn${
                                page === item.id
                                    ? " active"
                                    : ""
                            }`}
                            onClick={() =>
                                navTo(item.id)
                            }
                        >

                            <span className="nav-btn-icon">
                                <Icon />
                            </span>


                            <span className="nav-btn-label">
                                {item.label}
                            </span>

                        </button>

                    </li>

                );

            }
        )}


        {/* =========================
            ADMIN PANEL
        ========================= */}

        {user?.role === "admin" && (

            <li className="nav-item">

                <button
                    className={`nav-btn${
                        page === "admin"
                            ? " active"
                            : ""
                    }`}
                    onClick={() =>
                        navTo("admin")
                    }
                >

                    <span className="nav-btn-icon">
                        ⚙️
                    </span>


                    <span className="nav-btn-label">
                        Admin Panel
                    </span>

                </button>

            </li>

        )}

    </ul>

</nav>

            {/* =========================
                NEW VOICE
            ========================= */}

            <button
                className="sidebar-post-btn"
                onClick={() =>
                    navTo("feed")
                }
            >

                <MicIcon />

                <span>
                    New Voice Post
                </span>

            </button>


            {/* =========================
                PROFILE FOOTER
            ========================= */}

            <div
                className="sidebar-profile"
            >

                <div
                    onClick={() =>
                        navTo("profile")
                    }
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flex: 1,
                        minWidth: 0,
                        cursor: "pointer",
                    }}
                >

                    <Avatar
                        name={
                            user?.fullname ||
                            "User"
                        }
                        src={
                            user?.avatar
                        }
                        size="sm"
                    />


                    <div className="sidebar-profile-text">

                        <div className="sidebar-profile-name">

                            {
                                user?.fullname ||
                                "User"
                            }

                        </div>


                        <div className="sidebar-profile-handle">

                            @
                            {
                                user?.username ||
                                "user"
                            }

                        </div>

                    </div>

                </div>


                {/* Logout */}

<button
    type="button"
    onClick={handleLogout}
    title="Logout"
    style={{
        cursor: "pointer",
        border: "1px solid rgba(220, 38, 38, 0.25)",
        background: "rgba(220, 38, 38, 0.08)",
        color: "#dc2626",
        fontSize: "12px",
        fontWeight: 700,
        padding: "7px 11px",
        borderRadius: "8px",
        transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.background =
            "rgba(220, 38, 38, 0.15)";
        e.currentTarget.style.borderColor =
            "rgba(220, 38, 38, 0.45)";
        e.currentTarget.style.transform =
            "translateY(-1px)";
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.background =
            "rgba(220, 38, 38, 0.08)";
        e.currentTarget.style.borderColor =
            "rgba(220, 38, 38, 0.25)";
        e.currentTarget.style.transform =
            "translateY(0)";
    }}
>
    Logout
</button>


            </div>

        </aside>

    );

}