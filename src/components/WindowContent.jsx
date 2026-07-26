import { projects } from "../data/apps";
import Terminal from "./Terminal";

export default function WindowContent({ appId }) {
  switch (appId) {
    case "terminal":
      return <Terminal />;

    case "about":
      return (
        <div className="space-y-3">
          <p>
            I'm Harshan, a developer working across Python, Java, FastAPI,
            React, and applied ML. I build full-stack projects spanning data
            pipelines, dashboards, and browser extensions.
          </p>
          <p>
            Currently contributing to open source through GSSoC 2026, and
            building out projects like FutHommie, AstroGuard, and Rx-Block.
          </p>
        </div>
      );

    case "projects":
      return (
        <div className="space-y-4">
          {projects.map((p) => (
            <a
              key={p.name}
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="block border border-[#DCE1DB] rounded-md p-3 hover:border-[#5B8266] transition-colors"
            >
              <div className="text-[#2E332F] font-medium">{p.name}</div>
              <div className="text-xs text-[#6E766F] mt-1">{p.desc}</div>
            </a>
          ))}
        </div>
      );

    case "resume":
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
          <p className="text-[#6E766F] text-xs">
            Resume preview will render here.
          </p>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="border border-[#5B8266] text-[#5B8266] rounded-md px-4 py-2 text-xs hover:bg-[#5B8266] hover:text-white transition-colors"
          >
            Open Resume PDF
          </a>
        </div>
      );

    case "contact":
      return (
        <div className="space-y-3 text-xs">
          <p className="text-[#6E766F]">Reach out directly:</p>
          <a
            className="block text-[#3E453F] hover:text-[#5B8266]"
            href="mailto:your-email@example.com"
          >
            your-email@example.com
          </a>
          <a
            className="block text-[#3E453F] hover:text-[#5B8266]"
            href="https://github.com/Harshan07-web"
            target="_blank"
            rel="noreferrer"
          >
            github.com/Harshan07-web
          </a>
        </div>
      );

    default:
      return null;
  }
}