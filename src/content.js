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

export const projects = [
  {
    id: "murmur",
    folder: "ai",
    name: "Murmur",
    year: "2026",
    desc: "A free voice assistant for Mac and Windows. Hold a key and speak: it types in any app, rewrites selected text, finds files by what's inside them and runs small jobs for you. Speech recognition stays on your computer.",
    stack: ["Swift", "On-device speech", "Local models", "AI agents"],
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
    id: "sudoku",
    folder: "archive",
    name: "Sudoku 2.0",
    year: "2021",
    desc: "A playable online Sudoku with a challenge mode.",
    stack: ["React"],
    live: "https://thirsty-sammet-d9cce0.netlify.app/",
    source: "https://github.com/shubhamsWEB/Sudoku-V2",
    frame: true,
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
    "",
    "Looking for the serious part? Open My Projects or RESUME.TXT.",
  ].join("\n"),
  "RESUME.TXT": resumeLines.join("\n"),
};
