import { useEffect, useRef, useState } from "react";
import { MenuBar } from "../ui/Menu.jsx";

const PALETTE = ["#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080", "#ffffff", "#c0c0c0", "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff"];
const TOOLS = [
  { id: "pencil", label: "Pencil", glyph: "✎", size: 1 },
  { id: "brush", label: "Brush", glyph: "🖌", size: 5 },
  { id: "eraser", label: "Eraser", glyph: "▭", size: 12 },
  { id: "fill", label: "Fill", glyph: "◆", size: 0 },
];
const W = 640;
const H = 400;

function floodFill(ctx, startX, startY, hex) {
  const image = ctx.getImageData(0, 0, W, H);
  const d = image.data;
  const fill = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const at = (x, y) => (y * W + x) * 4;
  const s = at(startX, startY);
  const target = [d[s], d[s + 1], d[s + 2]];
  if (target.every((v, i) => v === fill[i])) return;
  const stack = [[startX, startY]];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const p = at(x, y);
    if (d[p] !== target[0] || d[p + 1] !== target[1] || d[p + 2] !== target[2]) continue;
    d[p] = fill[0];
    d[p + 1] = fill[1];
    d[p + 2] = fill[2];
    d[p + 3] = 255;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  ctx.putImageData(image, 0, 0);
}

export default function Paint({ openApp, close }) {
  const canvas = useRef(null);
  const [tool, setTool] = useState(TOOLS[0]);
  const [color, setColor] = useState("#000000");
  const last = useRef(null);
  const undoStack = useRef([]);

  const ctx = () => canvas.current.getContext("2d", { willReadFrequently: true });
  const clear = () => {
    const c = ctx();
    c.fillStyle = "#fff";
    c.fillRect(0, 0, W, H);
  };
  useEffect(clear, []);

  const remember = () => {
    undoStack.current = [...undoStack.current.slice(-9), ctx().getImageData(0, 0, W, H)];
  };
  const undo = () => {
    const image = undoStack.current.pop();
    if (image) ctx().putImageData(image, 0, 0);
  };

  const point = (e) => {
    const r = canvas.current.getBoundingClientRect();
    return { x: Math.floor(((e.clientX - r.left) / r.width) * W), y: Math.floor(((e.clientY - r.top) / r.height) * H) };
  };

  // Bresenham-free: square stamps along the segment so strokes keep hard pixel edges.
  const stroke = (from, to) => {
    const c = ctx();
    c.fillStyle = tool.id === "eraser" ? "#fff" : color;
    const steps = Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y), 1);
    for (let i = 0; i <= steps; i++) {
      const x = from.x + ((to.x - from.x) * i) / steps;
      const y = from.y + ((to.y - from.y) * i) / steps;
      c.fillRect(Math.round(x - tool.size / 2), Math.round(y - tool.size / 2), tool.size, tool.size);
    }
  };

  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    remember();
    const p = point(e);
    if (tool.id === "fill") return floodFill(ctx(), p.x, p.y, color);
    last.current = p;
    stroke(p, p);
  };
  const onMove = (e) => {
    if (!last.current) return;
    const p = point(e);
    stroke(last.current, p);
    last.current = p;
  };
  const onUp = () => {
    last.current = null;
  };

  const save = () => {
    const a = Object.assign(document.createElement("a"), { href: canvas.current.toDataURL("image/png"), download: "untitled.png" });
    a.click();
  };

  return (
    <div className="paint">
      <MenuBar
        menus={[
          {
            label: "File",
            items: [
              { label: "New", onClick: () => { remember(); clear(); } },
              { label: "Save As...", onClick: save },
              { separator: true },
              { label: "Exit", onClick: close },
            ],
          },
          { label: "Edit", items: [{ label: "Undo", onClick: undo }, { label: "Clear Image", onClick: () => { remember(); clear(); } }] },
          { label: "Help", items: [{ label: "Help Topics", onClick: () => openApp("help") }] },
        ]}
      />
      <div className="paint-main">
        <div className="paint-tools" role="toolbar" aria-label="Tools">
          {TOOLS.map((t) => (
            <button key={t.id} title={t.label} aria-label={t.label} aria-pressed={tool.id === t.id} className={tool.id === t.id ? "pressed" : ""} onClick={() => setTool(t)}>
              {t.glyph}
            </button>
          ))}
        </div>
        <div className="paint-canvas">
          <canvas ref={canvas} width={W} height={H} aria-label="Drawing canvas" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} />
        </div>
      </div>
      <div className="paint-palette" role="toolbar" aria-label="Colors">
        <span className="current-color" style={{ background: color }} />
        {PALETTE.map((c) => (
          <button key={c} aria-label={`Color ${c}`} aria-pressed={color === c} style={{ background: c }} onClick={() => setColor(c)} />
        ))}
      </div>
    </div>
  );
}
