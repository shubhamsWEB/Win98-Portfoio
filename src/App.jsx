import { useCallback, useEffect, useReducer, useState } from "react";
import { reducer, initialState, focusedId } from "./wm.js";
import { apps } from "./apps.jsx";
import { getSettings, useSettings } from "./settings.js";
import { play } from "./sound.js";
import Boot from "./Boot.jsx";
import Desktop from "./Desktop.jsx";
import Taskbar from "./Taskbar.jsx";
import Window from "./Window.jsx";
import ShutDown, { OffScreen } from "./ShutDown.jsx";
import Screensaver from "./ui/Screensaver.jsx";
import Assistant from "./Assistant.jsx";

const taskbarHeight = () => document.querySelector(".taskbar")?.offsetHeight ?? 32;
const viewport = () => ({ w: innerWidth, h: innerHeight - taskbarHeight() });
const hashApp = () => {
  const id = location.hash.slice(1);
  return apps[id] && id !== "message" ? id : null;
};

export default function App() {
  // boot | desktop | standby | off
  const [phase, setPhase] = useState(() => (hashApp() ? "desktop" : "boot"));
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [wm, dispatch] = useReducer(reducer, initialState);
  const focused = focusedId(wm);
  const { wallpaper, scheme } = useSettings();

  useEffect(() => {
    document.documentElement.dataset.wallpaper = wallpaper;
    document.documentElement.dataset.scheme = scheme;
  }, [wallpaper, scheme]);

  const openApp = useCallback((id, props) => {
    // The hourglass, briefly: programs used to take a moment to start.
    document.body.classList.add("busy");
    setTimeout(() => document.body.classList.remove("busy"), 300);
    dispatch({ type: "open", id, props, size: apps[id], viewport: viewport() });
  }, []);

  // First arrival at the desktop: a shared #projects link opens that app,
  // everyone else gets the welcome window (unless they turned it off).
  useEffect(() => {
    if (phase !== "desktop" || wm.order.length) return;
    play("startup");
    const start = hashApp() ?? (getSettings().welcome ? "welcome" : null);
    if (start) openApp(start);
    // ponytail: only runs on phase change, closing every window must not reopen Welcome.
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the URL shareable: it names the focused window when that has a stable page.
  useEffect(() => {
    if (phase !== "desktop") return;
    const shareable = focused && !["welcome", "message", "run"].includes(focused);
    history.replaceState(null, "", shareable ? `#${focused}` : location.pathname);
  }, [focused, phase]);

  const restart = useCallback(() => {
    setPhase("boot");
    try {
      sessionStorage.removeItem("booted");
    } catch {
      // Storage blocked: boot plays in full anyway.
    }
    history.replaceState(null, "", location.pathname);
  }, []);

  const closeAll = () => wm.order.forEach((id) => dispatch({ type: "close", id }));

  if (phase === "boot") return <Boot onDone={() => setPhase("desktop")} />;

  return (
    <>
      <div className="desktop">
        <Desktop openApp={openApp} dispatch={dispatch} />
        {wm.order.map((id, z) => {
          const win = wm.windows[id];
          const def = apps[id];
          return (
            <Window key={id} win={win} app={def} z={z + 1} active={focused === id} dispatch={dispatch}>
              <def.Component
                {...win.props}
                request={win.props}
                openApp={openApp}
                close={() => dispatch({ type: "close", id })}
                setTitle={(title) => dispatch({ type: "title", id, title })}
              />
            </Window>
          );
        })}
        {shutdownOpen && (
          <ShutDown
            onCancel={() => setShutdownOpen(false)}
            onChoose={(next) => {
              setShutdownOpen(false);
              if (next === "restart") {
                closeAll();
                restart();
              } else if (next === "off") {
                play("shutdown");
                closeAll();
                setPhase("off");
              } else {
                setPhase(next);
              }
            }}
          />
        )}
      </div>
      <Taskbar
        wm={wm}
        focused={focused}
        dispatch={dispatch}
        openApp={openApp}
        viewport={viewport}
        onShutDown={() => setShutdownOpen(true)}
        onLogOff={() => {
          closeAll();
          restart();
        }}
      />
      {phase === "desktop" && <Assistant openApp={openApp} focused={focused} />}
      {phase === "desktop" && <Screensaver />}
      {phase === "standby" && (
        <button className="standby" aria-label="Wake up" autoFocus onClick={() => setPhase("desktop")} />
      )}
      {phase === "off" && <OffScreen onPower={restart} />}
    </>
  );
}
