"""Remove references to the owner's study notes from student-visible text of an AKS pack (2026-10-12).
usage: strip-notes-refs.py pack.json [--write] [--out other.json]
Rules, applied to the explanation `e` and the wrong-option reasons `w` only (never q, o, a, keys):
 1. '(notes p.12)', '(notes pp.12-14; Laxmikanth p.9)' -> the notes part is dropped, the Laxmikanth part kept;
    '; notes p.12' / 'notes p.12;' / 'it is stated in notes p.12' / 'Notes p.12.' are dropped.
 2. A 'Statement N is correct: ...' clause that is EMPTY after the strip (it only cited notes pages) is filled with the
    statement's own text from the question, so the explanation still says what is true; 'Statement-I/II is correct'
    clauses likewise.  Clauses that already carry a reason are kept as they are.
Residual sentences that still mention 'the notes' in prose are listed (not rewritten) for manual fixing."""
import json, re, sys

NOTEPG = r'[Nn]otes?\s+pp?\.\s*[\d][\d\-–,\s]*'


def strip_parens(s):
    # (notes p.12)  /  (notes p.12; Laxmikanth p.9)  /  (Laxmikanth p.9; notes p.12) /  (Article 5; notes p.12)
    def fix(m):
        parts = [p.strip() for p in m.group(1).split(';')]
        keep = [p for p in parts if not re.fullmatch(NOTEPG, p)]
        return '(' + '; '.join(keep) + ')' if keep else ''
    s = re.sub(r'\(([^()]*?' + NOTEPG + r'[^()]*?)\)', fix, s)
    return s


def strip_loose(s):
    s = re.sub(r'\s*;\s*' + NOTEPG, '', s)                    # '; notes p.12'
    s = re.sub(NOTEPG + r'\s*;\s*', '', s)                    # 'notes p.12; Laxmikanth p.9'
    s = re.sub(r'\b(?:it is )?(?:stated|given|listed|described|recorded) in ' + NOTEPG, '', s)
    s = re.sub(NOTEPG, '', s)                                 # bare 'Notes p.12'
    return s


def clean_clause(c):
    c = strip_loose(strip_parens(c))
    c = re.sub(r'\s+([.,;:])', r'\1', c)
    c = re.sub(r'([:;,])\s*([.;,])', r'\2', c)
    c = re.sub(r'\(\s*\)', '', c)
    c = re.sub(r'\s{2,}', ' ', c)
    return c.strip()


def statements(q):
    st = {}
    for m in re.finditer(r'(?m)^\s*(\d)\.\s*(.+?)\s*$', q['q']):
        st[m.group(1)] = m.group(2)
    for m in re.finditer(r'Statement-(I{1,2}):\s*(.+?)(?=\s*(?:Statement-II?:|\n|$))', q['q']):
        st['I' * len(m.group(1))] = m.group(2)
    return st


def fix_e(q, e):
    st = statements(q)
    parts = re.split(r'(?=Statement(?:-I{1,2}| \d) is (?:correct|incorrect))', e)
    out = []
    for p in parts:
        if not p.strip():
            continue
        m = re.match(r'Statement(?:-(I{1,2})| (\d)) is (correct|incorrect)(?::|\s)?\s*(.*)$', p, re.S)
        if not m:
            out.append(clean_clause(p)); continue
        label = m.group(1) or m.group(2); key = 'I' * len(label) if m.group(1) else label
        verdict, body = m.group(3), clean_clause(m.group(4))
        # body without any reference/boilerplate left?
        probe = re.sub(r'(?i)^\(?\s*Laxmikanth p\.[\d\-–,\s]+\)?\.?$', '', body).strip(' .;:()')
        if verdict == 'correct' and not probe:
            txt = st.get(key, '').rstrip('. ')
            ref = re.search(r'(Laxmikanth pp?\.[\d\-–,\s]+\d)', body)
            body = (txt + ('' if not txt else '') + (f' ({ref.group(1)})' if ref and txt else '')).strip()
            if not txt:
                body = ref.group(1) if ref else ''
        head = f'Statement{"-" + m.group(1) if m.group(1) else " " + m.group(2)} is {verdict}'
        sep = ': ' if body else ''
        end = '' if body.endswith(('.', '?', '!')) else ('.' if body else '.')
        out.append(f'{head}{sep}{body}{end}')
    return ' '.join(x for x in out if x.strip())


def main():
    p = sys.argv[1]; d = json.load(open(p)); changed = 0; resid = []
    for c in d['concepts']:
        for q in c['questions']:
            old = (q['e'], list(q['w']))
            q['e'] = fix_e(q, q['e']) if re.search(NOTEPG, q['e']) or re.search(r'(?i)\bnotes?\b', q['e']) else q['e']
            q['w'] = [clean_clause(x) if re.search(r'(?i)notes?\s+pp?\.', x) else x for x in q['w']]
            if (q['e'], q['w']) != old: changed += 1
            for fld, txt in (('e', q['e']), ('w', ' '.join(q['w']))):
                for m in re.finditer(r"[^.\n]*\b(?:the )?notes?\b(?!\s+(?:that|on)\b)[^.\n]*", txt, re.I):
                    s = m.group(0).strip()
                    if re.search(r'promissory|\bnote\b on', s, re.I): continue
                    resid.append((q['id'][-12:], fld, s[:140]))
    print(p.split('/')[-1], 'items changed', changed, 'residual mentions', len(resid))
    for r in resid[:int(sys.argv[sys.argv.index('--show') + 1]) if '--show' in sys.argv else 0]: print('  ', r)
    out = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else (p if '--write' in sys.argv else None)
    if out: json.dump(d, open(out, 'w'), ensure_ascii=False, indent=1)


main()
