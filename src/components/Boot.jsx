import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Boot({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("Initializing");

  const steps = [
    { at: 0, label: "Initializing" },
    { at: 20, label: "Loading projects" },
    { at: 45, label: "Compiling experience" },
    { at: 70, label: "Rendering interface" },
    { at: 90, label: "Almost there" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 8 + 4;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onDone, 500);
          return 100;
        }
        const step = [...steps].reverse().find((s) => next >= s.at);
        if (step) setLabel(step.label);
        return next;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex flex-col items-center justify-center gap-8 bg-[#F4F6F3]"
    >
      <div className="text-2xl tracking-widest text-[#2E332F]">HARSHAN</div>

      <div className="w-64">
        <div className="h-[3px] w-full bg-[#DCE1DB] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#5B8266] transition-all duration-150 ease-out rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="mt-3 text-xs text-[#6E766F] flex justify-between">
          <span>{label}...</span>
          <span>{Math.min(Math.round(progress), 100)}%</span>
        </div>
      </div>
    </motion.div>
  );
}