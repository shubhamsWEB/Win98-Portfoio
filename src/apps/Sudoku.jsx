import { useState } from "react";
import { projects } from "../content.js";

const game = projects.find((p) => p.id === "sudoku");

// The game only lets this site's live address show it in a frame (its frame-ancestors header),
// so in local dev and deploy previews the frame stays empty.
export default function Sudoku() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="sudoku">
      {loading && <p className="sudoku-loading" role="status">Loading {game.name}...</p>}
      <iframe
        src={game.play}
        title={game.name}
        allow="clipboard-write; fullscreen"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
