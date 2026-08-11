import { useEffect, useRef, useState } from "react";
import { apps } from "../data/apps";
import { AppIcon, SearchIcon, WifiIcon, StartIcon, BatteryIcon } from "./Icons";

const BATTERY_TICK_MS = 4 * 60 * 1000; // drain 1% every 4 minutes
const BATTERY_FLOOR = 6; // "recharges" once it hits this

// Quick-launch shortcuts that always live on the taskbar, like pinned apps
// in a real OS — independent of whatever windows happen to be open.
const PINNED_IDS = ["terminal", "github", "linkedin"];

export default function Taskbar({ openWindows, onIconClick, onSearchOpen, onCloseWindow, onOpenApp }) {
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState(87);
  const [startOpen, setStartOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const b = setInterval(() => {
      setBattery((prev) => (prev <= BATTERY_FLOOR ? 100 : prev - 1));
    }, BATTERY_TICK_MS);
    return () => clearInterval(b);
  }, []);

  useEffect(() => {
    if (!startOpen) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setStartOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [startOpen]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 bg-white border-t border-[#DCE1DB] flex items-center justify-between px-3 z-50">
      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => setStartOpen((s) => !s)}
          className={`flex items-center justify-center w-7 h-7 rounded-md border transition-colors ${
            startOpen
              ? "border-[#5B8266] text-[#5B8266] bg-[#5B8266]/10"
              : "border-[#DCE1DB] text-[#3E453F] hover:border-[#5B8266] hover:text-[#5B8266]"
          }`}
          aria-label="Start menu"
        >
          <StartIcon className="w-3.5 h-3.5" />
        </button>

        {startOpen && (
          <div
            ref={menuRef}
            className="absolute bottom-11 left-0 w-60 bg-white border border-[#DCE1DB] rounded-lg shadow-lg overflow-hidden"
          >
            <div className="px-3 py-2 text-[11px] tracking-wide text-[#9AA098] border-b border-[#DCE1DB]">
              Applications
            </div>
            <div className="max-h-72 overflow-auto py-1">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    onOpenApp?.(app);
                    setStartOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs text-[#2E332F] hover:bg-[#EEF1EC]"
                >
                  <AppIcon id={app.id} className="w-4 h-4 text-[#5B8266]" />
                  <span>{app.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onSearchOpen}
          className="text-xs px-3 py-1 rounded-md border border-[#DCE1DB] text-[#3E453F] hover:border-[#5B8266] hover:text-[#5B8266] flex items-center gap-1.5 transition-colors"
        >
          <SearchIcon className="w-3 h-3" />
          Search
        </button>

        <div className="w-px h-5 bg-[#DCE1DB] mx-0.5" />

        {/* Pinned quick-launch icons — always present, like taskbar pins */}
        {PINNED_IDS.map((id) => {
          const app = apps.find((a) => a.id === id);
          if (!app) return null;
          const isOpen = openWindows.some((w) => w.id === id);
          return (
            <button
              key={`pinned-${id}`}
              onClick={() => onOpenApp?.(app)}
              title={app.title}
              aria-label={app.title}
              className={`relative flex items-center justify-center w-7 h-7 rounded-md border transition-colors ${
                isOpen
                  ? "border-[#5B8266]/50 text-[#5B8266] bg-[#5B8266]/10"
                  : "border-[#DCE1DB] text-[#3E453F] hover:border-[#5B8266] hover:text-[#5B8266]"
              }`}
            >
              <AppIcon id={app.id} className="w-3.5 h-3.5" />
              {isOpen && (
                <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#5B8266]" />
              )}
            </button>
          );
        })}

        {openWindows.map((w) => {
          const app = apps.find((a) => a.id === w.id);
          if (!app) return null;
          return (
            <div
              key={w.id}
              className={`flex items-center gap-1.5 text-xs pl-2.5 pr-1 py-1 rounded-md border ${
                w.minimized
                  ? "border-[#DCE1DB] text-[#9AA098]"
                  : "border-[#5B8266]/50 text-[#2E332F] bg-[#5B8266]/10"
              }`}
            >
              <button onClick={() => onIconClick(w.id)} className="flex items-center gap-1.5">
                <AppIcon id={app.id} className="w-3.5 h-3.5" />
                {app.title}
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
        <span title="Wi-Fi connected">
          <WifiIcon className="w-3.5 h-3.5" />
        </span>
        <span title={`Battery: ${battery}%`} className="flex items-center gap-1">
          <BatteryIcon level={battery} className="w-4 h-4" />
          {battery}%
        </span>
        <span>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  );
}