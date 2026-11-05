import { useEffect, useState } from "react";
import { links, projects } from "../content.js";
import { MenuBar } from "../ui/Menu.jsx";
import { icons } from "../icons.js";

const favourites = projects.filter((p) => p.frame && p.folder !== "archive");
const HOME = favourites[0].live;

export default function Browser({ url = HOME, request, openApp, close, setTitle }) {
  const [trail, setTrail] = useState({ pages: [url], at: 0 });
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const current = trail.pages[trail.at];
  const name = projects.find((p) => p.live === current)?.name ?? current;

  const visit = (page) => {
    if (page === current) return;
    setTrail({ pages: [...trail.pages.slice(0, trail.at + 1), page], at: trail.at + 1 });
    setLoading(true);
  };

  useEffect(() => {
    visit(url);
  }, [url, request]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTitle(`${name} - Internet Explorer`);
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  const step = (by) => {
    setTrail({ ...trail, at: trail.at + by });
    setLoading(true);
  };
  const refresh = () => {
    setReload(reload + 1);
    setLoading(true);
  };

  return (
    <div className="browser">
      <MenuBar
        menus={[
          { label: "File", items: [{ label: "Open in New Tab", onClick: () => window.open(current, "_blank", "noopener") }, { separator: true }, { label: "Close", onClick: close }] },
          {
            label: "Favorites",
            items: [
              ...favourites.map((p) => ({ label: p.name, icon: icons.explorer, onClick: () => visit(p.live) })),
              { separator: true },
              { label: "GitHub", icon: icons.github, onClick: () => window.open(links.github, "_blank", "noopener") },
              { label: "LinkedIn", icon: icons.linkedin, onClick: () => window.open(links.linkedin, "_blank", "noopener") },
            ],
          },
          { label: "Help", items: [{ label: "Help Topics", onClick: () => openApp("help") }] },
        ]}
      />
      <div className="ie-toolbar">
        <button disabled={trail.at === 0} onClick={() => step(-1)}>Back</button>
        <button disabled={trail.at === trail.pages.length - 1} onClick={() => step(1)}>Forward</button>
        <button onClick={refresh}>Refresh</button>
        <button onClick={() => visit(HOME)}>Home</button>
      </div>
      <nav className="favourites" aria-label="Favourites">
        {favourites.map((p) => (
          <button key={p.id} className={current === p.live ? "pressed" : ""} onClick={() => visit(p.live)}>
            {p.name}
          </button>
        ))}
      </nav>
      <div className="address">
        <label htmlFor="ie-addr">Address</label>
        <input id="ie-addr" type="text" readOnly value={current} />
        <a className="btn-link" href={current} target="_blank" rel="noreferrer">Open in new tab</a>
      </div>
      <div className="browser-view">
        <iframe
          key={`${current}#${reload}`}
          src={current}
          title="Project preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={() => setLoading(false)}
        />
      </div>
      <div className="status-bar">
        <p className="status-bar-field">{loading ? `Opening page ${current}...` : "Done"}</p>
        {loading && <p className="status-bar-field loading-bar" aria-hidden="true" />}
      </div>
    </div>
  );
}
