import { useState } from "react";
import { icons } from "../icons.js";
import { documents } from "../content.js";
import { MenuBar } from "../ui/Menu.jsx";
import IconView from "../ui/IconView.jsx";

export default function Computer({ openApp, close }) {
  const [details, setDetails] = useState(false);
  const notReady = (drive) =>
    openApp("message", {
      title: drive,
      text: `${drive} is not accessible. The device is not ready.`,
      buttons: [{ label: "Retry", onClick: () => notReady(drive) }, { label: "Cancel" }],
    });
  const items = [
    { id: "a", name: "3½ Floppy (A:)", icon: icons.floppy, detail: "Removable disk", onOpen: () => notReady("A:\\") },
    { id: "c", name: "Projects (C:)", icon: icons.drive, detail: "Local disk: everything I've built", onOpen: () => openApp("projects") },
    { id: "d", name: "Resume (D:)", icon: icons.cd, detail: "CD-ROM: read only", onOpen: () => openApp("notepad", { doc: "RESUME.TXT", text: documents["RESUME.TXT"] }) },
    { id: "control", name: "Control Panel", icon: icons.control, detail: "Change how the desktop looks and sounds", onOpen: () => openApp("control") },
  ];
  return (
    <div className="folder">
      <MenuBar
        menus={[
          { label: "File", items: [{ label: "Close", onClick: close }] },
          {
            label: "View",
            items: [
              { label: "Large Icons", checked: !details, onClick: () => setDetails(false) },
              { label: "Details", checked: details, onClick: () => setDetails(true) },
            ],
          },
          { label: "Help", items: [{ label: "Help Topics", onClick: () => openApp("help") }] },
        ]}
      />
      <IconView items={items} details={details} />
    </div>
  );
}
