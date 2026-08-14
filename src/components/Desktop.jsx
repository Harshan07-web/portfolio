import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apps } from "../data/apps";
import Window from "./Window";
import Taskbar from "./Taskbar";
import WindowContent from "./WindowContent";
import SearchOverlay from "./SearchOverlay";
import { AppIcon } from "./Icons";

let zCounter = 10;

const ICON_W = 76;
const ICON_H = 76;
const DRAG_THRESHOLD = 4;

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState([]); // {id, z, minimized}
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Draggable desktop icon positions, keyed by app id.
  const [iconPos, setIconPos] = useState(() => {
    const pos = {};
    apps.forEach((app, i) => {
      pos[app.id] = { top: 24 + i * ICON_H, left: 24 };
    });
    return pos;
  });

  const dragInfo = useRef(null); // { id, startX, startY, startTop, startLeft, moved }

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

  // Keyboard shortcuts act on the topmost (focused) non-minimized window
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

  // Two icon rects "collide" if they overlap once a small breathing-room
  // margin is applied.
  const ICON_MARGIN = 2;
  const rectsOverlap = (a, b) =>
    a.left < b.left + ICON_W + ICON_MARGIN &&
    a.left + ICON_W + ICON_MARGIN > b.left &&
    a.top < b.top + ICON_H + ICON_MARGIN &&
    a.top + ICON_H + ICON_MARGIN > b.top;

  const collidesWithOther = (id, candidate, positions) =>
    apps.some((other) => {
      if (other.id === id) return false;
      const otherPos = positions[other.id];
      if (!otherPos) return false;
      return rectsOverlap(candidate, otherPos);
    });

  // Grid used only for conflict resolution on drop — icons still move
  // freely (pixel-by-pixel, can overlap) while dragging, exactly like a
  // real OS. Only once you let go do we check whether the spot is taken,
  // and if so, bump the icon to the nearest free slot beside/below it.
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

    // Ring-by-ring search around the drop cell: prefer directly below,
    // then to the side, then further out — so the icon lands "aside or
    // below" the one it was dropped on, like Windows auto-arrange.
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
        { row: desiredCell.row + radius, col: desiredCell.col }, // below
        { row: desiredCell.row, col: desiredCell.col + 1 }, // right
        { row: desiredCell.row - radius, col: desiredCell.col }, // above
        { row: desiredCell.row, col: desiredCell.col - 1 }, // left
      ];
      // widen the sweep as radius grows so we don't get stuck in a thin column
      for (let c = -radius; c <= radius; c++) {
        candidates.push({ row: desiredCell.row + radius, col: desiredCell.col + c });
        candidates.push({ row: desiredCell.row - radius, col: desiredCell.col + c });
      }
      for (const cell of candidates) {
        const pos = tryCell(cell);
        if (pos) return pos;
      }
    }

    // Fallback: clamp desired position as-is (shouldn't really happen)
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

      // Move freely while dragging — overlap is fine mid-drag, just like
      // real desktop icons. We only resolve collisions on drop.
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

      // Drop resolution: if the icon was released on top of another one,
      // snap it to the nearest free grid slot beside/below instead.
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
      {/* Soft geometric accents — purely decorative, sit behind everything */}
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

      {/* About text — sits directly on the wallpaper, no card/container */}
      <div className="absolute top-16 right-16 bottom-24 w-[38%] flex flex-col justify-center text-right pointer-events-none select-none">
        <h1 className="text-4xl font-medium text-[#3E453F]/85 tracking-tight">
          Harshan
        </h1>
        <p className="mt-3 text-sm text-[#5B6259]/75">
          Developer & CS student building across the stack.
        </p>

        <div className="mt-8 space-y-4 text-xs leading-relaxed text-[#5B6259]/70">
          <p>
            I work across Python, FastAPI, React, and applied ML — building
            full-stack products, data pipelines, and ETL workflows end to end.
          </p>
          <p>
            My focus lately has shifted toward data engineering: orchestration
            with Airflow, warehousing with Snowflake, and building systems
            that move and shape data reliably at scale.
          </p>
          <p>
            Recent work includes FutHommie, a football statistics platform
            with a FastAPI/MySQL backend and a full ETL pipeline, alongside
            contributions to open source through GSSoC.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-1 text-[10px] tracking-wide text-[#8A9086]/70">
          <span>Python · FastAPI · React · MySQL</span>
          <span>Airflow · Snowflake · Web3.py · LangChain</span>
        </div>
      </div>

      {/* Desktop icons — freely draggable */}
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
            <span className="text-xs text-[#2E332F] text-center leading-tight">
              {app.title}
            </span>
          </button>
        );
      })}

      {/* Windows */}
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