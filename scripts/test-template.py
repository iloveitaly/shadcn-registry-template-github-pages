"""Exercise initial rendering and updates against a Git snapshot of the working tree."""

import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

from copier import run_copy, run_update

ROOT = Path(__file__).resolve().parents[1]

# Copier's tasks inherit this environment, including the active pnpm selected by mise.
pnpm_executable = os.environ.get("npm_execpath", "")
if Path(pnpm_executable).is_absolute():
    os.environ["PATH"] = str(Path(pnpm_executable).parent) + os.pathsep + os.environ["PATH"]


def run(*args, cwd):
    env = {**os.environ, "CI": "true"}
    if args[0] == "pnpm":
        executable = os.environ.get("npm_execpath", "pnpm")
        args = (executable, *args[1:])
        if Path(executable).is_absolute():
            env["PATH"] = str(Path(executable).parent) + os.pathsep + env["PATH"]
    subprocess.run(args, cwd=cwd, check=True, env=env)


def commit(directory, message):
    run("git", "add", "-A", cwd=directory)
    run("git", "-c", "user.name=Template Test", "-c", "user.email=test@example.com", "-c", "commit.gpgsign=false", "commit", "--quiet", "-m", message, cwd=directory)


with tempfile.TemporaryDirectory(prefix="registry-template-") as directory:
    temporary = Path(directory).resolve()
    source = temporary / "source"
    project = temporary / "example-registry"
    source.mkdir()
    files = subprocess.check_output(["git", "ls-files", "-co", "--exclude-standard", "-z"], cwd=ROOT).decode().split("\0")
    for name in set(files):
        if name and (ROOT / name).is_file():
            destination = source / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(ROOT / name, destination)
    run("git", "init", "--quiet", cwd=source)
    commit(source, "Template snapshot")
    answers = {"project_name": "example-registry", "github_username": "example-org", "github_pages_url": "https://components.example.com/catalog/"}
    run_copy(str(source), project, data=answers, defaults=True, unsafe=True, vcs_ref="HEAD")
    package = json.loads((project / "package.json").read_text())
    registry = json.loads((project / "registry.json").read_text())
    assert package["name"] == registry["name"] == "example-registry"
    assert package["homepage"] == registry["homepage"] == answers["github_pages_url"]
    assert package["repository"]["url"] == "https://github.com/example-org/example-registry.git"
    assert (project / ".copier/.copier-answers.yml").is_file()
    assert not (project / ".git").exists(), "Copying must not create commits or repositories"
    assert "example-registry" in (project / "README.md").read_text()
    assert (project / "node_modules/react/package.json").is_file(), "Copier must install dependencies"
    assert (project / "public/r/registry.json").is_file(), "Copier must build registry assets"
    build = project / "dist/index.html"
    assert build.is_file(), "Copier must build the demo"
    for item in registry["items"]:
        assert (project / "public/r" / f'{item["name"]}.json').is_file()
    run("pnpm", "check", cwd=project)
    run("git", "init", "--quiet", cwd=project)
    commit(project, "Generated project")
    example = project / "app/examples/hello-world.tsx"
    example.write_text(example.read_text() + "\n// Project-owned example\n")
    (project / "README.md").write_text("Project-owned documentation\n")
    gallery = project / "app/page.tsx"
    gallery.write_text(gallery.read_text() + "\n// Project-owned gallery\n")
    index = project / "index.html"
    index.write_text(index.read_text().replace("<title>example-registry</title>", "<title>Project-owned title</title>"))
    manifest = project / "registry.json"
    custom_registry = json.loads(manifest.read_text())
    custom_registry["items"][0]["description"] = "Project-owned metadata"
    manifest.write_text(json.dumps(custom_registry, indent=2) + "\n")
    preserved = {path: path.read_text() for path in (example, gallery, index, manifest)}
    commit(project, "Customize project")
    # Conflicting upstream edits must not overwrite content owned by the project.
    for name in ("app/examples/hello-world.tsx", "app/page.tsx"):
        path = source / name
        path.write_text(path.read_text() + "\n// Upstream edit\n")
    path = source / "registry.json"
    upstream_registry = json.loads(path.read_text())
    upstream_registry["items"][0]["description"] = "Upstream metadata"
    path.write_text(json.dumps(upstream_registry, indent=2) + "\n")
    path = source / "index.html"
    path.write_text(path.read_text().replace("Shadcn Registry Template", "Upstream title"))
    (source / ".template-update-check").write_text("Template update applied\n")
    commit(source, "Update template")
    build.write_text(build.read_text() + "\n<!-- Preserve build output during template updates. -->\n")
    previous_build = build.read_text()
    run_update(project, answers_file=".copier/.copier-answers.yml", defaults=True, unsafe=True, vcs_ref="HEAD", overwrite=True)
    assert build.read_text() == previous_build, "Template updates must not rerun setup builds"
    for path, content in preserved.items():
        assert path.read_text() == content, f"Copier overwrote project-owned {path.name}"
    assert (project / "README.md").read_text() == "Project-owned documentation\n"
    assert (project / ".template-update-check").is_file()
    assert json.loads((project / "package.json").read_text())["name"] == "example-registry"
    run("pnpm", "build", cwd=project)
    print("Copier automatically installs and builds; checks and updates preserve project customizations.")
