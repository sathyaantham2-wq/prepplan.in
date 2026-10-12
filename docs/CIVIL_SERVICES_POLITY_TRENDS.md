# UPSC Prelims Polity - how the questions changed (1995-2026)

Computed 2026-10-09 from `content/authoring/civil/polity/polity-tagged.json` (494 items; 2 duplicates and
15 out-of-scope items excluded = 477 counted). Tags were written by AI taggers reading Laxmikanth 8e, then
counted by script; they are NOT yet independently reviewed, so treat single percentages as +-5 points.
Caveat on volume: the set mixes UnlockIAS (polity-tagged) with a 2013-2023 list that also holds governance
items, so 2013-2019 shows 19.6/yr against Laxmikanth's own table (about 15/yr, 2011-2025 range 6-22).
Use the SHAPE of the change, not the absolute counts per year.

| | 1995-2004 | 2005-2012 | 2013-2019 | 2020-2026 |
|---|---|---|---|---|
| items per year (this set) | 13.1 | 11.6 | 19.6 | 16.6 |
| "adjacent" (governance/schemes) share | 12% | 18% | 34% | 29% |
| direct (one-line) | 63% | 40% | 45% | 26% |
| "consider the statements - which are correct" | 19% | 40% | 48% | 48% |
| "how many statements are correct" | 6% | 15% | 4% | 12% |
| Statement-I / Statement-II | 1% | 0% | 0% | 6% |
| case study | 0% | 0% | 0% | 3% |
| average statements per question | 0.9 | 1.6 | 1.6 | 2.1 |
| source: static text | 75% | 59% | 54% | 49% |
| source: current affairs | 3% | 7% | 26% | 12% |
| source: amendment acts | 7% | 15% | 8% | 9% |
| source: judgements | 0% | 2% | 5% | 6% |
| skill: pure recall | 64% | 55% | 49% | 42% |
| skill: two-step reasoning | 16% | 33% | 27% | 36% |

## What the numbers say
1. **The one-line question is dying.** From about two in three to about one in four. The modern question
   hands you 2-4 statements and a combination key, and rewards the student who can reject one wrong
   statement quickly (elimination), not the one who knows a fact.
2. **Format keeps inventing.** Statement-I/II appears only after 2020; "how many are correct" returns
   in 2020+ because it removes the elimination shortcut. A bank frozen on one format goes stale.
3. **Current affairs spiked 2013-19 (26%) and cooled to 12%**, while "other" source (mostly concepts and
   governance practice) grew to 19%. Judgements rose slowly (0 -> 6%).
4. **Traps are consistent:** negation ("not correct"), close numbers (terms, ages, majorities), "only",
   and from 2020 "exception". These can be authored deliberately.
5. **Chapter weight (Laxmikanth chapters):** Parliament (ch23) leads in every era (16/9/10/11 items);
   Fundamental Rights (ch8) rises in 2020+; Panchayati Raj (ch39), Union & Territory (ch6) and Centre-State
   (ch15) are strong early and fade. 39-46 items per era are `null` (not in Laxmikanth: schemes,
   committees, current affairs) - 36% of the set overall.

## Quality flags carried forward (see `ISSUES.md`)
- 23 items where a tagger disagrees with the stored key or could not settle it. No key was changed.
- Several keys were correct for the exam year but are outdated now (NHRC chair, number of High Courts,
  consumer forum limits, Election Commissioners' term). They count for trends, not for practice.
- 3 broken stems need recovery from the source PDF (2011-208, 2003-097, 2003-112).
- Laxmikanth 8e prints previous papers with official keys (ch95, pdf pages about 1095-1135): the best
  tiebreaker for the above.
