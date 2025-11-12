import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    jsx: "automatic",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup/testEnv.ts"],
    css: false,
    sequence: {
      concurrent: false,
      shuffle: false,
      hooks: "stack",
      files: (files) =>
        files.sort((a, b) => {
          const priority = ["scanFlow", "mealHistory"];
          const rank = (file: string) => {
            const idx = priority.findIndex((token) => file.includes(token));
            return idx === -1 ? priority.length : idx;
          };
          const diff = rank(a) - rank(b);
          return diff === 0 ? a.localeCompare(b) : diff;
        }),
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
