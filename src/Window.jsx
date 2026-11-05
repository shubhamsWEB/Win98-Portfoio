import { useLayoutEffect, useRef } from "react";

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// Animates an element between its real rect and `rect`, the way Win98 zoomed
// windows in and out of the taskbar.
function morph(el, rect, direction, duration = 170) {
  if (reduced()) return Promise.resolve();
  const box = el.getBoundingClientRect();
  const away = {
    transform: `translate(${rect.left - box.left}px, ${rect.top - box.top}px) scale(${rect.width / box.width}, ${rect.height / box.height})`,
    opacity: direction === "fade" ? 0 : 0.4,
    visibility: "visible",
  };
  const home = { transform: "none", opacity: 1, visibility: "visible" };
  const frames = direction === "to" || direction === "fade" ? [home, away] : [away, home];
  return el.animate(frames, { duration, easing: "cubic-bezier(.2,.7,.2,1)" }).finished;
}

const inset = (box, by) => ({
  left: box.left + box.width * by,
  top: box.top + box.height * by,
  width: box.width * (1 - 2 * by),
  height: box.height * (1 - 2 * by),
});

export default function Window({ win, app, z, active, dispatch, children }) {
  const { id, minimized, maximized } = win;
  const ref = useRef(null);
  const rectBeforeMax = useRef(null);
  const wasMinimized = useRef(false);
  const titleId = `win-title-${id}`;

  // Open: quick pop, then hand keyboard focus to the window.
  useLayoutEffect(() => {
    const el = ref.current;
    morph(el, inset(el.getBoundingClientRect(), 0.03), "from", 130);
    el.focus({ preventScroll: true });
  }, []);

  useLayoutEffect(() => {
    if (active && !minimized && !ref.current.contains(document.activeElement)) {
      ref.current.focus({ preventScroll: true });
    }
  }, [active, minimized]);

  // Minimize / restore: fly to and from the taskbar button.
  useLayoutEffect(() => {
    if (minimized === wasMinimized.current) return;
    wasMinimized.current = minimized;
    const target = document.querySelector(`[data-task="${id}"]`);
    if (target) morph(ref.current, target.getBoundingClientRect(), minimized ? "to" : "from");
  }, [minimized, id]);

  // Maximize / restore: morph from the previous rect.
  useLayoutEffect(() => {
    if (rectBeforeMax.current) {
      morph(ref.current, rectBeforeMax.current, "from", 150);
      rectBeforeMax.current = null;
    }
  }, [maximized]);

  const toggleMax = () => {
    rectBeforeMax.current = ref.current.getBoundingClientRect();
    dispatch({ type: "maximize", id });
  };

  const close = async () => {
    const el = ref.current;
    await morph(el, inset(el.getBoundingClientRect(), 0.03), "fade", 110);
    dispatch({ type: "close", id });
  };

  // Drag from the title bar only, with pointer capture so iframes can't steal it.
  const startDrag = (e) => {
    if (e.button !== 0 || maximized || e.target.closest("button")) return;
    if (matchMedia("(max-width: 720px)").matches) return;
    const el = ref.current;
    const bar = e.currentTarget;
    bar.setPointerCapture(e.pointerId);
    const dx = e.clientX - el.offsetLeft;
    const dy = e.clientY - el.offsetTop;
    const bounds = el.parentElement.getBoundingClientRect();
    let x = el.offsetLeft;
    let y = el.offsetTop;

    const onMove = (ev) => {
      // Always leave enough title bar on screen to grab again.
      x = Math.min(Math.max(ev.clientX - dx, 80 - el.offsetWidth), bounds.width - 80);
      y = Math.min(Math.max(ev.clientY - dy, 0), bounds.height - 24);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    };
    const onUp = () => {
      bar.removeEventListener("pointermove", onMove);
      bar.removeEventListener("pointerup", onUp);
      bar.removeEventListener("pointercancel", onUp);
      dispatch({ type: "move", id, x, y });
    };
    bar.addEventListener("pointermove", onMove);
    bar.addEventListener("pointerup", onUp);
    bar.addEventListener("pointercancel", onUp);
  };

  const className = ["window", "win", maximized && "maximized", minimized && "minimized", app.resizable === false && "fixed"]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      ref={ref}
      className={className}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      // ponytail: width/height are initial values only, CSS resize owns them afterwards.
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: z }}
      onPointerDownCapture={(e) => {
        dispatch({ type: "focus", id });
        // The native resize grip hits the frame itself: keep iframes from eating the drag.
        if (e.target === ref.current) {
          document.body.classList.add("resizing");
          addEventListener("pointerup", () => document.body.classList.remove("resizing"), { once: true });
        }
      }}
    >
      <div
        className={`title-bar ${active ? "" : "inactive"}`}
        onPointerDown={startDrag}
        onDoubleClick={(e) => {
          if (app.resizable !== false && !e.target.closest("button")) toggleMax();
        }}
      >
        <div className="title-bar-text" id={titleId}>
          <img src={app.icon} alt="" width="16" height="16" />
          {app.title}
        </div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={() => dispatch({ type: "minimize", id })} />
          {app.resizable !== false && (
            <button aria-label={maximized ? "Restore" : "Maximize"} className="max-btn" onClick={toggleMax} />
          )}
          <button aria-label="Close" onClick={close} />
        </div>
      </div>
      <div className="win-body">{children}</div>
    </section>
  );
}
