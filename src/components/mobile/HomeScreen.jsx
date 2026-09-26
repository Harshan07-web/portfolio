import { useRef, useState } from "react";
import { apps } from "../../Data/apps";
import { AppIcon, SearchIcon, NotificationIcon } from "../Icons";

// Apps pinned to the dock (removed from the grid, like a real phone).
const DOCK_IDS = ["projects", "terminal", "github", "linkedin"];

// Mirrors the "About" bento on the desktop (Desktop.jsx) - keep the copy in sync.
const ABOUT_CARDS = [
  {
    title: "01. The Stack",
    body: "Working across Python, FastAPI, React, and applied ML to build full-stack products, data pipelines, and robust ETL workflows end to end.",
  },
  {
    title: "02. Current Focus",
    body: "Orchestration with Airflow, warehousing with Snowflake, and engineering backend systems that move and shape data reliably at scale.",
  },
  {
    title: "03. Recent Deployments",
    body: "Architected Rx-Block, a blockchain-powered pharmaceutical tracking system, alongside FutHommie, a football statistics platform featuring a complete FastAPI/MySQL ETL pipeline.",
  },
];
const TAGS = ["Python", "FastAPI", "React", "MySQL", "Airflow", "Snowflake", "Web3.py", "Solidity"];

function AppTile({ app, onOpen, showLabel = true }) {
  return (
    <button
      onClick={() => onOpen(app)}
      aria-label={app.title}
      className="flex flex-col items-center gap-1.5 min-w-0 active:scale-90 transition-transform duration-150"
    >
      <span className="w-[58px] h-[58px] rounded-2xl bg-white/60 backdrop-blur-md border border-[#CFE3F2]/80 shadow-sm flex items-center justify-center">
        <AppIcon id={app.id} className="w-7 h-7 text-[#24384A]" />
      </span>
      {showLabel && (
        <span className="text-[11px] leading-tight text-[#1F2E3B] text-center">{app.title}</span>
      )}
    </button>
  );
}

export default function HomeScreen({ onOpen, onSearch, latest, onOpenFeed }) {
  const scroller = useRef(null);
  const [page, setPage] = useState(0);

  const gridApps = apps.filter((a) => a.id !== "about" && !DOCK_IDS.includes(a.id));
  const dockApps = DOCK_IDS.map((id) => apps.find((a) => a.id === id)).filter(Boolean);

  const onScroll = (e) => {
    const el = e.currentTarget;
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i) => {
    const el = scroller.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const aboutApp = apps.find((a) => a.id === "about");

  return (
    <div
      className="absolute inset-0 flex flex-col z-10"
      style={{ paddingTop: "calc(44px + env(safe-area-inset-top, 0px))" }}
    >
      {/* Swipeable home pages */}
      <div
        ref={scroller}
        onScroll={onScroll}
        className="flex-1 min-h-0 flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Page 1: identity + apps */}
        <section className="w-full shrink-0 snap-center overflow-y-auto px-5 pb-2">
          <div className="pt-3 pb-5 mb-6 border-b border-[#3E8ED9]/20">
            <h1 className="text-5xl font-medium text-[#24384A] tracking-tighter">Harshan</h1>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
              <p className="text-[11px] text-[#3E8ED9] font-mono uppercase tracking-widest">
                Data Engineer // CS Student
              </p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3E8ED9] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3E8ED9]" />
                </span>
                <span className="text-[9px] font-mono text-[#6E8CA0] tracking-wider">SYSTEM_ONLINE</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-x-2 gap-y-5">
            {gridApps.map((app) => (
              <AppTile key={app.id} app={app} onOpen={onOpen} />
            ))}
          </div>

          {/* Latest activity widget - taps through to the notification shade */}
          {latest && (
            <button
              onClick={onOpenFeed}
              className="mt-8 w-full text-left bg-white/40 border border-[#CFE3F2]/80 p-4 rounded-xl backdrop-blur-md shadow-sm active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-[10px] font-mono text-[#3E8ED9] uppercase tracking-wider">Latest activity</h3>
                <span className="text-[9px] font-mono text-[#3E8ED9] bg-[#3E8ED9]/10 px-2 py-0.5 rounded">LIVE</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[#3E8ED9] shrink-0">
                  <NotificationIcon type={latest.icon} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wide text-[#6E8CA0]">
                    {latest.platform} · {latest.repo} · {latest.relTime}
                  </div>
                  <div className="mt-1 text-xs text-[#1F2E3B] leading-snug break-words">{latest.message}</div>
                </div>
              </div>
            </button>
          )}
        </section>

        {/* Page 2: about widgets */}
        <section className="w-full shrink-0 snap-center overflow-y-auto px-5 pb-2">
          <div className="pt-3 pb-4 mb-4 border-b border-[#3E8ED9]/20">
            <p className="text-[10px] font-mono text-[#3E8ED9] uppercase tracking-widest">About</p>
            <h2 className="mt-1 text-2xl font-medium text-[#24384A] tracking-tight">What I'm building</h2>
          </div>

          <div className="space-y-3">
            {ABOUT_CARDS.map((c) => (
              <div
                key={c.title}
                className="bg-white/40 border border-[#CFE3F2]/80 p-4 rounded-xl backdrop-blur-md shadow-sm"
              >
                <h3 className="text-[10px] font-mono text-[#3E8ED9] mb-2 uppercase tracking-wider">{c.title}</h3>
                <p className="text-xs leading-relaxed text-[#3C5A6E]">{c.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-[#3E8ED9]/5 border border-[#3E8ED9]/20 rounded-md text-[10px] text-[#3E8ED9] font-mono tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>

          {aboutApp && (
            <button
              onClick={() => onOpen(aboutApp)}
              className="mt-5 w-full border border-[#3E8ED9] text-[#3E8ED9] rounded-full py-2.5 text-xs tracking-wide active:bg-[#3E8ED9] active:text-white transition-colors"
            >
              Read more about me
            </button>
          )}
        </section>
      </div>

      {/* Page dots */}
      <div className="flex justify-center gap-1.5 py-2">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Page ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              page === i ? "w-4 bg-[#3E8ED9]" : "w-1.5 bg-[#3E8ED9]/30"
            }`}
          />
        ))}
      </div>

      {/* Search pill */}
      <div className="flex justify-center pb-3">
        <button
          onClick={onSearch}
          className="flex items-center gap-1.5 text-xs px-5 py-2 rounded-full border border-[#CFE3F2] bg-white/60 backdrop-blur-md text-[#24384A] active:border-[#3E8ED9] active:text-[#3E8ED9] transition-colors"
        >
          <SearchIcon className="w-3 h-3" />
          Search
        </button>
      </div>

      {/* Dock */}
      <div
        className="mx-4 rounded-[28px] bg-white/60 backdrop-blur-xl border border-[#CFE3F2] shadow-lg px-3 py-3 flex justify-around"
        style={{ marginBottom: "max(12px, env(safe-area-inset-bottom, 0px))" }}
      >
        {dockApps.map((app) => (
          <AppTile key={app.id} app={app} onOpen={onOpen} showLabel={false} />
        ))}
      </div>
    </div>
  );
}
