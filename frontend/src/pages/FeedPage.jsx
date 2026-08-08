import { useState } from 'react';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';
import ComposeBox from '../components/ComposeBox';
import { SearchIcon, FlameIcon } from '../components/Icons';
import { POSTS } from '../data/mockData';

export default function FeedPage() {
  const [tab, setTab] = useState('trending');

  const sorted = tab === 'trending'
    ? [...POSTS].sort((a, b) => b.score - a.score)
    : [...POSTS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div className="page-anim">
      {/* Sticky header */}
      <div className="feed-header">
        <div className="feed-header-inner">
          <div className="rp-search header-search home-search">
            <span className="rp-search-icon"><SearchIcon /></span>
            <input
              placeholder="Search WeVoc"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="tab-strip home-tab-strip">
          <button className={`tab-strip-btn${tab === 'trending' ? ' active' : ''}`} onClick={() => setTab('trending')}>
            🔥 Trending
          </button>
          <button className={`tab-strip-btn${tab === 'following' ? ' active' : ''}`} onClick={() => setTab('following')}>
            Following
          </button>
          <button className={`tab-strip-btn${tab === 'recent' ? ' active' : ''}`} onClick={() => setTab('recent')}>
            Recent
          </button>
        </div>
      </div>

      {/* Compose */}
      <ComposeBox />

      {/* Posts */}
      {sorted.map((post, i) => (
        <PostCard
          key={post._id}
          post={post}
          style={{ animationDelay: `${i * 0.04}s` }}
        />
      ))}
    </div>
  );
}
