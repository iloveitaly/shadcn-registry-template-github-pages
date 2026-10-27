export interface SiteConfig {
  siteUrl: string
  repositoryUrl: string
  branch: string
}

export function registryItemUrl(config: SiteConfig, name: string) {
  return new URL(
    `r/${encodeURIComponent(name)}.json`,
    `${config.siteUrl.replace(/\/+$/, "")}/`,
  ).href
}

export function sourceUrl(config: SiteConfig, filePath: string) {
  const path = filePath.split("/").map(encodeURIComponent).join("/")
  return `${config.repositoryUrl.replace(/\/+$/, "")}/blob/${encodeURIComponent(config.branch)}/${path}`
}

export function openInV0Url(config: SiteConfig, name: string) {
  const url = new URL("https://v0.dev/chat/api/open")
  url.searchParams.set("url", registryItemUrl(config, name))
  return url.href
}
