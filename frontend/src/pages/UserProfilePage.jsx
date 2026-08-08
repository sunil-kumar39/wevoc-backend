import { useState } from 'react';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import { useApp } from '../context/AppContext';
import { ME, POSTS } from '../data/mockData';
import { fmtDate } from '../utils/helpers';

export default function UserProfilePage() {
  const { pageData: user, goBack } = useApp();
  const [tab, setTab] = useState('posts');

  const initialStatus = ME.friends.includes(user?._id)
    ? 'friends'
    : ME.friendRequests.includes(user?._id)
    ? 'incoming'
    : 'none';

  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const posts = POSTS.filter(p => !p.isAnonymous && p.user?._id === user?._id);
  const liked = POSTS.filter(p => p.likes.includes(user?._id));

  if (!user) return <div className="empty-state"><div className="empty-title">User not found</div></div>;

  const doAction = async (fn) => { setLoading(true); await new Promise(r => setTimeout(r, 350)); fn(); setLoading(false); };

  const FriendBtn = () => {
    if (status === 'friends') return (
      <button className="btn btn-secondary btn-sm" style={{ color: 'var(--crimson)' }} disabled={loading}
        onClick={() => doAction(() => setStatus('none'))}>
        {loading ? '…' : '✓ Friends'}
      </button>
    );
    if (status === 'requested') return (
      <button className="btn btn-ghost btn-sm" disabled={loading}
        onClick={() => doAction(() => setStatus('none'))}>
        {loading ? '…' : 'Requested'}
      </button>
    );
    if (status === 'incoming') return (
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-primary btn-sm" disabled={loading}
          onClick={() => doAction(() => setStatus('friends'))}>
          {loading ? '…' : 'Accept'}
        </button>
        <button className="btn btn-ghost btn-sm" disabled={loading}
          onClick={() => doAction(() => setStatus('none'))}>
          Reject
        </button>
      </div>
    );
    return (
      <button className="btn btn-outline btn-sm" disabled={loading}
        onClick={() => doAction(() => setStatus('requested'))}>
        {loading ? '…' : '+ Add Friend'}
      </button>
    );
  };

  return (
    <div className="page-anim">
      {/* Header */}
      <div className="feed-header">
        <div className="feed-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="back-btn" onClick={goBack}>←</button>
            <div>
              <div className="feed-header-title">{user.name}</div>
              <div style={{ fontSize: 13, color: 'var(--ink3)' }}>{posts.length} posts</div>
            </div>
          </div>
          <FriendBtn />
        </div>
      </div>

      {/* Info */}
      <div className="profile-info-wrap">
        <div className="profile-avatar-bump">
          <Avatar name={user.name} size="2xl" />
        </div>
        <div className="profile-name">{user.name}</div>
        <div className="profile-handle">@{user.username}</div>
        {user.bio && <div className="profile-bio">{user.bio}</div>}
        <div className="profile-meta-row">
          {user.college && <div className="profile-meta-item">🎓 {user.college}</div>}
          <div className="profile-meta-item">📅 Joined {fmtDate(user.createdAt)}</div>
        </div>
        <div className="profile-stats-row">
          <div className="stat-link"><span className="stat-count">{user.postsCount}</span><span className="stat-word">Posts</span></div>
          <div className="stat-link"><span className="stat-count">{user.friends?.length ?? 0}</span><span className="stat-word">Friends</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-strip">
        <button className={`tab-strip-btn${tab === 'posts' ? ' active' : ''}`} onClick={() => setTab('posts')}>Posts</button>
        <button className={`tab-strip-btn${tab === 'liked' ? ' active' : ''}`} onClick={() => setTab('liked')}>Liked</button>
      </div>

      {tab === 'posts' && (
        posts.length === 0
          ? <div className="empty-state"><div className="empty-ico">🎙</div><div className="empty-title">No posts yet</div></div>
          : posts.map(p => <PostCard key={p._id} post={p} />)
      )}
      {tab === 'liked' && (
        liked.length === 0
          ? <div className="empty-state"><div className="empty-ico">🤍</div><div className="empty-title">No liked posts</div></div>
          : liked.map(p => <PostCard key={p._id} post={p} />)
      )}
    </div>
  );
}
