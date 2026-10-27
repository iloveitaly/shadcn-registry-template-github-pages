import { execFileSync } from "node:child_process"
import { readdirSync } from "node:fs"

const installed = readdirSync("components/ui")
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.slice(0, -4))
const requested = process.argv.slice(2)
const components = requested.length ? requested : installed
for (const component of components) {
  if (!installed.includes(component))
    throw new Error(`Component is not installed: ${component}`)
  execFileSync(
    "pnpm",
    ["dlx", "shadcn@latest", "add", component, "--diff", `${component}.tsx`],
    { stdio: "inherit" },
  )
}
console.log(
  "Review the diffs, then merge the changes you need. No components were overwritten.",
)
