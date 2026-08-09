import { AppProvider, useApp } from "./context/AppContext";
import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import ExplorePage from "./pages/ExplorePage";
import NotificationsPage from "./pages/NotificationsPage";
import DmsPage from "./pages/DmsPage";
import FriendsPage from "./pages/FriendsPage";
import BookmarksPage from "./pages/BookmarksPage";
import CommunitiesPage from "./pages/CommunitiesPage";


// -------------------------
// Page Renderer
// -------------------------

function PageRenderer() {
    const { page } = useApp();

    const map = {
        feed: <FeedPage />,
        profile: <ProfilePage />,
        user: <UserProfilePage />,
        explore: <ExplorePage />,
        notifs: <NotificationsPage />,
        dms: <DmsPage />,
        friends: <FriendsPage />,
        bookmarks: <BookmarksPage />,
        communities: <CommunitiesPage />,
    };

    return map[page] ?? <FeedPage />;
}


// -------------------------
// Pages without Right Panel
// -------------------------

const NO_RIGHT = ["dms"];


// -------------------------
// App
// -------------------------

export default function App() {
    return (
        <AppProvider>
            <AppShell />
        </AppProvider>
    );
}


// -------------------------
// App Shell
// -------------------------

function AppShell() {

    const {
        user,
        authLoading,
        page,
        theme,
    } = useApp();

    const [authPage, setAuthPage] = useState("login");


    // -------------------------
    // Theme
    // -------------------------

    useEffect(() => {
        document.body.classList.toggle(
            "dark",
            theme === "dark"
        );
    }, [theme]);


    // -------------------------
    // Authentication Loading
    // -------------------------

    if (authLoading) {
        return (
            <div className="auth-loading">
                Loading...
            </div>
        );
    }


    // -------------------------
    // User Not Logged In
    // -------------------------

    if (!user) {

        if (authPage === "register") {
            return (
                <RegisterPage
                    onLogin={() => setAuthPage("login")}
                />
            );
        }

        return (
            <LoginPage
                onRegister={() => setAuthPage("register")}
            />
        );
    }


    // -------------------------
    // Logged In User
    // -------------------------

    const showRight = !NO_RIGHT.includes(page);


    return (
        <div className="app-shell">

            <Sidebar />

            <main className="main-feed">
                <PageRenderer />
            </main>

            {showRight && <RightPanel />}

        </div>
    );
}

