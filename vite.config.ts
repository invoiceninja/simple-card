import { defineConfig } from "vite";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "simple-card",
      name: "simple-card",
      formats: ["es"],
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
