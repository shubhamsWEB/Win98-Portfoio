import { icons } from "../icons.js";
import { setSettings, useSettings } from "../settings.js";
import { play } from "../sound.js";
import { MenuBar } from "../ui/Menu.jsx";
import IconView from "../ui/IconView.jsx";

export default function Control({ openApp, close }) {
  const { sound } = useSettings();
  const items = [
    { id: "display", name: "Display", icon: icons.display, detail: "Wallpaper, screen saver and colors", onOpen: () => openApp("display") },
    {
      id: "sounds",
      name: `Sounds (${sound ? "on" : "off"})`,
      icon: icons.message,
      detail: "Turn system sounds on or off",
      onOpen: () => {
        setSettings({ sound: !sound });
        play("on");
      },
    },
    { id: "datetime", name: "Date/Time", icon: icons.calendar, detail: "Calendar, and my local time", onOpen: () => openApp("datetime") },
    { id: "system", name: "System", icon: icons.computer, detail: "About this computer's owner", onOpen: () => openApp("about", { tab: "General" }) },
  ];
  return (
    <div className="folder">
      <MenuBar menus={[{ label: "File", items: [{ label: "Close", onClick: close }] }, { label: "Help", items: [{ label: "Help Topics", onClick: () => openApp("help") }] }]} />
      <IconView items={items} />
    </div>
  );
}
