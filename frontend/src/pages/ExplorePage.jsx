import { useState } from 'react';
import { SearchIcon } from '../components/Icons';
import PostCard from '../components/PostCard';
import { TRENDING, POSTS } from '../data/mockData';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();
  const trends = query
    ? TRENDING.filter(t => t.tag.toLowerCase().includes(query) || t.category.toLowerCase().includes(query))
    : TRENDING;
  const top = [...POSTS]
    .filter(p =>
      !query ||
      p.caption?.toLowerCase().includes(query) ||
      p.user?.name?.toLowerCase().includes(query) ||
      p.user?.college?.toLowerCase().includes(query)
    )
    .sort((a, b) => b.score - a.score);

  return (
    <div className="page-anim">

      {/* Trending tags */}
      <div className="explore-trends">
        <div className="explore-title">
          Trending on campus
        </div>
        <div className="rp-search header-search explore-search">
          <span className="rp-search-icon"><SearchIcon /></span>
          <input
            placeholder="Search explore"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div>
          {trends.map((t, i) => (
            <span key={i} className="trend-pill">
              #{t.tag}
              <span className="trend-pill-count">{t.voices.toLocaleString()}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Top posts */}
      <div className="section-lbl">🏆 Top Voice Posts This Week</div>

      {top.map((p, i) => (
        <PostCard key={p._id} post={p} style={{ animationDelay: `${i * 0.05}s` }} />
      ))}
    </div>
  );
}
