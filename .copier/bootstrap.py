"""Personalize a new project without changing Git state or requiring GitHub credentials."""

import html
import json
from pathlib import Path

root = Path.cwd()
answers = json.loads((root / ".copier/.copier-answers.yml").read_text())
name = answers["project_name"]
repository = answers["github_url"].rstrip("/")
homepage = answers["github_pages_url"].rstrip("/") + "/"

package_path = root / "package.json"
package = json.loads(package_path.read_text())
package.update(
    name=name,
    description=f"Reusable shadcn components from {name}.",
    homepage=homepage,
    repository={"type": "git", "url": repository + ".git"},
)
package["scripts"].pop("test:template", None)
package_path.write_text(json.dumps(package, indent=2) + "\n")

registry_path = root / "registry.json"
registry_text = registry_path.read_text()
registry = json.loads(registry_text)
# Preserve the source manifest's formatting, including compact dependency arrays.
for key, value in {"name": name, "homepage": homepage}.items():
    registry_text = registry_text.replace(
        f'"{key}": {json.dumps(registry[key])}',
        f'"{key}": {json.dumps(value)}',
        1,
    )
registry_path.write_text(registry_text)

index_path = root / "index.html"
index_path.write_text(
    index_path.read_text()
    .replace("Shadcn Registry Template", html.escape(name))
    .replace(
        "Reusable shadcn components with live examples and installation commands.",
        html.escape(package["description"], quote=True),
    )
)
readme = (root / ".copier/README.md").read_text()
for key, value in {"PROJECT_NAME": name, "SITE_URL": homepage, "REPOSITORY_URL": repository}.items():
    readme = readme.replace(f"<{key}>", value)
(root / "README.md").write_text(readme)
