#!/usr/bin/env bash
set -euo pipefail

# The answers file is nested; explicitly pass it so Copier can find it.
uv tool run copier@latest update \
  --answers-file .copier/.copier-answers.yml \
  --trust --skip-answered "$@"
