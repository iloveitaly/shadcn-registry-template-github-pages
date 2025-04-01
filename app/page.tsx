import * as React from "react"
import { OpenInV0Button } from "@/components/open-in-v0-button"
import { HelloWorld } from "@/registry/new-york/hello-world/hello-world"
import { ExampleForm } from "@/registry/new-york/example-form/example-form"
import PokemonPage from "@/registry/new-york/complex-component/page"

// This page displays items from the custom registry.
// You are free to implement this with your own design as needed.

interface ComponentDisplayProps {
  name: string;
  description: string;
  minHeight?: string;
  children: React.ReactNode;
}

function ComponentDisplay({ name, description, minHeight = "400px", children }: ComponentDisplayProps) {
  return (
    <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground sm:pl-3">
          {description}
        </h2>
        <OpenInV0Button name={name} className="w-fit" />
      </div>
      <div className={`flex items-center justify-center min-h-[${minHeight}] relative`}>
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Custom ShadCN Registry</h1>
        <p className="text-muted-foreground">
          A custom registry for distribing shadcn components using shadcn. I recommend using multiple registries for
          different types of components, so users can easily contribute back.
        </p>
        <pre className="mt-2 rounded-lg bg-slate-100 p-4">
          <code className="text-sm text-slate-900">npx shadcn add button</code>
        </pre>
      </header>

      <main className="flex flex-col flex-1 gap-8">
        <ComponentDisplay
          name="hello-world"
          description="A simple hello world component"
        >
          <HelloWorld />
        </ComponentDisplay>

        <ComponentDisplay
          name="example-form"
          description="A contact form with Zod validation."
          minHeight="500px"
        >
          <ExampleForm />
        </ComponentDisplay>

        <ComponentDisplay
          name="complex-component"
          description="A complex component showing hooks, libs and components."
        >
          <PokemonPage />
        </ComponentDisplay>
      </main>
    </div>
  )
}
