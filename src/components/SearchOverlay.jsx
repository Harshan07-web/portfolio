import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { apps } from "../Data/apps";
import { AppIcon } from "./Icons";

export default function SearchOverlay({ onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const results = apps.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
      className="absolute inset-0 bg-[#1F2E3B]/30 z-[100] flex items-start justify-center pt-32"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-[#CFE3F2] shadow-lg rounded-lg overflow-hidden"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search apps..."
          className="w-full px-4 py-3 bg-transparent text-sm text-[#1F2E3B] outline-none border-b border-[#CFE3F2] placeholder-[#7E97AC]"
        />
        <div className="max-h-64 overflow-auto">
          {results.length === 0 && (
            <div className="px-4 py-3 text-xs text-[#7E97AC]">
              No results
            </div>
          )}
          {results.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                onSelect(app);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-[#1F2E3B] hover:bg-[#E8F3FC]"
            >
              <AppIcon id={app.id} className="w-4 h-4 text-[#3E8ED9]" />
              <span>{app.title}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}