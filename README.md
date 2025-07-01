# ShadCN Component Repo & Self-hosted Registry Template

Running your own component registry allows you to distribute your custom components, hooks, pages, and
other files to any React project. Specifically, it makes it easy to share a component you built with the
wider community (and enable the community to contribute to it).

## Why Another Registry Template?

- I hate vercel / next and I just want static JavaScript.
- I wanted to [use copier](https://copier.readthedocs.io/en/stable/) to manage my registries and update them all from a single master template.

## Using This Template

It's better to first make the directory representing the repo and then copy the template into it:

```shell
mkdir shadcn-new-component
cd shadcn-new-component
```

Then run the copier command to copy the template into the current directory:

```shell
uv tool run --with jinja2_shell_extension copier@latest copy --trust https://github.com/iloveitaly/shadcn-registry-template-github-pages .
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

- https://github.com/shadcn-ui/registry-template-v4/
- https://github.com/ilyichv/hookagain

## Prompts

Paste in the component from your

```
Below is a component. I want you to add it to a file in `registry/new-york`. I will be pushing this component for easy reuse.
```

Help with generating example components:

```
Create a couple of examples of how to use the components in #file:registry

* <ComponentDisplay/> should exist only on the `page.tsx` and not within each example in `app/examples`.
* Examples should be created in `app/examples/`
* Add the examples to #file:page.tsx , removing the existing examples
* Don't use `<Card/>` and similar components. Assume the example will already be wrapped in a nice UI elements.
* Use the code block(s) below (pulled from another project) as example(s) of how to use the components and the type of examples you should generate
```

Add JSDocs to your component:

```
Can you add jsdoc for component props and a file-level jsdoc with a short description of what this component docs? Omit obvious comments.
```

Help writing repo documentation:

```
Update #file:README.md by reading the code in #file:registry and using the content in the readme as a template description. Be sure to add a ShadCN reference in both the title + description.

Also:

- Update registry.json with the GitHub Pages URL, required dependencies (npm packages), and any component dependencies (i.e. `components/ui` imports; add these to the `registryDependencies` array). You can remove any unrelated registry.json entries.
- Update index.html with a descriptive title and description
- Update package.json with a better description and keywords
```
