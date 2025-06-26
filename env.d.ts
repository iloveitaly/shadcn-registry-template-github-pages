/// <reference types="vite/client" />
// for typescript to avoid throwing errors relating to vite env variables

interface ImportMetaEnv {
  readonly VITE_GITHUB_BRANCH: string
  readonly VITE_GITHUB_REPO_URL: string
  readonly VITE_GITHUB_PAGES_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
