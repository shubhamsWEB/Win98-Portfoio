import { useEffect, useState } from "react";
import { folders, projects } from "../content.js";
import { icons } from "../icons.js";
import { MenuBar, useContextMenu } from "../ui/Menu.jsx";

const thumbs = import.meta.glob("../assets/projects/*.jpg", { eager: true, query: "?url", import: "default" });
const thumbOf = (id) => thumbs[`../assets/projects/${id}.jpg`];

export default function Projects({ folder: folderProp = "ai", select, request, openApp, close }) {
  const [folder, setFolder] = useState(folderProp);
  const [selectedId, setSelectedId] = useState(select ?? "murmur");
  const [details, setDetails] = useState(false);
  const [history, setHistory] = useState([]);
  const [menu, openMenu] = useContextMenu();

  useEffect(() => {
    if (select) {
      setFolder(folderProp);
      setSelectedId(select);
    }
  }, [select, folderProp, request]);

  const items = projects.filter((p) => p.folder === folder);
  const selected = projects.find((p) => p.id === selectedId && p.folder === folder) ?? items[0];
  const folderName = folders.find((f) => f.id === folder).name;

  const go = (id) => {
    if (id === folder) return;
    setHistory([...history, folder]);
    setFolder(id);
  };
  const back = () => {
    setFolder(history.at(-1));
    setHistory(history.slice(0, -1));
  };
  const open = (p) => {
    const url = p.live ?? p.source;
    if (url) window.open(url, "_blank", "noopener");
    else openApp("message", { title: p.name, kind: "info", text: `${p.name} has no public link yet.` });
  };
  const preview = (p) => openApp("browser", { url: p.live });
  const source = (p) => window.open(p.source, "_blank", "noopener");

  const actions = (p) => [
    { label: "Open", onClick: () => open(p) },
    { label: "Preview", disabled: !p.frame, onClick: () => preview(p) },
    { label: "View Source", disabled: !p.source, onClick: () => source(p) },
  ];

  return (
    <div className="explorer">
      <MenuBar
        menus={[
          { label: "File", items: [...actions(selected), { separator: true }, { label: "Close", onClick: close }] },
          {
            label: "View",
            items: [
              { label: "Large Icons", checked: !details, onClick: () => setDetails(false) },
              { label: "Details", checked: details, onClick: () => setDetails(true) },
            ],
          },
          {
            label: "Go",
            items: [
              { label: "Back", disabled: !history.length, onClick: back },
              { separator: true },
              ...folders.map((f) => ({ label: f.name, checked: f.id === folder, onClick: () => go(f.id) })),
            ],
          },
          { label: "Help", items: [{ label: "Help Topics", onClick: () => openApp("help") }, { label: "Find a project...", onClick: () => openApp("find") }] },
        ]}
      />
      <div className="address">
        <button className="back-btn" aria-label="Back" title="Back" disabled={!history.length} onClick={back}>←</button>
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
                onClick={() => go(f.id)}
              >
                <img src={folder === f.id ? icons.directory : icons.folder} alt="" width="16" height="16" />
                {f.name}
                <small>{projects.filter((p) => p.folder === f.id).length}</small>
              </button>
            </li>
          ))}
        </ul>

        <ul className={`files ${details ? "details-list" : ""}`} aria-label={`${folderName} projects`}>
          {items.map((p) => (
            <li key={p.id}>
              <button
                className={`file-item ${selected.id === p.id ? "selected" : ""}`}
                aria-pressed={selected.id === p.id}
                onClick={() => setSelectedId(p.id)}
                onDoubleClick={() => open(p)}
                onContextMenu={(e) => {
                  setSelectedId(p.id);
                  openMenu(e, actions(p));
                }}
              >
                <img src={icons.file} alt="" width={details ? 16 : 32} height={details ? 16 : 32} />
                <span>{p.name}</span>
                {details && <small>{p.year}</small>}
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
              <button className="default" onClick={() => preview(selected)}>Preview</button>
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
      {menu}
    </div>
  );
}
