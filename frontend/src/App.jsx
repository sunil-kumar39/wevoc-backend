import { AppProvider, useApp } from './context/AppContext';
import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';

// Pages
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import ExplorePage from './pages/ExplorePage';
import NotificationsPage from './pages/NotificationsPage';
import DmsPage from './pages/DmsPage';
import FriendsPage from './pages/FriendsPage';
import BookmarksPage from './pages/BookmarksPage';
import CommunitiesPage from './pages/CommunitiesPage';

function PageRenderer() {
  const { page } = useApp();

  const map = {
    feed:        <FeedPage />,
    profile:     <ProfilePage />,
    user:        <UserProfilePage />,
    explore:     <ExplorePage />,
    notifs:      <NotificationsPage />,
    dms:         <DmsPage />,
    friends:     <FriendsPage />,
    bookmarks:   <BookmarksPage />,
    communities: <CommunitiesPage />,
  };

  return map[page] ?? <FeedPage />;
}

// Pages that don't show the right panel
const NO_RIGHT = ['dms'];

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

function AppShell() {
  const { page, theme } = useApp();
  const showRight = !NO_RIGHT.includes(page);

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

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
