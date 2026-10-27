# Maintenance notes

The October 2026 refresh aligns React and React DOM at 19.3.1, updates Vite to 8.3.5 and
shadcn to 4.22.1, and refreshes transitive packages. The complete dependency audit reports
zero advisories after the lockfile refresh. This is a point-in-time result; run `pnpm audit`
when updating packages.

## Compatibility constraints

- TypeScript stays on the 6.0 release line because TypeScript ESLint 8.72 supports TypeScript
  below 6.1. Upgrade the parser and compiler together when TypeScript 7 support is released.
- React and React DOM are exact matching versions and are grouped in Dependabot.
- ESLint 10 works with the retained accessibility rules, but `eslint-plugin-jsx-a11y` still
  declares a peer range ending at ESLint 9. A package-specific pnpm peer rule records the
  tested combination. Remove that exception when the plugin publishes a compatible range.
- UI primitives keep the local `cn` utility. Current upstream shadcn primitives use the `cn`
  package instead; this import-only migration is optional. Review upstream diffs with
  `pnpm upgrade:shadcn` before adopting it.

## Changes for existing generated projects

The starter now uses `components/ui` as its only set of shared UI primitives. Replace imports
from `@/registry/new-york/ui` when adopting the new structure in an existing registry.
The Pokémon example is a portable `pokemon-list.tsx` component; it no longer installs a
Next-specific `app/pokemon/page.tsx` route.

Copier now installs tools and dependencies and builds the site during initial generation. It
uses `copier@latest` for generation and updates, with a minimum supported version declared in
`copier.yml`. Setup tasks run only on initial generation.

Copier copies working examples on initial generation and excludes project-owned registry
sources, previews, gallery, and HTML during updates. The answers file is stored at
`.copier/.copier-answers.yml`. Existing projects whose answers were written to the old root
`.copier-answers.yml` should move that file to the nested location before running the helper.

The template no longer initializes Git, creates commits, or asks for broad workflow write
permissions. GitHub Pages must be enabled once in repository settings. Metadata synchronization
is opt-in through `ENABLE_METADATA_SYNC` and its separate token.

The build command now generates the registry and typechecks before bundling. Deployment
consumes the Pages action's URL and path rather than guessing the address from the repository
name. `VITE_GITHUB_PAGES_URL` remains accepted, while new configurations should use
`VITE_SITE_URL`.
