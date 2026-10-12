#!/usr/bin/env bash
# Loads the reviewed UPSC Polity packs (F132) into the database named by DATABASE_URL.
#
#   DATABASE_URL='postgres://...' scripts/load-civil-polity.sh trial         # lk05 only
#   DATABASE_URL='postgres://...' scripts/load-civil-polity.sh all           # every pack in packs/
#   DATABASE_URL='postgres://...' scripts/load-civil-polity.sh retire-dry    # what would be retired
#   DATABASE_URL='postgres://...' scripts/load-civil-polity.sh retire        # retire OLD questions (status only)
#
# Additive and idempotent: a question whose text is already on the concept is skipped, so a re-run adds 0.
# Options are shuffled at load. Nothing is ever deleted; "retire" sets status='retired' on the old one-line
# questions of a concept ONLY when that concept already holds 20 approved civil-pack questions.
# Not routed through scripts/with-test-env.mjs on purpose (that wrapper refuses a non-local host): run it only
# when you mean to write to the database in DATABASE_URL.
set -euo pipefail
cd "$(dirname "$0")/.."

: "${DATABASE_URL:?set DATABASE_URL to the database to load into}"
mode="${1:-}"
host="$(printf '%s' "$DATABASE_URL" | sed -E 's#^[a-z]+://[^@]*@([^:/?]+).*#\1#')"

files=(content/authoring/civil/polity/packs/*.json)
for f in "${files[@]}"; do
  npx tsx scripts/load-civil-pack.ts "$f" --check >/dev/null
  python3 scripts/civil-services/check-civil-pack.py "$f" >/dev/null || { echo "quality check failed: $f" >&2; exit 1; }
done
echo "All ${#files[@]} packs validate. Target database host: $host"

case "$mode" in
  trial)       targets=(content/authoring/civil/polity/packs/lk05.json); extra=() ;;
  all)         targets=("${files[@]}"); extra=() ;;
  retire-dry)  targets=("${files[@]}"); extra=(--retire-old) ;;
  retire)      targets=("${files[@]}"); extra=(--retire-old --apply) ;;
  *) echo "usage: scripts/load-civil-polity.sh trial|all|retire-dry|retire" >&2; exit 2 ;;
esac

if [ "$mode" != "retire-dry" ]; then
  read -r -p "Run '$mode' on ${#targets[@]} pack(s) against '$host'? Type YES to continue: " answer
  [ "$answer" = "YES" ] || { echo "Aborted, nothing written."; exit 1; }
fi

for f in "${targets[@]}"; do
  echo "== $f"
  npx tsx scripts/load-civil-pack.ts "$f" ${extra[@]+"${extra[@]}"}
done
echo "Done."
