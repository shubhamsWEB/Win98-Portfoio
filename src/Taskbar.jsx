import { useEffect, useRef, useState } from "react";
import { Flag } from "./Boot.jsx";
import { apps, titleOf } from "./apps.jsx";
import { documents, links, projects } from "./content.js";
import { icons } from "./icons.js";
import { setSettings, useSettings } from "./settings.js";
import { play } from "./sound.js";
import { MenuList, useContextMenu, useDismiss } from "./ui/Menu.jsx";
import { FloppyArt } from "./Assistant.jsx";
import { newestFirst, openFloppy } from "./assistant.js";

const external = (url) => () => window.open(url, "_blank", "noopener");
const liveOf = (id) => projects.find((p) => p.id === id).live;

export default function Taskbar({ wm, focused, dispatch, openApp, viewport, onShutDown, onLogOff }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const startRef = useRef(null);
  const [context, openContext] = useContextMenu();
  const closeMenu = useRef(() => setMenuOpen(false)).current;
  useDismiss(menuOpen, closeMenu);

  // Ctrl+Esc: the original Start menu shortcut, and browsers leave it alone.
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.key === "Escape") {
        e.preventDefault();
        setMenuOpen((o) => !o);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const app = (id, label, props) => ({ label, icon: apps[id].icon, onClick: () => openApp(id, props) });
  const doc = (name) => ({ label: name, icon: icons.notepad, onClick: () => openApp("notepad", { doc: name, text: documents[name] }) });

  const startItems = [
    app("projects", "My Projects"),
    app("about", "About Me", { tab: "General" }),
    app("resume", "My Resume"),
    { label: "Ask Floppy", icon: icons.help, onClick: openFloppy },
    app("contact", "Send a Message"),
    { separator: true },
    {
      label: "Programs",
      icon: icons.directory,
      items: [
        {
          label: "Accessories",
          icon: icons.directory,
          items: [app("calculator", "Calculator"), app("notepad", "Notepad", { doc: null, text: "" }), app("paint", "Paint")],
        },
        { label: "Games", icon: icons.directory, items: [app("bughunt", "Bug Hunt"), app("reels", "Lucky Reels"), app("sudoku", "Sudoku Clan")] },
        app("browser", "Internet Explorer"),
        app("dos", "MS-DOS Prompt"),
        app("computer", "Windows Explorer"),
      ],
    },
    {
      label: "Documents",
      icon: icons.paste,
      items: [app("resume", "Resume.pdf"), doc("README.TXT"), doc("RESUME.TXT"), app("about", "Experience", { tab: "Experience" })],
    },
    {
      label: "Favorites",
      icon: icons.folder,
      items: [
        { label: "Murmur", icon: icons.explorer, onClick: external(liveOf("murmur")) },
        { separator: true },
        { label: "GitHub", icon: icons.github, onClick: external(links.github) },
        { label: "LinkedIn", icon: icons.linkedin, onClick: external(links.linkedin) },
        { label: "Blog", icon: icons.copy, onClick: external(links.blog) },
      ],
    },
    {
      label: "Settings",
      icon: icons.control,
      items: [app("control", "Control Panel"), app("display", "Display")],
    },
    app("find", "Find"),
    app("help", "Help"),
    app("run", "Run..."),
    { separator: true },
    { label: "Log Off Guest...", icon: icons.users, onClick: onLogOff },
    { label: "Shut Down...", icon: icons.computer, onClick: onShutDown },
  ];

  const barMenu = [
    { label: "Cascade Windows", onClick: () => dispatch({ type: "cascade", viewport: viewport() }) },
    { label: "Tile Windows", onClick: () => dispatch({ type: "tile", viewport: viewport() }) },
    { label: "Minimize All Windows", onClick: () => dispatch({ type: "showDesktop" }) },
    { separator: true },
    { label: "Properties", onClick: () => openApp("display") },
  ];

  const taskMenu = (id) => [
    { label: "Restore", disabled: !wm.windows[id].minimized, onClick: () => dispatch({ type: "focus", id }) },
    { label: "Minimize", disabled: wm.windows[id].minimized, onClick: () => dispatch({ type: "minimize", id }) },
    { separator: true },
    { label: "Close", onClick: () => dispatch({ type: "close", id }) },
  ];

  return (
    <footer className="taskbar" onContextMenu={(e) => openContext(e, barMenu)}>
      <button
        ref={startRef}
        className={`start ${menuOpen ? "pressed" : ""}`}
        data-menu-trigger
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <Flag /> Start
      </button>

      {menuOpen && (
        <div className="start-menu">
          <div className="start-rail" aria-hidden="true">
            <b>Shubham</b>98
          </div>
          <MenuList
            inline
            items={startItems}
            ariaLabel="Start menu"
            onClose={(viaEscape) => {
              setMenuOpen(false);
              if (viaEscape) startRef.current.focus();
            }}
          />
        </div>
      )}

      <div className="quick" role="toolbar" aria-label="Quick launch">
        <button title="Show Desktop" aria-label="Show Desktop" onClick={() => dispatch({ type: "showDesktop" })}>
          <img src={icons.display} alt="" width="16" height="16" />
        </button>
        <button title="Internet Explorer" aria-label="Internet Explorer" onClick={() => openApp("browser")}>
          <img src={icons.explorer} alt="" width="16" height="16" />
        </button>
        <button title="My Projects" aria-label="My Projects" onClick={() => openApp("projects")}>
          <img src={icons.folder} alt="" width="16" height="16" />
        </button>
      </div>

      <div className="tasks">
        {Object.keys(wm.windows).map((id) => (
          <button
            key={id}
            data-task={id}
            title={titleOf(wm.windows[id])}
            className={`task ${focused === id ? "pressed" : ""}`}
            aria-pressed={focused === id}
            onClick={() => dispatch({ type: "taskbar", id })}
            onContextMenu={(e) => openContext(e, taskMenu(id))}
          >
            <img src={apps[id].icon} alt="" width="16" height="16" />
            <span>{titleOf(wm.windows[id])}</span>
          </button>
        ))}
      </div>

      <div className="tray-box">
        <FloppyTray />
        <SoundToggle />
        <Clock onClick={() => openApp("datetime")} />
      </div>
      {context}
    </footer>
  );
}

function FloppyTray() {
  const { seenUpdates } = useSettings();
  const unseen = newestFirst().filter((u) => !seenUpdates.includes(u.id)).length;
  return (
    <button
      className="speaker floppy-tray"
      title={unseen ? `Ask Floppy (${unseen} new)` : "Ask Floppy"}
      aria-label={unseen ? `Ask Floppy, ${unseen} new updates` : "Ask Floppy"}
      onClick={openFloppy}
    >
      <FloppyArt size={16} />
      {unseen > 0 && <span className="tray-dot" aria-hidden="true" />}
    </button>
  );
}

function SoundToggle() {
  const { sound } = useSettings();
  return (
    <button
      className="speaker"
      title={sound ? "Sound is on" : "Sound is off"}
      aria-label={sound ? "Turn sound off" : "Turn sound on"}
      aria-pressed={sound}
      onClick={() => {
        setSettings({ sound: !sound });
        play("on");
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" shapeRendering="crispEdges" aria-hidden="true">
        <path d="M1 5h3l4-3v10L4 9H1z" fill="#ff0" stroke="#000" />
        {sound ? (
          <path d="M10 4l1 1v4l-1 1M12 2l1 2v6l-1 2" fill="none" stroke="#000" />
        ) : (
          <path d="M10 4l3 6M13 4l-3 6" fill="none" stroke="#c00" strokeWidth="1.5" />
        )}
      </svg>
    </button>
  );
}

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "full" });

function Clock({ onClick }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);
  return (
    <button
      className="tray"
      title={dateFormat.format(now)}
      onClick={onClick}
      aria-label={`${timeFormat.format(now)}. Open date and time`}
    >
      {timeFormat.format(now)}
    </button>
  );
}
