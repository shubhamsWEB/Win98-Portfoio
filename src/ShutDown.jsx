import { useState } from "react";
import { Flag } from "./Boot.jsx";

const OPTIONS = [
  ["standby", "Stand by"],
  ["off", "Shut down"],
  ["restart", "Restart"],
];

export default function ShutDown({ onChoose, onCancel }) {
  const [choice, setChoice] = useState("off");
  return (
    <div className="modal-scrim" onKeyDown={(e) => e.key === "Escape" && onCancel()}>
      <form
        className="window shutdown"
        role="alertdialog"
        aria-labelledby="sd-title"
        onSubmit={(e) => {
          e.preventDefault();
          onChoose(choice);
        }}
      >
        <div className="title-bar">
          <div className="title-bar-text" id="sd-title">Shut Down Shubham 98</div>
          <div className="title-bar-controls">
            <button type="button" aria-label="Close" onClick={onCancel} />
          </div>
        </div>
        <div className="window-body">
          <p>What do you want the computer to do?</p>
          {OPTIONS.map(([value, label]) => (
            <div className="field-row" key={value}>
              <input
                id={`sd-${value}`}
                type="radio"
                name="power"
                checked={choice === value}
                onChange={() => setChoice(value)}
              />
              <label htmlFor={`sd-${value}`}>{label}</label>
            </div>
          ))}
          <div className="row-end">
            <button type="submit" className="default" autoFocus>OK</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export function OffScreen({ onPower }) {
  return (
    <div className="off">
      <Flag size={40} />
      <p>It's now safe to turn off</p>
      <p>your computer.</p>
      <button autoFocus onClick={onPower}>Power on</button>
    </div>
  );
}
