import { useState } from "react";
import { icons } from "../icons.js";
import { MenuBar } from "../ui/Menu.jsx";
import IconView from "../ui/IconView.jsx";

const TRASH = [
  { id: "nm", name: "node_modules", icon: icons.folder, size: "Deleted 4.2 GB, and it still came back" },
  { id: "jq", name: "jquery-plugins.js", icon: icons.notepad, size: "Served its purpose, rest in peace" },
  { id: "final", name: "final_FINAL_v3.psd", icon: icons.paint, size: "There was a v4" },
  { id: "todo", name: "TODO-fix-later.txt", icon: icons.notepad, size: "Later never came" },
  { id: "ie6", name: "ie6-hacks.css", icon: icons.explorer, size: "We don't talk about this one" },
];

export default function Recycle({ openApp, close }) {
  const [files, setFiles] = useState(TRASH);
  const empty = () =>
    openApp("message", {
      title: "Confirm File Delete",
      kind: "info",
      text: `Are you sure you want to delete these ${files.length} items?`,
      buttons: [{ label: "Yes", onClick: () => setFiles([]) }, { label: "No" }],
    });
  const items = files.map((f) => ({
    ...f,
    detail: f.size,
    onOpen: () => openApp("message", { title: f.name, text: "This file is in the Recycle Bin. To use it, first drag it out. Or leave it there. Honestly, leave it there." }),
  }));
  return (
    <div className="folder">
      <MenuBar
        menus={[
          { label: "File", items: [{ label: "Empty Recycle Bin", disabled: !files.length, onClick: empty }, { separator: true }, { label: "Close", onClick: close }] },
          { label: "Help", items: [{ label: "Help Topics", onClick: () => openApp("help") }] },
        ]}
      />
      <IconView items={items} details emptyText="The Recycle Bin is empty." status={files.length ? "" : "0 bytes"} />
    </div>
  );
}
