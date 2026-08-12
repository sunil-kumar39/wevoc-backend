import {
    HomeIcon,
    UsersIcon,
    MicIcon,
    BellIcon,
} from "./Icons";

export default function AdminSidebar({
    active,
    onChange,
}) {

    const items = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: HomeIcon,
        },
        {
            id: "users",
            label: "Users",
            icon: UsersIcon,
        },
        {
            id: "voices",
            label: "Voices",
            icon: MicIcon,
        },
        {
            id: "reports",
            label: "Reports",
            icon: BellIcon,
        },
    ];


    return (
        <aside className="admin-sidebar">

            <div className="admin-logo">
                <div className="admin-logo-mark">
                    🎙
                </div>

                <div>
                    <div className="admin-logo-name">
                        WeVoc
                    </div>

                    <div className="admin-logo-sub">
                        ADMIN PANEL
                    </div>
                </div>
            </div>


            <div className="admin-nav-title">
                MANAGEMENT
            </div>


            <nav className="admin-nav">

                {items.map((item) => {

                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            className={`admin-nav-btn ${
                                active === item.id
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                onChange(item.id)
                            }
                        >

                            <span className="admin-nav-icon">
                                <Icon />
                            </span>

                            <span>
                                {item.label}
                            </span>

                        </button>
                    );

                })}

            </nav>


            <div className="admin-sidebar-bottom">

                <div className="admin-secure">
                    🔐
                    <span>
                        Admin access only
                    </span>
                </div>

            </div>

        </aside>
    );
}