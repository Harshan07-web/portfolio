import { useEffect, useRef, useState } from "react";
import { projects, LINKEDIN_URL, GITHUB_URL, EMAIL } from "../Data/apps";

const PROMPT = "harshan@portfolio ~ %";

function buildOutput(raw, print) {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  const arg = args.join(" ");

  switch (cmd) {
    case "":
      return [];

    case "help":
      return [
        "available commands:",
        "  about        short bio",
        "  skills       tech stack",
        "  projects     list of projects",
        "  contact      how to reach me",
        "  github       open github profile",
        "  linkedin     open linkedin profile",
        "  resume       open resume",
        "  whoami       guess",
        "  date         current date/time",
        "  echo <text>  print text back",
        "  clear        clear the screen",
      ];

    case "about":
      return [
        "Harshan — developer working across Python, Java, FastAPI, React,",
        "and applied ML. Builds full-stack projects spanning data pipelines,",
        "dashboards, and browser extensions. Active in open source (GSSoC 2026).",
      ];

    case "skills":
      return [
        "languages   : Python, Java, JavaScript",
        "backend     : FastAPI, SQLAlchemy, MySQL",
        "frontend    : React, Vite, Tailwind CSS",
        "ml/ai       : applied ML libraries, RAG pipelines",
        "other       : Chrome extensions, ETL pipelines, blockchain (Ganache)",
      ];

    case "projects":
      return projects.flatMap((p) => [`${p.name} — ${p.desc}`, ""]);

    case "contact":
      return [
        `email    : ${EMAIL}`,
        `github   : ${GITHUB_URL.replace("https://", "")}`,
      ];

    case "github":
      window.open(GITHUB_URL, "_blank");
      return [`opening ${GITHUB_URL.replace("https://", "")} ...`];

    case "linkedin":
      window.open(LINKEDIN_URL, "_blank");
      return ["opening linkedin ..."];

    case "resume":
      window.open("/resume.pdf", "_blank");
      return ["opening resume.pdf ..."];

    case "whoami":
      return ["a developer who put a working terminal in his portfolio."];

    case "date":
      return [new Date().toString()];

    case "echo":
      return [arg || ""];

    case "ls":
      return ["about.txt  skills.txt  projects/  resume.pdf  contact.txt"];

    case "cat":
      if (arg === "about.txt") return buildOutput("about", print);
      if (arg === "skills.txt") return buildOutput("skills", print);
      if (arg === "contact.txt") return buildOutput("contact", print);
      return [`cat: ${arg || "(no file)"}: No such file or directory`];

    case "sudo":
      if (arg === "hire-harshan") {
        return [
          "[sudo] password for visitor: ********",
          "permission granted.",
          "initiating hiring sequence... done.",
          "you now have full access to a very motivated developer.",
        ];
      }
      return [`sudo: ${arg}: command not found`];

    default:
      return [`command not found: ${cmd} — try 'help'`];
  }
}

export default function Terminal() {
  const [lines, setLines] = useState([
    "welcome to harshan's portfolio terminal.",
    "type 'help' to see available commands.",
    "",
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [histIndex, setHistIndex] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const runCommand = (raw) => {
    if (raw.trim() === "clear") {
      setLines([]);
      return;
    }
    const output = buildOutput(raw, () => {});
    setLines((prev) => [...prev, `${PROMPT} ${raw}`, ...output]);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (input.trim() !== "") {
        setHistory((h) => [...h, input]);
      }
      runCommand(input);
      setInput("");
      setHistIndex(null);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex =
        histIndex === null ? history.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(nextIndex);
      setInput(history[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIndex === null) return;
      const nextIndex = histIndex + 1;
      if (nextIndex >= history.length) {
        setHistIndex(null);
        setInput("");
      } else {
        setHistIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="h-full w-full bg-[#1E211D] text-[#D7E4D3] font-mono text-xs rounded-md p-3 overflow-auto -m-4"
      style={{ height: "calc(100% + 2rem)", width: "calc(100% + 2rem)" }}
    >
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap leading-relaxed">
          {line}
        </div>
      ))}
      <div className="flex gap-2">
        <span className="text-[#7FB08A]">{PROMPT}</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent outline-none text-[#D7E4D3] caret-[#7FB08A]"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}