import { useEffect } from "react";
import { motion } from "framer-motion";

export default function EnterScreen({ onEnter }) {
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
      className="w-full h-full flex flex-col items-center justify-center gap-10 bg-[#F4F6F3]"
    >
      <div className="text-center">
        <div className="text-6xl font-light tracking-tight text-[#2E332F]">{time}</div>
        <div className="text-[#6E766F] mt-2 text-sm">{date}</div>
      </div>

      <button
        onClick={onEnter}
        className="border border-[#5B8266] text-[#5B8266] px-8 py-2 text-sm tracking-wide rounded-full hover:bg-[#5B8266] hover:text-white transition-colors duration-200"
      >
        Press Enter
      </button>
    </motion.div>
  );
}