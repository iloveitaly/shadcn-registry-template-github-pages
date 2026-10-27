import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/site"

export function GitHubForkRibbon() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="absolute top-4 right-4"
      asChild
    >
      <a href={site.repositoryUrl} target="_blank" rel="noopener noreferrer">
        <ExternalLink data-icon="inline-start" /> GitHub
      </a>
    </Button>
  )
}
