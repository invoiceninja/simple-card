import { defineConfig } from "vite";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "simple-card",
      name: "SimpleCard",
      formats: ["es", "iife"],
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
