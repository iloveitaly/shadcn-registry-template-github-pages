# <PROJECT_NAME> · shadcn registry

Reusable React components with a static demo at <SITE_URL>.

## Develop

Copier has installed the tools and dependencies and built the registry and demo. Start the demo:

```sh
mise exec -- pnpm dev
```

For a fresh clone, or to repeat installation:

```sh
mise trust mise.toml
mise install
mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm dev
```

`pnpm build` validates the registry, rebuilds `public/r`, typechecks, and builds the site in `dist`.
`pnpm preview` serves the production build locally, including its configured subpath.

## Author components

Add source files under `registry/new-york/blocks/` and define their files, npm dependencies,
and shadcn dependencies in `registry.json`. Shared UI primitives live in `components/ui/`.
Add a default-exported preview to `app/examples/<registry-item-name>.tsx`; the gallery reads
its title, description, and source link from the registry manifest.

Keep distributed components independent of demo files. Use `registry:component` for portable
components; only use `registry:page` with a framework-specific target intentionally.

```sh
pnpm registry:validate
pnpm check
pnpm build
pnpm exec playwright install chromium
pnpm test
pnpm test:registry
```

## Install

```sh
pnpm dlx shadcn@latest add <SITE_URL>r/hello-world.json
```

You can also install from the public GitHub repository using `owner/repo/item` addresses.
See [GitHub registries](https://ui.shadcn.com/docs/registry/github).

## Deploy

Enable **Settings → Pages → Source → GitHub Actions** and push to `main` or `master`.
The workflow uses GitHub's built-in token and the Pages URL, including custom domains.
For other hosts, deploy `dist` and set `VITE_SITE_URL` to the public URL before building.
Optional environment overrides are documented in `.env.example`.

## Update

`pnpm upgrade:packages` previews dependency updates. `pnpm upgrade:shadcn` displays upstream
diffs for installed UI components; review and merge the changes you need.
React and React DOM must be updated together. TypeScript remains on 6 until the ESLint parser
supports 7. Review `pnpm audit` findings against actual browser and build-tool usage.

To update the template, commit your changes, then run `bash .copier/update.sh`.
Copier preserves registry sources, examples, your gallery, and HTML during updates.
Inspect the resulting diff and run the checks before committing. Repository: <REPOSITORY_URL>.
