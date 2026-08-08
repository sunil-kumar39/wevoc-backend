import { useState } from 'react';
import Avatar from './Avatar';
import { Waveform, LiveBars } from './Waveform';
import { ME } from '../data/mockData';
import { MicIcon, PauseIcon, PlayIcon, SmileIcon } from './Icons';

export default function ComposeBox() {
  const [caption, setCaption] = useState('');
  const [anon, setAnon] = useState(false);
  const [showRec, setShowRec] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const canPost = caption.trim() || recorded;

  return (
    <div className="compose-box">
      <div className="compose-box-head">
        <div>
          <div className="compose-box-title">Create campus voice</div>
          <div className="compose-box-note">Capture your story with text, a quick audio note, or anonymously.</div>
        </div>
        <span className="compose-box-pill">Draft ready</span>
      </div>

      <div className="compose-row">
        <Avatar name={anon ? '?' : ME.name} size="md" />
        <div className="compose-right">
          <textarea
            className="compose-textarea"
            placeholder="What's happening on campus? Add a voice post…"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            rows={caption.length > 80 ? 3 : 2}
          />

          {showRec && (
            <div className="record-strip">
              {recording && <LiveBars />}
              {recorded && !recording && (
                <div className="audio-player" style={{ width: '100%', marginBottom: 0 }}>
                  <button className="play-btn"><PlayIcon /></button>
                  <Waveform bars={22} />
                  <span className="audio-dur">0:08</span>
                </div>
              )}
              <button
                className={`rec-btn${recording ? ' recording' : ''}`}
                onClick={() => {
                  if (recording) { setRecording(false); setRecorded(true); }
                  else { setRecording(true); setRecorded(false); }
                }}
              >
                {recording ? <PauseIcon /> : <MicIcon />}
              </button>
              <span className="rec-hint">
                {recording ? 'Recording… tap to stop' : recorded ? 'Tap to re-record' : 'Tap to record'}
              </span>
            </div>
          )}

          <div className="compose-footer">
            <button
              className="compose-icon-btn"
              title="Record voice"
              onClick={() => setShowRec(r => !r)}
            ><MicIcon /></button>
            <button className="compose-icon-btn" title="Emoji"><SmileIcon /></button>

            <div className="anon-row" style={{ marginLeft: 8 }}>
              <button
                className={`toggle-track${anon ? ' on' : ''}`}
                onClick={() => setAnon(a => !a)}
                aria-label="Toggle anonymous"
              />
              <span className="toggle-text">Anonymous</span>
            </div>

            <button className="compose-post-btn" disabled={!canPost}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
