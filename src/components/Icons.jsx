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

    default:
      return (
        <svg viewBox="0 0 24 24" {...base} className={className}>
          <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
          <path d="M3.5 8.5h17" />
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