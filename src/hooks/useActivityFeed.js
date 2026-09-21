import { useCallback, useEffect, useState } from "react";
import { loadActivityFeed, NOTIF_SEEN_KEY } from "../lib/activityFeed";

// Feed state for the mobile notification shade (mirrors the desktop taskbar logic).
export default function useActivityFeed() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasUnseen, setHasUnseen] = useState(false);

  const load = useCallback(async () => {
    const items = await loadActivityFeed(setLoading);
    setNotifications(items);
    return items;
  }, []);

  useEffect(() => {
    load().then((items) => {
      try {
        const lastSeen = localStorage.getItem(NOTIF_SEEN_KEY);
        const latest = items?.[0]?.date;
        if (latest && latest !== lastSeen) setHasUnseen(true);
      } catch {
        /* storage unavailable */
      }
    });
  }, [load]);

  // Call when the shade opens: clears the badge and refreshes the feed.
  const markSeen = useCallback(() => {
    setHasUnseen(false);
    try {
      if (notifications[0]) localStorage.setItem(NOTIF_SEEN_KEY, notifications[0].date);
    } catch {
      /* storage unavailable */
    }
    load();
  }, [notifications, load]);

  return { notifications, loading, hasUnseen, markSeen };
}
