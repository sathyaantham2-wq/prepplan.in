"""Apply a rewrite patch to ONE civil pack (2026-10-16, book-name removal).
usage: apply-lk-patch.py pack.json patch.json
patch.json = {"<question id>": {"q": "...", "e": "...", "w": [...], "tr": [...]}, ...}
Allowed fields: q, e, w, tr always. a, o, f, t, sk only together with "replaced": true (a new question on the same concept).
Refuses (writes nothing) if any patched string still names the book, quotes a book page, or the id is unknown.
Does not validate the pack; run scripts/civil-services/check-civil-pack.py afterwards."""
import json
import re
import sys

NAME = re.compile(r'laxmikanth', re.I)
PAGE = re.compile(r'\bpp?\.\s*\d')
BOOKISH = re.compile(r'\b(?:the (?:book|textbook|text|notes)|(?:in|from|per|as per) the notes)\b', re.I)
SOFT = ('q', 'e', 'w', 'tr')
HARD = ('a', 'o', 'f', 't', 'sk')


def strings(v):
    if isinstance(v, str):
        yield v
    elif isinstance(v, list):
        for x in v:
            yield from strings(x)


def main(pack, patch):
    d = json.load(open(pack))
    p = json.load(open(patch))
    index = {q['id']: q for c in d['concepts'] for q in c['questions']}
    problems = []
    for qid, fields in p.items():
        q = index.get(qid)
        if q is None:
            problems.append(f'{qid}: unknown id in {pack}')
            continue
        replaced = bool(fields.get('replaced'))
        for k, v in fields.items():
            if k == 'replaced':
                continue
            if k in HARD and not replaced:
                problems.append(f'{qid}: field {k} needs "replaced": true')
            elif k not in SOFT + HARD:
                problems.append(f'{qid}: unknown field {k}')
            for s in strings(v):
                if NAME.search(s):
                    problems.append(f'{qid}.{k}: still names the book')
                if k != 'q' and PAGE.search(s):
                    problems.append(f'{qid}.{k}: still quotes a page')
                if BOOKISH.search(s):
                    problems.append(f'{qid}.{k}: refers to "the book/text/notes"')
    if problems:
        print('REFUSED:\n' + '\n'.join(problems[:40]))
        return 1
    for qid, fields in p.items():
        for k, v in fields.items():
            if k != 'replaced':
                index[qid][k] = v
    with open(pack, 'w') as fh:
        json.dump(d, fh, ensure_ascii=False, indent=2)
        fh.write('\n')
    print(f'applied {len(p)} questions to {pack}')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1], sys.argv[2]))
