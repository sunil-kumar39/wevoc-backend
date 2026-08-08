import { useState } from 'react';
import Avatar from './Avatar';
import { Waveform, LiveBars } from './Waveform';
import { BookmarkIcon, HeartIcon, HeartOutlineIcon, MicIcon, PauseIcon, PlayIcon, ProfileIcon, ReplyIcon, ShareIcon, FlameIcon } from './Icons';
import { useApp } from '../context/AppContext';
import { timeAgo } from '../utils/helpers';

export default function PostCard({ post, style, className = '' }) {
  const { navigate, bookmarks, toggleBookmark } = useApp();
  const [liked, setLiked] = useState(post.likes.includes('me123'));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [playing, setPlaying] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const isAnon = post.isAnonymous;
  const author = isAnon ? null : post.user;
  const displayName = isAnon ? null : author?.name;
  const displayHandle = isAnon ? null : `@${author?.username}`;
  const isBkd = bookmarks.includes(post._id);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(l => { setLikeCount(c => l ? c - 1 : c + 1); return !l; });
  };
  const handlePlay = (e) => { e.stopPropagation(); setPlaying(p => !p); };
  const handleReply = (e) => { e.stopPropagation(); setShowReply(r => !r); };
  const handleBk = (e) => { e.stopPropagation(); toggleBookmark(post._id); };
  const handleRecord = (e) => {
    e.stopPropagation();
    if (recording) { setRecording(false); setRecorded(true); }
    else { setRecording(true); setRecorded(false); }
  };
  const goUser = (e) => { e.stopPropagation(); if (!isAnon) navigate('user', post.user); };

  return (
    <article className={`post-card${className ? ` ${className}` : ''}`} style={style}>
      {/* Avatar col */}
      <div className="post-avatar-col">
        <Avatar
          name={isAnon ? '?' : displayName}
          size="md"
          onClick={isAnon ? undefined : goUser}
        />
      </div>

      {/* Body col */}
      <div className="post-body-col">
        {/* Header */}
        <div className="post-header">
          <div className="post-meta">
            {isAnon ? (
              <span className="anon-pill"><ProfileIcon /> Anonymous</span>
            ) : (
              <>
                <span className="post-name" onClick={goUser}>{displayName}</span>
                <span className="post-handle">{displayHandle}</span>
                <span className="post-sep">·</span>
              </>
            )}
            <span className="post-time">{timeAgo(post.createdAt)}</span>
          </div>
          <button className="post-more-btn" onClick={e => e.stopPropagation()}>···</button>
        </div>

        {/* Caption */}
        {post.caption && <p className="post-text">{post.caption}</p>}

        {/* Audio player */}
        <div className="audio-player">
          <button className="play-btn" onClick={handlePlay}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <Waveform playing={playing} />
          <span className="audio-dur">{post.duration}</span>
        </div>

        {/* Actions */}
        <div className="post-actions">
          <button className="act-btn act-reply" onClick={handleReply}>
            <span className="act-ico"><ReplyIcon /></span>
            <span className="act-num">{post.replyCount}</span>
          </button>
          <button className={`act-btn${liked ? ' liked' : ''}`} onClick={handleLike}>
            <span className="act-ico">{liked ? <HeartIcon /> : <HeartOutlineIcon />}</span>
            <span className="act-num">{likeCount}</span>
          </button>
          <button className={`act-btn${isBkd ? ' liked' : ''}`} onClick={handleBk}>
            <span className="act-ico"><BookmarkIcon /></span>
          </button>
          <button className="act-btn act-share" onClick={e => e.stopPropagation()}>
            <span className="act-ico"><ShareIcon /></span>
          </button>
          <div className="score-badge"><FlameIcon /> {post.score}</div>
        </div>

        {/* Reply box */}
        {showReply && (
          <div style={{ marginTop: 12 }}>
            <div className="record-strip">
              {recording && <LiveBars />}
              {recorded && !recording && (
                <div className="audio-player" style={{ width: '100%', marginBottom: 0 }}>
                  <button className="play-btn"><PlayIcon /></button>
                  <Waveform bars={20} />
                  <span className="audio-dur">0:06</span>
                </div>
              )}
              <button className={`rec-btn${recording ? ' recording' : ''}`} onClick={handleRecord}>
                {recording ? <PauseIcon /> : <MicIcon />}
              </button>
              <span className="rec-hint">
                {recording ? 'Recording… tap to stop' : recorded ? 'Re-record or send below' : 'Tap to record a voice reply'}
              </span>
            </div>
            {recorded && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={e => e.stopPropagation()}>
                  Send Reply
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
