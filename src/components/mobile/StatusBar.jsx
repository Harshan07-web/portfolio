import { WifiIcon, BatteryIcon, BellIcon } from "../Icons";

// Phone status bar: clock on the left, wifi / battery / notification bell on the right.
export default function StatusBar({ time, battery, hasUnseen, onBell }) {
  return (
    <div
      className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-5 text-[#3E453F]"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        height: "calc(44px + env(safe-area-inset-top, 0px))",
      }}
    >
      <span className="text-xs font-medium tracking-wide">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>

      <div className="flex items-center gap-2.5 text-[#6E766F] text-xs">
        <WifiIcon className="w-3.5 h-3.5" />
        <span className="flex items-center gap-1">
          <BatteryIcon level={battery} className="w-4 h-4" />
          {battery}%
        </span>
        <button
          onClick={onBell}
          aria-label="Notifications"
          className="relative flex items-center justify-center w-8 h-8 -mr-1.5 rounded-full active:bg-[#5B8266]/15"
        >
          <BellIcon className="w-4 h-4" />
          {hasUnseen && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C96A5A] animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
}
