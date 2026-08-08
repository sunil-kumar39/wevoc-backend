import { useState } from 'react';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import { ME, POSTS } from '../data/mockData';
import { fmtDate } from '../utils/helpers';

export default function ProfilePage() {
  const [tab, setTab] = useState('posts');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: ME.name, bio: ME.bio, college: ME.college });
  const [saved, setSaved] = useState({ ...form });

  const myPosts   = POSTS.filter(p => !p.isAnonymous && p.user?._id === 'u2'); // demo posts
  const likedPosts = POSTS.filter(p => p.likes.includes('me123'));

  const handleSave = () => { setSaved({ ...form }); setEditing(false); };

  return (
    <div className="page-anim">

      {/* Info */}
      <div className="profile-info-wrap">
        <div className="profile-avatar-bump">
          <Avatar name={saved.name} size="2xl" />
        </div>

        {editing ? (
          <div style={{ marginBottom: 16 }}>
            <div className="field-group">
              <label className="field-label">Name</label>
              <input className="field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field-group">
              <label className="field-label">College</label>
              <input className="field" value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} />
            </div>
            <div className="field-group">
              <label className="field-label">Bio ({form.bio.length}/200)</label>
              <textarea className="field" rows={3} maxLength={200} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
              <button className="btn btn-ghost btn-sm" onClick={() => { setForm({ ...saved }); setEditing(false); }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="profile-title-row">
              <div>
                <div className="profile-name">{saved.name}</div>
              </div>
              <button className="btn btn-ghost btn-sm profile-edit-btn" onClick={() => setEditing(true)}>
                Edit profile
              </button>
            </div>
            <div className="profile-handle">@{ME.username}</div>
            <div className="profile-bio">{saved.bio}</div>
            <div className="profile-meta-row">
              <div className="profile-meta-item">🎓 {saved.college}</div>
              <div className="profile-meta-item">📅 Joined {fmtDate(ME.createdAt)}</div>
            </div>
            <div className="profile-stats-row">
              <div className="stat-link">
                <span className="stat-count">{ME.postsCount}</span>
                <span className="stat-word">Posts</span>
              </div>
              <div className="stat-link">
                <span className="stat-count">{ME.friends.length}</span>
                <span className="stat-word">Friends</span>
              </div>
              <div className="stat-link">
                <span className="stat-count">{likedPosts.length}</span>
                <span className="stat-word">Liked</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="tab-strip">
        <button className={`tab-strip-btn${tab === 'posts' ? ' active' : ''}`} onClick={() => setTab('posts')}>
          Posts
        </button>
        <button className={`tab-strip-btn${tab === 'liked' ? ' active' : ''}`} onClick={() => setTab('liked')}>
          Liked
        </button>
      </div>

      {/* Content */}
      {tab === 'posts' && (
        myPosts.length === 0
          ? <EmptyState icon="🎙" title="No posts yet" sub="Your voice posts will appear here." />
          : myPosts.map(p => <PostCard key={p._id} post={p} />)
      )}
      {tab === 'liked' && (
        likedPosts.length === 0
          ? <EmptyState icon="🤍" title="No liked posts" sub="Posts you like will appear here." />
          : likedPosts.map(p => <PostCard key={p._id} post={p} />)
      )}
    </div>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <div className="empty-state">
      <div className="empty-ico">{icon}</div>
      <div className="empty-title">{title}</div>
      <div className="empty-sub">{sub}</div>
    </div>
  );
}
