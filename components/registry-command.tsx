import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { site } from "@/lib/site"
import { registryItemUrl } from "@/lib/site-config"

export function RegistryCommand({ registryId }: { registryId: string }) {
  const command = `pnpm dlx shadcn@latest add ${registryItemUrl(site, registryId)}`
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle")

  useEffect(() => {
    if (status === "idle") return
    const timeout = setTimeout(() => setStatus("idle"), 2000)
    return () => clearTimeout(timeout)
  }, [status])

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(command)
      setStatus("copied")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 pr-14 text-sm break-all whitespace-pre-wrap text-foreground">
        <code>{command}</code>
      </pre>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              aria-label={`Copy install command for ${registryId}`}
              onClick={copyToClipboard}
            >
              {status === "copied" ? <Check /> : <Copy />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy install command</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span role="status" className="sr-only">
        {status === "copied"
          ? "Copied to clipboard"
          : status === "error"
            ? "Copy failed. Select and copy the command manually."
            : ""}
      </span>
    </div>
  )
}
