import { documents, experience, profile, projects, skills } from "../content.js";

// Friendly names shared by the Run dialog and the MS-DOS Prompt's START command.
export const programs = {
  notepad: "notepad",
  paint: "paint",
  mspaint: "paint",
  pbrush: "paint",
  calc: "calculator",
  calculator: "calculator",
  command: "dos",
  cmd: "dos",
  explorer: "computer",
  iexplore: "browser",
  find: "find",
  control: "control",
  display: "display",
  bughunt: "bughunt",
  reels: "reels",
  help: "help",
  projects: "projects",
  about: "about",
  contact: "contact",
  resume: "resume",
};

export function resolveUrl(text) {
  try {
    const url = new URL(/^[a-z]+:/i.test(text) ? text : `https://${text}`);
    return /^https?:$/.test(url.protocol) && url.hostname.includes(".") ? url.href : null;
  } catch {
    return null;
  }
}

const HELP = [
  "DIR        List files            TYPE file   Show a file",
  "CD folder  Change folder         CLS         Clear the screen",
  "WHOAMI     Who built this        SKILLS      Tech I work with",
  "PROJECTS   List my projects      OPEN name   Open a project",
  "JOBS       Work history          CONTACT     Send me a message",
  "RESUME     Open my resume",
  "START app  Run a program         VER         Version",
  "DATE       Show the date         EXIT        Close this window",
];

const pad = (s, n) => s.padEnd(n).slice(0, n);
const short = (name) => name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);

// Returns { out: string[], cwd?, clear?, app?, url?, exit? }.
export function run(line, cwd) {
  const [rawCmd = "", ...rest] = line.trim().split(/\s+/);
  const cmd = rawCmd.toLowerCase();
  const arg = rest.join(" ");
  const inProjects = cwd === "C:\\PROJECTS";

  switch (cmd) {
    case "":
      return { out: [] };
    case "help":
    case "?":
      return { out: HELP };
    case "cls":
      return { out: [], clear: true };
    case "exit":
      return { out: [], exit: true };
    case "ver":
      return { out: ["Shubham 98 [Version 4.10.2026]"] };
    case "date":
      return { out: [`Current date is ${new Date().toDateString()}`] };
    case "whoami":
      return { out: [`${profile.name}, ${profile.title}`, profile.tagline] };
    case "skills":
      return { out: skills.map(([k, v]) => `${pad(k, 10)} ${v}`) };
    case "jobs":
      return { out: experience.map((j) => `${pad(j.period, 22)} ${j.company}`) };
    case "contact":
      return { out: ["Opening New Message..."], app: "contact" };
    case "projects":
      return { out: projects.map((p) => `${pad(p.name, 22)} ${p.year}`) };
    case "dir":
      return {
        out: inProjects
          ? [` Directory of ${cwd}`, "", ...projects.map((p) => `${pad(short(p.name), 9)}<DIR>   ${p.year}`), `${projects.length} dir(s)`]
          : [` Directory of ${cwd}`, "", "PROJECTS <DIR>", ...Object.keys(documents)],
      };
    case "cd":
    case "cd..": {
      const target = (cmd === "cd.." ? ".." : arg).toLowerCase();
      if (!target) return { out: [cwd] };
      if (target === ".." || target === "\\") return { out: [], cwd: "C:\\" };
      if (target === "projects" && !inProjects) return { out: [], cwd: "C:\\PROJECTS" };
      return { out: ["Invalid directory"] };
    }
    case "type": {
      const doc = documents[arg.toUpperCase()];
      if (!arg) return { out: ["Required parameter missing"] };
      return { out: doc ? doc.split("\n") : ["File not found"] };
    }
    case "open": {
      const needle = arg.toLowerCase();
      const hit = needle && projects.find((p) => p.name.toLowerCase().includes(needle));
      if (!needle) return { out: ["Usage: OPEN project-name"] };
      if (!hit) return { out: [`Project not found: ${arg}`] };
      const url = hit.live ?? hit.source;
      return url ? { out: [`Opening ${hit.name}...`], url } : { out: [`${hit.name} has no public link yet.`] };
    }
    case "start": {
      const app = programs[arg.toLowerCase()];
      return app ? { out: [], app } : { out: ["Bad command or file name"] };
    }
    default: {
      const app = programs[cmd.replace(/\.exe$/, "")];
      return app ? { out: [], app } : { out: ["Bad command or file name"] };
    }
  }
}
