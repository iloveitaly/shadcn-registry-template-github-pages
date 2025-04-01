import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface ShowSourceButtonProps {
  filePath: string
  className?: string
}

export function ShowSourceButton({ filePath, className }: ShowSourceButtonProps) {
  const baseUrl = "https://github.com/iloveitaly/shadcn-registry-template-github-pages"
  const url = `${baseUrl}/blob/main/${filePath}`

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={() => window.open(url, "_blank")}
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      Show Source
    </Button>
  )
}