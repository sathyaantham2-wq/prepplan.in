"""Near-duplicate finder for civil packs. usage: dup-check.py <pack.json> [--all-packs-dir DIR] [--threshold 0.6]
Compares every statement/stem line of the given pack with every question of every OTHER pack (default: polity packs/ and
aks/packs/) and prints pairs that share most of their words, so an author can re-angle them. Writes nothing."""
import json, sys, re, glob, os, collections
a = sys.argv[1]
thr = 0.6
if '--threshold' in sys.argv: thr = float(sys.argv[sys.argv.index('--threshold') + 1])
ROOT = '/Users/satyanarayanareddy/claude projects /Prepplan/content/authoring/civil/polity'
dirs = [ROOT + '/packs', ROOT + '/aks/packs']
files = [f for dd in dirs for f in glob.glob(dd + '/*.json') if os.path.abspath(f) != os.path.abspath(a)]
STOP = set('the of a an and or in on to is are was were by for with as that this which following statements statement correct given above consider about'.split())
def toks(s): return [w for w in re.findall(r'[a-z0-9]+', s.lower()) if w not in STOP]
def lines(q):
    out = []
    for ln in re.split(r'\n+', q['q']):
        ln = re.sub(r'^\s*(\d+\.|Statement-I+:?)\s*', '', ln).strip()
        if len(toks(ln)) >= 5: out.append(ln)
    out.append(q['a'] if q.get('f') == 'direct' and len(toks(q['a'])) >= 6 else '')  # keys of match/stmt12/which items are boilerplate
    return [x for x in out if x]
idx = collections.defaultdict(list); store = []
for f in files:
    d = json.load(open(f))
    for c in d['concepts']:
        for q in c['questions']:
            for ln in lines(q):
                t = toks(ln); n = len(store); store.append((os.path.basename(f), q.get('id', '?'), ln, set(t)))
                for g in set(zip(t, t[1:])): idx[g].append(n)
d = json.load(open(a)); hits = []
for c in d['concepts']:
    for q in c['questions']:
        for ln in lines(q):
            t = toks(ln); s = set(t); cand = collections.Counter()
            for g in set(zip(t, t[1:])):
                for n in idx.get(g, ()): cand[n] += 1
            best = None
            for n, _ in cand.most_common(8):
                o = store[n][3]; j = len(s & o) / max(1, len(s | o))
                if j >= thr and (best is None or j > best[0]): best = (j, store[n])
            if best: hits.append((best[0], q.get('id', '?'), ln[:110], best[1][0], best[1][1], best[1][2][:110]))
hits.sort(reverse=True)
print(f'{len(hits)} near-duplicate lines (word overlap >= {thr}) between {os.path.basename(a)} and {len(files)} other packs')
for j, i1, l1, p2, i2, l2 in hits[:80]: print(f'{j:.2f} {i1}: {l1}\n     ~ {p2} {i2}: {l2}')
