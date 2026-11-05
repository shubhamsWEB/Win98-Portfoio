import Welcome from "./apps/Welcome.jsx";
import About from "./apps/About.jsx";
import Projects from "./apps/Projects.jsx";
import Contact from "./apps/Contact.jsx";
import Browser from "./apps/Browser.jsx";
import Reels from "./apps/Reels.jsx";
import DateTime from "./apps/DateTime.jsx";
import computer from "./assets/icons/computer.png";
import users from "./assets/icons/users.png";
import folder from "./assets/icons/folder.png";
import message from "./assets/icons/message.png";
import explorer from "./assets/icons/explorer.png";
import reels from "./assets/icons/reels.png";
import calendar from "./assets/icons/calendar.png";

// Keys double as URL hashes: yoursite/#projects opens that window directly.
export const apps = {
  welcome: { title: "Welcome", icon: computer, Component: Welcome, w: 520, h: 310, center: true, resizable: false },
  about: { title: "About Shubham", icon: users, Component: About, w: 560, h: 500 },
  projects: { title: "C:\\Projects", icon: folder, Component: Projects, w: 780, h: 520 },
  contact: { title: "New Message", icon: message, Component: Contact, w: 460, h: 460 },
  browser: { title: "Internet Explorer", icon: explorer, Component: Browser, w: 900, h: 620 },
  reels: { title: "Lucky Reels", icon: reels, Component: Reels, w: 320, h: 300, resizable: false },
  datetime: { title: "Date/Time Properties", icon: calendar, Component: DateTime, w: 300, h: 350, resizable: false },
};
