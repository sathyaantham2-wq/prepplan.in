"""Build the metadata migration for the 2026-10-16 source-name removal (companion of build-debrand-migration.py).
usage: build-debrand-meta-migration.py out.json [--base <git rev>]
Compares every polity pack's metadata (source publisher, scope_in/scope_out texts, concept name/description/idea/rule/example)
in the working tree with the committed version and writes old->new pairs for scripts/apply-civil-debrand-meta.ts.
Scope lists are paired by position (the rewrite keeps the lists in order); a pair is dropped if the list length changed."""
import glob
import json
import subprocess
import sys

args = sys.argv[1:]
base = 'HEAD'
if '--base' in args:
    base = args[args.index('--base') + 1]
    args = [a for i, a in enumerate(args) if a != '--base' and args[i - 1] != '--base']
out = args[0]

meta = {'source': {'old_publisher': 'Laxmikanth', 'new_publisher': 'PrepPlan'}, 'concepts': [], 'scope': [], 'tags': []}
seen_scope = {}
for f in sorted(glob.glob('content/authoring/civil/polity/packs/*.json') + glob.glob('content/authoring/civil/polity/aks/packs/*.json')):
    old = json.loads(subprocess.run(['git', 'show', f'{base}:{f}'], capture_output=True, text=True, check=True).stdout)
    new = json.load(open(f))
    oc = {c['code']: c for c in old['concepts']}
    for c in new['concepts']:
        o = oc.get(c['code'])
        if not o:
            continue
        ch = {k: c[k] for k in ('name', 'description', 'idea', 'rule', 'example') if k in c and o.get(k) != c[k]}
        if ch:
            meta['concepts'].append({'code': c['code'], **ch})
    for key, fields in (('scope_in', ('item', 'pages')), ('scope_out', ('item', 'reason'))):
        ol, nl = old.get(key) or [], new.get(key) or []
        if len(ol) != len(nl):
            print(f'WARNING {f}: {key} length changed {len(ol)} -> {len(nl)}; skipped', file=sys.stderr)
            continue
        for a, b in zip(ol, nl):
            for fld in fields:
                if a.get(fld) != b.get(fld) and a.get(fld):
                    seen_scope[a[fld]] = b[fld]
meta['scope'] = [{'old': k, 'new': v} for k, v in seen_scope.items()]
json.dump(meta, open(out, 'w'), ensure_ascii=False, indent=1)
print(f"{len(meta['concepts'])} concept rows, {len(meta['scope'])} scope strings")
