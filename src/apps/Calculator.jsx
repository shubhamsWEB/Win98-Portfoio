import { useState } from "react";
import { initialCalc, press } from "./calc.js";

const KEYS = ["7", "8", "9", "/", "sqrt", "4", "5", "6", "*", "CE", "1", "2", "3", "-", "C", "0", "+/-", ".", "+", "="];
const KEYBOARD = { Enter: "=", Escape: "C", Backspace: "CE", Delete: "CE" };

export default function Calculator() {
  const [state, setState] = useState(initialCalc);
  const send = (key) => setState((s) => press(s, key));
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="calc"
      onKeyDown={(e) => {
        const key = KEYBOARD[e.key] ?? e.key;
        if (KEYS.includes(key) && !["C", "CE"].includes(e.key)) {
          e.preventDefault();
          send(key);
        }
      }}
    >
      <output className="calc-display">{state.display}</output>
      <div className="calc-keys">
        {KEYS.map((k) => (
          <button key={k} className={/[0-9.]/.test(k) ? "digit" : "op"} onClick={() => send(k)}>
            {k === "sqrt" ? "√" : k}
          </button>
        ))}
      </div>
    </div>
  );
}
