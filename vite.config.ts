import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  base: "", // This removes the leading slash from asset URLs
  build: {
    rollupOptions: {
      input: {
        popup: "popup.html",
        background: "src/background.ts",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  resolve: {
    alias: {
      url: "./src/polyfills/url.ts",
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
