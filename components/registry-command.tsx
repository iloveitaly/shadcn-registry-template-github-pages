import * as React from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface RegistryCommandProps {
  registryId: string
}

export function RegistryCommand({ registryId }: RegistryCommandProps) {
  const command = `pnpx shadcn add https://iloveitaly.github.io/shadcn-registry-template-github-pages/r/${registryId}.json`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command)
  }

  return (
    <div className="relative">
      <pre className="mt-2 rounded-lg bg-slate-100 p-4 whitespace-pre-wrap break-words">
        <code className="text-sm text-slate-900">{command}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2"
        onClick={copyToClipboard}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  )
}