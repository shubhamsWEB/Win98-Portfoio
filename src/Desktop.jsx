import { useRef, useState } from "react";
import { links, profile } from "./content.js";
import { apps } from "./apps.jsx";
import github from "./assets/icons/github.png";
import linkedin from "./assets/icons/linkedin.png";
import blog from "./assets/icons/copy.png";
import text from "./assets/icons/text.png";

const SHORTCUTS = [
  { id: "about", title: "About Me", icon: apps.about.icon },
  { id: "projects", title: "My Projects", icon: apps.projects.icon },
  { id: "experience", title: "Experience", icon: text, app: "about", props: { tab: "Experience" } },
  { id: "contact", title: "Send a Message", icon: apps.contact.icon },
  { id: "browser", title: "Live Demos", icon: apps.browser.icon },
  { id: "reels", title: "Lucky Reels", icon: apps.reels.icon },
  { id: "github", title: "GitHub", icon: github, href: links.github },
  { id: "linkedin", title: "LinkedIn", icon: linkedin, href: links.linkedin },
  { id: "blog", title: "Blog", icon: blog, href: links.blog },
];

export default function Desktop({ openApp }) {
  const [selected, setSelected] = useState(null);

  const launch = (s) => {
    if (s.href) window.open(s.href, "_blank", "noopener");
    else openApp(s.app ?? s.id, s.props);
  };

  return (
    <div className="wallpaper" onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}>
      <div className="watermark">
        <h1>{profile.name}</h1>
        <p>{profile.title}</p>
      </div>
      <ul className="icons">
        {SHORTCUTS.map((s) => (
          <DesktopIcon
            key={s.id}
            shortcut={s}
            selected={selected === s.id}
            onSelect={() => setSelected(s.id)}
            onOpen={() => launch(s)}
          />
        ))}
      </ul>
    </div>
  );
}

function DesktopIcon({ shortcut, selected, onSelect, onOpen }) {
  const ref = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  // Mouse users drag icons around; touch keeps native scrolling and tap-to-open.
  const startDrag = (e) => {
    onSelect();
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = ref.current;
    const start = { x: e.clientX - offset.current.x, y: e.clientY - offset.current.y };
    const onMove = (ev) => {
      offset.current = { x: ev.clientX - start.x, y: ev.clientY - start.y };
      el.style.transform = `translate(${offset.current.x}px, ${offset.current.y}px)`;
    };
    const onUp = () => {
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
    };
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
  };

  return (
    <li ref={ref}>
      <button
        type="button"
        className={`icon ${selected ? "selected" : ""}`}
        onPointerDown={startDrag}
        onDoubleClick={onOpen}
        onClick={(e) => {
          // Keyboard activation (detail 0) and touch tap open at once; mouse needs a double-click.
          if (e.detail === 0 || matchMedia("(pointer: coarse)").matches) onOpen();
        }}
      >
        <img src={shortcut.icon} alt="" width="32" height="32" draggable={false} />
        <span>{shortcut.title}</span>
      </button>
    </li>
  );
}
