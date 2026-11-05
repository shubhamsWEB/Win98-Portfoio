import { useEffect, useRef, useState } from "react";
import { Flag } from "./Boot.jsx";
import { apps } from "./apps.jsx";
import { links, projects } from "./content.js";
import github from "./assets/icons/github.png";
import linkedin from "./assets/icons/linkedin.png";
import blog from "./assets/icons/copy.png";
import text from "./assets/icons/text.png";
import file from "./assets/icons/file.png";

const external = (url) => () => window.open(url, "_blank", "noopener");
const liveOf = (id) => projects.find((p) => p.id === id).live;

export default function Taskbar({ wm, focused, dispatch, openApp, onShutDown }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef(null);
  const menuRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current.querySelector("button").focus({ preventScroll: true });
    const onDown = (e) => {
      if (!rootRef.current.contains(e.target)) setMenuOpen(false);
    };
    addEventListener("pointerdown", onDown);
    return () => removeEventListener("pointerdown", onDown);
  }, [menuOpen]);

  const onMenuKey = (e) => {
    if (e.key === "Escape") {
      setMenuOpen(false);
      startRef.current.focus();
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = [...menuRef.current.querySelectorAll("button")];
    const next = items.indexOf(document.activeElement) + (e.key === "ArrowDown" ? 1 : -1);
    items[(next + items.length) % items.length].focus();
  };

  const item = (icon, label, action) => (
    <li role="none">
      <button
        role="menuitem"
        onClick={() => {
          setMenuOpen(false);
          action();
        }}
      >
        <img src={icon} alt="" width="24" height="24" />
        {label}
      </button>
    </li>
  );

  return (
    <footer className="taskbar" ref={rootRef}>
      <button
        ref={startRef}
        className={`start ${menuOpen ? "pressed" : ""}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <Flag /> Start
      </button>

      {menuOpen && (
        <div className="start-menu" ref={menuRef} onKeyDown={onMenuKey}>
          <div className="start-rail" aria-hidden="true">
            <b>Shubham</b>98
          </div>
          <ul role="menu" aria-label="Start menu">
            {item(apps.projects.icon, "My Projects", () => openApp("projects"))}
            {item(apps.about.icon, "About Me", () => openApp("about", { tab: "General" }))}
            {item(text, "Experience", () => openApp("about", { tab: "Experience" }))}
            {item(apps.contact.icon, "Send a Message", () => openApp("contact"))}
            {item(apps.reels.icon, "Lucky Reels", () => openApp("reels"))}
            <li role="separator" className="sep" />
            {item(file, "Murmur", external(liveOf("murmur")))}
            {item(file, "NexusCode", external(liveOf("nexus")))}
            {item(github, "GitHub", external(links.github))}
            {item(linkedin, "LinkedIn", external(links.linkedin))}
            {item(blog, "Blog", external(links.blog))}
            <li role="separator" className="sep" />
            {item(apps.welcome.icon, "Shut Down...", onShutDown)}
          </ul>
        </div>
      )}

      <div className="tasks">
        {wm.order.length > 0 &&
          // Stable order: buttons shouldn't shuffle when focus changes.
          Object.keys(wm.windows).map((id) => (
            <button
              key={id}
              data-task={id}
              className={`task ${focused === id ? "pressed" : ""}`}
              aria-pressed={focused === id}
              onClick={() => dispatch({ type: "taskbar", id })}
            >
              <img src={apps[id].icon} alt="" width="16" height="16" />
              <span>{apps[id].title}</span>
            </button>
          ))}
      </div>

      <Clock onClick={() => openApp("datetime")} />
    </footer>
  );
}

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

function Clock({ onClick }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);
  return (
    <button className="tray" onClick={onClick} aria-label={`${timeFormat.format(now)}. Open date and time`}>
      {timeFormat.format(now)}
    </button>
  );
}
