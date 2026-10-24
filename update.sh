#!/usr/bin/env bash
# KeepPix: apply the newest image-tools*.zip from ~/Downloads to this repo and publish it.
# Usage:  ./update.sh                 (automatic commit message)
#         ./update.sh "what changed"  (your own message)
# Wrapped in main() so bash reads the whole script before the zip overwrites it.
main() {
  set -euo pipefail
  local repo zip tmp
  repo="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  zip="$(ls -t "$HOME"/Downloads/image-tools*.zip 2>/dev/null | head -n1 || true)"
  if [ -z "$zip" ]; then echo "✗ No image-tools*.zip found in ~/Downloads"; exit 1; fi

  echo "→ Applying $(basename "$zip")"
  tmp="$(mktemp -d)"; trap "rm -rf '$tmp'" EXIT
  unzip -q -o "$zip" -d "$tmp"
  cp -a "$tmp"/image-tools/. "$repo"/

  cd "$repo"
  git add -A
  if git diff --cached --quiet; then echo "✓ Already up to date, nothing to publish."; exit 0; fi
  git --no-pager diff --cached --stat | tail -n1
  git commit -q -m "${1:-Update $(date '+%Y-%m-%d %H:%M')}"
  git push -q
  echo "✓ Published. Live on https://keeppix.app in about a minute."
}
main "$@"; exit
