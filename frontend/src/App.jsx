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
import AdminPage from "./pages/AdminPage";


// ==========================================
// PAGE RENDERER
// ==========================================

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


// ==========================================
// PAGES WITHOUT RIGHT PANEL
// ==========================================

const NO_RIGHT = [
    "dms",
];


// ==========================================
// APP
// ==========================================

export default function App() {

    return (

        <AppProvider>

            <AppShell />

        </AppProvider>

    );
}


// ==========================================
// APP SHELL
// ==========================================

function AppShell() {

    const {
        user,
        authLoading,
        page,
        theme,
    } = useApp();


    const [authPage, setAuthPage] =
        useState("login");


    // ======================================
    // THEME
    // ======================================

    useEffect(() => {

        document.body.classList.toggle(
            "dark",
            theme === "dark"
        );

    }, [theme]);


    // ======================================
    // AUTH LOADING
    // ======================================

    if (authLoading) {

        return (

            <div className="auth-loading">
                Loading...
            </div>

        );

    }


    // ======================================
    // NOT LOGGED IN
    // ======================================

    if (!user) {

        if (authPage === "register") {

            return (

                <RegisterPage
                    onLogin={() =>
                        setAuthPage("login")
                    }
                />

            );

        }

        return (

            <LoginPage
                onRegister={() =>
                    setAuthPage("register")
                }
            />

        );

    }


    // ======================================
    // ADMIN
    // ======================================

    /*
       IMPORTANT:

       Admin ko normal app-shell ke andar
       render nahi karna.

       Isse admin ko full viewport milega.
    */

    if (page === "admin") {

        if (user.role !== "admin") {

            return (

                <div className="admin-denied">

                    <div className="admin-denied-icon">
                        🔒
                    </div>

                    <h2>
                        Access Denied
                    </h2>

                    <p>
                        You don't have permission
                        to access the admin panel.
                    </p>

                </div>

            );

        }

        return <AdminPage />;

    }


    // ======================================
    // NORMAL APP
    // ======================================

    const showRight =
        !NO_RIGHT.includes(page);


    return (

        <div className="app-shell">

            <Sidebar />


            <main className="main-feed">

                <PageRenderer />

            </main>


            {showRight && (
                <RightPanel />
            )}

        </div>

    );

}