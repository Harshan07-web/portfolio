import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apps } from "../../Data/apps";
import WindowContent from "../WindowContent";
import StatusBar from "./StatusBar";
import HomeScreen from "./HomeScreen";
import AppScreen from "./AppScreen";
import NotificationShade from "./NotificationShade";
import MobileSearch from "./MobileSearch";
import { useClock, useBattery } from "../../hooks/useSystemStatus";
import useActivityFeed from "../../hooks/useActivityFeed";

// Same wallpaper language as the desktop: soft sage radial washes + faint line art.
const WALLPAPER =
  "radial-gradient(circle at 12% 8%, rgba(91,130,102,0.16), transparent 42%)," +
  "radial-gradient(circle at 88% 14%, rgba(127,176,138,0.14), transparent 45%)," +
  "radial-gradient(circle at 78% 88%, rgba(91,130,102,0.12), transparent 40%)," +
  "radial-gradient(circle at 8% 86%, rgba(220,225,219,0.5), transparent 45%)," +
  "linear-gradient(160deg, #F6F8F4 0%, #F1F4EF 45%, #EDF1EA 100%)";

export default function MobileOS() {
  const [openId, setOpenId] = useState(null);
  const [shadeOpen, setShadeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const time = useClock();
  const battery = useBattery();
  const feed = useActivityFeed();

  // Let the phone's back button/gesture close the open app instead of leaving the site.
  useEffect(() => {
    const onPop = () => setOpenId(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const openApp = (app) => {
    if (app.type === "link") {
      window.open(app.url, "_blank", "noopener,noreferrer");
      return;
    }
    setShadeOpen(false);
    setSearchOpen(false);
    if (openId === null) window.history.pushState({ mobileApp: app.id }, "");
    setOpenId(app.id);
  };

  const goHome = () => {
    if (window.history.state?.mobileApp) window.history.back(); // popstate closes it
    else setOpenId(null);
  };

  const toggleShade = () => {
    if (!shadeOpen) feed.markSeen();
    setShadeOpen(!shadeOpen);
  };

  const openApp_ = openId ? apps.find((a) => a.id === openId) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-full overflow-hidden"
      style={{ background: WALLPAPER }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" aria-hidden="true">
        <circle cx="15%" cy="20%" r="220" fill="none" stroke="#5B8266" strokeOpacity="0.06" strokeWidth="1" />
        <circle cx="15%" cy="20%" r="140" fill="none" stroke="#5B8266" strokeOpacity="0.05" strokeWidth="1" />
        <circle cx="85%" cy="78%" r="260" fill="none" stroke="#5B8266" strokeOpacity="0.05" strokeWidth="1" />
        <line x1="0" y1="35%" x2="100%" y2="30%" stroke="#5B8266" strokeOpacity="0.04" strokeWidth="1" />
        <line x1="0" y1="72%" x2="100%" y2="76%" stroke="#5B8266" strokeOpacity="0.04" strokeWidth="1" />
      </svg>

      <StatusBar time={time} battery={battery} hasUnseen={feed.hasUnseen} onBell={toggleShade} />
      <HomeScreen
        onOpen={openApp}
        onSearch={() => setSearchOpen(true)}
        latest={feed.notifications[0]}
        onOpenFeed={toggleShade}
      />

      <AnimatePresence>
        {openApp_ && (
          <AppScreen key={openApp_.id} app={openApp_} onClose={goHome}>
            <WindowContent appId={openApp_.id} />
          </AppScreen>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shadeOpen && (
          <NotificationShade
            key="shade"
            notifications={feed.notifications}
            loading={feed.loading}
            onClose={() => setShadeOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <MobileSearch key="search" onClose={() => setSearchOpen(false)} onSelect={openApp} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
