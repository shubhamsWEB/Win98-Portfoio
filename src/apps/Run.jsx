import { useState } from "react";
import { programs, resolveUrl } from "./dos.js";
import { icons } from "../icons.js";

export default function Run({ openApp, close }) {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    const app = programs[text.toLowerCase().replace(/\.exe$/, "")];
    const url = !app && resolveUrl(text);
    if (app) openApp(app);
    else if (url) window.open(url, "_blank", "noopener");
    else return openApp("message", { title: text, text: `Cannot find the file '${text}' (or one of its components). Try notepad, paint, calc or command.` });
    close();
  };

  return (
    <form className="run" onSubmit={submit}>
      <div className="msg-main">
        <img src={icons.run} alt="" width="32" height="32" />
        <p>Type the name of a program or web address, and Shubham 98 will open it for you.</p>
      </div>
      <div className="run-row">
        <label htmlFor="run-input">Open:</label>
        <input id="run-input" type="text" autoFocus autoComplete="off" autoCapitalize="off" spellCheck={false} value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <div className="row-end">
        <button type="submit" className="default">OK</button>
        <button type="button" onClick={close}>Cancel</button>
      </div>
    </form>
  );
}
