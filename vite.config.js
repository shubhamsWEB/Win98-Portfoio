import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// outDir stays "build" so existing Netlify/Vercel publish settings keep working.
export default defineConfig({ plugins: [react()], build: {
    outDir: "build",
    // ponytail: 98.css ships a media query lightningcss rejects; both stylesheets are tiny, so skip minifying.
    cssMinify: false,
  } });
