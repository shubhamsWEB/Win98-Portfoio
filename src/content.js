// Everything a visitor reads lives here. Update this file, not the components.
export const profile = {
  name: "Shubham Agrawal",
  title: "Software Engineer",
  tagline: "I build AI agent systems and the products around them.",
  summary:
    "Software engineer with 6+ years designing, building and running production software across distributed systems, cloud and LLM infrastructure. I ship global web experiences at Ford, and I built Murmur, a private voice assistant.",
  facts: [
    ["Role", "Software Engineer, Ford Motor Company"],
    ["Experience", "6+ years"],
    ["Focus", "AI agents, full-stack, cloud"],
    ["Based in", "Bengaluru, India (IST)"],
  ],
};

export const links = {
  github: "https://github.com/shubhamsWEB",
  linkedin: "https://www.linkedin.com/in/shubham-agrawal-950078170/",
  blog: "https://shubhamsweb.hashnode.dev/",
  npm: "https://www.npmjs.com/~shubham_17",
  resume: "/Shubham_Agrawal_Resume.pdf",
};

export const experience = [
  {
    company: "Ford Motor Company",
    role: "Software Engineer",
    period: "Nov 2025 - Present",
    points: [
      "Build localized Owner Dashboard experiences for Ford vehicle owners: region-specific account, vehicle and service features across multiple markets.",
      "Ship responsive, production-grade React, Next.js and TypeScript UI over backend REST services.",
      "Partner with product, design and regional teams to adapt the experience for a global owner base.",
    ],
  },
  {
    company: "People Interactive (Shaadi.com)",
    role: "Software Engineer",
    period: "Jun 2022 - Oct 2025",
    points: [
      "Built Astrochat end to end, from architecture to deployment, with LLM-powered agents and real-time chat at scale.",
      "Moved the build pipeline from Webpack to Vite for 70% faster builds and raised TypeScript type safety to 90%.",
      "Optimized 45,000+ URLs for SEO, growing registrations and organic visibility.",
    ],
  },
  {
    company: "GeekyAnts",
    role: "Software Engineer",
    period: "Sep 2020 - May 2022",
    points: [
      "Migrated a monolith to microservices, improving scalability and reliability of production services.",
      "Cut page load times by up to 35% with code-splitting, lazy loading and caching.",
      "Worked directly with customers to capture requirements through integration and delivery.",
    ],
  },
];

export const skills = [
  ["Languages", "TypeScript, JavaScript, Python, Java"],
  ["AI", "LLM APIs, RAG, AI agents, MCP, pgvector, NLP"],
  ["Frontend", "React, Next.js, micro-frontends, component libraries, Three.js"],
  ["Backend", "Node.js, Express, NestJS, Socket.io, microservices, REST"],
  ["Data", "PostgreSQL, MySQL, MongoDB, Supabase"],
  ["Cloud", "AWS, Google Cloud, Vercel"],
];

export const education = [
  ["B.Tech, Computer Science", "Shri Shankaracharya Group of Institutions, CSVTU", "2020"],
];

export const folders = [
  { id: "ai", name: "AI & Agents" },
  { id: "web", name: "3D & Web" },
  { id: "oss", name: "Open Source" },
  { id: "archive", name: "Archive" },
];

// `notes` is extra detail for Floppy, the AI assistant. It is not shown in My Projects.
export const projects = [
  {
    id: "murmur",
    folder: "ai",
    name: "Murmur",
    year: "2026",
    desc: "A free, open-source voice assistant for Mac and Windows. Hold a key and speak: it types in any app, finds files by what's inside them and carries out tasks across your apps. On the Mac it also remembers your people, promises and plans. Speech recognition stays on your computer.",
    notes:
      "Hold fn on a Mac, or Ctrl + Windows on a PC, and speak; Murmur works out whether to type the words or act on them. Dictation covers English, Hinglish (spoken Hindi written in Roman script) and 25 European languages, using NVIDIA Parakeet and a Hinglish Whisper model on the device. Commands rewrite, translate or reply to selected text, open apps and websites, change settings, work inside browser pages, run multi-step tasks and can start Claude Code or Codex. They run on a local model through Ollama, or on Claude or OpenAI with the user's own key. File search covers PDFs, documents, photos, audio and video. Memory arrived in version 1.7 and is Mac-only for now: a private, on-device record of people, commitments and plans, with a morning brief and an evening wrap-up. Murmur Cleanup is Murmur's own small model, trained to tidy dictation. The Mac app is native Swift and the Windows app is a Tauri shell. MIT licensed, launched on Product Hunt, and built on the open-source DigUp file search.",
    stack: ["Swift", "Tauri", "On-device speech", "Local models", "AI agents"],
    live: "https://usemurmur.live/",
    source: "https://github.com/shubhamsWEB/murmur-app",
    frame: true,
  },
  {
    id: "gita",
    folder: "ai",
    name: "Spiritual AI",
    year: "2026",
    desc: "A Graph-RAG assistant grounded in the Bhagavad Gita, with a verse graph walk, hybrid retrieval, reranking and a citation verifier backed by an eval harness.",
    stack: ["Graph-RAG", "HyDE", "Reranking", "Evals"],
    source: "https://github.com/shubhamsWEB/spritual-aiclient",
  },
  {
    id: "motionscroll",
    folder: "ai",
    name: "MotionScroll",
    year: "2026",
    desc: "A TypeScript library that scrolls any web page with hand gestures tracked live from the webcam, with a React hook and SSR-safe setup. In development.",
    stack: ["TypeScript", "MediaPipe", "React"],
  },
  {
    id: "sudoku",
    folder: "web",
    name: "Sudoku Clan",
    year: "2026",
    desc: "Real-time multiplayer Sudoku with five modes: race a rival in Clash, fight over one shared board in Territory, take turns in Duel, survive an 8-player Battle Royale, or team up in Split Sight co-op. Solo play has teaching hints, a daily puzzle and a 3D board. Free in the browser, with Android and iOS apps on the way.",
    notes:
      "Sudoku Clan grew out of Sudoku 2.0, one of Shubham's first React projects from 2021, rebuilt from scratch in 2026. Clash is a 1 v 1 race on the same puzzle where finishing rows fires attacks such as Ice and Fog. Territory is 1 v 1 on one shared board, claiming cells in your colour. Duel is turn-based, and harder logic scores more. Battle Royale puts up to 8 players on quick sprint boards and knocks out the slowest each round. Split Sight is two-player co-op where each player sees different clues. Players can quick match or invite a friend with a room code, play as a guest or sign in with Google to keep progress, and each competitive mode has its own rating. The game server is the referee for every move, so results can't be faked, and live matches carry on through server updates. Puzzles are generated to be solvable by logic alone and graded by the hardest technique they need. One TypeScript engine is shared by the React app and the Node.js WebSocket server, and the mobile apps wrap the same build with Capacitor. This site has a Sudoku Clan program on the desktop that launches any mode in a new tab.",
    stack: ["React", "TypeScript", "Node.js", "WebSockets", "Three.js"],
    live: "https://sudokuclan.app/",
    play: "https://play.sudokuclan.app/",
    frame: true,
  },
  {
    id: "ring",
    folder: "web",
    name: "3D Ring Customizer",
    year: "2024",
    desc: "A real-time jewellery configurator. Swap stones, metals and settings on a refractive 3D ring, with performance tiers that keep it smooth on phones.",
    stack: ["React", "Three.js", "React Three Fiber"],
    live: "https://ring-customizer.vercel.app/",
    frame: true,
  },
  {
    id: "redbull",
    folder: "web",
    name: "Red Bull 3D",
    year: "2024",
    desc: "A 3D product concept site built around animated cans. Personal design study, not affiliated with Red Bull.",
    stack: ["Next.js", "Three.js"],
    live: "https://redbull3d.vercel.app/",
    source: "https://github.com/shubhamsWEB/redbull3d",
    frame: true,
  },
  {
    id: "whiteboard",
    folder: "web",
    name: "Realtime Whiteboard",
    year: "2024",
    desc: "Multiplayer drawing rooms where people sketch together on a shared canvas in a hand-drawn style.",
    stack: ["Socket.io", "Rough.js", "React"],
    source: "https://github.com/shubhamsWEB/realtime-whiteboard",
  },
  {
    id: "npm",
    folder: "oss",
    name: "npm Packages",
    year: "2021-22",
    desc: "Published packages including a project scaffolding CLI, a React boilerplate, a tooltip component and a CSS animation library.",
    stack: ["JavaScript", "CLI", "npm"],
    live: "https://www.npmjs.com/~shubham_17",
  },
  {
    id: "crickboard",
    folder: "oss",
    name: "Crickboard API",
    year: "2021",
    desc: "A TypeScript npm package that powers the Crickboard cricket scoreboard.",
    stack: ["TypeScript", "npm"],
    source: "https://github.com/shubhamsWEB/CrickboardApi",
  },
  {
    id: "playgrounds",
    folder: "oss",
    name: "Code Playgrounds",
    year: "2023",
    desc: "An in-browser development environment for building websites.",
    stack: ["JavaScript", "React"],
    source: "https://github.com/shubhamsWEB/Code-playgrounds",
  },
  {
    id: "copico",
    folder: "archive",
    name: "Copico Systems",
    year: "2023",
    desc: "Marketing website for a computer solutions and services company.",
    stack: ["Next.js"],
    live: "https://copicosystems.vercel.app/",
    frame: true,
  },
  {
    id: "bank",
    folder: "archive",
    name: "Banking DApp",
    year: "2022",
    desc: "A decentralized banking app with yield farming on the blockchain.",
    stack: ["Solidity", "Web3", "React"],
    live: "https://phenomenal-selkie-3483d5.netlify.app/",
    source: "https://github.com/shubhamsWEB/Banking-DAPP",
  },
  {
    id: "covid",
    folder: "archive",
    name: "COVID-19 Tracker",
    year: "2020",
    desc: "A web app that tracked COVID-19 case numbers.",
    stack: ["React"],
    source: "https://github.com/shubhamsWEB/COVID-19-TRACKER",
  },
  {
    id: "samvid20",
    folder: "archive",
    name: "Samvid 2020",
    year: "2020",
    desc: "Official website for the Samvid 2020 festival.",
    stack: ["HTML", "CSS", "JavaScript"],
    live: "https://shubhamsweb.github.io/MaachateRaho/",
    frame: true,
  },
  {
    id: "samvid19",
    folder: "archive",
    name: "Samvid 2019",
    year: "2019",
    desc: "Official website for the Samvid 2019 festival.",
    stack: ["HTML", "CSS", "JavaScript"],
    source: "https://github.com/shubhamsWEB/SAMVID19",
  },
  {
    id: "movie",
    folder: "archive",
    name: "Movie Rating App",
    year: "2019",
    desc: "Search for any film and see its ratings.",
    stack: ["JavaScript"],
    live: "https://shubhamsweb.github.io/Movieapp/",
    frame: true,
  },
];

// The Sudoku Clan program on the desktop. `id` is the game's own ?play= value.
export const sudokuClan = {
  tagline: "Sudoku, but multiplayer. Free, real-time, no download.",
  modes: [
    { id: "clash", name: "Clash", players: "1 v 1", desc: "Race the same puzzle. Finish rows to fire attacks, finish more to block them." },
    { id: "territory", name: "Territory", players: "1 v 1", desc: "One shared board. Claim cells in your colour and lock rows and boxes for bonus points." },
    { id: "duel", name: "Duel", players: "1 v 1, turn-based", desc: "Take turns, three digits each. Harder logic scores more, and guesses score nothing." },
    { id: "royale", name: "Battle Royale", players: "Up to 8 players", desc: "Quick sprint boards. The slowest players are knocked out each round." },
    { id: "coop", name: "Split Sight", players: "2 players, co-op", desc: "You each see different clues, so share wisely and solve it together." },
  ],
};

// Files visitors can open in Notepad or read from the MS-DOS Prompt.
const resumeLines = [
  profile.name.toUpperCase(),
  profile.title,
  "",
  profile.summary,
  "",
  "EXPERIENCE",
  ...experience.flatMap((job) => [
    "",
    `${job.company} - ${job.role} (${job.period})`,
    ...job.points.map((p) => `  * ${p}`),
  ]),
  "",
  "SKILLS",
  ...skills.map(([k, v]) => `  ${k}: ${v}`),
  "",
  "EDUCATION",
  ...education.map(([degree, school, year]) => `  ${degree}, ${school}, ${year}`),
];

export const documents = {
  "README.TXT": [
    "Welcome to Shubham 98.",
    "",
    "This is my portfolio, built to behave like the desktop I grew up with.",
    "",
    "  * Double-click desktop icons (tap on a phone).",
    "  * Right-click the desktop, the taskbar and title bars.",
    "  * Press Start, or Ctrl+Esc, for everything else.",
    "  * Try the MS-DOS Prompt. Type HELP.",
    "  * Turn on sound with the speaker in the corner.",
    "  * Ask Floppy, the AI assistant in the corner, anything about my work.",
    "",
    "Looking for the serious part? Open My Projects or RESUME.TXT.",
  ].join("\n"),
  "RESUME.TXT": resumeLines.join("\n"),
};
