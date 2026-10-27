import type { ComponentType } from "react"
import registry from "@/registry.json"
import { GitHubForkRibbon } from "@/components/github-fork-ribbon"
import { OpenInV0Button } from "@/components/open-in-v0-button"
import { RegistryCommand } from "@/components/registry-command"
import { ShowSourceButton } from "@/components/show-source-button"

const examples = import.meta.glob<{ default: ComponentType }>(
  "./examples/*.tsx",
  { eager: true },
)

export default function Home() {
  return (
    <>
      <GitHubForkRibbon />
      <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 px-4 py-8">
        <header className="mb-6 flex flex-col gap-4 pr-20">
          <h1 className="text-3xl font-bold tracking-tight">{registry.name}</h1>
          <p className="text-muted-foreground">
            Reusable shadcn components. Preview an example, inspect its source,
            or copy its install command.
          </p>
        </header>
        <main className="flex flex-1 flex-col gap-8">
          {registry.items.map((item) => {
            const Example = examples[`./examples/${item.name}.tsx`]?.default
            const source = item.files.find((file) =>
              file.path.endsWith(".tsx"),
            )?.path
            return (
              <section
                key={item.name}
                aria-labelledby={`${item.name}-title`}
                className="flex flex-col gap-4 rounded-lg border p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 id={`${item.name}-title`} className="font-semibold">
                      {item.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {source && <ShowSourceButton filePath={source} />}
                    <OpenInV0Button name={item.name} />
                  </div>
                </div>
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    minHeight: item.name === "example-form" ? 500 : 400,
                  }}
                >
                  {Example ? (
                    <Example />
                  ) : (
                    <p className="text-muted-foreground">
                      Preview coming soon.
                    </p>
                  )}
                </div>
                <RegistryCommand registryId={item.name} />
              </section>
            )
          })}
        </main>
      </div>
    </>
  )
}
