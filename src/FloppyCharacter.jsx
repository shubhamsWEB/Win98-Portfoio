import { useEffect, useRef, useState } from "react";

const IDLE_ACTIONS = ["wave", "hop", "look", "spin", "tap", "peek", "wave"];
const ACTION_MS = 1600;
const SLEEP_AFTER_MS = 90_000;
const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// Eyes follow the pointer. Writes CSS variables directly so moving the mouse never re-renders React.
function useEyeTracking(ref) {
  useEffect(() => {
    if (calm() || !matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = ref.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        const dx = e.clientX - (box.left + box.width / 2);
        const dy = e.clientY - (box.top + box.height * 0.55);
        const distance = Math.hypot(dx, dy) || 1;
        const reach = Math.min(distance / 60, 1) * 1.7;
        el.style.setProperty("--look-x", `${((dx / distance) * reach).toFixed(2)}px`);
        el.style.setProperty("--look-y", `${((dy / distance) * reach).toFixed(2)}px`);
      });
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}

// mood: idle (Floppy entertains itself) or think | talk | listen | happy, set by the chat.
export default function FloppyCharacter({ mood = "idle", size = 96 }) {
  const ref = useRef(null);
  const [action, setAction] = useState("enter");
  const [asleep, setAsleep] = useState(false);
  useEyeTracking(ref);

  // Idle antics at random intervals, so Floppy always looks alive but never repeats on a beat.
  useEffect(() => {
    if (mood !== "idle" || calm()) return;
    let timer;
    const schedule = () => {
      timer = setTimeout(() => {
        setAction(IDLE_ACTIONS[Math.floor(Math.random() * IDLE_ACTIONS.length)]);
        timer = setTimeout(() => {
          setAction(null);
          schedule();
        }, ACTION_MS);
      }, 3000 + Math.random() * 5000);
    };
    timer = setTimeout(() => {
      setAction(null);
      schedule();
    }, ACTION_MS);
    return () => clearTimeout(timer);
  }, [mood]);

  // Dozes off when nobody is around, and wakes the moment they come back.
  useEffect(() => {
    if (mood !== "idle" || calm()) {
      setAsleep(false);
      return;
    }
    let timer;
    const wake = () => {
      setAsleep(false);
      clearTimeout(timer);
      timer = setTimeout(() => setAsleep(true), SLEEP_AFTER_MS);
    };
    wake();
    addEventListener("pointermove", wake, { passive: true });
    addEventListener("keydown", wake);
    return () => {
      clearTimeout(timer);
      removeEventListener("pointermove", wake);
      removeEventListener("keydown", wake);
    };
  }, [mood]);

  const state = mood !== "idle" ? mood : asleep ? "sleep" : action ?? "idle";

  return (
    <span className={`fd fd-${state}`} ref={ref} style={{ width: size, height: size * 1.1 }} aria-hidden="true">
      {state === "sleep" && <span className="fd-zzz">z<i>z</i><b>z</b></span>}
      {state === "think" && <span className="fd-idea">?</span>}
      <svg viewBox="0 0 40 44" shapeRendering="crispEdges">
        <g className="fd-leg fd-leg-l"><rect x="13" y="35" width="2" height="5" fill="#000" /><rect x="10" y="39" width="6" height="3" fill="#b01818" /></g>
        <g className="fd-leg fd-leg-r"><rect x="25" y="35" width="2" height="5" fill="#000" /><rect x="24" y="39" width="6" height="3" fill="#b01818" /></g>
        <g className="fd-arm fd-arm-l"><rect x="2" y="21" width="5" height="2" fill="#000" /><rect x="0" y="19" width="3" height="4" fill="#fff" stroke="#000" strokeWidth=".6" /></g>
        <g className="fd-arm fd-arm-r"><rect x="33" y="21" width="5" height="2" fill="#000" /><rect x="37" y="19" width="3" height="4" fill="#fff" stroke="#000" strokeWidth=".6" /></g>
        <g className="fd-body">
          <path d="M6 3h24l4 4v29H6z" fill="#23409a" stroke="#000" />
          <rect x="11" y="3.500" width="16" height="8" fill="#c0c0c0" stroke="#000" strokeWidth=".5" />
          <rect x="21" y="5" width="4" height="5" fill="#23409a" />
          <rect x="9" y="14" width="22" height="21" fill="#fff" stroke="#000" strokeWidth=".5" />
          <g className="fd-brows">
            <rect className="fd-brow fd-brow-l" x="11.500" y="15" width="6" height="1.200" fill="#000" />
            <rect className="fd-brow fd-brow-r" x="22.500" y="15" width="6" height="1.200" fill="#000" />
          </g>
          <g className="fd-eye">
            <circle cx="14.500" cy="21.500" r="4" fill="#fff" stroke="#000" strokeWidth=".9" />
            <g className="fd-pupil"><circle cx="14.500" cy="21.500" r="2" fill="#000" /><rect x="14.800" y="20" width="1" height="1" fill="#fff" /></g>
            <rect className="fd-lid" x="10" y="17" width="9" height="9" fill="#9fb4ea" />
          </g>
          <g className="fd-eye">
            <circle cx="25.500" cy="21.500" r="4" fill="#fff" stroke="#000" strokeWidth=".9" />
            <g className="fd-pupil"><circle cx="25.500" cy="21.500" r="2" fill="#000" /><rect x="25.800" y="20" width="1" height="1" fill="#fff" /></g>
            <rect className="fd-lid" x="21" y="17" width="9" height="9" fill="#9fb4ea" />
          </g>
          <path className="fd-smile" d="M15 29h1v1.500h8v-1.500h1" fill="none" stroke="#000" strokeWidth="1" />
          <ellipse className="fd-mouth" cx="20" cy="30.500" rx="3" ry="2.500" fill="#7a1010" stroke="#000" strokeWidth=".7" />
        </g>
      </svg>
    </span>
  );
}
