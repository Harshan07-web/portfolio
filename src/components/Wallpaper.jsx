import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Free-to-use, no-API-key wallpapers via Lorem Picsum (backed by real photography,
// safe to hotlink). Seeds keep each slide stable + cacheable while still cycling
// through a nice variety of generic desktop-style shots.
const SEEDS = [
  "harshan-01",
  "harshan-02",
  "harshan-03",
  "harshan-04",
  "harshan-05",
  "harshan-06",
  "harshan-07",
  "harshan-08",
];

const ROTATE_MS = 45 * 1000;

function wallpaperUrl(seed) {
  const w = typeof window !== "undefined" ? Math.min(window.innerWidth, 2400) : 1920;
  const h = typeof window !== "undefined" ? Math.min(window.innerHeight, 1400) : 1080;
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export default function Wallpaper({ active }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SEEDS.length);
    }, ROTATE_MS);
    return () => clearInterval(timerRef.current);
  }, [active]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {active && (
          <motion.div
            key={SEEDS[index]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${wallpaperUrl(SEEDS[index])})` }}
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
