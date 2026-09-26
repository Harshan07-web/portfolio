import { motion, useDragControls } from "framer-motion";
import { NotificationIcon } from "../Icons";

// Pull-down shade holding the Activity Feed (the mobile version of the
// desktop notification panel). Tap the scrim, or drag the handle up, to close.
export default function NotificationShade({ notifications, loading, onClose }) {
  const controls = useDragControls();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 z-[60] bg-[#1F2E3B]/30"
      />
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
        drag="y"
        dragListener={false}
        dragControls={controls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.5, bottom: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.y < -60 || info.velocity.y < -400) onClose();
        }}
        className="absolute top-0 inset-x-0 z-[70] max-h-[82%] bg-white border-b border-[#CFE3F2] shadow-lg rounded-b-3xl flex flex-col overflow-hidden"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="px-4 py-3 border-b border-[#CFE3F2] text-xs tracking-wide text-[#1F2E3B] flex justify-between items-center">
          <span>Activity Feed</span>
          <span className="text-[9px] font-mono text-[#3E8ED9] bg-[#3E8ED9]/10 px-2 py-0.5 rounded">LIVE</span>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          {loading && (
            <div className="px-4 py-6 text-center text-xs text-[#7E97AC] animate-pulse">Syncing logs...</div>
          )}
          {!loading && notifications.length === 0 && (
            <div className="px-4 py-3 text-xs text-[#7E97AC]">No recent activity</div>
          )}
          {notifications.map((n, i) => (
            <a
              key={n.id || i}
              href={n.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 px-4 py-3 border-b border-[#E8F3FC] active:bg-[#E8F3FC] transition-colors"
            >
              <div className="mt-0.5 text-[#3E8ED9] shrink-0">
                <NotificationIcon type={n.icon} className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wide text-[#3E8ED9] font-semibold">
                  {n.platform} · {n.repo} · {n.relTime}
                </div>
                <div className="mt-1 text-xs text-[#1F2E3B] leading-snug break-words">{n.message}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Drag handle (drag is limited to this so the list can still scroll) */}
        <div
          onPointerDown={(e) => controls.start(e)}
          onClick={onClose}
          className="touch-none flex justify-center py-3 cursor-grab"
          aria-label="Close notifications"
        >
          <span className="block w-10 h-1 rounded-full bg-[#1F2E3B]/25" />
        </div>
      </motion.div>
    </>
  );
}
