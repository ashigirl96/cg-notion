import { crx } from "@crxjs/vite-plugin";
import { resolve } from "path";
import { defineConfig } from "vite";
import manifest from "./manifest.config";

export default defineConfig({
  plugins: [
    crx({ manifest })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
});