import { useEffect } from "react";
import { motion } from "framer-motion";

export default function EnterScreen({ onEnter, isMobile = false }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter") onEnter();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onEnter]);

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.6 }}
      // On phones the lock screen can also be swiped up to unlock
      drag={isMobile ? "y" : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.5, bottom: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -80 || info.velocity.y < -500) onEnter();
      }}
      className="relative w-full h-full flex flex-col items-center justify-center gap-10 bg-[#EAF4FB]"
    >
      <div className="text-center">
        <div className="text-6xl font-light tracking-tight text-[#1F2E3B]">{time}</div>
        <div className="text-[#58748A] mt-2 text-sm">{date}</div>
      </div>

      <button
        onClick={onEnter}
        className="border border-[#3E8ED9] text-[#3E8ED9] px-8 py-2 text-sm tracking-wide rounded-full hover:bg-[#3E8ED9] hover:text-white transition-colors duration-200"
      >
        {isMobile ? "Tap to unlock" : "Press Enter"}
      </button>

      {isMobile && (
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 text-[10px] tracking-widest uppercase text-[#7E97AC]"
          style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom, 0px))" }}
        >
          <span>Swipe up</span>
          <span className="block w-28 h-1 rounded-full bg-[#1F2E3B]/25" />
        </div>
      )}
    </motion.div>
  );
}