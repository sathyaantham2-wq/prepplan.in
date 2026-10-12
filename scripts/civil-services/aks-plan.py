"""Plan the AKS question packs from the inventory. usage: aks-plan.py [--facts-per-concept 45] [--concepts-per-pack 6]
Reads aks/inventory/*.json, groups each chapter's clusters (in fid order) into concepts of about N facts, then groups
concepts into packs of at most M concepts (one author agent per pack). Writes aks/plan.json and prints a table.
A fact flagged `verify` still counts toward a concept: the author tests it only in the corrected form given in its note,
or lists it under `skipped` with the reason."""
import json, glob, collections, sys, math
ROOT = '/Users/satyanarayanareddy/claude projects /Prepplan/content/authoring/civil/polity/aks'
NF = int(sys.argv[sys.argv.index('--facts-per-concept') + 1]) if '--facts-per-concept' in sys.argv else 45
NC = int(sys.argv[sys.argv.index('--concepts-per-pack') + 1]) if '--concepts-per-pack' in sys.argv else 6
NAMES = {1:'Historical Background',2:'Making of the Constitution',3:'Salient Features',4:'Preamble',5:'Fundamental Rights',6:'Directive Principles of State Policy',7:'Fundamental Duties',8:'Amendment of the Constitution',9:'Basic Structure of the Constitution',10:'Union Executive',11:'Union Legislature',12:'Parliamentary Committees',13:'Emergency Provisions',14:'State Executive',15:'State Legislature',16:'Indian Judicial System',17:'Democratic Decentralisation',18:'System of Elections',19:'Anti-Defection Provisions',20:'Constitutional Bodies',21:'Non-Constitutional Bodies'}
facts = collections.defaultdict(list)
for f in sorted(glob.glob(ROOT + '/inventory/*.json')):
    d = json.load(open(f))
    for x in d['facts']: facts[d['chapter']].append(x)
plan = []; tot_c = 0
for ch in sorted(facts):
    fs = sorted(facts[ch], key=lambda x: x['fid'])
    clusters = collections.OrderedDict()
    for x in fs: clusters.setdefault(x['cluster'], []).append(x)
    ncon = max(1, round(len(fs) / NF)); target = len(fs) / ncon
    concepts = []; cur = []
    for name, cl in clusters.items():
        if cur and len(cur) + len(cl) / 2 > target * 1.1 and len(concepts) < ncon - 1:
            concepts.append(cur); cur = []
        cur = cur + cl
    if cur: concepts.append(cur)
    packs = [concepts[i:i + NC] for i in range(0, len(concepts), NC)]
    if len(packs) > 1 and len(packs[-1]) <= 2:  # avoid a tiny last pack: merge back if it fits
        packs[-2] += packs[-1]; packs.pop()
    k = 0
    for pi, pk in enumerate(packs):
        suffix = '' if len(packs) == 1 else 'abcdefgh'[pi]
        pc = []
        for cf in pk:
            k += 1
            pc.append({'n': k, 'code': f'AKS-{ch:02d}.{k}', 'facts': len(cf), 'verify': sum(1 for x in cf if x['flag'] == 'verify'),
                       'clusters': list(collections.OrderedDict.fromkeys(x['cluster'] for x in cf)), 'fids': [x['fid'] for x in cf]})
        plan.append({'pack': f'aks{ch:02d}{suffix}', 'chapter': ch, 'name': NAMES[ch], 'concepts': pc,
                     'facts': sum(c['facts'] for c in pc), 'questions': 20 * len(pc)})
json.dump(plan, open(ROOT + '/plan.json', 'w'), indent=1)
print('pack     ch  concepts facts verify questions')
for p in plan: print(f"{p['pack']:8} {p['chapter']:3} {len(p['concepts']):8} {p['facts']:5} {sum(c['verify'] for c in p['concepts']):6} {p['questions']:9}")
print('TOTAL packs', len(plan), 'concepts', sum(len(p['concepts']) for p in plan), 'facts', sum(p['facts'] for p in plan), 'questions', sum(p['questions'] for p in plan))
