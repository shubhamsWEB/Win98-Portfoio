import { useEffect, useRef, useState } from "react";
import { useSettings } from "../settings.js";
import { profile } from "../content.js";

const BLOCKERS = ["keydown", "pointerdown", "pointermove", "wheel"];

export function previewSaver() {
  dispatchEvent(new Event("saver-preview"));
}

export default function Screensaver() {
  const { saver, saverMinutes } = useSettings();
  const [active, setActive] = useState(false);
  const last = useRef(Date.now());

  useEffect(() => {
    const preview = () => {
      last.current = Date.now();
      setActive(true);
    };
    addEventListener("saver-preview", preview);
    return () => removeEventListener("saver-preview", preview);
  }, []);

  useEffect(() => {
    if (active) return;
    const touch = () => (last.current = Date.now());
    BLOCKERS.forEach((e) => addEventListener(e, touch, { passive: true }));
    const timer = setInterval(() => {
      const idle = Date.now() - last.current > saverMinutes * 60_000;
      // Events inside an iframe never reach us, so don't interrupt someone using a demo.
      const inFrame = document.activeElement?.tagName === "IFRAME";
      if (saver !== "none" && idle && !inFrame && !document.hidden && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setActive(true);
      }
    }, 5000);
    return () => {
      clearInterval(timer);
      BLOCKERS.forEach((e) => removeEventListener(e, touch));
    };
  }, [active, saver, saverMinutes]);

  if (!active) return null;
  return <Canvas kind={saver === "none" ? "stars" : saver} onExit={() => { last.current = Date.now(); setActive(false); }} />;
}

function Canvas({ kind, onExit }) {
  const ref = useRef(null);

  useEffect(() => {
    const started = performance.now();
    let origin = null;
    const exit = (e) => {
      if (performance.now() - started < 600) return; // ignore the click that started a preview
      if (e.type === "pointermove") {
        origin ??= { x: e.clientX, y: e.clientY };
        if (Math.hypot(e.clientX - origin.x, e.clientY - origin.y) < 6) return;
      }
      onExit();
    };
    addEventListener("pointermove", exit);
    addEventListener("pointerdown", exit);
    addEventListener("keydown", exit);
    return () => {
      removeEventListener("pointermove", exit);
      removeEventListener("pointerdown", exit);
      removeEventListener("keydown", exit);
    };
  }, [onExit]);

  useEffect(() => {
    const canvas = ref.current;
    const c = canvas.getContext("2d");
    const W = (canvas.width = innerWidth);
    const H = (canvas.height = innerHeight);
    const stars = Array.from({ length: 220 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }));
    const text = { x: W / 3, y: H / 3, dx: 1.4, dy: 1.1, hue: 180 };
    let raf;

    const frame = () => {
      if (kind === "stars") {
        c.fillStyle = "#000";
        c.fillRect(0, 0, W, H);
        for (const s of stars) {
          s.z -= 0.006;
          if (s.z <= 0.02) Object.assign(s, { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: 1 });
          const size = (1 - s.z) * 3;
          c.fillStyle = `rgba(255,255,255,${1 - s.z})`;
          c.fillRect(W / 2 + (s.x / s.z) * (W / 4), H / 2 + (s.y / s.z) * (H / 4), size, size);
        }
      } else {
        c.fillStyle = "rgba(0,0,0,.12)";
        c.fillRect(0, 0, W, H);
        c.font = "italic 700 clamp(24px, 5vw, 56px) Tahoma, Arial, sans-serif";
        const width = c.measureText(profile.name).width;
        text.x += text.dx;
        text.y += text.dy;
        if (text.x < 0 || text.x + width > W) text.dx *= -1;
        if (text.y < 50 || text.y > H - 10) text.dy *= -1;
        text.hue = (text.hue + 0.4) % 360;
        c.fillStyle = `hsl(${text.hue} 90% 60%)`;
        c.fillText(profile.name, text.x, text.y);
      }
      raf = requestAnimationFrame(frame);
    };
    c.fillStyle = "#000";
    c.fillRect(0, 0, W, H);
    frame();
    return () => cancelAnimationFrame(raf);
  }, [kind]);

  return <canvas ref={ref} className="saver" aria-hidden="true" />;
}
