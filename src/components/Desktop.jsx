import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apps } from "../Data/apps";
import Window from "./Window";
import Taskbar from "./TaskBar";
import WindowContent from "./WindowContent";
import SearchOverlay from "./SearchOverlay";
import Wallpaper from "./Wallpaper";
import IntroOverlay from "./IntroOverlay";
import { AppIcon } from "./Icons";

let zCounter = 10;

const ICON_W = 76;
const ICON_H = 76;
const DRAG_THRESHOLD = 4;
const INTRO_SEEN_KEY = "harshanos_intro_seen_v1";

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [introDone, setIntroDone] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(INTRO_SEEN_KEY) === "1"
  );

  // Splits icons between left and right edges on initial load — two columns
  // hugging the left edge, one column hugging the right edge.
  const [iconPos, setIconPos] = useState(() => {
    const pos = {};
    const rightAlignIds = ["settings", "browser", "music", "trash", "certificates", "hackathons", "gssoc", "activities"];
    let leftIdx = 0;
    let rightIdx = 0;

    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;

    apps.forEach((app) => {
      if (rightAlignIds.includes(app.id)) {
        pos[app.id] = { top: 24 + rightIdx * ICON_H, left: vw - ICON_W - 24 };
        rightIdx++;
      } else {
        const col = leftIdx % 2;
        const row = Math.floor(leftIdx / 2);
        pos[app.id] = { top: 24 + row * ICON_H, left: 24 + col * ICON_W };
        leftIdx++;
      }
    });
    return pos;
  });

  const handleIntroDone = () => {
    try {
      localStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // ignore (e.g. private browsing storage restrictions)
    }
    setIntroDone(true);
  };

  const dragInfo = useRef(null);

  const openApp = (app) => {
    if (app.type === "link") {
      window.open(app.url, "_blank");
      return;
    }
    setOpenWindows((prev) => {
      const existing = prev.find((w) => w.id === app.id);
      if (existing) {
        zCounter += 1;
        return prev.map((w) =>
          w.id === app.id ? { ...w, minimized: false, z: zCounter } : w
        );
      }
      zCounter += 1;
      return [...prev, { id: app.id, z: zCounter, minimized: false }];
    });
  };

  const closeWindow = (id) =>
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));

  const focusWindow = (id) => {
    zCounter += 1;
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, z: zCounter } : w))
    );
  };

  const toggleMinimize = (id) =>
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w))
    );

  useEffect(() => {
    const handler = (e) => {
      const visible = openWindows.filter((w) => !w.minimized);
      if (visible.length === 0) return;
      const focused = visible.reduce((a, b) => (a.z > b.z ? a : b));

      if (e.key === "Escape") {
        closeWindow(focused.id);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleMinimize(focused.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openWindows]);

  const ICON_MARGIN = 2;
  const rectsOverlap = (a, b) =>
    a.left < b.left + ICON_W - ICON_MARGIN &&
    a.left + ICON_W - ICON_MARGIN > b.left &&
    a.top < b.top + ICON_H - ICON_MARGIN &&
    a.top + ICON_H - ICON_MARGIN > b.top;

  const collidesWithOther = (id, candidate, positions) =>
    apps.some((other) => {
      if (other.id === id) return false;
      const otherPos = positions[other.id];
      if (!otherPos) return false;
      return rectsOverlap(candidate, otherPos);
    });

  const ORIGIN = { top: 24, left: 24 };
  const toCell = (pos) => ({
    col: Math.round((pos.left - ORIGIN.left) / ICON_W),
    row: Math.round((pos.top - ORIGIN.top) / ICON_H),
  });
  const fromCell = (cell) => ({
    top: ORIGIN.top + cell.row * ICON_H,
    left: ORIGIN.left + cell.col * ICON_W,
  });
  const cellInBounds = (cell) => {
    const pos = fromCell(cell);
    const maxLeft = window.innerWidth - ICON_W;
    const maxTop = window.innerHeight - 40 - ICON_H;
    return pos.left >= 0 && pos.left <= maxLeft && pos.top >= 0 && pos.top <= maxTop;
  };

  const findFreeSpot = (id, desiredPos, positions) => {
    const desiredCell = toCell(desiredPos);
    const tryCell = (cell) => {
      if (!cellInBounds(cell)) return null;
      const pos = fromCell(cell);
      if (collidesWithOther(id, pos, positions)) return null;
      return pos;
    };

    const direct = tryCell(desiredCell);
    if (direct) return direct;

    const maxRadius = 40;
    for (let radius = 1; radius <= maxRadius; radius++) {
      const candidates = [
        { row: desiredCell.row + radius, col: desiredCell.col },
        { row: desiredCell.row, col: desiredCell.col + 1 },
        { row: desiredCell.row - radius, col: desiredCell.col },
        { row: desiredCell.row, col: desiredCell.col - 1 },
      ];
      for (let c = -radius; c <= radius; c++) {
        candidates.push({ row: desiredCell.row + radius, col: desiredCell.col + c });
        candidates.push({ row: desiredCell.row - radius, col: desiredCell.col + c });
      }
      for (const cell of candidates) {
        const pos = tryCell(cell);
        if (pos) return pos;
      }
    }
    return desiredPos;
  };

  const startIconDrag = (e, app) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    const start = iconPos[app.id] || { top: 24, left: 24 };
    dragInfo.current = {
      id: app.id,
      startX: e.clientX,
      startY: e.clientY,
      startTop: start.top,
      startLeft: start.left,
      moved: false,
    };

    const onMove = (ev) => {
      const info = dragInfo.current;
      if (!info) return;
      const dx = ev.clientX - info.startX;
      const dy = ev.clientY - info.startY;
      if (!info.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        info.moved = true;
        setSelectedIcon(info.id);
      }
      if (!info.moved) return;

      const maxLeft = window.innerWidth - ICON_W;
      const maxTop = window.innerHeight - 40 - ICON_H;
      const candidate = {
        top: Math.min(Math.max(0, info.startTop + dy), Math.max(0, maxTop)),
        left: Math.min(Math.max(0, info.startLeft + dx), Math.max(0, maxLeft)),
      };

      setIconPos((prev) => ({
        ...prev,
        [info.id]: candidate,
      }));
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      const info = dragInfo.current;
      dragInfo.current = null;
      if (!info || !info.moved) return;

      setIconPos((prev) => {
        const droppedAt = prev[info.id];
        if (!droppedAt) return prev;
        const resolved = findFreeSpot(info.id, droppedAt, prev);
        return { ...prev, [info.id]: resolved };
      });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 12% 8%, rgba(62,142,217,0.16), transparent 42%)," +
          "radial-gradient(circle at 88% 14%, rgba(95,181,232,0.14), transparent 45%)," +
          "radial-gradient(circle at 78% 88%, rgba(62,142,217,0.12), transparent 40%)," +
          "radial-gradient(circle at 8% 86%, rgba(207,227,242,0.5), transparent 45%)," +
          "linear-gradient(160deg, #EFF8FF 0%, #E6F3FC 45%, #DCEEF9 100%)",
      }}
      onMouseDown={() => setSelectedIcon(null)}
    >
      <Wallpaper active={introDone} />

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <circle cx="15%" cy="20%" r="220" fill="none" stroke="#3E8ED9" strokeOpacity="0.06" strokeWidth="1" />
        <circle cx="15%" cy="20%" r="140" fill="none" stroke="#3E8ED9" strokeOpacity="0.05" strokeWidth="1" />
        <circle cx="85%" cy="78%" r="260" fill="none" stroke="#3E8ED9" strokeOpacity="0.05" strokeWidth="1" />
        <line x1="0" y1="35%" x2="100%" y2="30%" stroke="#3E8ED9" strokeOpacity="0.04" strokeWidth="1" />
        <line x1="0" y1="72%" x2="100%" y2="76%" stroke="#3E8ED9" strokeOpacity="0.04" strokeWidth="1" />
      </svg>

      {/* First-visit only: big centered name + a one-time "how this works" tip.
          Fades out for good once dismissed (tracked in localStorage). */}
      <AnimatePresence>
        {!introDone && <IntroOverlay key="intro" onDone={handleIntroDone} />}
      </AnimatePresence>

      {apps.filter((app) => app.id !== "about").map((app) => {
        const p = iconPos[app.id] || { top: 24, left: 24 };
        return (
          <button
            key={app.id}
            onMouseDown={(e) => startIconDrag(e, app)}
            onClick={(e) => {
              e.stopPropagation();
              if (!dragInfo.current || !dragInfo.current.moved) {
                setSelectedIcon(app.id);
              }
            }}
            onDoubleClick={() => openApp(app)}
            style={{ position: "absolute", top: p.top, left: p.left, width: ICON_W }}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg select-none cursor-default ${
              selectedIcon === app.id ? "bg-[#3E8ED9]/15" : ""
            }`}
          >
            <AppIcon
              id={app.id}
              className={`w-7 h-7 transition-colors ${
                introDone ? "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]" : "text-[#24384A]"
              }`}
            />
            <span
              className={`text-xs text-center leading-tight transition-colors ${
                introDone
                  ? "text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]"
                  : "text-[#1F2E3B] drop-shadow-md"
              }`}
            >
              {app.title}
            </span>
          </button>
        );
      })}

      {openWindows.map((w) => {
        const app = apps.find((a) => a.id === w.id);
        if (!app || w.minimized) return null;
        return (
          <Window
            key={w.id}
            app={app}
            z={w.z}
            onClose={() => closeWindow(w.id)}
            onFocus={() => focusWindow(w.id)}
            onMinimize={() => toggleMinimize(w.id)}
          >
            <WindowContent appId={w.id} />
          </Window>
        );
      })}

      <Taskbar
        openWindows={openWindows}
        apps={apps}
        onIconClick={(id) => {
          const w = openWindows.find((w) => w.id === id);
          if (w?.minimized) toggleMinimize(id);
          else focusWindow(id);
        }}
        onSearchOpen={() => setSearchOpen(true)}
        onCloseWindow={closeWindow}
        onOpenApp={openApp}
      />

      <AnimatePresence>
        {searchOpen && (
          <SearchOverlay
            onClose={() => setSearchOpen(false)}
            onSelect={(app) => openApp(app)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}