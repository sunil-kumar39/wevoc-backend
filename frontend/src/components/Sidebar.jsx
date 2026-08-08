import Avatar from './Avatar';
import { BookmarkIcon, BellIcon, CommunityIcon, HomeIcon, MessageIcon, MicIcon, ProfileIcon, SearchIcon, UsersIcon } from './Icons';
import { useApp } from '../context/AppContext';
import { ME } from '../data/mockData';

const NAV_ITEMS = [
  { id: 'feed',        icon: HomeIcon, label: 'Home' },
  { id: 'explore',     icon: SearchIcon, label: 'Explore' },
  { id: 'notifs',      icon: BellIcon, label: 'Notifications', badge: 2 },
  { id: 'dms',         icon: MessageIcon, label: 'Messages',      badge: 3 },
  { id: 'communities', icon: CommunityIcon, label: 'Communities' },
  { id: 'bookmarks',   icon: BookmarkIcon, label: 'Saved' },
  { id: 'friends',     icon: UsersIcon, label: 'Friends',       badge: 1 },
  { id: 'profile',     icon: ProfileIcon, label: 'Profile' },
];

export default function Sidebar() {
  const { page, navTo } = useApp();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => navTo('feed')}>
        <div className="logo-icon"><MicIcon /></div>
        <span className="logo-wordmark">We<span>Voc</span></span>
      </div>

      {/* Nav */}
      <nav>
        <ul className="nav-list">
          {NAV_ITEMS.map(item => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-btn${page === item.id ? ' active' : ''}`}
                onClick={() => navTo(item.id)}
              >
                <span className="nav-btn-icon"><item.icon /></span>
                <span className="nav-btn-label">{item.label}</span>
                {item.badge && page !== item.id && (
                  <span className="nav-btn-badge">{item.badge}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Post CTA */}
      <button className="sidebar-post-btn" onClick={() => navTo('feed')}>
        <MicIcon />
        <span>New Voice Post</span>
      </button>

      {/* Profile footer */}
      <div className="sidebar-profile" onClick={() => navTo('profile')}>
        <Avatar name={ME.name} size="sm" />
        <div className="sidebar-profile-text">
          <div className="sidebar-profile-name">{ME.name}</div>
          <div className="sidebar-profile-handle">@{ME.username}</div>
        </div>
        <span className="sidebar-profile-dots">···</span>
      </div>
    </aside>
  );
}
