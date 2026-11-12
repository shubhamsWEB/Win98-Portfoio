import Welcome from "./apps/Welcome.jsx";
import About from "./apps/About.jsx";
import Projects from "./apps/Projects.jsx";
import Contact from "./apps/Contact.jsx";
import Browser from "./apps/Browser.jsx";
import Reels from "./apps/Reels.jsx";
import Sudoku from "./apps/Sudoku.jsx";
import DateTime from "./apps/DateTime.jsx";
import Computer from "./apps/Computer.jsx";
import Control from "./apps/Control.jsx";
import Recycle from "./apps/Recycle.jsx";
import Notepad from "./apps/Notepad.jsx";
import Dos from "./apps/Dos.jsx";
import Paint from "./apps/Paint.jsx";
import Calculator from "./apps/Calculator.jsx";
import BugHunt from "./apps/BugHunt.jsx";
import Find from "./apps/Find.jsx";
import Run from "./apps/Run.jsx";
import Display from "./apps/Display.jsx";
import Help from "./apps/Help.jsx";
import MessageBox from "./apps/MessageBox.jsx";
import Resume from "./apps/Resume.jsx";
import { icons as i } from "./icons.js";

// Keys double as URL hashes: yoursite/#projects opens that window directly.
export const apps = {
  welcome: { title: "Welcome", icon: i.computer, Component: Welcome, w: 520, h: 330, center: true, resizable: false },
  about: { title: "About Shubham", icon: i.users, Component: About, w: 560, h: 500 },
  projects: { title: "C:\\Projects", icon: i.folder, Component: Projects, w: 800, h: 540 },
  contact: { title: "New Message", icon: i.message, Component: Contact, w: 460, h: 460 },
  browser: { title: "Internet Explorer", icon: i.explorer, Component: Browser, w: 900, h: 620 },
  resume: { title: "Resume.pdf", icon: i.pdf, Component: Resume, w: 720, h: 620 },
  computer: { title: "My Computer", icon: i.computer, Component: Computer, w: 480, h: 340 },
  control: { title: "Control Panel", icon: i.control, Component: Control, w: 460, h: 320 },
  recycle: { title: "Recycle Bin", icon: i.recycle, Component: Recycle, w: 500, h: 340 },
  notepad: { title: "Untitled - Notepad", icon: i.notepad, Component: Notepad, w: 560, h: 440 },
  dos: { title: "MS-DOS Prompt", icon: i.dos, Component: Dos, w: 640, h: 400 },
  paint: { title: "untitled - Paint", icon: i.paint, Component: Paint, w: 720, h: 520 },
  calculator: { title: "Calculator", icon: i.calc, Component: Calculator, w: 260, h: 310, resizable: false },
  bughunt: { title: "Bug Hunt", icon: i.bug, Component: BugHunt, w: 320, h: 430, resizable: false },
  reels: { title: "Lucky Reels", icon: i.reels, Component: Reels, w: 320, h: 300, resizable: false },
  sudoku: { title: "Sudoku Clan", icon: i.sudoku, Component: Sudoku, w: 400, h: 400, resizable: false },
  find: { title: "Find: All Files", icon: i.search, Component: Find, w: 520, h: 400 },
  run: { title: "Run", icon: i.run, Component: Run, w: 380, h: 170, resizable: false },
  display: { title: "Display Properties", icon: i.display, Component: Display, w: 410, h: 470, resizable: false },
  help: { title: "Shubham 98 Help", icon: i.help, Component: Help, w: 620, h: 440 },
  datetime: { title: "Date/Time Properties", icon: i.calendar, Component: DateTime, w: 300, h: 350, resizable: false },
  message: { title: (p) => p?.title ?? "Shubham 98", icon: i.failed, Component: MessageBox, w: 370, h: 175, center: true, resizable: false },
};

export const titleOf = (win) => {
  const { title } = apps[win.id];
  return win.title ?? (typeof title === "function" ? title(win.props) : title);
};
