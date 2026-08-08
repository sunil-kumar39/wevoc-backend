import React from 'react';

function Icon({ className = '', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
      {...props}
    >
      {props.children}
    </svg>
  );
}

export const HomeIcon = (props) => (
  <Icon {...props}>
    <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5Z" />
  </Icon>
);

export const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6" />
    <line x1="17" y1="17" x2="21" y2="21" />
  </Icon>
);

export const BellIcon = (props) => (
  <Icon {...props}>
    <path d="M18 8a6 6 0 0 0-12 0c0 3.4-1 4.6-2 5.5h16c-1-0.9-2-2.1-2-5.5" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Icon>
);

export const MessageIcon = (props) => (
  <Icon {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Icon>
);

export const UsersIcon = (props) => (
  <Icon {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);

export const BookmarkIcon = (props) => (
  <Icon {...props}>
    <path d="M6 4h12v16l-6-4-6 4V4Z" />
  </Icon>
);

export const ProfileIcon = (props) => (
  <Icon {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
);

export const MicIcon = (props) => (
  <Icon {...props}>
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
    <path d="M19 10a7 7 0 0 1-14 0" />
    <path d="M12 19v3" />
    <path d="M8 22h8" />
  </Icon>
);

export const SmileIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8" />
    <path d="M8 14c1.333 2 3.333 2 4 2s2.667 0 4-2" />
    <path d="M9 10h.01" />
    <path d="M15 10h.01" />
  </Icon>
);

export const ReplyIcon = (props) => (
  <Icon {...props}>
    <path d="M10 14L5 9l5-5" />
    <path d="M5 9h9a7 7 0 0 1 7 7v1" />
  </Icon>
);

export const ShareIcon = (props) => (
  <Icon {...props}>
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
    <path d="M16 6l4 4-4 4" />
    <path d="M20 10H9" />
  </Icon>
);

export const HeartIcon = (props) => (
  <Icon {...props} fill="var(--crimson)" stroke="var(--crimson)" strokeWidth="1.4">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </Icon>
);

export const HeartOutlineIcon = (props) => (
  <Icon {...props} fill="#fff" stroke="#111" strokeWidth="1.4">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </Icon>
);

export const FlameIcon = (props) => (
  <Icon {...props}>
    <path d="M12 22s-4-4.5-4-8a4 4 0 0 1 8 0c0 3.5-4 8-4 8Z" />
    <path d="M12 2s6 4 6 9a6 6 0 0 1-12 0c0-5 6-9 6-9Z" />
  </Icon>
);

export const CheckIcon = (props) => (
  <Icon {...props}>
    <polyline points="20 6 9 17 4 12" />
  </Icon>
);

export const PencilIcon = (props) => (
  <Icon {...props}>
    <path d="m12 20 8-8-6-6-8 8v6h6Z" />
    <path d="M15.5 4.5 18.5 7.5" />
  </Icon>
);

export const PlayIcon = (props) => (
  <Icon {...props}>
    <path d="m8 5 11 7-11 7V5Z" fill="currentColor" stroke="none" />
  </Icon>
);

export const PauseIcon = (props) => (
  <Icon {...props}>
    <rect x="7" y="5" width="3" height="14" rx="1" />
    <rect x="14" y="5" width="3" height="14" rx="1" />
  </Icon>
);

export const MusicNoteIcon = (props) => (
  <Icon {...props}>
    <path d="M9 18V6l10-2v12" />
    <circle cx="7" cy="18" r="3" />
    <circle cx="17" cy="16" r="3" />
  </Icon>
);

export const CalendarIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M3 11h18" />
  </Icon>
);

export const GraduationCapIcon = (props) => (
  <Icon {...props}>
    <path d="M12 2 2 7l10 5 10-5-10-5Z" />
    <path d="M6 12.5v4.5c0 1.5 2 3 6 3s6-1.5 6-3v-4.5" />
    <path d="M12 7v8" />
  </Icon>
);

export const TrophyIcon = (props) => (
  <Icon {...props}>
    <path d="M6 3h12v5c0 3-2 5-4 5H10c-2 0-4-2-4-5V3Z" />
    <path d="M8 14h8v3H8v-3Z" />
    <path d="M9 20h6" />
  </Icon>
);

export const CircleIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8" />
  </Icon>
);

export const CommunityIcon = (props) => (
  <Icon {...props}>
    <circle cx="8" cy="9" r="3" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h2" />
    <path d="M16 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
    <path d="M13 21v-2a4 4 0 0 0-4-4h-1" />
  </Icon>
);

export const EmptyBellIcon = (props) => (
  <Icon {...props}>
    <path d="M12 2a6 6 0 0 0-6 6v4s-1 2-1 3h14c0-1-1-3-1-3V8a6 6 0 0 0-6-6Z" />
    <path d="M8 22h8" />
  </Icon>
);

export const MoonIcon = (props) => (
  <Icon {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Icon>
);

export const SunIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </Icon>
);
