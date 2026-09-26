import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Curated landscape photography, shuffled once per page load.
export const DEFAULT_THEME = {
  surface: "rgba(239, 248, 255, 0.94)",
  widget: "rgba(220, 238, 249, 0.88)",
  border: "rgba(168, 199, 220, 0.72)",
  text: "#1F2E3B",
  muted: "#58748A",
  accent: "#3E7090",
  hover: "rgba(255, 255, 255, 0.68)",
};

const WALLPAPERS = [
  { photo: "photo-1500530855697-b586d89ba3ee", theme: { surface: "rgba(232, 239, 222, 0.94)", widget: "rgba(211, 224, 199, 0.88)", border: "rgba(158, 177, 143, 0.72)", text: "#28372B", muted: "#5F715F", accent: "#58745A", hover: "rgba(255, 255, 255, 0.68)" } },
  { photo: "photo-1470770841072-f978cf4d019e", theme: { surface: "rgba(226, 237, 241, 0.94)", widget: "rgba(203, 222, 229, 0.88)", border: "rgba(151, 179, 190, 0.72)", text: "#25353C", muted: "#566F79", accent: "#4F7483", hover: "rgba(255, 255, 255, 0.68)" } },
  { photo: "photo-1501785888041-af3ef2852f5b", theme: { surface: "rgba(239, 233, 219, 0.95)", widget: "rgba(224, 211, 187, 0.88)", border: "rgba(189, 168, 136, 0.72)", text: "#3D352A", muted: "#75664E", accent: "#8A704B", hover: "rgba(255, 255, 255, 0.68)" } },
  { photo: "photo-1470252649378-9c29740c9fa8", theme: { surface: "rgba(241, 231, 222, 0.95)", widget: "rgba(226, 207, 190, 0.88)", border: "rgba(190, 160, 136, 0.72)", text: "#40332D", muted: "#7A6255", accent: "#946C58", hover: "rgba(255, 255, 255, 0.68)" } },
  { photo: "photo-1441974231531-c6227db76b6e", theme: { surface: "rgba(226, 237, 225, 0.95)", widget: "rgba(202, 222, 200, 0.88)", border: "rgba(148, 176, 146, 0.72)", text: "#28362A", muted: "#58705A", accent: "#527653", hover: "rgba(255, 255, 255, 0.68)" } },
  { photo: "photo-1518837695005-2083093ee35b", theme: { surface: "rgba(222, 238, 237, 0.95)", widget: "rgba(195, 222, 220, 0.88)", border: "rgba(139, 180, 178, 0.72)", text: "#243735", muted: "#52716D", accent: "#397B75", hover: "rgba(255, 255, 255, 0.68)" } },
  { photo: "photo-1464822759023-fed622ff2c3b", theme: { surface: "rgba(230, 234, 242, 0.95)", widget: "rgba(207, 216, 232, 0.88)", border: "rgba(159, 173, 198, 0.72)", text: "#2C3340", muted: "#5E687B", accent: "#60799C", hover: "rgba(255, 255, 255, 0.68)" } },
  { photo: "photo-1472396961693-142e6e269027", theme: { surface: "rgba(233, 238, 219, 0.95)", widget: "rgba(214, 224, 191, 0.88)", border: "rgba(169, 181, 133, 0.72)", text: "#33382A", muted: "#68704F", accent: "#78824D", hover: "rgba(255, 255, 255, 0.68)" } },
];

const ROTATE_MS = 45 * 1000;
const FADE_MS = 2.8;

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function wallpaperUrl(photo) {
  const w = typeof window !== "undefined" ? Math.min(window.innerWidth, 2400) : 1920;
  const h = typeof window !== "undefined" ? Math.min(window.innerHeight, 1400) : 1080;
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${w}&h=${h}&q=85`;
}

export default function Wallpaper({ active, onPaletteChange }) {
  const [wallpapers] = useState(() => shuffle(WALLPAPERS));
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % wallpapers.length);
    }, ROTATE_MS);
    return () => clearInterval(timerRef.current);
  }, [active, wallpapers.length]);

  useEffect(() => {
    onPaletteChange?.(wallpapers[index].theme);
  }, [index, onPaletteChange, wallpapers]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {active && (
          <motion.div
            key={wallpapers[index].photo}
            initial={{ opacity: 0, scale: 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.015 }}
            transition={{ duration: FADE_MS, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${wallpaperUrl(wallpapers[index].photo)})` }}
          />
        )}
      </AnimatePresence>

      {/* soft scrim so icons / text stay legible over any photo */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: active ? 1 : 0,
          background:
            "linear-gradient(180deg, rgba(15,30,45,0.28) 0%, rgba(15,30,45,0.12) 35%, rgba(15,30,45,0.22) 100%)",
        }}
      />
    </div>
  );
}
