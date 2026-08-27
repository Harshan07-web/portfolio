import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AppIcon } from "./Icons";

const TASKBAR_HEIGHT = 40;
const SNAP_THRESHOLD = 12;

export default function Window({ app, z, onClose, onFocus, onMinimize, children }) {
  const [size, setSize] = useState(app.defaultSize || { width: 480, height: 380 });
  const [pos, setPos] = useState({ top: 60, left: 120 });
  const [maximized, setMaximized] = useState(false);
  const [snapPreview, setSnapPreview] = useState(null); // "left" | "right" | "top" | null

  const dragging = useRef(false);
  const resizing = useRef(false);
  const pendingSnap = useRef(null);
  const startRef = useRef({ x: 0, y: 0, top: 0, left: 0, w: 0, h: 0 });

  const applySnap = (side) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight - TASKBAR_HEIGHT;
    if (side === "top") {
      setMaximized(true);
      return;
    }
    setMaximized(false);
    if (side === "left") {
      setPos({ top: 0, left: 0 });
      setSize({ width: vw / 2, height: vh });
    } else if (side === "right") {
      setPos({ top: 0, left: vw / 2 });
      setSize({ width: vw / 2, height: vh });
    }
  };

  const startDrag = (e) => {
    if (maximized) return;
    onFocus();
    dragging.current = true;
    startRef.current = { x: e.clientX, y: e.clientY, top: pos.top, left: pos.left };

    const onMove = (ev) => {
      if (!dragging.current) return;
      const dx = ev.clientX - startRef.current.x;
      const dy = ev.clientY - startRef.current.y;
      setPos({
        top: Math.max(0, startRef.current.top + dy),
        left: Math.max(0, startRef.current.left + dx),
      });

      // detect edge proximity for snap preview
      let side = null;
      if (ev.clientX <= SNAP_THRESHOLD) side = "left";
      else if (ev.clientX >= window.innerWidth - SNAP_THRESHOLD) side = "right";
      else if (ev.clientY <= SNAP_THRESHOLD) side = "top";
      pendingSnap.current = side;
      setSnapPreview(side);
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (pendingSnap.current) {
        applySnap(pendingSnap.current);
        pendingSnap.current = null;
      }
      setSnapPreview(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const startResize = (e) => {
    if (maximized) return;
    e.stopPropagation();
    resizing.current = true;
    startRef.current = { x: e.clientX, y: e.clientY, w: size.width, h: size.height };

    const onMove = (ev) => {
      if (!resizing.current) return;
      const dx = ev.clientX - startRef.current.x;
      const dy = ev.clientY - startRef.current.y;
      setSize({
        width: Math.max(280, startRef.current.w + dx),
        height: Math.max(200, startRef.current.h + dy),
      });
    };
    const onUp = () => {
      resizing.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const toggleMaximize = () => setMaximized((m) => !m);

  const style = maximized
    ? { top: 0, left: 0, width: "100%", height: "calc(100% - 40px)" }
    : { top: pos.top, left: pos.left, width: size.width, height: size.height };

  return (
    <>
      {snapPreview && (
        <div
          className="absolute bg-[#5B8266]/10 border border-[#5B8266]/40 pointer-events-none z-[200]"
          style={
            snapPreview === "top"
              ? { top: 0, left: 0, width: "100%", height: `calc(100% - ${TASKBAR_HEIGHT}px)` }
              : snapPreview === "left"
              ? { top: 0, left: 0, width: "50%", height: `calc(100% - ${TASKBAR_HEIGHT}px)` }
              : { top: 0, left: "50%", width: "50%", height: `calc(100% - ${TASKBAR_HEIGHT}px)` }
          }
        />
      )}
      <motion.div
        onMouseDown={onFocus}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        style={{ ...style, position: "absolute", zIndex: z }}
        className="bg-white border border-[#DCE1DB] flex flex-col shadow-lg rounded-lg overflow-hidden"
      >
        {/* Title bar */}
        <div
          onMouseDown={startDrag}
          onDoubleClick={toggleMaximize}
          className="flex items-center justify-between px-3 py-2 bg-[#EEF1EC] border-b border-[#DCE1DB] cursor-move"
        >
          <span className="flex items-center gap-1.5 text-xs tracking-wide text-[#2E332F]">
            <AppIcon id={app.id} className="w-3.5 h-3.5 text-[#5B8266]" />
            {app.title}
          </span>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="w-3 h-3 rounded-full bg-[#D8DCD4] hover:bg-[#E8B84B]"
              aria-label="Minimize"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMaximize();
              }}
              className="w-3 h-3 rounded-full bg-[#D8DCD4] hover:bg-[#5B8266]"
              aria-label="Maximize"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-[#D8DCD4] hover:bg-[#C96A5A]"
              aria-label="Close"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 text-sm text-[#3E453F]">
          {children}
        </div>

        {/* Resize handle */}
        {!maximized && (
          <div
            onMouseDown={startResize}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          />
        )}
      </motion.div>
    </>
  );
}