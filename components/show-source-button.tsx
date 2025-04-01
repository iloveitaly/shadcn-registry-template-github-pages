import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface ShowSourceButtonProps {
  filePath: string
  className?: string
}

export function ShowSourceButton({ filePath, className }: ShowSourceButtonProps) {
  const baseUrl = "https://github.com/iloveitaly/shadcn-registry-template-github-pages"
  const branch = import.meta.env.VITE_GITHUB_BRANCH || "main"
  const url = `${baseUrl}/blob/${branch}/${filePath}`

  return (
    <Button
      variant="outline"
      className={`h-7 gap-1 rounded-lg px-3 text-xs ${className}`}
      onClick={() => window.open(url, "_blank")}
    >
      <ExternalLink className="h-4 w-4" />
      Show Source
    </Button>
  )
}