export function timeAgo(dateStr) {
  const s = (Date.now() - new Date(dateStr)) / 1000;
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export function fmtDate(dateStr, opts = {}) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'long', year: 'numeric', ...opts
  });
}
