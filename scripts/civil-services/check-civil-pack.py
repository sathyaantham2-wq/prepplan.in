"""Check a civil_pack file (UPSC-style polity MCQs). Writes nothing. usage: check-civil-pack.py pack.json
Pack = {kind:'civil_pack', subject:{code,class:0,board:'CIVILS'}, chapter:{...}, source_code,
        concepts:[{code, questions:[{f,t,m:1,q,a,o:[4, correct first],e,w,tr,sk,pg}]}]}
 f format: direct|which|howmany|stmt12|match|case   t: mcq|multi_statement|assertion_reason|match
 e explanation, w why-wrong (one line per wrong option, in o order after the correct one), tr traps[], sk skill, pg[] pdf pages"""
import json, sys, re, collections
P = []; d = json.load(open(sys.argv[1]))
if d.get('kind') != 'civil_pack': P.append('kind must be civil_pack')
MIX = dict(direct=(0.15, 0.30), which=(0.35, 0.55), howmany=(0.10, 0.20), stmt12=(0.05, 0.15))  # share of a concept, from the 2020-26 era
# new-chapter packs (chapter_no > 7) must carry what the loader needs to create the rows
ch = d.get('chapter', {})
if ch.get('chapter_no', 0) > 7 or ch.get('part') == 'A':  # part 'A' = the AKS study-notes chapters (2026-10-11)
    if not d.get('scope_in'): P.append('new chapter: scope_in missing')
    if not d.get('source'): P.append('new chapter: source missing')
    for k in ('name', 'blurb', 'source_code'):
        if not ch.get(k): P.append(f'new chapter: chapter.{k} missing')
    for c in d['concepts']:
        for k in ('name', 'description', 'idea', 'rule'):
            if not c.get(k): P.append(f"{c['code']}: concept {k} missing (the loader creates the concept)")
seen = set()
# owner rule 2026-10-16: student-visible text never names the source book, "the book/text/notes" or a page number
_SRC = re.compile(r"laxmikanth|\bthe (?:book|textbook|notes)\b|\bstudy notes\b|\bbook's\b", re.I)
_PG = re.compile(r'\bpp?\.\s*\d')
for c in d['concepts']:
    for q in c['questions']:
        for k in ('q', 'o', 'e', 'w', 'tr', 'a'):
            t = json.dumps(q.get(k), ensure_ascii=False)
            if _SRC.search(t) or (k != 'q' and _PG.search(t)):
                P.append(f"{q.get('id', c['code'])}: '{k}' names the source book or quotes a page (students never see the source; pages belong in pg)")
# metadata too (owner rule 2026-10-16): the source book's name never appears in scope records, concept text or the source row
_META = re.compile(r"laxmikanth|\bthe chapter\b|\bthe book\b", re.I)
for k, v in d.items():
    if k != 'concepts' and _META.search(json.dumps(v, ensure_ascii=False)):
        P.append(f"metadata '{k}' names the source book or says 'the chapter/the book'")
for c in d['concepts']:
    for k, v in c.items():
        if k != 'questions' and _META.search(json.dumps(v, ensure_ascii=False)):
            P.append(f"{c['code']}: concept {k} names the source book or says 'the chapter/the book'")
for c in d['concepts']:
    qs = c['questions']; n = len(qs)
    if not 20 <= n <= 22: P.append(f"{c['code']}: {n} questions, wants 20-22")
    cnt = collections.Counter(q.get('f') for q in qs)
    for f, (lo, hi) in MIX.items():
        if not lo * 20 - 1 <= cnt[f] <= hi * 20 + 1: P.append(f"{c['code']}: {cnt[f]} '{f}' items, trend wants {round(lo*20)}-{round(hi*20)}")
    rec = sum(q.get('sk') == 'recall' for q in qs)
    if rec > 0.4 * n: P.append(f"{c['code']}: {rec} pure-recall items, max 40%")
    # guessability (review of lk05, 2026-10-09): option sets and key text must vary inside a concept
    wh = [q for q in qs if q.get('f') in ('which', 'howmany')]
    ks = collections.Counter(q['a'].strip().lower() for q in wh)
    if ks and ks.most_common(1)[0][1] > 3: P.append(f"{c['code']}: key text '{ks.most_common(1)[0][0]}' repeats {ks.most_common(1)[0][1]}x (max 3)")
    sets = collections.Counter(tuple(sorted(x.strip().lower() for x in q['o'])) for q in wh)
    if sets and sets.most_common(1)[0][1] > 2: P.append(f"{c['code']}: one option set reused {sets.most_common(1)[0][1]}x (max 2)")
    allc = sum(1 for q in wh if q.get('f') == 'which' and re.search(r'1,? 2,? (and )?3', q['a']))
    if wh and allc == 0 and len(wh) >= 6: P.append(f"{c['code']}: no which-item has all statements correct")
    # lk04b review (2026-10-09): in a four-statement item, a lone three-statement option that is also the key
    # lets a student score without knowing a fact. Count such items per concept.
    def nums(opt): return len(re.findall(r'\b[1-4]\b', opt))
    lone = 0
    for q in qs:
        if q.get('f') == 'which' and len(re.findall(r'(?m)^\s*[1-4]\.', q['q'])) == 4:
            three = [x for x in q['o'] if nums(x) == 3 and 'and 4' not in x.replace('1, 2, 3 and 4', '')[:0]]
            if len(three) == 1 and nums(q['a']) == 3: lone += 1
    if lone > 2: P.append(f"{c['code']}: {lone} four-statement items where the key is the only three-statement option (max 2)")
    # size-uniqueness giveaway (lk04b-r2, lk06b reviews): the key is the only option with its number of statements
    uniq = {}
    for q in qs:
        if q.get('f') == 'which' and len(re.findall(r'(?m)^\s*[1-4]\.', q['q'])) == 4:
            sizes = collections.Counter(nums(x) for x in q['o'])
            if sizes[nums(q['a'])] == 1: uniq[nums(q['a'])] = uniq.get(nums(q['a']), 0) + 1
    tot = sum(uniq.values()); n4 = sum(1 for q in qs if q.get('f') == 'which' and len(re.findall(r'(?m)^\s*[1-4]\.', q['q'])) == 4)
    if n4 >= 4 and tot > 0.5 * n4: P.append(f"{c['code']}: in {tot} of {n4} four-statement items the key is the only option of its size (max half)")
    # longest-key tell (lk07-a, lk01 reviews): in direct items the key must not be the longest option most of the time
    dr = [q for q in qs if q.get('f') == 'direct' and len(q['o']) == 4]
    lng = sum(1 for q in dr if len(q['a']) == max(len(x) for x in q['o']) and len(q['a']) > 1.15 * sorted(len(x) for x in q['o'])[-2])
    if len(dr) >= 4 and lng > 0.5 * len(dr): P.append(f"{c['code']}: key is clearly the longest option in {lng} of {len(dr)} direct items (max half)")
    for i, q in enumerate(qs, 1):
        w = f"{c['code']} #{i}"
        if q.get('t') not in ('mcq', 'multi_statement', 'assertion_reason', 'match'): P.append(f'{w}: type {q.get("t")}')
        if q.get('m') != 1: P.append(f'{w}: 1 mark')
        o = q.get('o') or []
        if len(o) != 4 or len({x.strip() for x in o}) != 4: P.append(f'{w}: needs 4 distinct options')
        if q['q'] in seen: P.append(f'{w}: duplicate text')
        seen.add(q['q'])
        if re.search(r'\b(option|choice)s?\s*\(?[a-d1-4]\)?(?![a-z])', q.get('a', ''), re.I): P.append(f'{w}: answer names a letter (options are shuffled)')
        if not q.get('e'): P.append(f'{w}: explanation missing')
        if len(q.get('w') or []) != 3: P.append(f'{w}: w needs 3 reasons (one per wrong option)')
        if not q.get('pg'): P.append(f'{w}: pdf page citation missing')
        f = q.get('f')
        if f in ('which', 'howmany'):
            if len(re.findall(r'(?m)^\s*[1-4]\.', q['q'])) < 2: P.append(f'{w}: {f} needs numbered statements')
            if f == 'howmany' and not any(re.search(r'only (one|two|three)|all (three|four)|none', x, re.I) for x in o): P.append(f'{w}: howmany options should be counts')
        if f == 'match' or q.get('t') == 'match':  # 2026-10-12: aks21a/aks12 lost their List-I rows while List-II was re-ordered by hand
            li = set(re.findall(r'(?m)^\s*([A-D])[\.\):]\s*\S', q['q'])); lii = set(re.findall(r'(?m)^\s*([1-4])[\.\):]\s*\S', q['q']))
            if len(li) < 3 or len(lii) < 3: P.append(f'{w}: match item needs List-I rows (A, B, C...) AND List-II rows (1, 2, 3...) in the stem; found {len(li)} and {len(lii)}')
        if f == 'stmt12' and not (re.search(r'Statement[- ]I\b', q['q']) and re.search(r'Statement[- ]II\b', q['q'])): P.append(f'{w}: stmt12 needs Statement-I and Statement-II')
        if f == 'direct' and len(q['q']) < 40: P.append(f'{w}: stem too thin to be a UPSC item')
print(len(P), 'problems'); [print(' ', p) for p in P[:60]]
sys.exit(1 if P else 0)
