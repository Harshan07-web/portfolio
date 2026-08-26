// Central registry of desktop icons / apps.
// type: "window" opens an in-desktop window, "link" opens external URL directly.
export const apps = [
  {
    id: "terminal",
    title: "Terminal",
    type: "window",
    icon: "⌨️",
    defaultSize: { width: 560, height: 400 },
  },
  {
    id: "about",
    title: "About Me",
    type: "window",
    icon: "👤",
    defaultSize: { width: 480, height: 380 },
  },
  {
    id: "projects",
    title: "Projects",
    type: "window",
    icon: "🗂️",
    defaultSize: { width: 620, height: 440 },
  },
  {
    id: "resume",
    title: "Resume",
    type: "window",
    icon: "📄",
    defaultSize: { width: 520, height: 500 },
  },
  {
    id: "contact",
    title: "Contact",
    type: "window",
    icon: "✉️",
    defaultSize: { width: 420, height: 320 },
  },
  {
    id: "github",
    title: "GitHub",
    type: "link",
    icon: "🐙",
    url: "https://github.com/Harshan07-web",
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    type: "link",
    icon: "in",
    url: "https://linkedin.com/in/your-handle",
  },
// --- New Apps ---
  {
    id: "settings",
    title: "Control Panel",
    type: "window",
    icon: "⚙️",
    defaultSize: { width: 500, height: 400 },
  },
  {
    id: "browser",
    title: "Web Explorer",
    type: "window",
    icon: "🌐",
    defaultSize: { width: 800, height: 600 },
  },
  {
    id: "certificates",
    title: "Certificates",
    type: "window",
    icon: "🎓",
    defaultSize: { width: 500, height: 400 },
  },
  {
    id: "hackathons",
    title: "Hackathons",
    type: "window",
    icon: "⚡",
    defaultSize: { width: 600, height: 450 },
  },
  {
    id: "gssoc",
    title: "GSSoC '26",
    type: "window",
    icon: "💻",
    defaultSize: { width: 500, height: 400 },
  },
  {
    id: "activities",
    title: "Activities",
    type: "window",
    icon: "🌟",
    defaultSize: { width: 450, height: 350 },
  },
  {
    id: "music",
    title: "Lo-fi Player",
    type: "window",
    icon: "🎵",
    defaultSize: { width: 320, height: 420 },
  },
  {
    id: "trash",
    title: "Recycle Bin",
    type: "window",
    icon: "🗑️",
    defaultSize: { width: 400, height: 300 },
  }
];

export const projects = [
  {
    name: "FutHommie",
    desc: "Football statistics web app tracking European leagues and the World Cup. React + FastAPI + MySQL.",
    link: "https://github.com/Harshan07-web",
  },
  {
    name: "AstroGuard",
    desc: "Space radiation health monitoring using NASA DONKI data with a physiological simulation engine.",
    link: "https://github.com/Harshan07-web",
  },
  {
    name: "Rx-Block",
    desc: "Blockchain pharmaceutical supply chain platform with an AI advisor. Submitted to Google Solution Challenge 2026.",
    link: "https://github.com/Harshan07-web",
  },
  {
    name: "LeetLog AI",
    desc: "Chrome extension + FastAPI backend that auto-generates blog posts from LeetCode solutions.",
    link: "https://github.com/Harshan07-web",
  },
];