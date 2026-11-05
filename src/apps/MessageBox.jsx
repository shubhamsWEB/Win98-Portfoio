import { useEffect } from "react";
import { play } from "../sound.js";
import { icons } from "../icons.js";

export default function MessageBox({ text, kind = "error", buttons, request, close }) {
  useEffect(() => {
    if (kind === "error") play("ding");
  }, [kind, request]);
  return (
    <div className="msgbox">
      <div className="msg-main">
        <img src={kind === "error" ? icons.failed : icons.tick} alt={kind} width="32" height="32" />
        <p>{text}</p>
      </div>
      <div className="row-center">
        {(buttons ?? [{ label: "OK" }]).map((b, i) => (
          <button
            key={b.label}
            autoFocus={i === 0}
            className={i === 0 ? "default" : ""}
            onClick={() => {
              close();
              b.onClick?.();
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
