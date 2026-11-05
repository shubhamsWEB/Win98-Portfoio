import { useEffect, useRef, useState } from "react";
import { run } from "./dos.js";

const BANNER = ["Shubham 98 [Version 4.10.2026]", "(C) Copyright 1998-2026. Type HELP to look around.", ""];

export default function Dos({ openApp, close }) {
  const [lines, setLines] = useState(BANNER);
  const [cwd, setCwd] = useState("C:\\");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(null);
  const bottom = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottom.current.scrollIntoView({ block: "end" });
  }, [lines]);

  const submit = (e) => {
    e.preventDefault();
    const result = run(input, cwd);
    if (result.exit) return close();
    setLines(result.clear ? [] : [...lines, `${cwd}>${input}`, ...result.out, ""]);
    if (result.cwd) setCwd(result.cwd);
    if (result.app) openApp(result.app);
    if (result.url) window.open(result.url, "_blank", "noopener");
    if (input.trim()) setHistory([...history, input]);
    setCursor(null);
    setInput("");
  };

  const onKeyDown = (e) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    if (!history.length) return;
    const from = cursor ?? history.length;
    const next = Math.max(0, Math.min(history.length, from + (e.key === "ArrowUp" ? -1 : 1)));
    setCursor(next);
    setInput(history[next] ?? "");
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="dos"
      onPointerUp={() => {
        // Keep the prompt focused, unless they were selecting text to copy.
        if (!getSelection().toString()) inputRef.current.focus();
      }}
    >
      <pre role="log" aria-live="polite">{lines.join("\n")}</pre>
      <form onSubmit={submit} ref={bottom}>
        <label htmlFor="dos-input">{cwd}&gt;</label>
        <input
          id="dos-input"
          ref={inputRef}
          type="text"
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </form>
    </div>
  );
}
