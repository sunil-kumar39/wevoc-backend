import { useState } from 'react';
import Avatar from '../components/Avatar';
import { Waveform, LiveBars } from '../components/Waveform';
import { SearchIcon } from '../components/Icons';
import { DMS } from '../data/mockData';
import { timeAgo } from '../utils/helpers';

export default function DmsPage() {
  const [threads, setThreads] = useState(DMS);
  const [active, setActive] = useState(null);
  const [search, setSearch] = useState('');

  if (active) {
    return (
      <ChatView
        thread={active}
        onBack={() => {
          setActive(null);
          setThreads(t => t.map(x => x._id === active._id ? { ...x, unread: 0 } : x));
        }}
      />
    );
  }

  const shownThreads = threads.filter(t =>
    t.with.name.toLowerCase().includes(search.toLowerCase()) ||
    t.with.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-anim">
      <div className="feed-header dm-header">
        <div className="feed-header-inner">
          <div className="rp-search header-search dm-search">
            <span className="rp-search-icon"><SearchIcon /></span>
            <input
              placeholder="Search messages"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {shownThreads.map(t => (
        <div key={t._id} className="dm-thread" onClick={() => setActive(t)}>
          <Avatar name={t.with.name} size="md" />
          <div className="dm-info">
            <div className="dm-name">{t.with.name}</div>
            <div className="dm-preview">Voice message</div>
          </div>
          <div className="dm-meta">
            <span className="dm-time">{timeAgo(t.messages.at(-1).time)}</span>
            {t.unread > 0 && <span className="dm-unread-badge">{t.unread}</span>}
          </div>
        </div>
      ))}

      <div className="section-lbl dm-friends-heading">Friends</div>
      <div className="dm-friends-strip">
        {['Priya Mehta', 'Rahul Gupta', 'Dev Malhotra', 'Sneha Patel', 'Karan Verma'].map(n => (
          <div key={n} className="dm-friend-chip">
            <Avatar name={n} size="md" />
            <span className="dm-friend-name">
              {n.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatView({ thread, onBack }) {
  const [recording, setRecording] = useState(false);
  const [msgs, setMsgs] = useState(thread.messages);

  const send = () => {
    if (!recording) return;
    setRecording(false);
    setMsgs(m => [...m, { id: 'new-' + Date.now(), from: 'me123', duration: '0:05', time: new Date().toISOString() }]);
  };

  return (
    <div className="chat-view">
      <div className="feed-header">
        <div className="chat-topbar">
          <button className="back-btn" onClick={onBack}>Back</button>
          <Avatar name={thread.with.name} size="sm" />
          <div className="chat-topbar-info">
            <div className="chat-topbar-name">{thread.with.name}</div>
            <div className="chat-topbar-sub">@{thread.with.username}</div>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {msgs.map(m => {
          const mine = m.from === 'me123';
          return (
            <div key={m.id} className={`msg-row${mine ? ' mine' : ''}`}>
              {!mine && <Avatar name={thread.with.name} size="xs" />}
              <div className="msg-bubble">
                <span style={{ fontSize: 16 }}>Audio</span>
                <div>
                  <Waveform bars={14} />
                  <span style={{ fontSize: 12, opacity: 0.75 }}>{m.duration}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-input-bar">
        {recording && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <LiveBars count={10} />
            <span style={{ fontSize: 13, color: 'var(--crimson)', fontWeight: 600 }}>Recording...</span>
          </div>
        )}
        {!recording && <span style={{ flex: 1, fontSize: 14, color: 'var(--ink4)' }}>Hold to record a voice message</span>}
        <button
          className={`rec-btn${recording ? ' recording' : ''}`}
          style={{ width: 44, height: 44, fontSize: 20 }}
          onMouseDown={() => setRecording(true)}
          onMouseUp={send}
          onTouchStart={() => setRecording(true)}
          onTouchEnd={send}
        >
          Mic
        </button>
      </div>
    </div>
  );
}
