import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import type { TestSpecification } from "vitest/node";
import { BaseSequencer } from "vitest/node";

class PrioritizedSequencer extends BaseSequencer {
  async sort(files: TestSpecification[]) {
    const priority = ["scanFlow", "mealHistory"];
    const getString = (value: unknown) => (typeof value === "string" ? value : undefined);
    const safePath = (file: TestSpecification) => {
      const record = file as unknown as Record<string, unknown>;
      const nestedFile = record.file as Record<string, unknown> | undefined;
      return (
        getString(record.filepath) ??
        getString(nestedFile?.filepath) ??
        getString(nestedFile?.name) ??
        getString(record.moduleId) ??
        getString(record.projectName) ??
        ""
      );
    };
    const rank = (filepath: string) => {
      const idx = priority.findIndex((token) => filepath.includes(token));
      return idx === -1 ? priority.length : idx;
    };

    return files.sort((a, b) => {
      const aPath = safePath(a);
      const bPath = safePath(b);
      const diff = rank(aPath) - rank(bPath);
      return diff === 0 ? aPath.localeCompare(bPath) : diff;
    });
  }
}

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
      sequencer: PrioritizedSequencer,
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
