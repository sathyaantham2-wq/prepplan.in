# Review v2: class8sc ch11 "Keeping Time with the Skies" (SCI8, hecu111)

Reviewer pass 1 (independent). File read: content/authoring/dps/class8sc/ch11.json. All 125 questions read
(21 + 20 + 20 + 22 + 21 + 21), no sampling. Every number recomputed in python or by hand against
pages 170-189. Indices are 0-based within the concept.

Verdict: NOT load-ready as it stands. Pass after fixes (2 HIGH, 9 MEDIUM, 8 LOW). Every key is
factually correct and astronomically sound, correct option is at o[0] throughout, step marks sum to
marks in every item, no unsafe task (no looking at the Sun). The problems are decisions that accept
either answer, and a large block of items that are recall in disguise.

## HIGH

1. C8SC-11.6 idx 16 (long_answer, 5 marks, Plan 1 / Plan 2 satellite): part (e) "Recommend one plan" and the key says
   "Either plan is accepted if argued from the data". This is an either-is-fine decision, and the
   stem gives no data to break the tie (the book gives none). Fix: give a deciding fact in the stem (for example,
   "the satellite is above a busy orbit lane used by 40 working satellites and the only landing zone is open
   ocean") so that one plan is clearly better, then key that plan.
2. C8SC-11.6 idx 18 (case study, Job A/B/C): key (d) ends "A student who chooses Job C ... may earn the mark".
   The data (60% against 40%) was meant to settle it, but the key then admits the other side, so the decision
   is a free choice. Fix: make the numbers decisive and remove the escape clause (for example 80% / 20%, or add that only
   one satellite can be launched this year and Job C duplicates an existing service).

## MEDIUM

3. C8SC-11.1 idx 8 (claim_check, "science-club notice"): key "Partly right (a verdict of 'wrong' is also accepted ...)".
   Two verdicts accepted. Fix: key "partly right" only and make the stem's two halves unambiguous.
4. C8SC-11.4 idx 5 (claim_check, "extra month every year"): same defect, "partly right (or wrong with the reason kept)".
   Fix: key "partly right" only.
5. C8SC-11.1 idx 5 (long_answer, three observers P, Q, R): part (c) "Moon is half lit only on this one day". Ambiguous.
   A half circle is seen twice a month (waxing and waning), which is also a defensible rebuttal. The key
   gives only "half the Moon is always lit". Fix: reword to "the Moon is lit only on one half on only one day"
   or say "half of the Moon is lit only on this one day of the month".
6. C8SC-11.1 idx 2 (case study, five dates): (d) ranks 8 Oct (3 days after full) above 30 Oct (about 4.5 days before the next full).
   That is a near tie and rests on 29.5 days, which the stem does not give. Also the last part is a ranking, not a decision.
   Fix: use dates that are clearly apart (for example 7 Oct and 31 Oct) or ask for two groups
   ("more than half" / "half or less"), and end on a real decision.
7. C8SC-11.2 idx 18 (long_answer, Nagpur moonrise): key (e) "around 6 p.m." but the student's own (c) gives 24.6 h of delay,
   which puts moonrise at about 6:45 p.m. Also (b) "the next morning" is ambiguous (which morning after day 7).
   Fix: key (e) "about 6 to 7 p.m., near sunset again" and reword (b) "at sunrise on that same seventh day's morning".
8. C8SC-11.6 (whole concept) is mostly book-recall disguised as higher-order. Idx 0, 1, 4, 5, 6, 7, 9, 10, 12, 13, 15, 17, 19, 20
   each have an answer that is a single book line or a name-to-purpose lookup (debris types; InspireSat-1; "some moving
   points of light are satellites"; Mangalyaan to Mars; AstroSat/Bhuvan/Cartosat matches). Idx 20 is five one-line lookups
   for 5 marks labelled Hardest. The mission-to-purpose mapping appears in idx 2, 5, 7, 13, 18 and 20 (6 times).
   Fix: keep about 4, replace the rest with items that need a step beyond the book (a numeric orbit comparison, a priority
   decision with a deciding fact, a "which of these cannot be done by a satellite and why" item).
9. C8SC-11.2 idx 15, idx 13 (partly), C8SC-11.3 idx 18, C8SC-11.4 idx 15, 17, 21, C8SC-11.5 idx 0, 7, 9, 18, 19, 20 are easy in disguise:
   each answer is one or two lines stated in the book (eclipse only on full/new Moon; month = Moon around Earth and year = Earth
   around Sun; Calendar Reform Committee and 1956 date; Gregorian months add to 365; INC is solar; Diwali on new Moon; Eid in any month;
   Bihu is solar sidereal; Uttarayan and solstice dates; Eid needs sighting). Several carry 3 to 5 marks and Hard/Hardest labels.
   Fix: for each, add a calculation, a prediction or a decision (as C8SC-11.5 idx 10 and 15 already do) or swap for a stronger item.
10. Repeated ideas (more than twice in one concept).
    - C8SC-11.2: "eclipse only on a full/new Moon" in idx 0, 4, 15, 16; "waxing seen at sunset, waning at sunrise" in idx 1, 2, 3, 7, 8, 14, 17.
    - C8SC-11.3: the shadow-record duration arithmetic (idx 2, 4, 5, 8, 9, 14); "day from rotation, month from the Moon, year from
      the Sun" (idx 0, 3, 5, 6, 10, 18, 19).
    - C8SC-11.4: calendar drift arithmetic (idx 9, 11, 13, 20) and the 20-minute year difference (idx 14, 18).
    - C8SC-11.5: Eid/lunar 11-day drift (idx 3, 5, 7, 10, 11, 15, 18, 20) and Holi/Diwali luni-solar (idx 3, 7, 14, 16).
    - C8SC-11.1: "gibbous waning against waxing" (idx 2c, 12, 14, 15).
    Fix: cut each to at most 2 and use the freed slots for the missing ideas (C8SC-11.1: Shukla/Krishna Paksha timing; C8SC-11.3: the
    leap-year bridge; C8SC-11.5: Pongal/Uttarayan link; C8SC-11.6: orbit height and period comparison).
11. Option quality C8SC-11.6 idx 13: options 3 and 4 ("AstroSat and Cartosat" and "AstroSat and the Cartosat series") mean the same thing,
    so only three real options. Idx 19 (reverse mcq): the odd one ("lighting up the night sky the way the full Moon does")
    is a strawman that nobody would choose. Fix: replace one option in idx 13 with a different pair (for example "Aditya L1 and Bhuvan");
    make idx 19's odd one a plausible job such as "predicting when the Moon will be full".

## LOW

12. C8SC-11.2 idx 2 (true_false) and C8SC-11.4 idx 7 and C8SC-11.6 idx 4: the verdict is "True" and the item is a plain restatement of the
    book, not a misconception. The standard wants a real misconception with a reason or a correction; make at least one a "False"
    with a plausible error. (idx 4 of 11.6 is almost a free point.)
13. C8SC-11.3 idx 14 (mcq): option "The small changes come from the Earth's revolution around the Sun" is arguably true in real
    astronomy (the day-length variation does depend on the orbit). It does not answer "why the chapter still says 24 hours", so the key
    stays unique, but replace with a clearly wrong reason ("leap years remove the extra minutes").
14. C8SC-11.3 idx 9 (reverse): the stem lists 24:01, 24:00, 23:59 without saying they are in order; the key assumes order.
    Add "in this order".
15. C8SC-11.3 idx 19 (iv): "any other length occurs twice a day" goes slightly beyond the book. Acceptable, but add "morning and
    afternoon" to the stem or trim the key.
16. C8SC-11.3 idx 11 (reverse mcq): the claim that a lunar eclipse "does not repeat in a regular cycle that can be used to keep time" is
    not stated in the book (it says eclipses are rare and brief). Reword to "rare and brief, not once every month".
17. C8SC-11.4 idx 15: "In 1950 two neighbouring towns would have celebrated the start of the year on different days" is an invented
    premise (the book only says many calendars were in use). Reword to "many different calendars were in use".
18. C8SC-11.5 idx 2 (case study): part (a) is solvable from the stem alone (compare 5:38 with 5:45) and (c) restates the stem. Only (b)
    and (d) need the chapter. Move one real chapter step into (a) or (c).
19. C8SC-11.6 idx 2 (case study): (c) "Which mission studies the Earth's natural satellite" is answerable from Row 1 of the stem.
    C8SC-11.6 idx 20 (i) could also be answered "Bhuvan"; add "the mission series" to the wording.

## Template and structure counts

- Slot order is NOT identical across concepts (sequence strings differ in every concept). Not a template at the slot level.
- Types per concept: each has mcq 4-5, multi_statement 1 (C8SC-11.3 has 2), assertion_reason 1 (C8SC-11.5 has 2), match 1 (C8SC-11.3 has none),
  fill_blank 1-2, long_answer 4-5, short_answer 7-8. Every concept carries 2 five-mark and 2 case-study items; minimums met.
- C8SC-11.3 has no match item; the loader floor is chapter-level so this is fine, but check the chapter total (5 of 6 concepts have one).
- multi_statement keys (7 items): "1 and 3 only", "1 only" (x2), "2 and 3 only", "1, 2 and 3", "2 only", "1 and 2 only". Well spread.
  The keyed false statements move across 1, 2, 3. No "mostly 1 and 2 only".
- assertion_reason keys (7 items): explains x2, not-explains x2, A-false x2, R-false x1. Good mix. But C8SC-11.1 idx 13 (answer
  "both true, R explains") and C8SC-11.5 idx 18 are verbatim restatements of one book sentence.
- claim_check verdicts (6): partly right x2 (both also accept "wrong"), right x2, wrong x2. Mix is fine; only the "either verdict" wording is a defect.
- Correct-option-is-longest rate: 5 of 22 mcq are tied or longest, and all 5 are ties (single-character or equal-length options). Not a tell.
- Bloom/difficulty: nothing at Remember, nothing labelled Easy. The labels are honest only where noted above; the recall-in-disguise items
  are under findings 8 and 9. About 35 of 125 items (28%) are recall-level in substance.
- No option is named by position ("option (b)") anywhere. The only letter references are figure positions (P, Q, R...) in C8SC-11.1 idx 6,
  which are part of the stem's diagram, not the shuffled options.
- Fill_blank (6): 2, half, 1439, 7, 9, 432, 15 all take one number or word, all application, all matchable. C8SC-11.1 idx 4 answer "2" and
  C8SC-11.4 idx 3 answer "7" are close to a one-line lookup (low).

## Premises the task asked to verify

- Waxing crescent low in the west at sunset: C8SC-11.2 idx 14 states "a crescent always appears close to the Sun" and "just after sunset", so
  the premise is in the stem. Acceptable.
- Full Moon rising near sunset: C8SC-11.2 idx 18 supplies "rose at 6:10 p.m., close to sunset"; idx 19 does not rely on it. Acceptable.
- Earth's shadow points away from the Sun: stated in the stem of C8SC-11.1 idx 11. Acceptable.
- Crescent close to the Sun: stated in the stem for C8SC-11.2 idx 14; for C8SC-11.2 idx 4 the key relies on it without the stem stating it
  (it is a chapter statement, so fine). The "full Moon lies opposite the Sun at sunrise" rule is chapter text.
- Astronomy checked: waning half Moon overhead at sunrise (waxing half is not); observers Q and R view of the half Moon (C8SC-11.1 idx 5);
  figure ordering P to W (U is the waxing crescent); Day 1 to Day 26 positions; Eid and Diwali date arithmetic; INC month starts for
  2025 and 2028; 1 Chaitra 1950 Saka = 21 March 2028; full-Moon date gaps (325 days / 11 = 29.5); Gregorian 97 leap years in 400 (365.2425);
  all correct.

## Per-concept verdict

- C8SC-11.1 (21 Qs): keys correct. Fix #3, #5, #6, and repeat of gibbous items. Pass after fixes.
- C8SC-11.2 (20 Qs): keys correct. Fix #7, strengthen idx 15, cut repeated eclipse and sunrise/sunset items. Pass after fixes.
- C8SC-11.3 (20 Qs): keys correct. Over-reliance on the shadow table (6 items) and day/month/year source (7). Pass after fixes.
- C8SC-11.4 (22 Qs): keys correct. Fix #4, easy items (idx 15, 17, 21), repeated drift arithmetic. Pass after fixes.
- C8SC-11.5 (21 Qs): keys correct. Several recall items (idx 0, 7, 9, 18, 19, 20) and repeated Eid drift. Pass after fixes.
- C8SC-11.6 (21 Qs): keys correct but HIGH #1 and #2, option duplicates, and heavy recall. Rework the weakest eight items.

## Counts

Read 125 of 125. HIGH 2, MEDIUM 9 (findings 3 to 11), LOW 8 (findings 12 to 19). Wrong keys 0. Arithmetic or fact errors 0.
Templated: not at slot or sentence-frame level; yes at idea level in the repeated-ideas finding (#10).
Overall: pass after fixes. Not load-ready until the two HIGH items are fixed and the recall items are strengthened.
