import { useCallback, useEffect, useReducer, useState } from "react";
import { reducer, initialState, focusedId } from "./wm.js";
import { apps } from "./apps.jsx";
import Boot from "./Boot.jsx";
import Desktop from "./Desktop.jsx";
import Taskbar from "./Taskbar.jsx";
import Window from "./Window.jsx";
import ShutDown, { OffScreen } from "./ShutDown.jsx";

const TASKBAR_HEIGHT = 32;
const hashApp = () => {
  const id = location.hash.slice(1);
  return apps[id] ? id : null;
};

export default function App() {
  // boot | desktop | standby | off
  const [phase, setPhase] = useState(() => (hashApp() ? "desktop" : "boot"));
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [wm, dispatch] = useReducer(reducer, initialState);
  const focused = focusedId(wm);

  const openApp = useCallback((id, props) => {
    dispatch({
      type: "open",
      id,
      props,
      size: apps[id],
      viewport: { w: innerWidth, h: innerHeight - TASKBAR_HEIGHT },
    });
  }, []);

  // First arrival at the desktop: a shared #projects link opens that app,
  // everyone else gets the welcome window.
  useEffect(() => {
    if (phase === "desktop" && wm.order.length === 0) openApp(hashApp() ?? "welcome");
    // ponytail: only runs on phase change, closing every window must not reopen Welcome.
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the URL shareable: it always names the focused window.
  useEffect(() => {
    if (phase === "desktop") history.replaceState(null, "", focused && focused !== "welcome" ? `#${focused}` : location.pathname);
  }, [focused, phase]);

  if (phase === "boot") return <Boot onDone={() => setPhase("desktop")} />;

  const restart = () => {
    wm.order.forEach((id) => dispatch({ type: "close", id }));
    sessionStorageRemove();
    history.replaceState(null, "", location.pathname);
    setPhase("boot");
  };

  return (
    <>
      <div className="desktop">
        <Desktop openApp={openApp} />
        {wm.order.map((id, z) => {
          const win = wm.windows[id];
          const def = apps[id];
          return (
            <Window
              key={id}
              win={win}
              app={def}
              z={z + 1}
              active={focused === id}
              dispatch={dispatch}
            >
              <def.Component
                {...win.props}
                request={win.props}
                openApp={openApp}
                close={() => dispatch({ type: "close", id })}
              />
            </Window>
          );
        })}
        {shutdownOpen && (
          <ShutDown
            onCancel={() => setShutdownOpen(false)}
            onChoose={(next) => {
              setShutdownOpen(false);
              if (next === "restart") restart();
              else setPhase(next);
            }}
          />
        )}
      </div>
      <Taskbar
        wm={wm}
        focused={focused}
        dispatch={dispatch}
        openApp={openApp}
        onShutDown={() => setShutdownOpen(true)}
      />
      {phase === "standby" && (
        <button className="standby" aria-label="Wake up" autoFocus onClick={() => setPhase("desktop")} />
      )}
      {phase === "off" && <OffScreen onPower={restart} />}
    </>
  );
}

function sessionStorageRemove() {
  try {
    sessionStorage.removeItem("booted");
  } catch {
    // Storage blocked: boot plays in full anyway.
  }
}
