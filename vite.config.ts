import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "simple-card",
      name: "simple-card",
      formats: ["es"],
    },
  },
});

