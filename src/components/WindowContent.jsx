import { projects, contributions, EMAIL, GITHUB_URL } from "../data/apps";
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
      
      <div className={`w-24 h-24 rounded-full bg-[#2E332F] flex items-center justify-center shadow-lg transition-transform ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
        <div className="w-6 h-6 rounded-full bg-[#F4F6F3]" />
      </div>
      
      <div className="text-center">
        <div className="text-sm font-medium text-[#2E332F]">{currentTrack.title}</div>
        <div className="text-xs text-[#5B8266] mt-1">{currentTrack.artist}</div>
      </div>
      
      <div className="flex gap-4 items-center">
        <button onClick={prevTrack} className="text-[#2E332F] hover:text-[#5B8266] transition-colors">⏮</button>
        <button onClick={togglePlay} className="text-[#2E332F] hover:text-[#5B8266] text-2xl w-6 transition-colors flex justify-center">
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button onClick={nextTrack} className="text-[#2E332F] hover:text-[#5B8266] transition-colors">⏭</button>
      </div>

      {/* Volume Slider */}
      <div className="flex items-center gap-2 mt-2 w-32">
        <span className="text-[10px] text-[#8A9086]">🔈</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-[#DCE1DB] rounded-lg appearance-none cursor-pointer accent-[#5B8266]"
        />
        <span className="text-[10px] text-[#8A9086]">🔊</span>
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
          <a className="flex items-center gap-3 text-[#3E453F] hover:text-[#5B8266]" href={`mailto:${EMAIL}`}>
            <span className="font-mono text-xs bg-[#EEF1EC] px-2 py-1 rounded">MAIL</span>
            {EMAIL}
          </a>
          <a className="flex items-center gap-3 text-[#3E453F] hover:text-[#5B8266]" href={GITHUB_URL} target="_blank" rel="noreferrer">
            <span className="font-mono text-xs bg-[#EEF1EC] px-2 py-1 rounded">GIT</span>
            {GITHUB_URL.replace("https://", "")}
          </a>
        </div>
      );

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

    case "certificates":
      return (
        <div className="space-y-3 text-sm text-[#3E453F] p-2">
          <div className="p-3 border border-[#DCE1DB] rounded hover:border-[#5B8266] transition-colors cursor-default">
            <div className="font-medium">AWS Certified Cloud Practitioner</div>
            <div className="text-xs text-[#9AA098] mt-1">Amazon Web Services</div>
          </div>
          <div className="p-3 border border-[#DCE1DB] rounded hover:border-[#5B8266] transition-colors cursor-default">
            <div className="font-medium">Data Engineering Professional Certificate</div>
            <div className="text-xs text-[#9AA098] mt-1">Coursera</div>
          </div>
        </div>
      );

    case "hackathons":
      return (
        <div className="space-y-4 font-mono text-xs p-2">
          <div className="border border-[#DCE1DB] p-4 rounded bg-[#EEF1EC]/50">
            <div className="text-[#E8B84B] text-sm font-bold">Smart India Hackathon (SIH) 2025</div>
            <div className="text-[#5B6259] mt-2">Project: Blockchain-Based Blue Carbon Registry</div>
            <div className="text-[#9AA098] mt-2">Built a decentralized ledger system to track and verify blue carbon credits.</div>
          </div>
          <div className="border border-[#DCE1DB] p-4 rounded bg-[#EEF1EC]/50">
            <div className="text-[#5B8266] text-sm font-bold">Smart Motion Hackathon 2.0</div>
            <div className="text-[#5B6259] mt-2">Chennai Institute of Technology (CIT) · Dec 2025</div>
            <div className="text-[#9AA098] mt-2">Developed and proposed technical abstracts for local problem statements.</div>
          </div>
        </div>
      );

    case "gssoc":
      return (
        <div className="h-full flex flex-col p-4 overflow-auto">
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-14 h-14 bg-[#EEF1EC] rounded-full flex items-center justify-center mb-3 text-[#5B8266]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
                <path d="M18 9v6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 6h6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 9v2c0 2.2 1.8 4 4 4h5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="18" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <circle cx="18" cy="6" r="3" />
              </svg>
            </div>
            <h3 className="text-[#3E453F] font-bold text-lg">GirlScript Summer of Code 2026</h3>
            <p className="text-[#6E766F] text-xs mt-2 max-w-xs leading-relaxed">
              Contributing to open source projects, reviewing pull requests, and shipping features in collaborative repos.
            </p>
          </div>
          <div className="space-y-3 pr-1">
            {contributions.map((c) => (
              <a
                key={c.name}
                href={c.link}
                target="_blank"
                rel="noreferrer"
                className="block border border-[#DCE1DB] rounded-md p-3 hover:border-[#5B8266] hover:bg-[#5B8266]/5 transition-all"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-[#2E332F] font-medium">{c.name}</div>
                  {c.upstream && (
                    <div className="text-[9px] font-mono text-[#9AA098] whitespace-nowrap">
                      fork of {c.upstream}
                    </div>
                  )}
                </div>
                <div className="text-xs text-[#6E766F] mt-1.5 leading-relaxed">{c.desc}</div>
              </a>
            ))}
          </div>
        </div>
      );

    case "activities":
      return (
        <div className="p-4 space-y-2 text-sm text-[#3E453F]">
          <h3 className="font-medium border-b border-[#DCE1DB] pb-2 mb-3">Highlights & Initiatives</h3>
          <ul className="list-disc list-outside ml-4 space-y-3 text-[#5B6259]">
            <li><strong className="text-[#3E453F]">Google Summer of Code (GSoC) 2026:</strong> Official applicant for the mid-March intake.</li>
            <li><strong className="text-[#3E453F]">30-Day Learning Sprint:</strong> Designed and executed an intensive holiday curriculum covering cloud computing, DevOps, and MLOps (Dec 2025).</li>
            <li><strong className="text-[#3E453F]">Technical Collaborator:</strong> Active participant in university coding clubs and collaborative group projects.</li>
          </ul>
        </div>
      );

    case "music":
      return <LofiPlayer />;

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