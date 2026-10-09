#!/usr/bin/env bash
# Loads the reviewed Class 9 DPS packs (30 chapters) into the database named by DATABASE_URL.
#
#   DATABASE_URL='postgres://...'  scripts/load-dps-class9.sh trial   # ONE chapter first
#   DATABASE_URL='postgres://...'  scripts/load-dps-class9.sh all     # the others (and the trial one, skipped)
#
# Safe to re-run: the loader never changes or deletes an existing question and skips any question
# whose text is already on the concept, so a second run adds 0. It only ADDS questions; the old
# grid is NOT retired by this script (retiring is a separate, explicit step).
#
# This does NOT go through scripts/with-test-env.mjs on purpose: that wrapper refuses a non-local
# host. Run it only when you mean to write to the database in DATABASE_URL.
set -euo pipefail
cd "$(dirname "$0")/.."

: "${DATABASE_URL:?set DATABASE_URL to the database to load into}"
mode="${1:-}"
host="$(printf '%s' "$DATABASE_URL" | sed -E 's#^[a-z]+://[^@]*@([^:/?]+).*#\1#')"

files=()
for set in class9 class9sc class9s; do
  for f in content/authoring/dps/$set/*.json; do files+=("$f"); done
done

# Every pack must validate before anything is written.
for f in "${files[@]}"; do
  npx tsx scripts/load-dps-pack.ts "$f" --check >/dev/null
done
echo "All ${#files[@]} packs validate. Target database host: $host"

case "$mode" in
  trial) targets=("content/authoring/dps/class9/ch01.json") ;;
  all)   targets=("${files[@]}") ;;
  *) echo "usage: scripts/load-dps-class9.sh trial|all" >&2; exit 2 ;;
esac

read -r -p "Load ${#targets[@]} pack(s) into '$host'? Type YES to continue: " answer
[ "$answer" = "YES" ] || { echo "Aborted, nothing written."; exit 1; }

for f in "${targets[@]}"; do
  echo "== $f"
  npx tsx scripts/load-dps-pack.ts "$f"
done
echo "Done."
