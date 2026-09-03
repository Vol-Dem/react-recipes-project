import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { getPublicEnvironment } from "./config/publicEnvironment.ts";

export default defineConfig(({ mode }) => {
  const publicEnvironment = getPublicEnvironment(
    loadEnv(mode, process.cwd(), ""),
  );
  const define = Object.fromEntries(
    Object.entries(publicEnvironment).map(([name, value]) => [
      `process.env.${name}`,
      JSON.stringify(value),
    ]),
  );

  return {
    define,
    plugins: [react(), svgr()],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/setupTests.ts",
    },
  };
});
