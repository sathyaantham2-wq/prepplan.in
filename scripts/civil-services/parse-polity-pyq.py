"""Parse the two UPSC Prelims polity PYQ text dumps into one merged JSON (internal tooling).
usage: parse-polity-pyq.py A.txt B.txt out.json
A = UnlockIAS (year + topic + source Q number), B = 2013-2023 list (year only)."""
import re, sys, json

def norm(s): return re.sub(r'[^a-z0-9]', '', s.lower())[:50]

def clean(s):
    s = re.sub(r'=====PAGE \d+=====', '', s)
    s = re.sub(r'UnlockIAS \| www\.unlockias\.in/upsc-prelims-pyq\s*', '', s)
    return re.sub(r'[ \t]+\n', '\n', s).strip()

def split_q(body):
    """-> stem, options{a..d}; body has no answer line."""
    m = re.search(r'\n?\(a\)', body) or re.search(r'\s\(?a\)\s', body)
    if not m: return clean(body), {}
    stem = body[:m.start()]
    opts = {}
    parts = re.split(r'\(?\b([a-d])\)\s*', body[m.start():])
    for i in range(1, len(parts) - 1, 2):
        opts[parts[i]] = re.sub(r'\s+', ' ', parts[i + 1]).strip()
    return clean(stem), opts

def parse_a(t):
    out = []
    for b in re.split(r'\n(?=UPSC \d{4}\s+Indian Polity)', t):
        m = re.match(r'UPSC (\d{4})\s+Indian Polity › ([^\n]+)\n(.*)', b, re.S)
        if not m: continue
        year, topic, rest = int(m[1]), m[2].strip(), m[3]
        qm = re.match(r'\s*Q\.?\s*(\d+)\.\s*(.*)', rest, re.S)
        am = re.search(r'Answer:\s*\(([a-d])\)', rest) or re.search(r'Answer:\s*(cancelled)', rest)
        if not (qm and am): print('A skip', year, rest[:60].replace('\n', ' ')); continue
        body = re.sub(r'Answer:.*', '', qm[2], flags=re.S)
        stem, opts = split_q(body)
        out.append(dict(year=year, source_q=int(qm[1]), unlock_topic=topic, stem=stem, options=opts, answer=am[1]))
    return out

def parse_b(t):
    out = []; year = None
    for blk in re.split(r'\n(?=\d{4}\s*\n)', '\n' + clean(t)):
        ym = re.match(r'\s*(\d{4})\s*\n(.*)', blk, re.S)
        if not ym: continue
        year = int(ym[1])
        for q in re.split(r'\n(?=Q\.?\s*\d+\.)', ym[2]):
            qm = re.match(r'\s*Q\.?\s*(\d+)\.\s*(.*)', q, re.S)
            am = re.search(r'Correct answer:\s*([a-d])', q)
            if not (qm and am): continue
            body = re.sub(r'Correct answer:.*', '', qm[2], flags=re.S)
            stem, opts = split_q(body)
            out.append(dict(year=year, source_q=int(qm[1]), stem=stem, options=opts, answer=am[1]))
    return out

a = parse_a(open(sys.argv[1]).read()); b = parse_b(open(sys.argv[2]).read())
print('A', len(a), 'B', len(b))
seen = {(q['year'], norm(q['stem'])): q for q in a}
only_b = []
conflict = []
for q in b:
    k = (q['year'], norm(q['stem']))
    if k in seen:
        if seen[k]['answer'] != q['answer']:
            conflict.append((q['year'], q['stem'][:70], seen[k]['answer'], q['answer']))
            seen[k]['answer_conflict'] = {'unlockias': seen[k]['answer'], 'list2013-23': q['answer']}
    else: only_b.append(q)
print('B not in A:', len(only_b), ' answer conflicts:', len(conflict))
for c in conflict: print('  CONFLICT', c)
for q in only_b: print('  onlyB', q['year'], q['source_q'], q['stem'][:70].replace('\n', ' '))
allq = []
for q in a: allq.append({**q, 'sources': ['unlockias'] + (['list2013-23'] if (q['year'], norm(q['stem'])) in {(x['year'], norm(x['stem'])) for x in b} else [])})
for q in only_b: allq.append({**q, 'unlock_topic': None, 'sources': ['list2013-23']})
allq.sort(key=lambda q: (q['year'], q['source_q']))
for i, q in enumerate(allq): q['id'] = f"UPSC-POL-{q['year']}-{i+1:03d}"
json.dump(allq, open(sys.argv[3], 'w'), ensure_ascii=False, indent=1)
print('wrote', len(allq))
