import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INSTRUCTIONS_DELAY_MS = 900;
const MIN_VISIBLE_MS = 30_000;
const AUTO_DISMISS_GRACE_MS = 5_000;

export default function IntroOverlay({ onDone }) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const instructionsShownAt = useRef(null);
  const dismissed = useRef(false);

  const dismiss = () => {
    if (
      dismissed.current ||
      instructionsShownAt.current === null ||
      Date.now() - instructionsShownAt.current < MIN_VISIBLE_MS
    ) return;

    dismissed.current = true;
    setLeaving(true);
    setTimeout(() => onDone?.(), 550);
  };

  useEffect(() => {
    const instructionsTimer = setTimeout(() => {
      instructionsShownAt.current = Date.now();
      setShowInstructions(true);
    }, INSTRUCTIONS_DELAY_MS);
    const autoDismissTimer = setTimeout(
      dismiss,
      INSTRUCTIONS_DELAY_MS + MIN_VISIBLE_MS + AUTO_DISMISS_GRACE_MS
    );
    return () => {
      clearTimeout(instructionsTimer);
      clearTimeout(autoDismissTimer);
    };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none select-none"
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-6xl sm:text-8xl font-medium text-[#1F2E3B] tracking-tighter drop-shadow-sm">
          Harshan B
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-[#3E8ED9] font-mono uppercase tracking-[0.25em]">
          Data Engineer // CS Student
        </p>
      </motion.div>

      <AnimatePresence>
        {showInstructions && !leaving && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={dismiss}
            className="pointer-events-auto mt-10 max-w-sm w-[90%] sm:w-auto bg-white/90 backdrop-blur-md border border-[#CFE3F2] rounded-xl shadow-lg px-5 py-4 cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3E8ED9]/10 text-[#3E8ED9] text-sm">
                i
              </div>
              <div>
                <p className="text-xs leading-relaxed text-[#24384A]">
                  Move around, double-click icons to open apps — they reveal info about
                  me and what I've been working on.
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-[#7E97AC]">
                  Tap this message to dismiss after 30 seconds
                </p>
              </div>
            </div>
            <div className="mt-3 h-[2px] w-full bg-[#E8F3FC] rounded-full overflow-hidden">
              <motion.div
                key={showInstructions ? "run" : "idle"}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: (MIN_VISIBLE_MS + AUTO_DISMISS_GRACE_MS) / 1000, ease: "linear" }}
                className="h-full bg-[#3E8ED9]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
