import { useSyncExternalStore } from "react";

const KEY = "shubham98-settings";
const defaults = { wallpaper: "teal", scheme: "standard", saver: "stars", saverMinutes: 2, sound: false, welcome: true };

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}

let state = { ...defaults, ...load() };
const listeners = new Set();

export const getSettings = () => state;

export function setSettings(patch) {
  state = { ...state, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode: settings simply last for this visit.
  }
  listeners.forEach((l) => l());
}

export const useSettings = () =>
  useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), getSettings);
