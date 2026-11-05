import { useState } from "react";
import { folders, projects } from "../content.js";
import fileIcon from "../assets/icons/file.png";
import folderIcon from "../assets/icons/folder.png";

const thumbs = import.meta.glob("../assets/projects/*.jpg", { eager: true, query: "?url", import: "default" });
const thumbOf = (id) => thumbs[`../assets/projects/${id}.jpg`];

export default function Projects({ openApp }) {
  const [folder, setFolder] = useState("ai");
  const [selectedId, setSelectedId] = useState("murmur");
  const items = projects.filter((p) => p.folder === folder);
  const selected = projects.find((p) => p.id === selectedId && p.folder === folder) ?? items[0];
  const folderName = folders.find((f) => f.id === folder).name;

  const open = (p) => {
    const url = p.live ?? p.source;
    if (url) window.open(url, "_blank", "noopener");
  };

  return (
    <div className="explorer">
      <div className="address">
        <label htmlFor="proj-addr">Address</label>
        <input id="proj-addr" type="text" readOnly value={`C:\\Projects\\${folderName}`} />
      </div>
      <div className="explorer-main">
        <ul className="tree-view explorer-tree" aria-label="Project folders">
          {folders.map((f) => (
            <li key={f.id}>
              <button
                className={`tree-item ${folder === f.id ? "selected" : ""}`}
                aria-current={folder === f.id}
                onClick={() => setFolder(f.id)}
              >
                <img src={folderIcon} alt="" width="16" height="16" />
                {f.name}
                <small>{projects.filter((p) => p.folder === f.id).length}</small>
              </button>
            </li>
          ))}
        </ul>

        <ul className="files" aria-label={`${folderName} projects`}>
          {items.map((p) => (
            <li key={p.id}>
              <button
                className={`file-item ${selected.id === p.id ? "selected" : ""}`}
                aria-pressed={selected.id === p.id}
                onClick={() => setSelectedId(p.id)}
                onDoubleClick={() => open(p)}
              >
                <img src={fileIcon} alt="" width="32" height="32" />
                <span>{p.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <aside className="details prose" key={selected.id}>
          {thumbOf(selected.id) && (
            <img className="thumb" src={thumbOf(selected.id)} alt={`${selected.name} screenshot`} loading="lazy" />
          )}
          <h3>
            {selected.name} <small>{selected.year}</small>
          </h3>
          <p>{selected.desc}</p>
          <ul className="chips" aria-label="Tech stack">
            {selected.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="row">
            {selected.frame && (
              <button className="default" onClick={() => openApp("browser", { url: selected.live })}>
                Preview
              </button>
            )}
            {selected.live && (
              <a className="btn-link" href={selected.live} target="_blank" rel="noreferrer">Open site</a>
            )}
            {selected.source && (
              <a className="btn-link" href={selected.source} target="_blank" rel="noreferrer">Source</a>
            )}
          </div>
        </aside>
      </div>
      <div className="status-bar">
        <p className="status-bar-field">{items.length} object(s)</p>
        <p className="status-bar-field">{selected.name}</p>
      </div>
    </div>
  );
}
