# WeVoc Frontend 🎙

Premium campus voice platform UI — Twitter-style layout with warm ivory × crimson theme.

## Tech Stack
- **React 18** + **Vite 5**
- Pure CSS (no Tailwind, no extra UI libs)
- Fonts: Playfair Display + Plus Jakarta Sans (Google Fonts)

## Project Structure

```
wevoc-frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              ← Entry point
    ├── App.jsx               ← Shell + page router
    ├── styles/
    │   └── global.css        ← All styles (CSS variables, layout, components)
    ├── context/
    │   └── AppContext.jsx    ← Navigation state (navigate, goBack, navTo)
    ├── data/
    │   └── mockData.js       ← All mock data (posts, users, DMs, etc.)
    ├── utils/
    │   └── helpers.js        ← timeAgo, fmtDate helpers
    ├── components/
    │   ├── Sidebar.jsx       ← Left nav (Twitter-style)
    │   ├── RightPanel.jsx    ← Search + trending + suggestions
    │   ├── Avatar.jsx        ← Avatar with initials
    │   ├── Waveform.jsx      ← Waveform + LiveBars for recording
    │   ├── PostCard.jsx      ← Full post card with player + actions
    │   └── ComposeBox.jsx    ← New post composer
    └── pages/
        ├── FeedPage.jsx
        ├── ProfilePage.jsx
        ├── UserProfilePage.jsx
        ├── ExplorePage.jsx
        ├── NotificationsPage.jsx
        ├── DmsPage.jsx
        ├── FriendsPage.jsx
        ├── BookmarksPage.jsx
        └── CommunitiesPage.jsx
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

## Connecting the Backend

All mock data lives in `src/data/mockData.js`.
Replace the imports in each page/component with real API calls using `axios` or `fetch`.

Set your backend URL in a `.env` file:
```
VITE_API_URL=http://localhost:5001/api
```

Then replace e.g.:
```js
// Before (mock)
import { POSTS } from '../data/mockData';

// After (real API)
const [posts, setPosts] = useState([]);
useEffect(() => { api.get('/posts').then(r => setPosts(r.data)); }, []);
```

## Pages & Features

| Page | Route key | Features |
|------|-----------|---------|
| Feed | `feed` | Trending/Following/Recent tabs, Compose box, Post cards |
| Explore | `explore` | Trending hashtags, Top posts |
| Notifications | `notifs` | Like/Reply/Friend alerts, Mark read |
| Messages | `dms` | DM threads, Voice chat view |
| Friends | `friends` | Accept/reject requests, Unfriend |
| Bookmarks | `bookmarks` | Saved posts (synced with 🔖 on cards) |
| Communities | `communities` | Join/leave, Community feed |
| My Profile | `profile` | Edit name/bio/college, tabs |
| User Profile | `user` | View + Add/Remove friend |
