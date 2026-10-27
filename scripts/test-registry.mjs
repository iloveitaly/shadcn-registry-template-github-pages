import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { createServer } from "node:http"
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"))
const registry = JSON.parse(
  await readFile(path.join(root, "registry.json"), "utf8"),
)
const consumer = await mkdtemp(path.join(tmpdir(), "registry-consumer-"))
const server = createServer(async (request, response) => {
  const name = new URL(request.url, "http://localhost").pathname.match(
    /^\/r\/([a-z0-9-]+)\.json$/,
  )?.[1]
  if (!name) {
    response.writeHead(404).end()
    return
  }
  try {
    response.setHeader("Content-Type", "application/json")
    response.end(await readFile(path.join(root, "public/r", `${name}.json`)))
  } catch {
    response.writeHead(404).end()
  }
})
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
const base = `http://127.0.0.1:${server.address().port}`

// Async spawning keeps the registry HTTP server responsive while the CLI installs.
async function run(command, args, cwd = consumer) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      env: { ...process.env, CI: "true" },
    })
    child.on("error", reject)
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${command} ${args.join(" ")} failed (${code})`)),
    )
  })
}

try {
  await mkdir(path.join(consumer, "app"))
  await writeFile(
    path.join(consumer, "package.json"),
    JSON.stringify(
      {
        name: "registry-consumer",
        private: true,
        type: "module",
        packageManager: pkg.packageManager,
        dependencies: {
          react: pkg.dependencies.react,
          "react-dom": pkg.dependencies["react-dom"],
        },
        devDependencies: Object.fromEntries(
          [
            "@types/node",
            "@types/react",
            "@types/react-dom",
            "typescript",
            "vite",
            "tailwindcss",
            "@tailwindcss/vite",
            "@vitejs/plugin-react",
          ].map((name) => [name, pkg.devDependencies[name]]),
        ),
      },
      null,
      2,
    ),
  )
  await writeFile(
    path.join(consumer, "pnpm-workspace.yaml"),
    await readFile(path.join(root, "pnpm-workspace.yaml")),
  )
  await writeFile(
    path.join(consumer, "env.d.ts"),
    '/// <reference types="vite/client" />\n',
  )
  await writeFile(
    path.join(consumer, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        module: "ESNext",
        moduleResolution: "bundler",
        jsx: "react-jsx",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        esModuleInterop: true,
        paths: { "@/*": ["./*"] },
      },
      include: ["**/*.ts", "**/*.tsx"],
      exclude: ["node_modules"],
    }),
  )
  await writeFile(
    path.join(consumer, "app/globals.css"),
    await readFile(path.join(root, "app/globals.css")),
  )
  await writeFile(
    path.join(consumer, "index.html"),
    '<div id="root"></div><script type="module" src="/app/main.tsx"></script>',
  )
  await writeFile(
    path.join(consumer, "vite.config.ts"),
    `import { defineConfig } from 'vite'; import react from '@vitejs/plugin-react'; import tailwind from '@tailwindcss/vite'; import { fileURLToPath } from 'node:url'; export default defineConfig({plugins:[react(),tailwind()],resolve:{alias:{'@':fileURLToPath(new URL('.',import.meta.url))}}})`,
  )
  await run("pnpm", ["install"])
  const cli = path.join(root, "node_modules/.bin/shadcn")
  await run(cli, [
    "init",
    "--template",
    "vite",
    "--base",
    "radix",
    "--preset",
    "nova",
    "--no-monorepo",
    "--no-reinstall",
    "--yes",
    "--cwd",
    consumer,
  ])
  await run(cli, [
    "add",
    ...registry.items.map((item) => `${base}/r/${item.name}.json`),
    "--yes",
    "--cwd",
    consumer,
  ])
  const files = await readdir(consumer, { recursive: true })
  const components = files.filter(
    (file) =>
      !file.startsWith("node_modules/") &&
      file.endsWith(".tsx") &&
      !file.startsWith("app/"),
  )
  assert(
    components.length >= registry.items.length,
    "The CLI must install source components",
  )
  const imports = components
    .map(
      (file, index) =>
        `import * as item${index} from ${JSON.stringify(`../${file.replace(/\.tsx$/, "")}`)}; console.log(item${index});`,
    )
    .join("\n")
  await writeFile(
    path.join(consumer, "app/main.tsx"),
    `import './globals.css';\n${imports}`,
  )
  for (const file of files.filter(
    (file) => !file.startsWith("node_modules/") && /\.[jt]sx?$/.test(file),
  )) {
    assert(
      !/@\/registry\//.test(await readFile(path.join(consumer, file), "utf8")),
      `Unresolved registry import in ${file}`,
    )
  }
  await run("pnpm", ["exec", "tsc", "--noEmit"])
  await run("pnpm", ["exec", "vite", "build"])
  console.log(
    `Installed, typechecked, and built all ${registry.items.length} items in a clean consumer.`,
  )
} finally {
  await new Promise((resolve) => server.close(resolve))
  await rm(consumer, { recursive: true, force: true })
}
