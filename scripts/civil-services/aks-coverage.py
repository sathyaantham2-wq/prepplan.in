"""AKS coverage ledger: every inventory fact must be tested by >=1 question (`fi` list) or listed under a pack's `skipped`.
usage: aks-coverage.py [--chapter NN] [--list]   (reads aks/inventory/*.json and aks/packs/*.json)
Prints per chapter: facts, covered, skipped, UNCOVERED (and the fids with --list). Exit 1 if anything is uncovered."""
import json, sys, glob, collections
ROOT = '/Users/satyanarayanareddy/claude projects /Prepplan/content/authoring/civil/polity/aks'
ch = sys.argv[sys.argv.index('--chapter') + 1].zfill(2) if '--chapter' in sys.argv else None
facts = {}
for f in sorted(glob.glob(ROOT + '/inventory/*.json')):
    for x in json.load(open(f))['facts']:
        if ch is None or x['fid'].startswith('A' + ch): facts[x['fid']] = x
cov = collections.Counter(); skipped = {}; unknown = set()
for f in sorted(glob.glob(ROOT + '/packs/*.json')):
    d = json.load(open(f))
    for s in d.get('skipped', []): skipped[s['fid']] = s.get('reason', '')
    for c in d['concepts']:
        for q in c['questions']:
            for fid in q.get('fi', []):
                if fid in facts: cov[fid] += 1
                elif ch is None or fid.startswith('A' + (ch or '')): unknown.add(fid)
by = collections.defaultdict(lambda: [0, 0, 0, 0]); un = []
for fid in facts:
    k = fid[:3]; by[k][0] += 1
    if cov[fid]: by[k][1] += 1
    elif fid in skipped: by[k][2] += 1
    else: by[k][3] += 1; un.append(fid)
print('chapter  facts  covered  skipped  UNCOVERED')
for k in sorted(by): print(f'{k:7} {by[k][0]:6} {by[k][1]:8} {by[k][2]:8} {by[k][3]:9}')
t = [sum(v[i] for v in by.values()) for i in range(4)]
print(f'TOTAL   {t[0]:6} {t[1]:8} {t[2]:8} {t[3]:9}')
if unknown: print('fids in questions but not in the inventory:', sorted(unknown)[:20])
if '--list' in sys.argv: print('uncovered:', ' '.join(un))
sys.exit(1 if un else 0)
