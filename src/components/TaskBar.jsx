import { useEffect, useState } from "react";
import { apps } from "../data/apps";

export default function Taskbar({ openWindows, onIconClick, onSearchOpen, onCloseWindow }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 bg-white border-t border-[#DCE1DB] flex items-center justify-between px-3 z-50">
      <div className="flex items-center gap-2">
        <button
          onClick={onSearchOpen}
          className="text-xs px-3 py-1 rounded-md border border-[#DCE1DB] text-[#3E453F] hover:border-[#5B8266] hover:text-[#5B8266] flex items-center gap-1 transition-colors"
        >
          🔍 Search
        </button>

        {openWindows.map((w) => {
          const app = apps.find((a) => a.id === w.id);
          if (!app) return null;
          return (
            <div
              key={w.id}
              className={`flex items-center gap-1 text-xs pl-3 pr-1 py-1 rounded-md border ${
                w.minimized
                  ? "border-[#DCE1DB] text-[#9AA098]"
                  : "border-[#5B8266]/50 text-[#2E332F] bg-[#5B8266]/10"
              }`}
            >
              <button onClick={() => onIconClick(w.id)}>
                {app.icon} {app.title}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseWindow(w.id);
                }}
                className="ml-1 px-1 rounded text-[#8A8F87] hover:text-white hover:bg-[#C96A5A]"
                aria-label={`Close ${app.title}`}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 text-[#6E766F] text-xs">
        <span title="Wi-Fi connected">📶</span>
        <span title="Battery: 87%">🔋 87%</span>
        <span>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  );
}