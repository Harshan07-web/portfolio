// Minimal line-art icon set — replaces emoji icons across the desktop/taskbar.
// Single color, currentColor-driven so they inherit text color via className.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function AppIcon({ id, className = "w-7 h-7" }) {
  switch (id) {
    case "about":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <circle cx="12" cy="8" r="3.4" />
          <path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6" />
        </svg>
      );

    case "projects":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <path d="M3 7.5h6l1.5 2H21V18a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18z" />
        </svg>
      );

    case "resume":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <path d="M6.5 3h8L19 6.5V20a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M14 3v3.5a1 1 0 0 0 1 1H19" />
          <path d="M8.5 12h7M8.5 15h7M8.5 9h3" />
        </svg>
      );

    case "contact":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
          <path d="M4 6.5l8 6.5 8-6.5" />
        </svg>
      );

    case "terminal":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <rect x="3" y="4.5" width="18" height="15" rx="1.5" />
          <path d="M6.5 9.5l3.2 3-3.2 3" />
          <path d="M12 15.5h5.5" />
        </svg>
      );

    case "github":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <path d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.62-.2.62-.43v-1.66c-2.53.55-3.06-1.1-3.06-1.1-.41-1.05-1-1.33-1-1.33-.83-.57.06-.56.06-.56.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.62.75.08-.58.32-.98.57-1.2-2.02-.23-4.15-1.01-4.15-4.5 0-1 .35-1.8.93-2.44-.1-.23-.4-1.16.09-2.42 0 0 .76-.24 2.5.93a8.6 8.6 0 0 1 4.55 0c1.73-1.17 2.5-.93 2.5-.93.48 1.26.18 2.19.09 2.42.58.64.93 1.45.93 2.44 0 3.5-2.13 4.27-4.16 4.5.33.28.62.85.62 1.7v2.53c0 .24.16.51.63.43A9 9 0 0 0 12 3z" />
        </svg>
      );

    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
          <path d="M8 10.2V17M8 7.3v.05" />
          <path d="M12 17v-4.2c0-1.4 1-2.3 2.2-2.3s2 .9 2 2.3V17" />
        </svg>
      );

    case "settings":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );

    case "browser":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );

    case "trash":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      );

    case "music":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );

    case "certificates":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <circle cx="12" cy="10" r="4" />
          <polyline points="10 13.5 9 20 12 18 15 20 14 13.5" />
        </svg>
      );

    case "hackathons":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );

    case "gssoc":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <circle cx="18" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="6" r="3" />
          <path d="M18 9v6" />
          <path d="M9 6h6" />
          <path d="M6 9v2c0 2.2 1.8 4 4 4h5" />
        </svg>
      );

    case "activities":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21v-2a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v2" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
          <path d="M3.5 8.5h17" />
        </svg>
      );
  }
}

// Activity-feed icons — same line-art language as AppIcon, used for
// notification rows instead of emoji.
export function NotificationIcon({ type, className = "w-4 h-4" }) {
  switch (type) {
    case "push":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <line x1="3" y1="12" x2="8" y2="12" />
          <circle cx="12" cy="12" r="3" />
          <line x1="16" y1="12" x2="21" y2="12" />
        </svg>
      );

    case "merge":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <circle cx="6" cy="6" r="2.2" />
          <circle cx="6" cy="18" r="2.2" />
          <circle cx="18" cy="6" r="2.2" />
          <path d="M6 8.2V18" />
          <path d="M18 8.2c0 5-6 5-6 8" />
        </svg>
      );

    case "create-repo":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <path d="M3.5 7.5a1.5 1.5 0 0 1 1.5-1.5h4l1.8 2h8.2a1.5 1.5 0 0 1 1.5 1.5V17a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3.5 17z" />
          <line x1="12" y1="10.8" x2="12" y2="15.2" />
          <line x1="9.8" y1="13" x2="14.2" y2="13" />
        </svg>
      );

    case "branch":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <circle cx="6" cy="6" r="2.2" />
          <circle cx="6" cy="18" r="2.2" />
          <circle cx="18" cy="9" r="2.2" />
          <path d="M6 8.2V18" />
          <path d="M6 12c0 2.5 2.3 2.5 5 2.5h4.3" />
        </svg>
      );

    case "fork":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <circle cx="7" cy="6" r="2.2" />
          <circle cx="17" cy="6" r="2.2" />
          <circle cx="12" cy="18" r="2.2" />
          <path d="M7 8.2v2a4 4 0 0 0 4 4" />
          <path d="M17 8.2v2a4 4 0 0 1-4 4" />
        </svg>
      );

    case "review":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M8.3 12.3l2.4 2.4 4.8-5.2" />
        </svg>
      );

    case "issue":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <circle cx="12" cy="12" r="8.5" />
          <line x1="12" y1="7.8" x2="12" y2="13" />
          <circle cx="12" cy="16.2" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );

    case "comment":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <path d="M4 5.5h16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9l-4 3.5V16H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1z" />
        </svg>
      );

    case "star":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <polygon points="12 3.5 14.6 9.6 21.3 10.2 16.2 14.5 17.8 21 12 17.4 6.2 21 7.8 14.5 2.7 10.2 9.4 9.6 12 3.5" />
        </svg>
      );

    case "release":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <path d="M11 3.5H5.5a1 1 0 0 0-1 1V10c0 .3.1.5.3.7l8.5 8.5c.4.4 1 .4 1.4 0l6-6c.4-.4.4-1 0-1.4L12.2 3.8a1 1 0 0 0-.7-.3z" />
          <circle cx="8.3" cy="8.3" r="1" fill="currentColor" stroke="none" />
        </svg>
      );

    case "leetcode":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <polygon points="12 3 21 12 12 21 3 12" />
        </svg>
      );

    case "neetcode":
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <circle cx="6" cy="7" r="2" />
          <circle cx="18" cy="7" r="2" />
          <circle cx="12" cy="17" r="2" />
          <path d="M7.7 8.3L10.5 15.3" />
          <path d="M16.3 8.3L13.5 15.3" />
          <path d="M8 7h8" />
        </svg>
      );

    default:
      // Generic GitHub mark — used as a fallback for any push/repo event.
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <path d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.62-.2.62-.43v-1.66c-2.53.55-3.06-1.1-3.06-1.1-.41-1.05-1-1.33-1-1.33-.83-.57.06-.56.06-.56.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.62.75.08-.58.32-.98.57-1.2-2.02-.23-4.15-1.01-4.15-4.5 0-1 .35-1.8.93-2.44-.1-.23-.4-1.16.09-2.42 0 0 .76-.24 2.5.93a8.6 8.6 0 0 1 4.55 0c1.73-1.17 2.5-.93 2.5-.93.48 1.26.18 2.19.09 2.42.58.64.93 1.45.93 2.44 0 3.5-2.13 4.27-4.16 4.5.33.28.62.85.62 1.7v2.53c0 .24.16.51.63.43A9 9 0 0 0 12 3z" />
        </svg>
      );
  }
}

export function SearchIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" {...base} className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M19 19l-4-4" />
    </svg>
  );
}

export function WifiIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" {...base} className={className}>
      <path d="M4 8.5a12 12 0 0 1 16 0" />
      <path d="M7 12a8 8 0 0 1 10 0" />
      <path d="M10 15.5a4 4 0 0 1 4 0" />
      <circle cx="12" cy="19" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function StartIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" {...base} className={className}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1" />
    </svg>
  );
}

export function BellIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" {...base} className={className}>
      <path d="M6 10.5a6 6 0 0 1 12 0c0 3.2 1 4.8 1.6 5.5H4.4C5 15.3 6 13.7 6 10.5z" />
      <path d="M10.3 19a1.8 1.8 0 0 0 3.4 0" />
    </svg>
  );
}

// Battery renders its own fill level, so it isn't purely stroke-based.
export function BatteryIcon({ level = 100, className = "w-4 h-4" }) {
  const w = Math.max(0, Math.min(100, level)) / 100 * 13;
  const low = level <= 20;
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <rect x="2" y="7" width="18" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <rect x="21" y="10" width="1.8" height="4" rx="0.6" fill="currentColor" />
      <rect x="4" y="9" width={w} height="6" rx="0.8" fill={low ? "#C96A5A" : "currentColor"} />
    </svg>
  );
}