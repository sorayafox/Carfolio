#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$repo_root"

required=(agents prd architecture conventions features design database)
failed=0

for name in "${required[@]}"; do
  file="docs/$name.md"
  if [[ ! -s "$file" ]]; then
    echo "MISSING: $file"
    failed=1
    continue
  fi
  if ! grep -q '^# ' "$file"; then
    echo "INVALID: $file has no level-one heading"
    failed=1
  fi
done

if (( failed )); then
  exit 1
fi

echo "Required documents: present"

changed="$(git status --short --untracked-files=all | awk '{print substr($0,4)}' | grep -Ev '^docs/[^/]+\.md$' || true)"
if [[ -z "$changed" ]]; then
  echo "Implementation changes: none detected in the working tree"
  exit 0
fi

echo "Implementation areas changed:"
if grep -Eq '^(components/|app/globals\.css|public/)' <<<"$changed"; then echo "- UI or interaction: review features.md and design.md"; fi
if grep -Eq '^(app/api/|lib/|app/\[section\]/)' <<<"$changed"; then echo "- Runtime or API: review architecture.md and conventions.md"; fi
if grep -Eq '^(prisma/|app/api/.*/)' <<<"$changed"; then echo "- Persistence boundary: review database.md and architecture.md"; fi
if grep -Eq '^(tests/|package\.json|tsconfig\.json)' <<<"$changed"; then echo "- Validation or tooling: review conventions.md and architecture.md"; fi
if grep -Eq '^\.agents/skills/' <<<"$changed"; then echo "- Agent workflow: review agents.md"; fi

echo "Audit complete; confirm relevance by reading the changed implementation."
