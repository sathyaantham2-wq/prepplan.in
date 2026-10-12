"""Check an AKS notes inventory file (Mode I). Writes nothing. usage: aks-inventory-check.py inventory/<unit>.json
Unit = {unit, chapter, pages:[first,last], facts:[{fid,ch,topic,sub,kind,text,pg,cluster,flag,note}], outline:[{heading,pg}]}
Also reports facts per page and pages of the notes that carry text but no fact (likely a gap)."""
import json, sys, re, collections, os
P = []
path = sys.argv[1]
d = json.load(open(path))
BASE = '/Users/satyanarayanareddy/claude projects /Prepplan/content/reference/civil-services/shashank/chapters'
KINDS = {'definition', 'article', 'date', 'number', 'list', 'exception', 'power', 'case', 'committee', 'amendment', 'body', 'comparison', 'other'}
for k in ('unit', 'chapter', 'pages', 'facts', 'outline'):
    if k not in d: P.append(f'missing top-level {k}')
if P: print('\n'.join(P)); sys.exit(1)
lo, hi = d['pages']
ids = set(); per = collections.Counter(); flagged = 0
for f in d['facts']:
    w = f.get('fid', '?')
    if not re.fullmatch(r'A\d\d-\d{3,4}', w): P.append(f'{w}: bad fid')
    if w in ids: P.append(f'{w}: duplicate fid')
    ids.add(w)
    if f.get('kind') not in KINDS: P.append(f"{w}: kind {f.get('kind')}")
    if f.get('flag') not in ('ok', 'verify'): P.append(f"{w}: flag must be ok|verify")
    if f.get('flag') == 'verify':
        flagged += 1
        if len(f.get('note', '')) < 10: P.append(f'{w}: verify needs a note')
    if len(f.get('text', '')) < 15: P.append(f'{w}: text too short')
    if len(f.get('cluster', '')) < 3: P.append(f'{w}: cluster missing')
    pg = f.get('pg')
    if not isinstance(pg, int) or not lo <= pg <= hi: P.append(f'{w}: pg {pg} outside {lo}-{hi}')
    else: per[pg] += 1
    if not f.get('topic'): P.append(f'{w}: topic missing')
# pages with text but no facts
chap = f"{BASE}/ch{int(d['chapter']):02d}.txt"
txt = open(chap).read()
pages = {}
for m in re.finditer(r'=====PDF PAGE (\d+)=====\n(.*?)(?=\n=====PDF PAGE|\Z)', txt, re.S):
    pages[int(m.group(1))] = len(re.sub(r'\s+', ' ', m.group(2)))
gaps = [p for p in range(lo, hi + 1) if pages.get(p, 0) > 700 and per[p] == 0]
for p in gaps: P.append(f'page {p} has {pages[p]} chars of text but no fact')
low = [(p, per[p], pages.get(p, 0)) for p in range(lo, hi + 1) if pages.get(p, 0) > 1500 and per[p] < 4]
for p, n, c in low: P.append(f'page {p}: only {n} facts for {c} chars of text (too thin?)')
if len(d['outline']) < 3: P.append('outline too short')
print(f"{os.path.basename(path)}: {len(d['facts'])} facts on {hi-lo+1} pages ({len(d['facts'])/(hi-lo+1):.1f}/page), {flagged} flagged verify")
print(f'{len(P)} problems' if P else '0 problems')
for p in P[:60]: print(' -', p)
sys.exit(1 if P else 0)
