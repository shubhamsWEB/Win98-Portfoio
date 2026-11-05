import { useEffect, useState } from "react";
import { createBoard, reveal, statusOf, toggleFlag } from "./bughunt.js";
import { play } from "../sound.js";
import { MenuBar } from "../ui/Menu.jsx";

const W = 9;
const H = 9;
const BUGS = 10;
const blank = () => Array.from({ length: W * H }, () => ({ bug: false, open: false, flag: false, near: 0 }));

export default function BugHunt({ openApp, close }) {
  const [cells, setCells] = useState(blank);
  const [started, setStarted] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const status = started ? statusOf(cells) : "ready";
  const left = BUGS - cells.filter((c) => c.flag).length;

  useEffect(() => {
    if (status !== "playing") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  useEffect(() => {
    if (status === "lost") play("ding");
    if (status === "won") play("on");
  }, [status]);

  const reset = () => {
    setCells(blank());
    setStarted(false);
    setSeconds(0);
  };

  const flag = (i) => {
    if (status === "playing" || status === "ready") setCells(toggleFlag(cells, i));
  };

  const open = (i) => {
    if (status === "lost" || status === "won") return;
    if (flagMode) return flag(i);
    if (cells[i].flag) return;
    // The first patch is always safe: the board is only generated now.
    const board = started ? cells : createBoard(W, H, BUGS, i);
    setStarted(true);
    setCells(reveal(board, i, W, H));
  };

  const message = { ready: "Patch any line to start", playing: `${seconds}s`, won: `All bugs found in ${seconds}s. Ship it!`, lost: "A bug reached production." }[status];

  return (
    <div className="bughunt">
      <MenuBar
        menus={[
          { label: "Game", items: [{ label: "New", shortcut: "F2", onClick: reset }, { separator: true }, { label: "Exit", onClick: close }] },
          { label: "Help", items: [{ label: "How to Play", onClick: () => openApp("message", { title: "Bug Hunt", kind: "info", text: "Numbers count the bugs on neighbouring lines. Patch every clean line. Right-click, or use Flag mode, to mark a bug." }) }] },
        ]}
      />
      <div className="hunt-bar">
        <span>🐛 {left}</span>
        <button onClick={reset}>New build</button>
        <button className={flagMode ? "pressed" : ""} aria-pressed={flagMode} onClick={() => setFlagMode(!flagMode)}>Flag</button>
      </div>
      <div className="hunt-grid" style={{ gridTemplateColumns: `repeat(${W}, 1fr)` }}>
        {cells.map((c, i) => {
          const showBug = c.bug && (c.open || status === "lost");
          return (
            <button
              key={i}
              aria-label={c.open ? (c.bug ? "Bug" : `${c.near} bugs near`) : c.flag ? "Flagged line" : "Unchecked line"}
              className={`hunt-cell ${c.open ? "open" : ""} ${showBug ? "bug" : ""} n${c.near}`}
              onClick={() => open(i)}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                flag(i);
              }}
            >
              {showBug ? "🐛" : c.flag ? "⚑" : c.open && c.near ? c.near : !c.open ? "{}" : ""}
            </button>
          );
        })}
      </div>
      <p className="hunt-msg" role="status">{message}</p>
    </div>
  );
}
