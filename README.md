# Shadcn registry template for GitHub Pages

A Copier template for sharing React components through a shadcn registry, with a Vite demo
and static GitHub Pages deployment. It includes four working examples and checks both the
generated project and installation into a clean consumer.

## Start a registry

Install [mise](https://mise.jdx.dev/) and [uv](https://docs.astral.sh/uv/), then run:

```sh
mkdir my-registry
cd my-registry
uv tool run copier==9.19.1 copy --trust https://github.com/iloveitaly/shadcn-registry-template-github-pages .
mise install
mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm dev
```

Copier asks for the project name, GitHub owner, repository URL, and site URL. These populate
package metadata, registry metadata, the HTML title, and README. Custom domains are supported.
Copying does not initialize Git or create commits. Initialize and push the repository when ready.

The pinned toolchain is Node 24, pnpm 12, Just, and uv. Run commands through `mise exec --`
if your shell has not activated mise.

## Commands

| Command                           | Purpose                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `pnpm dev`                        | Generate registry assets and start Vite                                                     |
| `pnpm build`                      | Validate and generate registry assets, typecheck, and build `dist`                          |
| `pnpm preview`                    | Preview the production site at its configured path                                          |
| `pnpm check`                      | Lint, typecheck, and check formatting                                                       |
| `pnpm format`                     | Format source files                                                                         |
| `pnpm test`                       | Chromium smoke tests, including a Pages subpath and form validation                         |
| `pnpm test:registry`              | Install every built registry item into a clean Vite consumer, typecheck, and build it       |
| `pnpm test:template`              | Render, install, check, build, and update a fresh Copier project (template repository only) |
| `pnpm upgrade:packages`           | Review dependency updates interactively                                                     |
| `pnpm upgrade:shadcn [component]` | Preview upstream diffs for installed primitives                                             |

Before running browser tests the first time:

```sh
pnpm exec playwright install chromium
```

`pnpm build` always recreates `public/r`, including its registry index, so deleted items cannot
linger in deployments. Generated registry files are ignored by Git; other files in `public/`
can be committed normally. Add new registry items while developing, then rerun
`pnpm registry:build` or restart `pnpm dev` to refresh their JSON.

## Project layout

```text
app/                         Vite demo, stylesheet, and entry point
app/examples/<item>.tsx       Default-exported previews, matched by registry item name
components/                  Gallery controls
components/ui/               Shared shadcn primitives used by the demo and registry items
registry/new-york/blocks/     Distributed components, hooks, and utilities
registry.json                Source manifest and gallery metadata
lib/                         Shared helpers and deployment URL configuration
scripts/                     Build, upgrade preview, and integration checks
.copier/                     Generated-project documentation, bootstrap, and update helper
```

Define items and their installable files in `registry.json`. Declare npm packages in
`dependencies` and official shadcn primitives in `registryDependencies`. Bare names such as
`button` refer to the official registry. Use full URLs, namespace addresses, or GitHub addresses
for custom dependencies.

The gallery reads names, descriptions, and source links from the manifest. A preview named
`app/examples/hello-world.tsx` is displayed for the `hello-world` item. Missing previews show
a placeholder. Keep distributed code independent of demo files. Use `registry:component` for
portable React components; `registry:page` installs to a specific framework path and should be
an explicit choice. The Vite host has `rsc: false`; distributed interactive examples retain
client directives for consumers that use React Server Components.

For larger registries, the [registry schema](https://ui.shadcn.com/docs/registry/registry-json)
supports composing source manifests with `include`. This starter keeps its four items together.

## Install components

```sh
pnpm dlx shadcn@latest add https://iloveitaly.github.io/shadcn-registry-template-github-pages/r/hello-world.json
```

Public GitHub repositories can also be installed directly:

```sh
pnpm dlx shadcn@latest add iloveitaly/shadcn-registry-template-github-pages/hello-world
```

For repeatable installations, append `#<tag-or-commit>` to a GitHub address.
See [GitHub registries](https://ui.shadcn.com/docs/registry/github).
Pages URLs remain useful for the demo and the [Open in v0 integration](https://ui.shadcn.com/docs/registry/open-in-v0).

## Deploy

Enable **Settings → Pages → Source → GitHub Actions**, then push to `main` or `master`.
The deployment workflow uses the built-in `GITHUB_TOKEN`; a Pages personal access token is not
required. The Pages action supplies the URL and base path, including custom domains.

`package.json` supplies local default URLs. Optional overrides in `.env.local` or the build
environment are listed in `.env.example`:

- `VITE_SITE_URL`: absolute public site URL, including a subpath when applicable.
- `VITE_BASE_PATH`: asset path with leading and trailing slashes; defaults to the site URL's
  pathname for production builds and `/` for development.
- `VITE_GITHUB_REPO_URL`: repository URL for source links.
- `VITE_GITHUB_BRANCH`: source-link branch; defaults to the current Git branch, then `main`.

`VITE_GITHUB_PAGES_URL` remains an alias for `VITE_SITE_URL` for existing integrations.
Copy commands and v0 links use the same absolute registry URL; previews served locally still
point at the public registry unless you explicitly set a local `VITE_SITE_URL`.

Repository metadata sync is optional. Set `ENABLE_METADATA_SYNC=true` as an Actions variable
and provide `GH_PERSONAL_TOKEN` only if you want that workflow to update the public repository
metadata. You can also run `just github_repo_set_metadata` manually.

## Maintain and update

Dependabot groups React with React DOM and their types, Tailwind packages, and lint tooling.
React and React DOM use the same exact version. pnpm enforces a one-day release-age window,
strict peer dependencies, and explicit build-script permissions.

TypeScript is held on 6 until TypeScript ESLint supports 7. ESLint 10 is retained; the narrowly
scoped pnpm peer rule documents the accessibility plugin's lagging peer declaration. Its rules
run in `pnpm lint`. UI updates use stable shadcn releases and display diffs without overwriting
components. Merge the changes you need; add new primitives explicitly with the CLI.

Run `pnpm audit` after updating the dependency graph. Review tooling findings separately from
code bundled into the static site. See [maintenance notes](docs/maintenance.md) for the upgrade
baseline and any remaining dependency constraints.

Generated projects can update this template with:

```sh
bash .copier/update.sh
```

Commit local work first. The helper explicitly selects `.copier/.copier-answers.yml`.
Registry sources, previews, the gallery page, HTML, and README are project-owned during updates.
Review the merge and run checks before committing. Use `--vcs-ref=HEAD` to test an unreleased
template revision intentionally.

Pull request workflows check code, build the site and registry, install items into a clean
consumer, run browser smoke tests, and exercise Copier generation and updates. Fork PRs do not
need deployment credentials.
