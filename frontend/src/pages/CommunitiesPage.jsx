import { useState } from 'react';
import { COMMUNITIES, POSTS } from '../data/mockData';
import PostCard from '../components/PostCard';

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState(COMMUNITIES);
  const [tab, setTab] = useState('discover');
  const [active, setActive] = useState(null);

  const toggle = (id) => setCommunities(c => c.map(x => x._id === id ? { ...x, joined: !x.joined } : x));

  if (active) {
    const comm = communities.find(c => c._id === active);
    const posts = POSTS.slice(0, 3);
    return (
      <div className="page-anim">
        <div className="feed-header">
          <div className="feed-header-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button className="back-btn" onClick={() => setActive(null)}>←</button>
              <div>
                <div className="feed-header-title">{comm.icon} {comm.name}</div>
                <div style={{ fontSize: 13, color: 'var(--ink3)' }}>{comm.members.toLocaleString()} members</div>
              </div>
            </div>
            <button
              className={`btn btn-sm ${comm.joined ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => toggle(comm._id)}
            >
              {comm.joined ? '✓ Joined' : 'Join'}
            </button>
          </div>
        </div>
        <div className="section-lbl">Recent posts</div>
        {posts.map(p => <PostCard key={p._id} post={p} />)}
      </div>
    );
  }

  const shown = tab === 'joined' ? communities.filter(c => c.joined) : communities;

  return (
    <div className="page-anim">
      <div className="feed-header communities-header">
        <div className="feed-header-inner">
          <button className="community-create-bar">
            <span className="community-create-plus" aria-hidden="true" />
            <span>Create community</span>
          </button>
        </div>
        <div className="tab-strip page-tab-strip">
          <button className={`tab-strip-btn${tab === 'discover' ? ' active' : ''}`} onClick={() => setTab('discover')}>Discover</button>
          <button className={`tab-strip-btn${tab === 'joined' ? ' active' : ''}`} onClick={() => setTab('joined')}>Joined ({communities.filter(c => c.joined).length})</button>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="empty-state">
          <div className="empty-ico">👥</div>
          <div className="empty-title">No communities joined</div>
          <div className="empty-sub">Browse and join communities that interest you.</div>
        </div>
      ) : shown.map(c => (
        <div key={c._id} className="comm-row" onClick={() => setActive(c._id)}>
          <div className="comm-icon">{c.icon}</div>
          <div className="comm-info">
            <div className="comm-name">{c.name}</div>
            <div className="comm-meta">{c.members.toLocaleString()} members · {c.posts} posts</div>
            <div className="comm-tags">
              {c.tags.map(t => <span key={t} className="comm-tag">#{t}</span>)}
            </div>
          </div>
          <button
            className={`btn btn-sm ${c.joined ? 'btn-secondary' : 'btn-outline'}`}
            onClick={e => { e.stopPropagation(); toggle(c._id); }}
          >
            {c.joined ? '✓ Joined' : 'Join'}
          </button>
        </div>
      ))}
    </div>
  );
}
