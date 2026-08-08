import { useState } from 'react';
import Avatar from '../components/Avatar';
import { useApp } from '../context/AppContext';
import { ME, USERS } from '../data/mockData';

export default function FriendsPage() {
  const { navigate } = useApp();
  const [tab, setTab] = useState('requests');

  const [requests, setRequests] = useState(
    USERS.filter(u => ME.friendRequests.includes(u._id))
  );
  const [friends, setFriends] = useState(
    USERS.filter(u => ME.friends.includes(u._id))
  );
  const [loading, setLoading] = useState(null);

  const act = (fn, id) => {
    setLoading(id);
    setTimeout(() => { fn(); setLoading(null); }, 300);
  };

  const accept = (u) => act(() => {
    setRequests(r => r.filter(x => x._id !== u._id));
    setFriends(f => [...f, u]);
  }, u._id);

  const reject = (u) => act(() => {
    setRequests(r => r.filter(x => x._id !== u._id));
  }, u._id);

  const unfriend = (u) => act(() => {
    setFriends(f => f.filter(x => x._id !== u._id));
  }, u._id);

  return (
    <div className="page-anim">
      <div className="feed-header friends-header">
        <div className="feed-header-inner page-title-header">
          <div className="page-top-title friends-page-title">Friends</div>
        </div>
        <div className="tab-strip page-tab-strip">
          <button className={`tab-strip-btn${tab === 'requests' ? ' active' : ''}`} onClick={() => setTab('requests')}>
            Requests {requests.length > 0 && <span style={{ marginLeft: 4, background: 'var(--crimson)', color: '#fff', borderRadius: 99, padding: '1px 7px', fontSize: 12 }}>{requests.length}</span>}
          </button>
          <button className={`tab-strip-btn${tab === 'friends' ? ' active' : ''}`} onClick={() => setTab('friends')}>
            My Friends ({friends.length})
          </button>
        </div>
      </div>

      {tab === 'requests' && (
        requests.length === 0
          ? <div className="empty-state"><div className="empty-ico">🤝</div><div className="empty-title">No pending requests</div><div className="empty-sub">When someone adds you, it'll show here.</div></div>
          : requests.map(u => (
            <div key={u._id} className="friend-row">
              <Avatar name={u.name} size="md" onClick={() => navigate('user', u)} />
              <div className="friend-info">
                <div className="friend-name" onClick={() => navigate('user', u)}>{u.name}</div>
                <div className="friend-college">{u.college}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" disabled={loading === u._id} onClick={() => accept(u)}>
                  {loading === u._id ? '…' : 'Accept'}
                </button>
                <button className="btn btn-ghost btn-sm" disabled={loading === u._id} onClick={() => reject(u)}>
                  Reject
                </button>
              </div>
            </div>
          ))
      )}

      {tab === 'friends' && (
        friends.length === 0
          ? <div className="empty-state"><div className="empty-ico">👥</div><div className="empty-title">No friends yet</div><div className="empty-sub">Connect with people in the feed.</div></div>
          : friends.map(u => (
            <div key={u._id} className="friend-row">
              <Avatar name={u.name} size="md" onClick={() => navigate('user', u)} />
              <div className="friend-info">
                <div className="friend-name" onClick={() => navigate('user', u)}>{u.name}</div>
                <div className="friend-college">{u.college}</div>
              </div>
              <button className="btn btn-danger btn-sm" disabled={loading === u._id} onClick={() => unfriend(u)}>
                {loading === u._id ? '…' : 'Unfriend'}
              </button>
            </div>
          ))
      )}
    </div>
  );
}
