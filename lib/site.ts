import type { SiteConfig } from "./site-config"

export const site: SiteConfig = {
  siteUrl: import.meta.env.VITE_SITE_URL,
  repositoryUrl: import.meta.env.VITE_GITHUB_REPO_URL,
  branch: import.meta.env.VITE_GITHUB_BRANCH,
}
