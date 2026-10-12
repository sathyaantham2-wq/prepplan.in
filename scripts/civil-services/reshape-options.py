"""Rebuild the option sets of four-statement 'which' items so the key is not the only option of its size.
Deterministic (seeded by item id); changes ONLY `o` and `w` (and keeps the key first). Truth values come from the
explanation `e` ('Statement n is correct/incorrect'). usage: reshape-options.py pack.json [--write]"""
import json, re, sys, random, itertools
LABEL3_ALL = False
def label(s):
    s = sorted(s)
    if len(s) == 4: return '1, 2, 3 and 4'
    if len(s) == 3 and s == [1, 2, 3] and LABEL3_ALL: return '1, 2 and 3'
    if len(s) == 1: return f'{s[0]} only'
    if len(s) == 2: return f'{s[0]} and {s[1]} only'
    return ', '.join(map(str, s[:-1])) + f' and {s[-1]} only'
def reason(opt, K, pg):
    inc = sorted(opt - K); out = sorted(K - opt); parts = []
    if inc: parts.append('includes statement ' + ' and '.join(map(str, inc)) + ', which is incorrect')
    if out: parts.append('leaves out statement ' + ' and '.join(map(str, out)) + ', which is correct')
    return f"'{label(opt)}' " + ' and '.join(parts) + (f': {pg}' if pg else '')
p = sys.argv[1]; d = json.load(open(p)); changed = 0
for c in d['concepts']:
    for q in c['questions']:
        ns = len(re.findall(r'(?m)^\s*[1-4]\.', q['q']))
        if q.get('f') != 'which' or ns not in (3, 4): continue
        truth = {int(n): v == 'correct' for n, v in re.findall(r'Statement (\d) is (correct|incorrect)', q['e'])}
        if len(truth) != ns: continue
        K = {n for n, v in truth.items() if v}
        if not K: continue
        LABEL3_ALL = (q['a'] == '1, 2 and 3' and ns == 3 and K == {1, 2, 3})
        if label(K) != q['a']: continue
        pgm = re.search(r'p\.\d+', q['e']); pg = pgm.group(0) if pgm else ''
        rnd = random.Random(q['id'])
        pool = []
        for n in range(1, ns + 1):
            pool.append(K ^ {n})
        for a in K:
            for b in set(range(1, ns + 1)) - K: pool.append((K - {a}) | {b})
        pool = [s for s in {frozenset(x) for x in pool} if s and set(s) != K]
        same = [s for s in pool if len(s) == len(K)]; other = [s for s in pool if len(s) != len(K)]
        rnd.shuffle(same); rnd.shuffle(other)
        pick = []
        if same: pick.append(same.pop())
        rest = other + same; rnd.shuffle(rest)
        while len(pick) < 3 and rest: pick.append(rest.pop())
        if len(pick) < 3: continue
        # key must not be the only option of its size nor the unique odd-one-out by shape: keep if satisfied
        opts = [set(K)] + [set(s) for s in pick]
        q['o'] = [label(s) for s in opts]
        q['w'] = [reason(s, K, pg) for s in opts[1:]]
        changed += 1
print(p.split('/')[-1], 'reshaped', changed)
if '--write' in sys.argv: json.dump(d, open(p, 'w'), ensure_ascii=False, indent=1)
