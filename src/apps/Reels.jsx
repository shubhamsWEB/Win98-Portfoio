import { useEffect, useState } from "react";

const SYMBOLS = ["☕", "🐛", "🚀", "🔥"];
const PRIZES = {
  "☕": "Three coffees. Merge conflicts fear you.",
  "🐛": "Three bugs. Works on my machine.",
  "🚀": "Jackpot! Shipped on a Friday.",
  "🔥": "Three fires. You're on call tonight.",
};
const pick = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

export default function Reels() {
  const [reels, setReels] = useState(["🚀", "🚀", "🚀"]);
  const [stopped, setStopped] = useState(3); // reels 0..stopped-1 are still; 3 = idle

  useEffect(() => {
    if (stopped === 3) return;
    const t = setInterval(() => setReels((r) => r.map((s, i) => (i < stopped ? s : pick()))), 90);
    return () => clearInterval(t);
  }, [stopped]);

  const idle = stopped === 3;
  const won = reels.every((s) => s === reels[0]);

  return (
    <div className="reels">
      <div className="reel-row" aria-live="off">
        {reels.map((s, i) => (
          <div key={i} className={`reel ${i >= stopped ? "spinning" : ""}`}>{s}</div>
        ))}
      </div>
      <p className="reel-msg" role="status">
        {!idle ? "Stop each reel in turn." : won ? PRIZES[reels[0]] : "No match. Try again."}
      </p>
      <button className="default" onClick={() => setStopped(idle ? 0 : stopped + 1)}>
        {idle ? "Spin" : `Stop reel ${stopped + 1}`}
      </button>
    </div>
  );
}
