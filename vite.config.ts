import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { defineConfig, loadEnv } from "vite"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import pkg from "./package.json" with { type: "json" }

// https://vite.dev/config/
export default defineConfig(({ command, mode, isPreview }) => {
  const env = { ...loadEnv(mode, process.cwd(), "VITE_"), ...process.env }
  const siteUrl = new URL(
    env.VITE_SITE_URL || env.VITE_GITHUB_PAGES_URL || pkg.homepage,
  )
  siteUrl.pathname = `${siteUrl.pathname.replace(/\/+$/, "")}/`
  let branch = env.VITE_GITHUB_BRANCH
  if (!branch) {
    try {
      branch = execFileSync("git", ["symbolic-ref", "--short", "HEAD"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim()
    } catch {
      branch = "main"
    }
  }
  const base =
    env.VITE_BASE_PATH ||
    (command === "build" || isPreview ? siteUrl.pathname : "/")
  if (!base.startsWith("/") || !base.endsWith("/")) {
    throw new Error(
      "VITE_BASE_PATH must start and end with / (for example /my-registry/).",
    )
  }
  return {
    base,
    plugins: [tailwindcss(), react()],
    define: {
      "import.meta.env.VITE_SITE_URL": JSON.stringify(siteUrl.href),
      "import.meta.env.VITE_GITHUB_REPO_URL": JSON.stringify(
        env.VITE_GITHUB_REPO_URL || pkg.repository.url.replace(/\.git$/, ""),
      ),
      "import.meta.env.VITE_GITHUB_BRANCH": JSON.stringify(branch),
    },
    resolve: {
      alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
    },
  }
})
