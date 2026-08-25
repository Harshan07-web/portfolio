import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apps } from "../data/apps";
import Window from "./Window";
import Taskbar from "./TaskBar";
import WindowContent from "./WindowContent";
import SearchOverlay from "./SearchOverlay";
import { AppIcon } from "./Icons";

let zCounter = 10;

const ICON_W = 76;
const ICON_H = 76;
const DRAG_THRESHOLD = 4;

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Splits icons between left and right sides on initial load
  const [iconPos, setIconPos] = useState(() => {
    const pos = {};
    const rightAlignIds = ["settings", "gallery", "browser", "trash", "aim_trainer", "music", "database", "blockchain"];
    let leftIdx = 0;
    let rightIdx = 0;
    
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;

    apps.forEach((app) => {
      if (rightAlignIds.includes(app.id)) {
        pos[app.id] = { top: 24 + rightIdx * ICON_H, left: vw - ICON_W - 24 };
        rightIdx++;
      } else {
        pos[app.id] = { top: 24 + leftIdx * ICON_H, left: 24 };
        leftIdx++;
      }
    });
    return pos;
  });

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
          "radial-gradient(circle at 12% 8%, rgba(91,130,102,0.16), transparent 42%)," +
          "radial-gradient(circle at 88% 14%, rgba(127,176,138,0.14), transparent 45%)," +
          "radial-gradient(circle at 78% 88%, rgba(91,130,102,0.12), transparent 40%)," +
          "radial-gradient(circle at 8% 86%, rgba(220,225,219,0.5), transparent 45%)," +
          "linear-gradient(160deg, #F6F8F4 0%, #F1F4EF 45%, #EDF1EA 100%)",
      }}
      onMouseDown={() => setSelectedIcon(null)}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <circle cx="15%" cy="20%" r="220" fill="none" stroke="#5B8266" strokeOpacity="0.06" strokeWidth="1" />
        <circle cx="15%" cy="20%" r="140" fill="none" stroke="#5B8266" strokeOpacity="0.05" strokeWidth="1" />
        <circle cx="85%" cy="78%" r="260" fill="none" stroke="#5B8266" strokeOpacity="0.05" strokeWidth="1" />
        <line x1="0" y1="35%" x2="100%" y2="30%" stroke="#5B8266" strokeOpacity="0.04" strokeWidth="1" />
        <line x1="0" y1="72%" x2="100%" y2="76%" stroke="#5B8266" strokeOpacity="0.04" strokeWidth="1" />
      </svg>

      {/* About Section — Centered Bento Grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] max-w-4xl flex flex-col justify-center pointer-events-none select-none z-0">
        
        <div className="flex items-end justify-between border-b border-[#5B8266]/20 pb-6 mb-6">
          <div>
            <h1 className="text-7xl font-medium text-[#3E453F] tracking-tighter">
              Harshan
            </h1>
            <p className="mt-2 text-sm text-[#5B8266] font-mono uppercase tracking-widest">
              Data Engineer // CS Student
            </p>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B8266] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#5B8266]"></span>
            </span>
            <span className="text-[10px] font-mono text-[#8A9086] tracking-wider">SYSTEM_ONLINE</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/40 border border-[#DCE1DB]/80 p-5 rounded-xl backdrop-blur-md shadow-sm">
            <h3 className="text-[10px] font-mono text-[#5B8266] mb-2.5 uppercase tracking-wider">01. The Stack</h3>
            <p className="text-xs leading-relaxed text-[#5B6259]">
              Working across Python, FastAPI, React, and applied ML to build full-stack products, data pipelines, and robust ETL workflows end to end.
            </p>
          </div>
          
          <div className="bg-white/40 border border-[#DCE1DB]/80 p-5 rounded-xl backdrop-blur-md shadow-sm">
            <h3 className="text-[10px] font-mono text-[#5B8266] mb-2.5 uppercase tracking-wider">02. Current Focus</h3>
            <p className="text-xs leading-relaxed text-[#5B6259]">
              Orchestration with Airflow, warehousing with Snowflake, and engineering backend systems that move and shape data reliably at scale.
            </p>
          </div>

          <div className="bg-white/40 border border-[#DCE1DB]/80 p-5 rounded-xl backdrop-blur-md shadow-sm col-span-2">
            <h3 className="text-[10px] font-mono text-[#5B8266] mb-2.5 uppercase tracking-wider">03. Recent Deployments</h3>
            <p className="text-xs leading-relaxed text-[#5B6259]">
              Architected Rx-Block, a blockchain-powered pharmaceutical tracking system, alongside FutHommie, a football statistics platform featuring a complete FastAPI/MySQL ETL pipeline.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {['Python', 'FastAPI', 'React', 'MySQL', 'Airflow', 'Snowflake', 'Web3.py', 'Solidity'].map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-[#5B8266]/5 border border-[#5B8266]/20 rounded-md text-[10px] text-[#5B8266] font-mono tracking-wide">
              {tag}
            </span>
          ))}
        </div>
      </div>

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
              selectedIcon === app.id ? "bg-[#5B8266]/15" : ""
            }`}
          >
            <AppIcon id={app.id} className="w-7 h-7 text-[#3E453F]" />
            <span className="text-xs text-[#2E332F] text-center leading-tight shadow-white drop-shadow-md">
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