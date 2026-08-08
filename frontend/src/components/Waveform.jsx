import { useMemo } from 'react';

export function Waveform({ playing, bars = 30 }) {
  const heights = useMemo(
    () => Array.from({ length: bars }, () => Math.floor(Math.random() * 20) + 5),
    []
  );
  const lit = Math.floor(bars * 0.35);

  return (
    <div className="waveform-wrap">
      {heights.map((h, i) => (
        <div
          key={i}
          className="wv-bar"
          style={{
            width: 3,
            height: h,
            opacity: playing && i < lit ? 1 : 0.25,
            animation: playing
              ? `lv-anim ${0.5 + (i % 5) * 0.12}s ease-in-out ${i * 0.03}s infinite`
              : 'none',
          }}
        />
      ))}
    </div>
  );
}

export function LiveBars({ count = 13 }) {
  return (
    <div className="live-wv">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="lv-bar" style={{ animationDelay: `${i * 0.07}s` }} />
      ))}
    </div>
  );
}
