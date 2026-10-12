"""Re-number List-II of 'match' items whose key is the identity pairing (A-1, B-2, C-3[, D-4]) so the key is not the
giveaway pattern. Deterministic (seeded by item id). Changes q (List-II numbering/order), a, o, e, w pairings only.
usage: permute-match.py pack.json [--write]"""
import json, re, sys, random
p = sys.argv[1]; d = json.load(open(p)); n_changed = 0
PAIR = re.compile(r'\b([A-D])-([1-4])\b')
for c in d['concepts']:
    for q in c['questions']:
        if not (q.get('f') == 'match' or q.get('t') == 'match'): continue
        pairs = PAIR.findall(q['a'])
        if not pairs or any(l != 'ABCD'[int(n) - 1] for l, n in pairs): continue  # only identity keys
        m = re.search(r'List-II[^\n]*\n((?:\d\. .*(?:\n|$))+)', q['q'])
        if not m: continue
        items = re.findall(r'^(\d)\. (.*)$', m.group(1), re.M)
        k = len(items)
        if k < 3: continue
        rnd = random.Random(q['id'])
        perm = list(range(1, k + 1))
        for _ in range(20):
            rnd.shuffle(perm)
            if perm != list(range(1, k + 1)) and sum(1 for i, v in enumerate(perm, 1) if i == v) <= 1: break
        mp = {str(i): str(perm[i - 1]) for i in range(1, k + 1)}  # old number -> new number
        new_items = sorted(((int(mp[n]), t) for n, t in items))
        new_block = ''.join(f'{i}. {t}\n' for i, t in new_items)
        if not m.group(1).endswith('\n'): new_block = new_block.rstrip('\n')
        q['q'] = q['q'][:m.start(1)] + new_block + q['q'][m.end(1):]
        fix = lambda s: PAIR.sub(lambda mm: f'{mm.group(1)}-{mp[mm.group(2)]}', s)
        q['a'] = fix(q['a']); q['o'] = [fix(x) for x in q['o']]; q['e'] = fix(q['e']); q['w'] = [fix(x) for x in q['w']]
        n_changed += 1
print(p.split('/')[-1], 'match items permuted', n_changed)
if '--write' in sys.argv: json.dump(d, open(p, 'w'), ensure_ascii=False, indent=1)
