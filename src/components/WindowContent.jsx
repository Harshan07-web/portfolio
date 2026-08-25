import { useState, useEffect } from "react";
import { projects } from "../data/apps";
import Terminal from "./Terminal";

// --- MINI APPS ---

function AimTrainer() {
  const [score, setScore] = useState(0);
  const [pos, setPos] = useState({ top: 50, left: 50 });

  const moveTarget = () => {
    setPos({
      top: Math.random() * 80 + 10,
      left: Math.random() * 80 + 10,
    });
  };

  return (
    <div className="relative w-full h-full bg-[#1E211D] overflow-hidden flex flex-col items-center justify-center select-none">
      <div className="absolute top-4 left-4 text-xs font-mono text-[#7FB08A]">
        Score: {score} | Config: 4-Finger Claw + Full Gyro 
      </div>
      {score === 0 ? (
        <button
          onClick={() => { setScore(1); moveTarget(); }}
          className="px-6 py-2 border border-[#7FB08A] text-[#7FB08A] font-mono text-xs rounded hover:bg-[#7FB08A] hover:text-[#1E211D] transition-colors"
        >
          INITIATE WARMUP
        </button>
      ) : (
        <button
          onMouseDown={(e) => {
            e.stopPropagation();
            setScore(s => s + 1);
            moveTarget();
          }}
          style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
          className="absolute w-8 h-8 bg-[#C96A5A] rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_12px_#C96A5A]"
        />
      )}
    </div>
  );
}

function DatabaseManager() {
  return (
    <div className="w-full h-full bg-[#1E211D] text-[#D7E4D3] font-mono text-xs p-4 overflow-auto">
      <div className="text-[#8A9086]">-- Connected to Snowflake WH: futhommie_prod --</div>
      <div className="mt-3 text-[#E8B84B] leading-relaxed">
        WITH RankedStats AS (<br/>
        &nbsp;&nbsp;SELECT player_id, goals, assists,<br/>
        &nbsp;&nbsp;RANK() OVER(PARTITION BY team_id ORDER BY goals DESC) as team_rank<br/>
        &nbsp;&nbsp;FROM player_match_logs<br/>
        )<br/>
        SELECT * FROM RankedStats WHERE team_rank = 1;
      </div>
      <div className="mt-4 border-t border-[#3E453F] pt-3">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#3E453F] text-[#7FB08A]">
              <th className="pb-2 font-normal">player_id</th>
              <th className="pb-2 font-normal">goals</th>
              <th className="pb-2 font-normal">assists</th>
              <th className="pb-2 font-normal">team_rank</th>
            </tr>
          </thead>
          <tbody className="text-[#9AA098]">
            <tr><td className="py-1.5">P_1001</td><td>24</td><td>12</td><td>1</td></tr>
            <tr><td className="py-1.5">P_2044</td><td>18</td><td>8</td><td>1</td></tr>
            <tr><td className="py-1.5">P_3012</td><td>15</td><td>15</td><td>1</td></tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-[#7FB08A] animate-pulse"> Query executed in 1.24s. Optimized via CTE.</div>
    </div>
  );
}

function BlockchainNode() {
  const [logs, setLogs] = useState([
    "[Ganache CLI] Starting local RPC server...",
    "Listening on 127.0.0.1:8545",
    "Initializing Rx-Block smart contracts..."
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLogs(prev => [
        ...prev, 
        `[Block #${prev.length - 2}] Mined successfully! Hash: 0x${Math.random().toString(16).substr(2, 12)}...`
      ]);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full bg-[#1E211D] text-[#7FB08A] font-mono text-[11px] p-4 overflow-auto flex flex-col gap-1">
      {logs.map((log, i) => (
        <div key={i} className={log.includes("Rx-Block") ? "text-[#E8B84B]" : ""}>
          {log}
        </div>
      ))}
    </div>
  );
}

// --- MAIN CONTENT SWITCHER ---

export default function WindowContent({ appId }) {
  switch (appId) {
    case "terminal":
      return <Terminal />;

    case "about":
      return (
        <div className="space-y-4 leading-relaxed">
          <p>
            I'm Harshan, a developer working across Python, Java, FastAPI,
            React, and applied ML. I build full-stack projects spanning data
            pipelines, dashboards, and backend architectures.
          </p>
          <p>
            Currently contributing to open source through GSSoC 2026, and
            building out systems like FutHommie, AstroGuard, and Rx-Block.
          </p>
        </div>
      );

    case "projects":
      return (
        <div className="space-y-4 pr-2">
          {projects.map((p) => (
            <a
              key={p.name}
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="block border border-[#DCE1DB] rounded-md p-3 hover:border-[#5B8266] hover:bg-[#5B8266]/5 transition-all"
            >
              <div className="text-[#2E332F] font-medium">{p.name}</div>
              <div className="text-xs text-[#6E766F] mt-1.5 leading-relaxed">{p.desc}</div>
            </a>
          ))}
        </div>
      );

    case "resume":
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
          <div className="w-16 h-16 bg-[#EEF1EC] rounded-full flex items-center justify-center text-2xl">📄</div>
          <p className="text-[#6E766F] text-xs">
            Resume viewer requires PDF plugin.
          </p>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="border border-[#5B8266] text-[#5B8266] rounded-md px-5 py-2 text-xs hover:bg-[#5B8266] hover:text-white transition-colors mt-2"
          >
            Download PDF
          </a>
        </div>
      );

    case "contact":
      return (
        <div className="space-y-4 text-sm h-full flex flex-col justify-center px-4">
          <p className="text-[#6E766F] text-xs mb-2">Initialize connection protocol:</p>
          <a className="flex items-center gap-3 text-[#3E453F] hover:text-[#5B8266]" href="mailto:your-email@example.com">
            <span className="font-mono text-xs bg-[#EEF1EC] px-2 py-1 rounded">MAIL</span>
            your-email@example.com
          </a>
          <a className="flex items-center gap-3 text-[#3E453F] hover:text-[#5B8266]" href="https://github.com/Harshan07-web" target="_blank" rel="noreferrer">
            <span className="font-mono text-xs bg-[#EEF1EC] px-2 py-1 rounded">GIT</span>
            github.com/Harshan07-web
          </a>
        </div>
      );

    /* --- NEW APPS CONTENT --- */

    case "settings":
      return (
        <div className="p-2 space-y-4 text-sm">
          <div className="flex justify-between items-center border-b border-[#DCE1DB] pb-3">
            <span className="text-[#2E332F] font-medium">System Theme</span>
            <span className="text-[#5B8266] text-xs bg-[#5B8266]/10 px-2 py-1 rounded">Forest Minimal (Locked)</span>
          </div>
          <div className="flex justify-between items-center border-b border-[#DCE1DB] pb-3">
            <span className="text-[#2E332F] font-medium">Language Model</span>
            <span className="text-[#6E766F] text-xs">Tamil / English</span>
          </div>
          <div className="flex justify-between items-center border-b border-[#DCE1DB] pb-3">
            <span className="text-[#2E332F] font-medium">OS Version</span>
            <span className="text-[#6E766F] text-xs">HarshanOS v2.0.26</span>
          </div>
        </div>
      );

    case "gallery":
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#EEF1EC] border border-dashed border-[#DCE1DB] rounded">
          <div className="text-center">
            <div className="text-4xl mb-3">🕸️</div>
            <p className="text-xs font-mono text-[#6E766F]">Airflow DAG Visualization<br/>Loading schema...</p>
          </div>
        </div>
      );

    case "browser":
      return (
        <div className="w-full h-full flex flex-col">
          <div className="flex gap-2 mb-3 bg-[#EEF1EC] p-2 rounded">
            <span className="text-[#9AA098] font-mono text-xs">https://localhost:8000/api/v1/futhommie</span>
          </div>
          <div className="flex-1 border border-[#DCE1DB] border-dashed rounded flex items-center justify-center text-[#9AA098] text-xs">
            {"{ \"status\": 200, \"message\": \"FastAPI server running\" }"}
          </div>
        </div>
      );

    case "database":
      return <DatabaseManager />;

    case "blockchain":
      return <BlockchainNode />;

    case "aim_trainer":
      return <AimTrainer />;

    case "music":
      return (
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <div className="w-24 h-24 rounded-full bg-[#2E332F] flex items-center justify-center shadow-lg animate-[spin_10s_linear_infinite]">
            <div className="w-6 h-6 rounded-full bg-[#F4F6F3]" />
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-[#2E332F]">Deep Focus.mp3</div>
            <div className="text-xs text-[#5B8266] mt-1">Coding Session // Vol. 1</div>
          </div>
          <div className="flex gap-4">
            <button className="text-[#2E332F] hover:text-[#5B8266]">⏮</button>
            <button className="text-[#2E332F] hover:text-[#5B8266] text-xl">▶</button>
            <button className="text-[#2E332F] hover:text-[#5B8266]">⏭</button>
          </div>
        </div>
      );

    case "trash":
      return (
        <div className="space-y-1 font-mono text-xs">
          <div className="flex items-center justify-between p-2 hover:bg-[#EEF1EC] rounded group cursor-default">
            <div className="flex items-center gap-3 text-[#3E453F]">
              <span className="text-lg opacity-80">📄</span> sih_25_finale_pitch.pdf
            </div>
            <span className="text-[#9AA098] opacity-0 group-hover:opacity-100">12 MB</span>
          </div>
          <div className="flex items-center justify-between p-2 hover:bg-[#EEF1EC] rounded group cursor-default">
            <div className="flex items-center gap-3 text-[#3E453F]">
              <span className="text-lg opacity-80">🐍</span> messy_folder_organizer.py
            </div>
            <span className="text-[#9AA098] opacity-0 group-hover:opacity-100">4 KB</span>
          </div>
          <div className="flex items-center justify-between p-2 hover:bg-[#EEF1EC] rounded group cursor-default">
            <div className="flex items-center gap-3 text-[#3E453F]">
              <span className="text-lg opacity-80">📋</span> house_md_diagnoses_list.txt
            </div>
            <span className="text-[#9AA098] opacity-0 group-hover:opacity-100">82 KB</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}