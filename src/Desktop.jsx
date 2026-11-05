import { useRef, useState } from "react";
import { documents, links, profile } from "./content.js";
import { apps } from "./apps.jsx";
import { icons } from "./icons.js";
import { useContextMenu } from "./ui/Menu.jsx";

const openDoc = (name) => ({ doc: name, text: documents[name] });

const SHORTCUTS = [
  { id: "computer", title: "My Computer", icon: icons.computer },
  { id: "projects", title: "My Projects", icon: icons.folder },
  { id: "about", title: "About Me", icon: icons.users },
  { id: "experience", title: "Experience", icon: icons.text, app: "about", props: { tab: "Experience" } },
  { id: "resume", title: "Resume.pdf", icon: icons.pdf },
  { id: "recycle", title: "Recycle Bin", icon: icons.recycle },
  { id: "browser", title: "Live Demos", icon: icons.explorer },
  { id: "contact", title: "Send a Message", icon: icons.message },
  { id: "readme", title: "README.TXT", icon: icons.notepad, app: "notepad", props: openDoc("README.TXT") },
  { id: "dos", title: "MS-DOS Prompt", icon: icons.dos, link: true },
  { id: "bughunt", title: "Bug Hunt", icon: icons.bug, link: true },
  { id: "reels", title: "Lucky Reels", icon: icons.reels, link: true },
  { id: "github", title: "GitHub", icon: icons.github, href: links.github, link: true },
  { id: "linkedin", title: "LinkedIn", icon: icons.linkedin, href: links.linkedin, link: true },
  { id: "blog", title: "Blog", icon: icons.copy, href: links.blog, link: true },
];

export default function Desktop({ openApp }) {
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState(SHORTCUTS);
  const [layoutKey, setLayoutKey] = useState(0);
  const [band, setBand] = useState(null);
  const [menu, openMenu] = useContextMenu();
  const rootRef = useRef(null);

  const launch = (s) => {
    if (s.href) window.open(s.href, "_blank", "noopener");
    else openApp(s.app ?? s.id, s.props);
  };

  const arrange = (sorted) => {
    setOrder(sorted);
    setLayoutKey((k) => k + 1); // remount clears dragged positions
  };
  const byName = () => [...SHORTCUTS].sort((a, b) => a.title.localeCompare(b.title));
  const byType = () => [...SHORTCUTS].sort((a, b) => Number(!!a.link) - Number(!!b.link));

  const desktopMenu = [
    {
      label: "Arrange Icons",
      items: [
        { label: "By Name", onClick: () => arrange(byName()) },
        { label: "By Type", onClick: () => arrange(byType()) },
        { label: "Default", onClick: () => arrange(SHORTCUTS) },
      ],
    },
    { label: "Line Up Icons", onClick: () => arrange(order) },
    { separator: true },
    { label: "Refresh", onClick: () => setLayoutKey((k) => k + 1) },
    { separator: true },
    { label: "Paste", disabled: true },
    { separator: true },
    { label: "New", items: [{ label: "Text Document", icon: icons.notepad, onClick: () => openApp("notepad", { doc: null, text: "" }) }] },
    { separator: true },
    { label: "Properties", onClick: () => openApp("display") },
  ];

  // Rubber-band selection, mouse only so touch can still scroll.
  const startBand = (e) => {
    if (e.target !== e.currentTarget || e.button !== 0) return;
    setSelected([]);
    if (e.pointerType !== "mouse") return;
    const bounds = rootRef.current.getBoundingClientRect();
    const start = { x: e.clientX, y: e.clientY };
    const onMove = (ev) => {
      const box = {
        left: Math.min(start.x, ev.clientX),
        top: Math.min(start.y, ev.clientY),
        right: Math.max(start.x, ev.clientX),
        bottom: Math.max(start.y, ev.clientY),
      };
      setBand({ left: box.left - bounds.left, top: box.top - bounds.top, width: box.right - box.left, height: box.bottom - box.top });
      setSelected(
        [...rootRef.current.querySelectorAll("[data-icon]")]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.left < box.right && r.right > box.left && r.top < box.bottom && r.bottom > box.top;
          })
          .map((el) => el.dataset.icon)
      );
    };
    const onUp = () => {
      setBand(null);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
    };
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
  };

  // Arrow keys walk between icons, like the real desktop.
  const onKeyDown = (e) => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const all = [...rootRef.current.querySelectorAll("[data-icon]")];
    const at = all.indexOf(document.activeElement);
    if (at === -1) return;
    e.preventDefault();
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    all[(at + step + all.length) % all.length].focus();
    setSelected([all[(at + step + all.length) % all.length].dataset.icon]);
  };

  return (
    <div
      className="wallpaper"
      ref={rootRef}
      onPointerDown={startBand}
      onContextMenu={(e) => openMenu(e, desktopMenu)}
      onKeyDown={onKeyDown}
    >
      <div className="watermark">
        <h1>{profile.name}</h1>
        <p>{profile.title}</p>
      </div>
      <ul className="icons" key={layoutKey} onPointerDown={startBand}>
        {order.map((s) => (
          <DesktopIcon
            key={s.id}
            shortcut={s}
            selected={selected.includes(s.id)}
            onSelect={() => setSelected([s.id])}
            onOpen={() => launch(s)}
            onMenu={(e) =>
              openMenu(e, [
                { label: "Open", onClick: () => launch(s) },
                { separator: true },
                { label: "Properties", onClick: () => openApp("message", {
                  title: `${s.title} Properties`,
                  kind: "info",
                  text: s.href ? `Shortcut to ${s.href}` : `Type: ${s.link ? "Shortcut to program" : "System folder or file"}`,
                }) },
              ])
            }
          />
        ))}
      </ul>
      {band && <div className="band" style={band} />}
      {menu}
    </div>
  );
}

function DesktopIcon({ shortcut, selected, onSelect, onOpen, onMenu }) {
  const ref = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  // Mouse users drag icons around; touch keeps native scrolling and tap-to-open.
  const startDrag = (e) => {
    e.stopPropagation();
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
        data-icon={shortcut.id}
        className={`icon ${selected ? "selected" : ""}`}
        onPointerDown={startDrag}
        onDoubleClick={onOpen}
        onContextMenu={onMenu}
        onClick={(e) => {
          // Keyboard activation (detail 0) and touch tap open at once; mouse needs a double-click.
          if (e.detail === 0 || matchMedia("(pointer: coarse)").matches) onOpen();
        }}
      >
        <span className={shortcut.link ? "icon-img shortcut" : "icon-img"}>
          <img src={shortcut.icon} alt="" width="32" height="32" draggable={false} />
        </span>
        <span className="icon-label">{shortcut.title}</span>
      </button>
    </li>
  );
}
