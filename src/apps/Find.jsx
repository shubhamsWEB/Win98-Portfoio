import { useMemo, useState } from "react";
import { documents, experience, projects } from "../content.js";
import { icons } from "../icons.js";

export default function Find({ openApp }) {
  const [query, setQuery] = useState("");
  const index = useMemo(
    () => [
      ...projects.map((p) => ({
        id: p.id, name: p.name, where: "C:\\Projects", icon: icons.file,
        text: `${p.name} ${p.desc} ${p.stack.join(" ")}`,
        open: () => openApp("projects", { select: p.id, folder: p.folder }),
      })),
      ...experience.map((j) => ({
        id: j.company, name: j.company, where: "Experience", icon: icons.text,
        text: `${j.company} ${j.role} ${j.points.join(" ")}`,
        open: () => openApp("about", { tab: "Experience" }),
      })),
      {
        id: "resume", name: "Resume.pdf", where: "C:\\", icon: icons.pdf,
        text: "resume cv pdf download " + documents["RESUME.TXT"],
        open: () => openApp("resume"),
      },
      ...Object.keys(documents).map((d) => ({
        id: d, name: d, where: "C:\\", icon: icons.notepad, text: `${d} ${documents[d]}`,
        open: () => openApp("notepad", { doc: d, text: documents[d] }),
      })),
    ],
    [openApp]
  );
  const q = query.trim().toLowerCase();
  const results = q ? index.filter((f) => f.text.toLowerCase().includes(q)) : [];

  return (
    <div className="find">
      <form className="find-form" role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="find-q">Containing text:</label>
        <input id="find-q" type="search" autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="react, agents, Ford..." />
      </form>
      <ul className="find-results" aria-label="Results">
        {results.map((r) => (
          <li key={r.id}>
            <button className="find-row" onDoubleClick={r.open} onClick={(e) => (e.detail === 0 || matchMedia("(pointer: coarse)").matches) && r.open()}>
              <img src={r.icon} alt="" width="16" height="16" />
              <span>{r.name}</span>
              <small>{r.where}</small>
            </button>
          </li>
        ))}
        {q && !results.length && <li className="empty">No files found.</li>}
      </ul>
      <div className="status-bar">
        <p className="status-bar-field" role="status">{q ? `${results.length} file(s) found` : "Type to search my projects and experience"}</p>
      </div>
    </div>
  );
}
