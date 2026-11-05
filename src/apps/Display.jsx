import { useState } from "react";
import { getSettings, setSettings } from "../settings.js";
import { previewSaver } from "../ui/Screensaver.jsx";

const WALLPAPERS = [["teal", "(None)"], ["sky", "Sky"], ["circuit", "Circuit"], ["bricks", "Bricks"], ["night", "Night"]];
const SCHEMES = [["standard", "Standard"], ["slate", "Slate"], ["plum", "Plum"], ["forest", "Forest"], ["pumpkin", "Pumpkin"]];
const SAVERS = [["none", "(None)"], ["stars", "Starfield"], ["name", "Bouncing Name"]];
const TABS = ["Background", "Screen Saver", "Appearance"];

export default function Display({ close }) {
  const [tab, setTab] = useState(TABS[0]);
  const [draft, setDraft] = useState(getSettings);
  const patch = (p) => setDraft({ ...draft, ...p });
  const apply = () =>
    setSettings({ wallpaper: draft.wallpaper, scheme: draft.scheme, saver: draft.saver, saverMinutes: draft.saverMinutes });

  return (
    <div className="about display-props">
      <menu role="tablist" aria-label="Display settings">
        {TABS.map((t) => (
          <li role="tab" key={t} aria-selected={tab === t}>
            <a href={`#${t}`} onClick={(e) => { e.preventDefault(); setTab(t); }}>{t}</a>
          </li>
        ))}
      </menu>
      <div className="window tab-panel" role="tabpanel" aria-label={tab}>
        <div className="window-body">
          <div className="monitor" data-wallpaper={draft.wallpaper} data-scheme={draft.scheme}>
            <div className="monitor-screen">
              {tab === "Screen Saver" && draft.saver !== "none" ? (
                <div className="monitor-saver">{draft.saver === "stars" ? "· ✦ ·" : "Shubham"}</div>
              ) : (
                <div className="monitor-window"><i /></div>
              )}
            </div>
          </div>
          {tab === "Background" && (
            <Choice id="wall" label="Wallpaper:" value={draft.wallpaper} options={WALLPAPERS} onChange={(wallpaper) => patch({ wallpaper })} />
          )}
          {tab === "Screen Saver" && (
            <>
              <Choice id="saver" label="Screen Saver:" value={draft.saver} options={SAVERS} onChange={(saver) => patch({ saver })} />
              <div className="field-row saver-row">
                <label htmlFor="saver-wait">Wait:</label>
                <input id="saver-wait" type="number" min="1" max="60" value={draft.saverMinutes} onChange={(e) => patch({ saverMinutes: Math.max(1, Math.min(60, Number(e.target.value) || 1)) })} />
                <span>minutes</span>
                <button type="button" disabled={draft.saver === "none"} onClick={() => { apply(); previewSaver(); }}>Preview</button>
              </div>
            </>
          )}
          {tab === "Appearance" && (
            <Choice id="scheme" label="Color scheme:" value={draft.scheme} options={SCHEMES} onChange={(scheme) => patch({ scheme })} />
          )}
        </div>
      </div>
      <div className="row-end">
        <button className="default" onClick={() => { apply(); close(); }}>OK</button>
        <button onClick={close}>Cancel</button>
        <button onClick={apply}>Apply</button>
      </div>
    </div>
  );
}

function Choice({ id, label, value, options, onChange }) {
  return (
    <div className="field-row-stacked">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, text]) => <option key={v} value={v}>{text}</option>)}
      </select>
    </div>
  );
}
