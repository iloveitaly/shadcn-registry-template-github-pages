import { Button } from "@/components/ui/button"
import { site } from "@/lib/site"
import { openInV0Url } from "@/lib/site-config"

export function OpenInV0Button({ name }: { name: string }) {
  return (
    <Button variant="outline" size="sm" asChild>
      <a
        href={openInV0Url(site, name)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in v0
      </a>
    </Button>
  )
}
