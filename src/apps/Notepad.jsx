import { useEffect, useRef, useState } from "react";
import { documents } from "../content.js";
import { icons } from "../icons.js";
import { MenuBar } from "../ui/Menu.jsx";

export default function Notepad({ doc = null, text = "", request, openApp, close, setTitle }) {
  const [content, setContent] = useState(text);
  const [name, setName] = useState(doc);
  const [wrap, setWrap] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    setContent(text);
    setName(doc);
  }, [text, doc, request]);

  useEffect(() => {
    setTitle(`${name ?? "Untitled"} - Notepad`);
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = () => {
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: name ?? "untitled.txt" });
    a.click();
    URL.revokeObjectURL(url);
  };

  const insert = (value) => {
    const el = ref.current;
    const at = el.selectionStart;
    setContent(content.slice(0, at) + value + content.slice(el.selectionEnd));
    el.focus();
  };

  const load = (file) => {
    setName(file);
    setContent(documents[file]);
  };

  return (
    <div className="notepad">
      <MenuBar
        menus={[
          {
            label: "File",
            items: [
              { label: "New", onClick: () => { setName(null); setContent(""); } },
              { label: "Open", items: Object.keys(documents).map((d) => ({ label: d, icon: icons.notepad, onClick: () => load(d) })) },
              { label: "Save As...", onClick: save },
              { separator: true },
              { label: "Exit", onClick: close },
            ],
          },
          {
            label: "Edit",
            items: [
              { label: "Select All", onClick: () => { ref.current.focus(); ref.current.select(); } },
              { label: "Time/Date", shortcut: "F5", onClick: () => insert(new Date().toLocaleString()) },
              { separator: true },
              { label: "Word Wrap", checked: wrap, onClick: () => setWrap(!wrap) },
            ],
          },
          { label: "Help", items: [{ label: "Help Topics", onClick: () => openApp("help") }] },
        ]}
      />
      <textarea
        ref={ref}
        aria-label="Document text"
        spellCheck={false}
        wrap={wrap ? "soft" : "off"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "F5") {
            e.preventDefault();
            insert(new Date().toLocaleString());
          }
        }}
      />
    </div>
  );
}
