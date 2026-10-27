import { execFileSync } from "node:child_process"
import { rmSync } from "node:fs"

// Remove items deleted from the source manifest before publishing the next build.
rmSync("public/r", { recursive: true, force: true })
execFileSync("pnpm", ["exec", "shadcn", "build"], { stdio: "inherit" })
