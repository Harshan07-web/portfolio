import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apps } from "../data/apps";
import Window from "./Window";
import Taskbar from "./Taskbar";
import WindowContent from "./WindowContent";
import SearchOverlay from "./SearchOverlay";

let zCounter = 10;

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState([]); // {id, z, minimized}
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full relative bg-[#F4F6F3]"
      onMouseDown={() => setSelectedIcon(null)}
    >
      {/* Desktop icons */}
      <div className="absolute top-6 left-6 grid grid-cols-1 gap-6 w-20">
        {apps.map((app) => (
          <button
            key={app.id}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setSelectedIcon(app.id)}
            onDoubleClick={() => openApp(app)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
              selectedIcon === app.id ? "bg-[#5B8266]/15" : ""
            }`}
          >
            <span className="text-3xl">{app.icon}</span>
            <span className="text-xs text-[#2E332F] text-center leading-tight">
              {app.title}
            </span>
          </button>
        ))}
      </div>

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