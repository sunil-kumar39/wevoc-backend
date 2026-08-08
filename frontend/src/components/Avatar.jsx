export default function Avatar({ name, size = 'md', onClick }) {
  const letter = name ? name[0].toUpperCase() : '?';
  const cls = `avatar av-${size}${onClick ? ' clickable' : ''}`;
  return (
    <div className={cls} onClick={onClick} role={onClick ? 'button' : undefined}>
      {letter}
    </div>
  );
}
