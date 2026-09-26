import { projects } from "../Data/apps";
import Terminal from "./Terminal";
import { useState, useEffect, useRef } from "react";

// --- MINI APPS ---

function LofiPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5); // Default to 50% volume
  const audioRef = useRef(null);

  // Add your own local MP3s here later! (e.g., src: "/my-song.mp3")
  const playlist = [
    { 
      title: "Deep Focus.mp3", 
      artist: "Coding Session // Vol. 1", 
      src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" 
    },
    { 
      title: "Late Night Code.mp3", 
      artist: "Coding Session // Vol. 2", 
      src: "https://cdn.pixabay.com/download/audio/2022/04/27/audio_7569b3f947.mp3" 
    },
    { 
      title: "Bugs & Brews.mp3", 
      artist: "Coding Session // Vol. 3", 
      src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8285513.mp3" 
    }
  ];

  const currentTrack = playlist[trackIndex];

  // Sync the React volume state with the actual HTML audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const prevTrack = () => {
    setTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Playback blocked:", e));
    }
  }, [trackIndex, isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5">
      <audio 
        ref={audioRef} 
        src={currentTrack.src} 
        onEnded={nextTrack} 
      />
      
      <div className={`w-24 h-24 rounded-full bg-[#1F2E3B] flex items-center justify-center shadow-lg transition-transform ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
        <div className="w-6 h-6 rounded-full bg-[#EAF4FB]" />
      </div>
      
      <div className="text-center">
        <div className="text-sm font-medium text-[#1F2E3B]">{currentTrack.title}</div>
        <div className="text-xs text-[#3E8ED9] mt-1">{currentTrack.artist}</div>
      </div>
      
      <div className="flex gap-4 items-center">
        <button onClick={prevTrack} className="text-[#1F2E3B] hover:text-[#3E8ED9] transition-colors">⏮</button>
        <button onClick={togglePlay} className="text-[#1F2E3B] hover:text-[#3E8ED9] text-2xl w-6 transition-colors flex justify-center">
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button onClick={nextTrack} className="text-[#1F2E3B] hover:text-[#3E8ED9] transition-colors">⏭</button>
      </div>

      {/* Volume Slider */}
      <div className="flex items-center gap-2 mt-2 w-32">
        <span className="text-[10px] text-[#6E8CA0]">🔈</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-[#CFE3F2] rounded-lg appearance-none cursor-pointer accent-[#3E8ED9]"
        />
        <span className="text-[10px] text-[#6E8CA0]">🔊</span>
      </div>
    </div>
  );
}

export default function WindowContent({ appId }) {
  switch (appId) {
    case "terminal":
      return <Terminal />;

    case "about":
      return (
        <div className="space-y-5 leading-relaxed">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3E8ED9] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3E8ED9]"></span>
            </span>
            <span className="text-[10px] font-mono text-[#6E8CA0] tracking-wider">SYSTEM_ONLINE</span>
          </div>

          <p>
            I'm Harshan, a Data Engineer &amp; CS student working across Python, FastAPI,
            React, and applied ML to build full-stack products, data pipelines, and robust
            ETL workflows end to end.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#E8F3FC]/60 border border-[#CFE3F2] p-3.5 rounded-lg">
              <h3 className="text-[10px] font-mono text-[#3E8ED9] mb-2 uppercase tracking-wider">01. The Stack</h3>
              <p className="text-xs leading-relaxed text-[#3C5A6E]">
                Python, FastAPI, React, and applied ML to build full-stack products, data
                pipelines, and robust ETL workflows end to end.
              </p>
            </div>
            <div className="bg-[#E8F3FC]/60 border border-[#CFE3F2] p-3.5 rounded-lg">
              <h3 className="text-[10px] font-mono text-[#3E8ED9] mb-2 uppercase tracking-wider">02. Current Focus</h3>
              <p className="text-xs leading-relaxed text-[#3C5A6E]">
                Orchestration with Airflow, warehousing with Snowflake, and backend systems
                that move and shape data reliably at scale.
              </p>
            </div>
            <div className="bg-[#E8F3FC]/60 border border-[#CFE3F2] p-3.5 rounded-lg sm:col-span-2">
              <h3 className="text-[10px] font-mono text-[#3E8ED9] mb-2 uppercase tracking-wider">03. Recent Deployments</h3>
              <p className="text-xs leading-relaxed text-[#3C5A6E]">
                Architected Rx-Block, a blockchain-powered pharmaceutical tracking system,
                alongside FutHommie, a football statistics platform featuring a complete
                FastAPI/MySQL ETL pipeline.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['Python', 'FastAPI', 'React', 'MySQL', 'Airflow', 'Snowflake', 'Web3.py', 'Solidity'].map(tag => (
              <span key={tag} className="px-2.5 py-1 bg-[#3E8ED9]/5 border border-[#3E8ED9]/20 rounded-md text-[10px] text-[#3E8ED9] font-mono tracking-wide">
                {tag}
              </span>
            ))}
          </div>

          <p className="text-xs text-[#58748A]">
            Currently contributing to open source through GSSoC 2026, and building out
            systems like FutHommie, AstroGuard, and Rx-Block.
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
              className="block border border-[#CFE3F2] rounded-md p-3 hover:border-[#3E8ED9] hover:bg-[#3E8ED9]/5 transition-all"
            >
              <div className="text-[#1F2E3B] font-medium">{p.name}</div>
              <div className="text-xs text-[#58748A] mt-1.5 leading-relaxed">{p.desc}</div>
            </a>
          ))}
        </div>
      );

    case "resume":
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
          <div className="w-16 h-16 bg-[#E8F3FC] rounded-full flex items-center justify-center text-2xl">📄</div>
          <p className="text-[#58748A] text-xs">
            Resume viewer requires PDF plugin.
          </p>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="border border-[#3E8ED9] text-[#3E8ED9] rounded-md px-5 py-2 text-xs hover:bg-[#3E8ED9] hover:text-white transition-colors mt-2"
          >
            Download PDF
          </a>
        </div>
      );

    case "contact":
      return (
        <div className="space-y-4 text-sm h-full flex flex-col justify-center px-4">
          <p className="text-[#58748A] text-xs mb-2">Initialize connection protocol:</p>
          <a className="flex items-center gap-3 text-[#24384A] hover:text-[#3E8ED9]" href="mailto:your-email@example.com">
            <span className="font-mono text-xs bg-[#E8F3FC] px-2 py-1 rounded">MAIL</span>
            your-email@example.com
          </a>
          <a className="flex items-center gap-3 text-[#24384A] hover:text-[#3E8ED9]" href="https://github.com/Harshan07-web" target="_blank" rel="noreferrer">
            <span className="font-mono text-xs bg-[#E8F3FC] px-2 py-1 rounded">GIT</span>
            github.com/Harshan07-web
          </a>
        </div>
      );

    case "settings":
      return (
        <div className="p-2 space-y-4 text-sm">
          <div className="flex justify-between items-center border-b border-[#CFE3F2] pb-3">
            <span className="text-[#1F2E3B] font-medium">System Theme</span>
            <span className="text-[#3E8ED9] text-xs bg-[#3E8ED9]/10 px-2 py-1 rounded">Forest Minimal (Locked)</span>
          </div>
          <div className="flex justify-between items-center border-b border-[#CFE3F2] pb-3">
            <span className="text-[#1F2E3B] font-medium">Language Model</span>
            <span className="text-[#58748A] text-xs">Tamil / English</span>
          </div>
          <div className="flex justify-between items-center border-b border-[#CFE3F2] pb-3">
            <span className="text-[#1F2E3B] font-medium">OS Version</span>
            <span className="text-[#58748A] text-xs">HarshanOS v2.0.26</span>
          </div>
        </div>
      );

    case "browser":
      return (
        <div className="w-full h-full flex flex-col">
          <div className="flex gap-2 mb-3 bg-[#E8F3FC] p-2 rounded">
            <span className="text-[#7E97AC] font-mono text-xs">https://localhost:8000/api/v1/futhommie</span>
          </div>
          <div className="flex-1 border border-[#CFE3F2] border-dashed rounded flex items-center justify-center text-[#7E97AC] text-xs">
            {"{ \"status\": 200, \"message\": \"FastAPI server running\" }"}
          </div>
        </div>
      );

    case "certificates":
      return (
        <div className="space-y-3 text-sm text-[#24384A] p-2">
          <div className="p-3 border border-[#CFE3F2] rounded hover:border-[#3E8ED9] transition-colors cursor-default">
            <div className="font-medium">ML Fundamentals</div>
            <div className="text-xs text-[#7E97AC] mt-1">LinkedIn Learning</div>
          </div>
          <div className="p-3 border border-[#CFE3F2] rounded hover:border-[#3E8ED9] transition-colors cursor-default">
            <div className="font-medium">AI Fundamentals</div>
            <div className="text-xs text-[#7E97AC] mt-1">LinkedIn Learning</div>
          </div>
          <div className="p-3 border border-[#CFE3F2] rounded hover:border-[#3E8ED9] transition-colors cursor-default">
            <div className="font-medium">AI Fundamentals</div>
            <div className="text-xs text-[#7E97AC] mt-1">IBM</div>
          </div>
          <div className="p-3 border border-[#CFE3F2] rounded hover:border-[#3E8ED9] transition-colors cursor-default">
            <div className="font-medium">Intro to Databricks</div>
            <div className="text-xs text-[#7E97AC] mt-1">DataCamp</div>
          </div>
        </div>
      );

    case "hackathons":
      return (
        <div className="space-y-3 font-mono text-xs p-2">
          <div className="border border-[#CFE3F2] p-4 rounded bg-[#E8F3FC]/50 flex items-center justify-between">
            <div>
              <div className="text-[#24384A] text-sm font-bold">Smart Motion Hackathon</div>
              <div className="text-[#7E97AC] mt-1">Chennai Institute of Technology (CIT) · 2025</div>
            </div>
            <span className="text-[10px] text-[#3E8ED9] bg-[#3E8ED9]/10 px-2 py-1 rounded shrink-0">Participation</span>
          </div>
          <div className="border border-[#CFE3F2] p-4 rounded bg-[#E8F3FC]/50 flex items-center justify-between">
            <div>
              <div className="text-[#24384A] text-sm font-bold">iterXY '26</div>
              <div className="text-[#7E97AC] mt-1">St. Joseph's College of Engineering</div>
            </div>
            <span className="text-[10px] text-[#3E8ED9] bg-[#3E8ED9]/10 px-2 py-1 rounded shrink-0">Participation</span>
          </div>
          <div className="border border-[#CFE3F2] p-4 rounded bg-[#E8F3FC]/50 flex items-center justify-between">
            <div>
              <div className="text-[#24384A] text-sm font-bold">HackFusion</div>
              <div className="text-[#7E97AC] mt-1">Chennai Institute of Technology (CIT) · 2026</div>
            </div>
            <span className="text-[10px] text-[#3E8ED9] bg-[#3E8ED9]/10 px-2 py-1 rounded shrink-0">Participation</span>
          </div>
          <div className="border border-[#CFE3F2] p-4 rounded bg-[#E8F3FC]/50 flex items-center justify-between">
            <div>
              <div className="text-[#24384A] text-sm font-bold">Google Solution Challenge</div>
            </div>
            <span className="text-[10px] text-[#3E8ED9] bg-[#3E8ED9]/10 px-2 py-1 rounded shrink-0">Participation</span>
          </div>
        </div>
      );

    case "gssoc":
      return (
        <div className="h-full flex flex-col justify-center items-center text-center p-4">
          <div className="w-16 h-16 bg-[#E8F3FC] rounded-full flex items-center justify-center text-2xl mb-4 text-[#3E8ED9]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
              <path d="M18 9v6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 6h6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 9v2c0 2.2 1.8 4 4 4h5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="18" cy="18" r="3" />
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="6" r="3" />
            </svg>
          </div>
          <h3 className="text-[#24384A] font-bold text-lg">GirlScript Summer of Code 2026</h3>
          <p className="text-[#58748A] text-sm mt-2 max-w-xs leading-relaxed">
            Actively contributing to open source projects, reviewing pull requests, and building features in collaborative environments.
          </p>
        </div>
      );

    case "activities":
      return (
        <div className="p-4 space-y-2 text-sm text-[#24384A]">
          <h3 className="font-medium border-b border-[#CFE3F2] pb-2 mb-3">Highlights & Initiatives</h3>
          <ul className="list-disc list-outside ml-4 space-y-3 text-[#3C5A6E]">
            <li><strong className="text-[#24384A]">Code Mavericks (AI/ML Coding Club):</strong> Member, 1st year.</li>
            <li><strong className="text-[#24384A]">Association of AIML:</strong> Executive Member, 3rd year.</li>
            <li><strong className="text-[#24384A]">Code Mavericks (AI/ML Coding Club):</strong> President, 4th year.</li>
            <li><strong className="text-[#24384A]">National-Level Technical Symposium:</strong> Coordinated the conduction of the event.</li>
            <li><strong className="text-[#24384A]">Coding Events:</strong> Conducted various coding events for the college community.</li>
            <li><strong className="text-[#24384A]">Volunteering:</strong> Volunteered at various events across college.</li>
          </ul>
        </div>
      );

    case "music":
      return <LofiPlayer />;

    case "trash":
      return (
        <div className="space-y-1 font-mono text-xs">
          <div className="flex items-center justify-between p-2 hover:bg-[#E8F3FC] rounded group cursor-default">
            <div className="flex items-center gap-3 text-[#24384A]">
              <span className="text-lg opacity-80">📄</span> sih_25_finale_pitch.pdf
            </div>
            <span className="text-[#7E97AC] opacity-0 group-hover:opacity-100">12 MB</span>
          </div>
          <div className="flex items-center justify-between p-2 hover:bg-[#E8F3FC] rounded group cursor-default">
            <div className="flex items-center gap-3 text-[#24384A]">
              <span className="text-lg opacity-80">🐍</span> messy_folder_organizer.py
            </div>
            <span className="text-[#7E97AC] opacity-0 group-hover:opacity-100">4 KB</span>
          </div>
          <div className="flex items-center justify-between p-2 hover:bg-[#E8F3FC] rounded group cursor-default">
            <div className="flex items-center gap-3 text-[#24384A]">
              <span className="text-lg opacity-80">📋</span> house_md_diagnoses_list.txt
            </div>
            <span className="text-[#7E97AC] opacity-0 group-hover:opacity-100">82 KB</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}