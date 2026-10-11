import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  use: { baseURL: "http://localhost:4173", headless: true },
  webServer: {
    command: "node scripts/serve.mjs",
    url: "http://localhost:4173",
    reuseExistingServer: true,
  },
  reporter: "list",
});
