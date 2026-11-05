import { useEffect, useState } from "react";
import { projects } from "./content.js";

const LINES = [
  "AMIBIOS (C) 1998-2026 Shubham Megatrends Inc.",
  "BIOS Version 19.REACT",
  "PENTIUM III CPU at 450MHz",
  "",
  "Memory Test : 65536K OK",
  "Detecting Keyboard ... detected",
  "Detecting Mouse ...... detected",
  `Mounting C:\\PROJECTS ... ${projects.length} found`,
  "",
  "Starting Shubham 98 ...",
];
const LINE_MS = 130;
const SPLASH_MS = 1300;

function alreadyBooted() {
  try {
    if (sessionStorage.getItem("booted")) return true;
    sessionStorage.setItem("booted", "1");
  } catch {
    // Storage blocked: just play the boot.
  }
  return false;
}

export default function Boot({ onDone }) {
  // Repeat visits and reduced-motion users go straight to the short splash.
  const [skipBios] = useState(
    () => alreadyBooted() || matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [count, setCount] = useState(skipBios ? LINES.length : 0);
  const biosDone = count >= LINES.length;

  useEffect(() => {
    const t = biosDone ? setTimeout(onDone, SPLASH_MS) : setTimeout(() => setCount((c) => c + 1), LINE_MS);
    return () => clearTimeout(t);
  }, [count, biosDone, onDone]);

  useEffect(() => {
    addEventListener("keydown", onDone);
    addEventListener("pointerdown", onDone);
    return () => {
      removeEventListener("keydown", onDone);
      removeEventListener("pointerdown", onDone);
    };
  }, [onDone]);

  if (biosDone) {
    return (
      <div className="splash" role="status" aria-label="Starting Shubham 98">
        <div className="splash-mark">
          <Flag size={72} />
          <div>
            <small>Shubham Agrawal</small>
            <strong>
              Shubham<span>98</span>
            </strong>
          </div>
        </div>
        <div className="splash-bar" />
      </div>
    );
  }
  return (
    <div className="bios" role="status" aria-label="Starting up">
      {LINES.slice(0, count).map((line, i) => (
        <div key={i}>{line || "\u00a0"}</div>
      ))}
      <span className="bios-cursor" />
      <div className="bios-skip">Press any key to skip</div>
    </div>
  );
}

export function Flag({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="0" y="0" width="3.5" height="3.5" fill="#d33" />
      <rect x="4.5" y="0" width="3.5" height="3.5" fill="#2a2" />
      <rect x="0" y="4.5" width="3.5" height="3.5" fill="#25c" />
      <rect x="4.5" y="4.5" width="3.5" height="3.5" fill="#ec0" />
    </svg>
  );
}
