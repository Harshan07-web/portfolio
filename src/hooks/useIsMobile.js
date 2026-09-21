import { useEffect, useState } from "react";

// Phones + small/touch tablets get the mobile "phone OS" UI, everything else
// gets the desktop UI. Also flips live when a desktop browser is resized narrow.
const QUERY = "(max-width: 820px), (pointer: coarse) and (max-width: 1100px)";

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    onChange();
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
