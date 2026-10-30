# Re-review (r2): class7-topup/p1ch03-la4.json (Class 7 Maths P1 Ch3, gegp103)

Method: diffed against the v1 copy; recomputed every number in python; checked pages (printed page = file + 45) against
content/extracted/gegp103; checked difficulty/Bloom/tag values against src/db/enums.ts and scripts/load-dps-pack.ts.
Changed: C7M-3.1 (d only), 3.3, 3.5 (d only), 3.8, 3.9 (b only). Unchanged: 3.2, 3.4, 3.6, 3.7 -> confirmed byte-identical.

## HIGH
1. C7M-3.1 and C7M-3.5: `"d": "Medium"`. The only valid tiers are Easy / Hard / Hardest (type Tier in scripts/load-dps-pack.ts line 25;
   DB check `difficulty in ('Easy','Hard','Hardest')` in migration 0010; "Easy" is retired by the loader). validatePack does not test
   the value, so the pack passes validation and then fails at insert. It also gives the bank a non-Hard 4-mark item, which the
   owner's no-easy rule forbids. Fix: set both back to "Hard" (and, if the item feels routine, make it harder rather than relabel it;
   e.g. 3.1(c) could ask where a borrowing slip would put the answer).

## Item notes
| Concept | Verdict | Notes |
|---|---|---|
| C7M-3.1 | HIGH (label) / LOW | Key right: 3 8/10 + 5 6/10 = 9 4/10; 12 3/10 - 9 4/10 = 2 9/10; 123 - 94 = 29 tenths; 1/10 m short of 3 m. Still routine arithmetic (LOW). Page pp. 50-51 right. |
| C7M-3.2 | OK (unchanged) | |
| C7M-3.3 (changed) | OK | Earlier MEDIUM RESOLVED. Leading-zero position removed; three positions: 30.7, 3.07, 3.70. Only 3.70 equals 3.7 (370 hundredths = 37 tenths). 30.7 - 3.7 = 27, 3.7 - 3.07 = 0.63. (d) uses exactly what p. 70 teaches (0.2 = 0.20 = 0.200; 0.02, 0.002 differ): 3.700 = 3.7, 3.007 not. Page now "p. 70" (file 025), correct. Steps match. |
| C7M-3.4 | OK (unchanged) | |
| C7M-3.5 | HIGH (label) / LOW | Key right: 0.85 + 1.2 + 0.64 = 2.69; 0.31 m = 31 cm = 310 mm; 4 cm short. Routine (LOW). Pages 64-66 right. |
| C7M-3.6, 3.7 | OK (unchanged) | Re-ran: 60.25 - 37.468 = 22.782; apprentice's 37.218 reproduces the digit-wise smaller-from-larger slip; 30.13 total, bound 28 < total < 31. |
| C7M-3.8 (changed) | OK | Earlier MEDIUM RESOLVED (new setting, page fixed). The overs setting is gone; now feet and inches: 5 ft 6 in = 5.5 ft; 2.5 ft = 2 ft 6 in, 1 in more than 2 ft 5 in; 5.6 > 5.5 so longer; 2 ft 5 in + 3 ft 7 in = 6 ft; 5.12 ft wrong (inches are twelfths). Inside scope and on p. 77 (door example, 1 ft = 12 in, file 032), page now correct. Not a repeat of existing pack items (grep). LOW: (b) restates the book's door story, (a)-(c) are light for "Hardest"; the (d) twist carries the item. |
| C7M-3.9 (changed: b only) | OK | Apply, Hard now matches the thinking: 0.45 per week; 14.15, 14.6, 15.05; week 7; week 6 (0.1 vs 0.35 vs 0.55). |

Checks: steps 4 x 1 = 4 everywhere; no option wording; no OUT line breached; tags claim_check 2, show_impossible 1; Bloom Apply 3 / Analyse 4 / Evaluate 2 (all fit la4 slot); difficulty Hard 5, Hardest 2, **Medium 2 (invalid)**. Not templated.

## Counts
HIGH 1 (invalid "Medium" difficulty on 3.1 and 3.5, one fix), MEDIUM 0, LOW 3 (3.1 and 3.5 routine, 3.8 light first parts).
Earlier MEDIUMs (3.3, 3.8) resolved. All keys correct.

Verdict: FAIL (only because of the invalid difficulty value; change "Medium" to "Hard" and it is a PASS)
