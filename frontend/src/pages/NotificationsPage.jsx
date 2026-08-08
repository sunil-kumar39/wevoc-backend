import { useState } from 'react';
import { BellIcon, CheckIcon, HeartIcon, ReplyIcon, UsersIcon } from '../components/Icons';
import { NOTIFICATIONS } from '../data/mockData';
import { timeAgo } from '../utils/helpers';

const ICONS = { like: HeartIcon, reply: ReplyIcon, friend_request: UsersIcon, friend_accepted: CheckIcon };
const TEXT = (n) => {
  const name = <strong>{n.from.name}</strong>;
  if (n.type === 'like') return <>{name} liked your post · <em style={{ color: 'var(--ink4)' }}>{n.postPreview}</em></>;
  if (n.type === 'reply') return <>{name} replied to your post · <em style={{ color: 'var(--ink4)' }}>{n.postPreview}</em></>;
  if (n.type === 'friend_request') return <>{name} sent you a friend request</>;
  if (n.type === 'friend_accepted') return <>{name} accepted your friend request</>;
  return null;
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [tab, setTab] = useState('all');

  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  const unreadCount = notifs.filter(n => !n.read).length;
  const shown = tab === 'unread' ? notifs.filter(n => !n.read) : notifs;

  return (
    <div className="page-anim">
      <div className="feed-header notifications-header">
        <div className="feed-header-inner page-title-header">
          <div className="page-top-title notif-page-title">Notifications</div>
        </div>
        <div className="tab-strip page-tab-strip notif-tab-strip">
          <button className={`tab-strip-btn${tab === 'all' ? ' active' : ''}`} onClick={() => setTab('all')}>All</button>
          <button className={`tab-strip-btn${tab === 'unread' ? ' active' : ''}`} onClick={() => setTab('unread')}>
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
      </div>

      <div className="notif-toolbar">
        <span className="notif-summary">
          {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'No unread notifications'}
        </span>
        <button className="btn btn-ghost btn-sm" onClick={markAll} disabled={unreadCount === 0}>
          Mark all read
        </button>
      </div>

      {shown.length === 0 ? (
        <div className="empty-state">
          <div className="empty-ico"><BellIcon /></div>
          <div className="empty-title">All caught up!</div>
          <div className="empty-sub">No new notifications.</div>
        </div>
      ) : (
        shown.map(n => {
          const NotificationIcon = ICONS[n.type];

          return (
            <div key={n._id} className={`notif-item${!n.read ? ' unread' : ''}`}
              onClick={() => setNotifs(ns => ns.map(x => x._id === n._id ? { ...x, read: true } : x))}>
              <div className={`notif-dot${n.read ? ' read' : ''}`} />
              <div className="notif-icon"><NotificationIcon /></div>
              <div className="notif-content">
                <div className="notif-text">{TEXT(n)}</div>
                <div className="notif-time">{timeAgo(n.createdAt)}</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
