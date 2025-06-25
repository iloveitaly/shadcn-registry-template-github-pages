# ShadCN Component Repo & Self-hosted Registry Template

Running your own component registry allows you to distribute your custom components, hooks, pages, and
other files to any React project. Specifically, it makes it easy to share a component you built with the
wider community (and enable the community to contribute to it).

## Why Another Registry Template?

* I hate vercel / next and I just want static JavaScript.
* I wanted to [use copier](https://copier.readthedocs.io/en/stable/) to manage my registries and update them all from a single master template.

## Copying

```shell
uv tool run --with jinja2_shell_extension copier@latest copy --trust https://github.com/shadcn-ui/registry-template shadcn-registry-template-github-pages
```

## Getting Started

This is a template for creating a custom registry using plain old React.

- The template uses a `registry.json` file to define components and their files.
- The `shadcn build` command is used to build the registry.
- The registry items are served as static files under `public/r/[name].json`.
- Every registry item are compatible with the `shadcn` CLI.
- We have also added v0 integration using the `Open in v0` api.
- Everything is statically built to easily serve off of GitHub Pages, or whatever you want.

## Documentation

Visit the [shadcn documentation](https://ui.shadcn.com/docs/registry) to view the full documentation.

## Other Registry Templates

* https://github.com/shadcn-ui/registry-template-v4/