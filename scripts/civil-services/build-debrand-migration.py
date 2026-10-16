"""Build the database migration for the 2026-10-16 book-name removal.
usage: build-debrand-migration.py out.json
Compares every polity pack in the working tree with its committed version (git HEAD, or --base <rev>) and writes one entry
per question whose student-visible text changed (stem, explanation, wrong-option reasons or traps):
  kind 'replace' when the key/options changed (a different question; old row is retired, the new one is loaded
  additively by scripts/load-civil-pack.ts), otherwise kind 'edit' with the new stem, rebuilt explanation and tags.
Consumed by scripts/apply-civil-debrand.ts. Writes nothing to any database."""
import glob
import json
import re
import subprocess
import sys

base = 'HEAD'
args = sys.argv[1:]
if '--base' in args:
    base = args[args.index('--base') + 1]
    args = [a for i, a in enumerate(args) if a != '--base' and args[i - 1] != '--base']
out = args[0]


def explanation_text(q):
    wrong = [f'- {o}: {q["w"][i]}' for i, o in enumerate(q['o'][1:])]
    return '\n'.join([q['e'].strip(), '', 'Why the other options fail:'] + wrong)


def tags(q):
    return ['civil', q['f']] + [re.sub(r'\W+', '_', t, flags=re.ASCII) for t in (q.get('tr') or [])]


entries = []
for f in sorted(glob.glob('content/authoring/civil/polity/packs/*.json') + glob.glob('content/authoring/civil/polity/aks/packs/*.json')):
    old = json.loads(subprocess.run(['git', 'show', f'{base}:{f}'], capture_output=True, text=True, check=True).stdout)
    new = json.load(open(f))
    oi = {q['id']: q for c in old['concepts'] for q in c['questions']}
    sc = new['chapter']['source_code']
    for c in new['concepts']:
        for q in c['questions']:
            o = oi.get(q['id'])
            if o is None:
                continue
            if o['a'] != q['a'] or o['o'] != q['o']:
                entries.append({'kind': 'replace', 'source_code': sc, 'concept_code': c['code'], 'old_q': o['q']})
            elif (o['q'], o['e'], o['w'], o.get('tr')) != (q['q'], q['e'], q['w'], q.get('tr')):
                entries.append({'kind': 'edit', 'source_code': sc, 'concept_code': c['code'], 'old_q': o['q'],
                                'new_q': q['q'], 'new_explanation': explanation_text(q), 'new_tags': tags(q)})
json.dump(entries, open(out, 'w'), ensure_ascii=False, indent=1)
print(len(entries), 'entries;', sum(e['kind'] == 'replace' for e in entries), 'replace')
