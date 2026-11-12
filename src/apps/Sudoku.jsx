import { useState } from "react";
import { projects, sudokuClan } from "../content.js";
import { icons } from "../icons.js";

const game = projects.find((p) => p.id === "sudoku");
const visit = (url) => window.open(url, "_blank", "noopener");

// The game refuses to load inside another page, so this window picks a mode and opens it in a new tab.
export default function Sudoku({ openApp }) {
  const [modeId, setModeId] = useState(sudokuClan.modes[0].id);
  const mode = sudokuClan.modes.find((m) => m.id === modeId);

  return (
    <div className="sudoku">
      <header className="sudoku-head">
        <img src={icons.sudoku} alt="" width="48" height="48" />
        <div>
          <h2>{game.name}</h2>
          <p>{sudokuClan.tagline}</p>
        </div>
      </header>

      <fieldset>
        <legend>Choose a mode</legend>
        {sudokuClan.modes.map((m) => (
          <div className="field-row" key={m.id}>
            <input id={`sudoku-${m.id}`} type="radio" name="sudoku-mode" checked={m.id === modeId} onChange={() => setModeId(m.id)} />
            <label htmlFor={`sudoku-${m.id}`}>
              {m.name} <small>({m.players})</small>
            </label>
          </div>
        ))}
      </fieldset>

      <p className="sudoku-desc" role="status">{mode.desc}</p>

      <div className="row sudoku-actions">
        <button className="default" onClick={() => visit(`${game.play}?play=${mode.id}`)}>Play {mode.name}</button>
        <button onClick={() => visit(`${game.play}?play=friend`)}>Challenge a Friend</button>
        <button onClick={() => visit(game.play)}>Solo</button>
        <button onClick={() => openApp("projects", { select: game.id, folder: game.folder })}>About</button>
      </div>

      <div className="status-bar">
        <p className="status-bar-field">The game opens in a new tab.</p>
      </div>
    </div>
  );
}
