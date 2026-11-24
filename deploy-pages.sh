#!/usr/bin/env bash
# Publish public/ to the gh-pages branch of melissakiehl/senior-pages (GitHub Pages serves that branch at the site root).
# Usage: ./deploy-pages.sh   (run from this folder after committing on main; needs `gh` or git signed in as melissakiehl)
set -euo pipefail
REPO=https://github.com/melissakiehl/senior-pages.git
SRC="$(cd "$(dirname "$0")" && pwd)/public"
export GIT_AUTHOR_NAME="$(git -C "$SRC/.." config user.name)" GIT_AUTHOR_EMAIL="$(git -C "$SRC/.." config user.email)"
export GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME" GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"
MSG="Deploy public/ from main $(git -C "$SRC/.." rev-parse --short HEAD)"
TMP=$(mktemp -d)
if git ls-remote --exit-code --heads "$REPO" gh-pages >/dev/null 2>&1; then
  git clone -q --depth 1 --branch gh-pages "$REPO" "$TMP"
  find "$TMP" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
else
  git -C "$TMP" init -q -b gh-pages && git -C "$TMP" remote add origin "$REPO"
fi
cp -R "$SRC"/. "$TMP"/
touch "$TMP/.nojekyll"
git -C "$TMP" add -A
if git -C "$TMP" diff --cached --quiet; then echo "Nothing changed."; else git -C "$TMP" commit -q -m "$MSG" && git -C "$TMP" push -q origin gh-pages && echo "Pushed gh-pages."; fi
rm -rf "$TMP"
