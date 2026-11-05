const files = import.meta.glob("./assets/icons/*.png", { eager: true, query: "?url", import: "default" });

// icons.folder, icons.recycle, ... one per file in assets/icons.
export const icons = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.match(/([^/]+)\.png$/)[1], url])
);
