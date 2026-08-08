import PostCard from '../components/PostCard';
import { BookmarkIcon } from '../components/Icons';
import { useApp } from '../context/AppContext';
import { POSTS } from '../data/mockData';

export default function BookmarksPage() {
  const { bookmarks } = useApp();
  const saved = POSTS.filter(p => bookmarks.includes(p._id));

  return (
    <div className="page-anim">
      <div className="feed-header bookmarks-header">
        <div className="feed-header-inner page-title-header">
          <div className="page-title-stack">
            <div className="page-top-title bookmarks-page-title">Saved</div>
          </div>
        </div>
      </div>

      {saved.length === 0 ? (
        <div className="empty-state">
          <div className="empty-ico">🔖</div>
          <div className="empty-title">Nothing saved yet</div>
          <div className="empty-sub">Tap 🔖 on any post to bookmark it here.</div>
        </div>
      ) : (
        saved.map(p => <PostCard key={p._id} post={p} className="saved-post-card" />)
      )}
    </div>
  );
}
