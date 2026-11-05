import { useEffect, useState } from "react";
import { projects } from "../content.js";

const favourites = projects.filter((p) => p.frame && p.folder !== "archive");

export default function Browser({ url = favourites[0].live, request }) {
  const [current, setCurrent] = useState(url);
  const [loading, setLoading] = useState(true);
  useEffect(() => setCurrent(url), [url, request]);
  useEffect(() => setLoading(true), [current]);

  return (
    <div className="browser">
      <nav className="favourites" aria-label="Favourites">
        {favourites.map((p) => (
          <button
            key={p.id}
            className={current === p.live ? "pressed" : ""}
            onClick={() => setCurrent(p.live)}
          >
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
          key={current}
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
