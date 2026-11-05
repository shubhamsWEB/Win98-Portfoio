import { useState } from "react";
import { icons } from "../icons.js";

const TOPICS = [
  {
    title: "Getting around",
    body: [
      "Double-click an icon to open it. On a phone, tap once.",
      "Press Start, or Ctrl+Esc, for all programs and documents.",
      "Right-click the desktop, the taskbar, a title bar or an icon to see more options.",
    ],
  },
  {
    title: "Working with windows",
    body: [
      "Drag a title bar to move a window, and its bottom-right corner to resize it.",
      "Double-click a title bar to maximize. Click a taskbar button to minimize or restore.",
      "The first button by the Start button shows the desktop. Right-click the taskbar to cascade or tile windows.",
    ],
  },
  {
    title: "Finding my work",
    body: [
      "My Projects holds everything, sorted into folders. Select a project to see screenshots and links.",
      "About Me has my experience and skills. RESUME.TXT is the same thing in plain text.",
      "Find, on the Start menu, searches all of it.",
    ],
  },
  {
    title: "Things to try",
    body: [
      "Open MS-DOS Prompt and type HELP.",
      "Draw something in Paint, then save it. Play Bug Hunt.",
      "Change the wallpaper in Display Properties. Your choice is remembered.",
      "Leave the desktop alone for a while and the screen saver starts.",
    ],
  },
  {
    title: "About this site",
    body: [
      "Built from scratch with React and plain CSS, on top of 98.css for the classic controls.",
      "The sounds are generated in the browser, and they stay off until you click the speaker.",
    ],
  },
];

export default function Help() {
  const [active, setActive] = useState(0);
  const topic = TOPICS[active];
  return (
    <div className="help">
      <ul className="tree-view" aria-label="Help topics">
        {TOPICS.map((t, i) => (
          <li key={t.title}>
            <button className={`tree-item ${i === active ? "selected" : ""}`} aria-current={i === active} onClick={() => setActive(i)}>
              <img src={icons.help} alt="" width="16" height="16" />
              {t.title}
            </button>
          </li>
        ))}
      </ul>
      <article className="help-body prose" key={active}>
        <h3>{topic.title}</h3>
        <ul>{topic.body.map((b) => <li key={b}>{b}</li>)}</ul>
      </article>
    </div>
  );
}
