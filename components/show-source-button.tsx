import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/site"
import { sourceUrl } from "@/lib/site-config"

export function ShowSourceButton({ filePath }: { filePath: string }) {
  return (
    <Button variant="outline" size="sm" asChild>
      <a
        href={sourceUrl(site, filePath)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalLink data-icon="inline-start" /> Show source
      </a>
    </Button>
  )
}
