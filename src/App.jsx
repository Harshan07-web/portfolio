import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Boot from "./components/Boot";
import EnterScreen from "./components/EnterScreen";
import Desktop from "./components/Desktop";
import MobileOS from "./components/mobile/MobileOS";
import useIsMobile from "./hooks/useIsMobile";

// stages: "boot" -> "enter" -> "desktop" (desktop UI on PCs, phone UI on mobile)
export default function App() {
  const [stage, setStage] = useState("boot");
  const isMobile = useIsMobile();

  return (
    <div className="w-screen h-dvh overflow-hidden bg-[#F4F6F3] text-[#2E332F] font-mono select-none">
      <AnimatePresence mode="wait">
        {stage === "boot" && (
          <Boot key="boot" onDone={() => setStage("enter")} />
        )}
        {stage === "enter" && (
          <EnterScreen
            key="enter"
            isMobile={isMobile}
            onEnter={() => setStage("desktop")}
          />
        )}
        {stage === "desktop" &&
          (isMobile ? <MobileOS key="mobile" /> : <Desktop key="desktop" />)}
      </AnimatePresence>
    </div>
  );
}
