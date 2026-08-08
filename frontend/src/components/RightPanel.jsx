import { useState } from 'react';
import Avatar from './Avatar';
import { MoonIcon, SunIcon } from './Icons';
import { useApp } from '../context/AppContext';
import { TRENDING, USERS } from '../data/mockData';

export default function RightPanel() {
  const { navigate, theme, toggleTheme, searchQuery } = useApp();
  const [following, setFollowing] = useState({});

  const toggle = (id) => setFollowing(f => ({ ...f, [id]: !f[id] }));

  const shown = searchQuery.length > 1
    ? USERS.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.college.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : USERS.slice(0, 5);

  return (
    <aside className="right-panel">
      <div className="rp-panel-top">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <><SunIcon /> Light Mode</> : <><MoonIcon /> Dark Mode</>}
        </button>
      </div>

      {/* Trending — hide when searching */}
      {!searchQuery && (
        <div className="rp-box" style={{ marginBottom: 16 }}>
          <div className="rp-box-title">What's trending</div>
          {TRENDING.map((t, i) => (
            <div key={i} className="rp-row">
              <div className="trend-category">{t.category}</div>
              <div className="trend-tag">#{t.tag}</div>
              <div className="trend-count">{t.voices.toLocaleString()} voice posts</div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      <div className="rp-box">
        <div className="rp-box-title">
          {searchQuery.length > 1 ? 'Search results' : 'People you may know'}
        </div>
        {shown.length === 0 && (
          <div style={{ padding: '16px 20px', fontSize: 14, color: 'var(--ink3)' }}>No users found</div>
        )}
        {shown.map(u => (
          <div key={u._id} className="rp-row">
            <div className="suggest-row">
              <Avatar name={u.name} size="sm" onClick={() => navigate('user', u)} />
              <div className="suggest-names">
                <div className="suggest-name" style={{ cursor: 'pointer' }} onClick={() => navigate('user', u)}>{u.name}</div>
                <div className="suggest-college">{u.college}</div>
              </div>
              <button
                className={`btn btn-sm ${following[u._id] ? 'btn-secondary' : 'btn-outline'}`}
                onClick={() => toggle(u._id)}
              >
                {following[u._id] ? 'Following' : '+ Add'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--ink4)', lineHeight: 1.7, padding: '8px 4px' }}>
        WeVoc · Terms · Privacy · Campus Voice Platform © 2025
      </p>
    </aside>
  );
}
