"""Remove the book name 'Laxmikanth' and book page references from student-visible text of civil-services packs (2026-10-16).

usage: strip-laxmikanth-refs.py [--write] [--residue residue.json] pack.json [pack.json ...]

Owner decision 2026-10-16: question text and explanations must not name the book (copyright / attribution).
Mechanical rules only; the questions' keys (`a`, `o`) are never touched.
  explanation `e`, wrong-option reasons `w`, traps `tr`:
    - parentheticals that mention Laxmikanth are dropped: '(Laxmikanth p.58)', '(Laxmikanth Ch.3 (Concept), p.58)'
    - 'Laxmikanth Ch.13 Title, p.206: <fact>' prefix is dropped (the fact is kept), 'Laxmikanth ch26 p.419-420.' tail dropped
    - 'Laxmikanth p.640' and 'according to Laxmikanth' are dropped, bare page refs 'p.58' / '(pp.12-14)' are dropped
    - a 'Statement N is correct:' clause left empty (or only 'says so') is refilled with that statement's own text
  stem `q`:
    - 'According to Laxmikanth, ' prefix and ' according to Laxmikanth' tail are dropped, '(Laxmikanth Ch.13)' dropped
Everything that still names the book, or reads oddly after the strip, is written to the residue file for an agent rewrite."""
import json
import re
import sys

NAME = re.compile(r'laxmikanth', re.I)
PG = r'pp?\.\s*\d[\d\s\-–,]*'
VERBISH = (r'(?:says so|states this|says this|records this view|confirms this|notes this|mentions this|'
           r'describes this|gives this|states the same|says the same|records this)')
SUBJECT_PAGEREF = re.compile(r'(?:^|[.:;]\s*)\(?pp?\.\s*\d[\d\s\-–,]*\)?\s+[a-z]')
SUSPICIOUS = re.compile(r'(?:correct|incorrect|:)[a-z]|^(?:and|or)\b|[.:;]\s*(?:and|or)\s*[.:;]|^.{0,12}$|'
                        r'[:;,]\s*[:;,.]|\(\s*\)|\b(?:and|or)\s*[.;]')


def drop_parens(s):
    """Remove balanced (...) groups whose text mentions Laxmikanth."""
    out, i = [], 0
    while i < len(s):
        if s[i] == '(':
            depth, j = 0, i
            while j < len(s):
                depth += (s[j] == '(') - (s[j] == ')')
                j += 1
                if depth == 0:
                    break
            if depth == 0 and NAME.search(s[i:j]):
                while out and out[-1] == ' ':
                    out.pop()
                i = j
                continue
        out.append(s[i])
        i += 1
    return ''.join(out)


def upper_first(m):
    return m.group(1) + m.group(2).upper()


def tidy(s):
    s = re.sub(r'\(\s*\)', '', s)
    s = re.sub(r'\s+([.,;:])', r'\1', s)
    s = re.sub(r'([:;,])\s*([.;,])', r'\2', s)
    s = re.sub(r'\.\s*\.', '.', s)
    s = re.sub(r'::+', ':', s)
    s = re.sub(r'[ \t]{2,}', ' ', s)
    s = re.sub(r'\s*;\s*$', '', s)
    # a sentence that now starts with orphan punctuation
    s = re.sub(r'(^|[.!?]\s+)[:;,]\s*([A-Za-z])', upper_first, s)
    return s.strip()


def clean_expl(s):
    s = drop_parens(s)
    s = re.sub(r'(?:^|(?<=[.!?]\s))(?:Source:\s*)?Laxmikanth\s+[Cc]h\.?\s*\d+[^:\n]{0,90}?:\s*', '', s)
    s = re.sub(r'\s*(?:Source:\s*)?Laxmikanth\s+[Cc]h\.?\s*\d+[^.\n]{0,60}?(?:' + PG + r')?\.?\s*(?=$|\n)', '', s)
    s = re.sub(r'(?:[;,]\s*|\band\s+)?(?:Source:\s*)?Laxmikanth\s+[Cc]h\.?\s*\d+(?:\s*\([^()]*\))?', '', s)
    s = re.sub(r'\s*Laxmikanth\s+' + PG, '', s)
    s = re.sub(r'\s*,?\s*according to Laxmikanth,?', '', s, flags=re.I)
    s = re.sub(r'\s*\(?\b' + PG + r'\)?', '', s)
    s = tidy(s)
    s = re.sub(r'(^)([a-z])', upper_first, s)
    return s


def clean_stem(s):
    s = drop_parens(s)
    s = re.sub(r'^According to Laxmikanth,?\s*', '', s)
    s = re.sub(r'(?<=\n)(\d+\.\s*)According to Laxmikanth,?\s*(?=\S)', r'\1', s)
    s = re.sub(r',?\s+according to Laxmikanth(?=[?.,:])', '', s, flags=re.I)
    s = re.sub(r'(?<=[.\n:])\s*According to Laxmikanth,?\s*', ' ', s)
    s = tidy(s)
    s = re.sub(r'^([a-z])', lambda m: m.group(1).upper(), s)
    s = re.sub(r'(\n\d+\.\s+)([a-z])', upper_first, s)
    return s


def statement_texts(q):
    return {int(n): t.strip() for n, t in re.findall(r'(?m)^\s*(\d+)\.\s+(.+)$', q)}


def refill_empty_clauses(e, q):
    sts = statement_texts(q)

    def fix(m):
        n = int(m.group(2))
        txt = sts.get(n)
        if not txt:
            return m.group(0)
        return f'{m.group(1)}{n} is {m.group(3)}: {txt}' + ('' if txt.endswith('.') else '.')

    e = re.sub(r'(Statement\s+)(\d+) is (correct|incorrect):\s*' + VERBISH + r'(?=[.;]|$)', fix, e)
    return re.sub(r'(Statement\s+)(\d+) is (correct|incorrect):\s*(?:and\s*)?(?=\.|;|$|Statement)', fix, e)


def process(path, write):
    d = json.load(open(path))
    changed = 0
    residue = []
    for c in d['concepts']:
        for q in c['questions']:
            before = json.dumps([q['q'], q['e'], q.get('w'), q.get('tr')], ensure_ascii=False)
            if not NAME.search(before) and not re.search(r'\b' + PG, before):
                continue
            q['q'] = clean_stem(q['q']) if NAME.search(q['q']) else q['q']
            q['e'] = refill_empty_clauses(clean_expl(q['e']), q['q'])
            if isinstance(q.get('w'), list):
                q['w'] = [clean_expl(x) for x in q['w']]
            if isinstance(q.get('tr'), list):
                q['tr'] = [clean_expl(x) if isinstance(x, str) else x for x in q['tr']]
            elif isinstance(q.get('tr'), str):
                q['tr'] = clean_expl(q['tr'])
            after = json.dumps([q['q'], q['e'], q.get('w'), q.get('tr')], ensure_ascii=False)
            if after != before:
                changed += 1
            flag = (NAME.search(after) or SUBJECT_PAGEREF.search(before)
                    or any(SUSPICIOUS.search(x) for x in [q['e']] + list(q.get('w') or [])))
            if flag:
                residue.append({'file': path, 'concept': c['code'], 'id': q.get('id'), 'q': q['q'], 'e': q['e'],
                                'w': q.get('w'), 'tr': q.get('tr')})
    if write and changed:
        with open(path, 'w') as fh:
            json.dump(d, fh, ensure_ascii=False, indent=2)
            fh.write('\n')
    return changed, residue


if __name__ == '__main__':
    args = sys.argv[1:]
    write = '--write' in args
    out = args[args.index('--residue') + 1] if '--residue' in args else None
    files = [a for a in args if a.endswith('.json') and a != out]
    total_changed, all_res = 0, []
    for f in files:
        ch, res = process(f, write)
        total_changed += ch
        all_res += res
    print(f'files {len(files)}, questions changed {total_changed}, residue {len(all_res)}',
          '(written)' if write else '(dry run)')
    if out:
        json.dump(all_res, open(out, 'w'), ensure_ascii=False, indent=2)
