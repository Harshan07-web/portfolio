import { motion } from "framer-motion";
import { AppIcon } from "../Icons";

// Full-screen "app" - the mobile equivalent of a desktop <Window>.
// Header mirrors the window title bar; a home pill at the bottom closes it
// (tap, or swipe up).
export default function AppScreen({ app, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 30 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute inset-0 z-50 bg-white flex flex-col"
    >
      {/* Title bar */}
      <div
        className="bg-[#E8F3FC] border-b border-[#CFE3F2]"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="h-12 px-2 grid grid-cols-[4.5rem_1fr_4.5rem] items-center">
          <button
            onClick={onClose}
            className="flex items-center gap-0.5 pl-1 pr-2 py-2 text-xs text-[#3E8ED9] active:opacity-60"
            aria-label="Back to home"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            Home
          </button>
          <span className="flex items-center justify-center gap-1.5 text-xs tracking-wide text-[#1F2E3B]">
            <AppIcon id={app.id} className="w-3.5 h-3.5 text-[#3E8ED9]" />
            {app.title}
          </span>
          <span />
        </div>
      </div>

      {/* Content - same structure as Window.jsx so shared content renders identically */}
      <div className="flex-1 min-h-0 overflow-auto p-4 text-sm text-[#24384A]">{children}</div>

      {/* Home indicator */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.6, bottom: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.y < -40 || info.velocity.y < -400) onClose();
        }}
        className="touch-none flex justify-center border-t border-[#CFE3F2] bg-white"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <button onClick={onClose} aria-label="Go home" className="w-full py-3 flex justify-center">
          <span className="block w-28 h-1 rounded-full bg-[#1F2E3B]/30" />
        </button>
      </motion.div>
    </motion.div>
  );
}
