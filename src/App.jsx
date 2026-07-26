import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Boot from "./components/Boot";
import EnterScreen from "./components/EnterScreen";
import Desktop from "./components/Desktop";

// stages: "boot" -> "enter" -> "desktop"
export default function App() {
  const [stage, setStage] = useState("boot");

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#F4F6F3] text-[#2E332F] font-mono select-none">
      <AnimatePresence mode="wait">
        {stage === "boot" && (
          <Boot key="boot" onDone={() => setStage("enter")} />
        )}
        {stage === "enter" && (
          <EnterScreen key="enter" onEnter={() => setStage("desktop")} />
        )}
        {stage === "desktop" && <Desktop key="desktop" />}
      </AnimatePresence>
    </div>
  );
}