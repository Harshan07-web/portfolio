import { useEffect, useRef, useState } from "react";
import { apps } from "../data/apps";
import { AppIcon, SearchIcon, WifiIcon, StartIcon, BatteryIcon, BellIcon } from "./Icons";

const BATTERY_TICK_MS = 4 * 60 * 1000; // drain 1% every 4 minutes
const BATTERY_FLOOR = 6; // "recharges" once it hits this
const GITHUB_USER = "Harshan07-web";
const NOTIF_CACHE_KEY = "gh-notifs-cache";
const NOTIF_CACHE_TTL = 15 * 60 * 1000; // 15 min
const NOTIF_SEEN_KEY = "gh-notifs-last-seen";

// Quick-launch shortcuts that always live on the taskbar, like pinned apps
// in a real OS — independent of whatever windows happen to be open.
const PINNED_IDS = ["terminal", "github", "linkedin"];

function CalendarPopup({ date }) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = date.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = date.toLocaleDateString([], { month: "long", year: "numeric" });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="absolute bottom-11 right-0 w-64 bg-white border border-[#DCE1DB] rounded-lg shadow-lg overflow-hidden">
      <div className="px-3 py-2 text-xs text-[#2E332F] border-b border-[#DCE1DB]">
        {monthName}
      </div>
      <div className="grid grid-cols-7 gap-y-1 px-2 py-2 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="text-[10px] text-[#9AA098]">{d}</span>
        ))}
        {cells.map((d, i) => (
          <span
            key={i}
            className={`text-[11px] py-1 rounded-full ${
              d === today
                ? "bg-[#5B8266] text-white"
                : d
                ? "text-[#3E453F]"
                : ""
            }`}
          >
            {d || ""}
          </span>
        ))}
      </div>
    </div>
  );
}

function NotificationPanel({ notifications, loading }) {
  return (
    <div className="fixed top-0 right-0 bottom-10 w-80 bg-white border-l border-[#DCE1DB] shadow-lg z-[150] flex flex-col">
      <div className="px-4 py-3 border-b border-[#DCE1DB] text-xs tracking-wide text-[#2E332F]">
        Notifications
      </div>
      <div className="flex-1 overflow-auto">
        {loading && (
          <div className="px-4 py-3 text-xs text-[#9AA098]">Loading...</div>
        )}
        {!loading && notifications.length === 0 && (
          <div className="px-4 py-3 text-xs text-[#9AA098]">No recent activity</div>
        )}
        {notifications.map((n, i) => (
          <a
            key={i}
            href={n.url}
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-3 border-b border-[#EEF1EC] hover:bg-[#EEF1EC] transition-colors"
          >
            <div className="text-xs text-[#2E332F]">{n.message}</div>
            <div className="mt-1 text-[10px] text-[#9AA098]">
              {n.repo} · {n.relTime}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function relativeTime(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Taskbar({ openWindows, onIconClick, onSearchOpen, onCloseWindow, onOpenApp }) {
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState(87);
  const [startOpen, setStartOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [hasUnseen, setHasUnseen] = useState(false);
  const menuRef = useRef(null);
  const calendarRef = useRef(null);
  const notifRef = useRef(null);

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

  useEffect(() => {
    if (!calendarOpen) return;
    const onClick = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [calendarOpen]);

  useEffect(() => {
    if (!notifOpen) return;
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [notifOpen]);

  const loadNotifications = async () => {
    try {
      const cached = JSON.parse(localStorage.getItem(NOTIF_CACHE_KEY) || "null");
      if (cached && Date.now() - cached.fetchedAt < NOTIF_CACHE_TTL) {
        setNotifications(cached.items);
        return cached.items;
      }
    } catch {
      // ignore bad cache
    }

    setNotifLoading(true);
    try {
      const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public`);
      const events = await res.json();
      const items = (Array.isArray(events) ? events : [])
        .filter((e) => e.type === "PushEvent")
        .flatMap((e) =>
          (e.payload?.commits || []).map((c) => ({
            message: c.message.split("\n")[0],
            repo: e.repo.name.replace(`${GITHUB_USER}/`, ""),
            url: `https://github.com/${e.repo.name}/commit/${c.sha}`,
            date: e.created_at,
            relTime: relativeTime(e.created_at),
          }))
        )
        .slice(0, 20);
      setNotifications(items);
      localStorage.setItem(
        NOTIF_CACHE_KEY,
        JSON.stringify({ fetchedAt: Date.now(), items })
      );
      return items;
    } catch {
      return [];
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications().then((items) => {
      const lastSeen = localStorage.getItem(NOTIF_SEEN_KEY);
      const latest = items?.[0]?.date;
      if (latest && latest !== lastSeen) setHasUnseen(true);
    });
  }, []);

  const toggleNotifications = () => {
    setNotifOpen((open) => {
      const next = !open;
      if (next) {
        setHasUnseen(false);
        if (notifications[0]) {
          localStorage.setItem(NOTIF_SEEN_KEY, notifications[0].date);
        }
        loadNotifications();
      }
      return next;
    });
  };

  return (
    <>
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

      <div className="flex items-center gap-3 text-[#6E766F] text-xs relative">
        <span title="Wi-Fi connected">
          <WifiIcon className="w-3.5 h-3.5" />
        </span>
        <span title={`Battery: ${battery}%`} className="flex items-center gap-1">
          <BatteryIcon level={battery} className="w-4 h-4" />
          {battery}%
        </span>

        <div ref={calendarRef} className="relative">
          <button
            onClick={() => setCalendarOpen((o) => !o)}
            className="flex flex-col items-end leading-tight rounded-md px-1.5 py-0.5 hover:bg-[#EEF1EC] transition-colors"
          >
            <span>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            <span className="text-[10px] text-[#9AA098]">
              {time.toLocaleDateString([], { month: "2-digit", day: "2-digit", year: "numeric" })}
            </span>
          </button>
          {calendarOpen && <CalendarPopup date={time} />}
        </div>

        <button
          onClick={toggleNotifications}
          className="relative flex items-center justify-center w-7 h-7 rounded-md hover:bg-[#EEF1EC] transition-colors"
          aria-label="Notifications"
        >
          <BellIcon className="w-3.5 h-3.5" />
          {hasUnseen && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#C96A5A]" />
          )}
        </button>
      </div>
    </div>

    {notifOpen && (
      <div ref={notifRef}>
        <NotificationPanel notifications={notifications} loading={notifLoading} />
      </div>
    )}
    </>
  );
}