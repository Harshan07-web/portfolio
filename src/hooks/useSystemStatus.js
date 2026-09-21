import { useEffect, useState } from "react";

// Same fake-battery behaviour as the desktop taskbar: drains 1% every 4 minutes
// and "recharges" once it hits the floor.
const BATTERY_TICK_MS = 4 * 60 * 1000;
const BATTERY_FLOOR = 6;

export function useClock(intervalMs = 30 * 1000) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return time;
}

export function useBattery(start = 87) {
  const [battery, setBattery] = useState(start);
  useEffect(() => {
    const b = setInterval(() => {
      setBattery((prev) => (prev <= BATTERY_FLOOR ? 100 : prev - 1));
    }, BATTERY_TICK_MS);
    return () => clearInterval(b);
  }, []);
  return battery;
}
