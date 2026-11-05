import { getSettings } from "./settings.js";

// All sounds are synthesized here, there are no audio files. Off until the visitor enables them.
const TUNES = {
  ding: [[880, 0.1], [660, 0.18]],
  startup: [[392, 0.16], [523, 0.16], [659, 0.16], [784, 0.36]],
  shutdown: [[784, 0.14], [659, 0.14], [523, 0.14], [392, 0.3]],
  on: [[660, 0.07], [880, 0.1]],
};
let ctx;

export function play(name) {
  if (!getSettings().sound) return;
  try {
    ctx ??= new AudioContext();
    ctx.resume();
    let t = ctx.currentTime + 0.01;
    for (const [freq, length] of TUNES[name]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + length);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + length);
      t += length * 0.8;
    }
  } catch {
    // No audio support: stay silent.
  }
}
