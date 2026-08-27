// Central app registry + project data for HarshanOS.
// Every component (Desktop, TaskBar, SearchOverlay, Terminal, WindowContent)
// imports from here, so this is the single place to add/edit an app or project.

export const GITHUB_URL = "https://github.com/Harshan07-web";
export const EMAIL = "bharshan17@gmail.com";
// TODO: swap in your real LinkedIn handle
export const LINKEDIN_URL = "https://www.linkedin.com/in/harshan07-/";

// --- Personal projects -----------------------------------------------------
export const projects = [
  {
    name: "FutHommie",
    desc: "End-to-end football analytics pipeline — pulls stats from an external API, transforms them into analytics-ready datasets, stores them in a relational database, and serves them through a live web dashboard.",
    link: "https://github.com/Harshan07-web/FutHommie",
    homepage: "https://futhommie.vercel.app/",
  },
  {
    name: "Rx-Block",
    desc: "Blockchain + smart contracts + FastAPI powering an immutable, decentralized medical supply chain, built to keep counterfeit medicine from slipping into circulation.",
    link: "https://github.com/Harshan07-web/Rx-Block",
  },
  {
    name: "Counterfactual Football Intelligence",
    desc: "ML-driven football analytics that model counterfactual outcomes — exploring how match results might have shifted under different in-game decisions.",
    link: "https://github.com/Harshan07-web/counterfactual_football_intelligence",
  },
  {
    name: "API Benchmarking Suite",
    desc: "Full-stack platform for monitoring and benchmarking REST APIs under configurable workloads, tracking latency and throughput over time.",
    link: "https://github.com/Harshan07-web/api_benchmarking_suite",
  },
  {
    name: "Football Simulation",
    desc: "Reinforcement-learning-based football match simulator exploring tactical decision-making through simulated play.",
    link: "https://github.com/Harshan07-web/football_simulation",
  },
  {
    name: "Data Quality Observatory",
    desc: "Data engineering platform that profiles datasets and continuously scores their quality — flags missing values, duplicates, schema drift, type mismatches, and outliers via an overall Data Health Score.",
    link: "https://github.com/Harshan07-web/Data_quality_observatory",
  },
  {
    name: "NEET-Trace",
    desc: "Python project for tracking and analyzing NEET exam-related data.",
    link: "https://github.com/Harshan07-web/NEET-Trace",
  },
  {
    name: "AI Math Tutor",
    desc: "AI-powered math tutor built with Gemini and SymPy — solves problems step by step and explains the reasoning to clear up doubts.",
    link: "https://github.com/Harshan07-web/AI-Math-Tutor",
  },
  {
    name: "LangChain + Gemini Playground",
    desc: "Collection of programs built during a first internship at Sutherland, exploring LangChain and Gemini integrations.",
    link: "https://github.com/Harshan07-web/Langchain-using-genimi",
  },
];

// --- GSSoC 2026 open-source contributions (forked repos) --------------------
export const contributions = [
  {
    name: "Deckflow",
    desc: "AI presentation builder — write a prompt, pick a theme, get an editable deck you can drag, rewrite via chat, and export to PowerPoint or PDF.",
    link: "https://github.com/Harshan07-web/Deckflow",
    upstream: "izhan0102/exdeck",
  },
  {
    name: "BizInsight AI",
    desc: "Turns customer reviews into actionable insight — sentiment analysis, issue detection, trend tracking, and recommendations in one dashboard.",
    link: "https://github.com/Harshan07-web/BizInsight-AI",
    upstream: "Prateekiiitg56/BizInsight-AI",
  },
  {
    name: "Agri-Vision",
    desc: "AI cotton-crop analysis system using deep learning and computer vision to detect growth stages and crop health issues via a Flask app and REST API.",
    link: "https://github.com/Harshan07-web/Agri-Vision",
    upstream: "neeru24/Agri-Vision",
  },
  {
    name: "Humane-Proxy",
    desc: "Lightweight AI-safety middleware that intercepts self-harm and criminal-intent signals in LLM conversations before they reach the model.",
    link: "https://github.com/Harshan07-web/Humane-Proxy",
    upstream: "Vishisht16/Humane-Proxy",
  },
  {
    name: "DevPath",
    desc: "Recommends real coding projects to build based on your skills, experience level, interests, and available time.",
    link: "https://github.com/Harshan07-web/DevPath",
    upstream: "komalharshita/DevPath",
  },
  {
    name: "Smart Ingredient Checker",
    desc: "Scans ingredient lists and flags potentially harmful or allergenic ingredients.",
    link: "https://github.com/Harshan07-web/Smart-Ingredient-Checker",
    upstream: "Jaiminkansagara1327/Smart-Ingredient-Checker",
  },
  {
    name: "LeetcodeAI",
    desc: "AI-assisted LeetCode practice tool.",
    link: "https://github.com/Harshan07-web/LeetcodeAI",
    upstream: "vanshaggarwal27/LeetcodeAI",
  },
];

// --- App / window registry --------------------------------------------------
export const apps = [
  { id: "about", title: "About Me" },
  { id: "projects", title: "Projects", defaultSize: { width: 520, height: 460 } },
  { id: "resume", title: "Resume" },
  { id: "contact", title: "Contact" },
  { id: "terminal", title: "Terminal", defaultSize: { width: 560, height: 380 } },
  { id: "github", title: "GitHub", type: "link", url: GITHUB_URL },
  { id: "linkedin", title: "LinkedIn", type: "link", url: LINKEDIN_URL },
  { id: "settings", title: "Settings" },
  { id: "browser", title: "Browser" },
  { id: "music", title: "Lofi Player" },
  { id: "certificates", title: "Certificates" },
  { id: "hackathons", title: "Hackathons" },
  { id: "gssoc", title: "GSSoC '26" },
  { id: "activities", title: "Activities" },
  { id: "trash", title: "Recycle Bin" },
];