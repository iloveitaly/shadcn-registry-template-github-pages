import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    channel: process.env.PLAYWRIGHT_CHANNEL,
    baseURL: "http://127.0.0.1:4173/registry-preview/",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        permissions: ["clipboard-read", "clipboard-write"],
      },
    },
  ],
  webServer: {
    command:
      "pnpm build && pnpm preview --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173/registry-preview/",
    reuseExistingServer: false,
    env: {
      VITE_BASE_PATH: "/registry-preview/",
      VITE_SITE_URL: "https://registry.example.test/registry-preview/",
      VITE_GITHUB_BRANCH: "main",
    },
  },
})
