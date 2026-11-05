// Pure rules for Bug Hunt. A board is a flat array of { bug, open, flag, near }.
export function createBoard(w, h, bugs, safeIndex, random = Math.random) {
  const cells = Array.from({ length: w * h }, () => ({ bug: false, open: false, flag: false, near: 0 }));
  const spots = cells.map((_, i) => i).filter((i) => i !== safeIndex && !neighbours(i, w, h).includes(safeIndex));
  for (let n = 0; n < bugs && spots.length; n++) {
    const [spot] = spots.splice(Math.floor(random() * spots.length), 1);
    cells[spot].bug = true;
  }
  cells.forEach((cell, i) => {
    cell.near = neighbours(i, w, h).filter((j) => cells[j].bug).length;
  });
  return cells;
}

export function neighbours(i, w, h) {
  const x = i % w;
  const y = Math.floor(i / w);
  const out = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if ((dx || dy) && nx >= 0 && ny >= 0 && nx < w && ny < h) out.push(ny * w + nx);
    }
  }
  return out;
}

export function reveal(cells, start, w, h) {
  const next = cells.map((c) => ({ ...c }));
  const stack = [start];
  while (stack.length) {
    const i = stack.pop();
    const cell = next[i];
    if (cell.open || cell.flag) continue;
    cell.open = true;
    if (!cell.bug && cell.near === 0) stack.push(...neighbours(i, w, h));
  }
  return next;
}

export const toggleFlag = (cells, i) =>
  cells.map((c, j) => (j === i && !c.open ? { ...c, flag: !c.flag } : c));

export function statusOf(cells) {
  if (cells.some((c) => c.open && c.bug)) return "lost";
  return cells.every((c) => c.bug || c.open) ? "won" : "playing";
}
