import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { apps } from "../../Data/apps";
import { AppIcon, SearchIcon } from "../Icons";

export default function MobileSearch({ onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = apps.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-0 z-[80] bg-[#EAF4FB]/95 backdrop-blur-md flex flex-col"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-[#CFE3F2] rounded-full px-4 py-2.5 focus-within:border-[#3E8ED9] transition-colors">
          <SearchIcon className="w-3.5 h-3.5 text-[#7E97AC]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps..."
            className="flex-1 min-w-0 bg-transparent text-sm text-[#1F2E3B] outline-none placeholder-[#7E97AC]"
          />
        </div>
        <button onClick={onClose} className="text-xs text-[#3E8ED9] active:opacity-60">
          Cancel
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto mx-4 mb-4 bg-white border border-[#CFE3F2] rounded-2xl shadow-sm">
        {results.length === 0 && <div className="px-4 py-3 text-xs text-[#7E97AC]">No results</div>}
        {results.map((app) => (
          <button
            key={app.id}
            onClick={() => onSelect(app)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-[#1F2E3B] border-b border-[#E8F3FC] last:border-b-0 active:bg-[#E8F3FC]"
          >
            <AppIcon id={app.id} className="w-4 h-4 text-[#3E8ED9]" />
            <span>{app.title}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
