# v3 re-review: content/authoring/dps/class8/p2ch03.json (MATH8, Ganita Prakash Gr 8 Part II ch3, hegp203)

Index = concept index.question index (0-based, as in v2). 127 questions; 49 changed items diffed against orig.json and all 49 recomputed (every part of every case study, every option set). Scope read from content/authoring/class8/p2ch03.json (scope_in / scope_out).

## v2 status
- 3.13 order: FIXED. Stem now fixes the order (first, second, two halves of the third); 20:30:20:20 = 2:3:2:2 only.
- 2.16 and 2.19: FIXED. 2.16 states cardamom was guessed (factor 1.5, B should use 1.5, 0.5 too much). 2.19 states salt is the trusted scale; Batch 2 breaks it; (d) now makes the "which entry is trusted" point explicit. One reading each.
- 1.18(e): FIXED. Now a second-map RF conversion (240 km = 9.6 cm) plus "road distance unchanged"; no shortest-path claim anywhere. (d) says the road bends, which is plain reasoning, no unsupported theorem.
- Other v2 MEDIUMs (1.4, 2.4, 0.12, 3.20(c), 4.20(d), 4.16(a), 5.0, 5.1, 5.6, 5.7, 5.9, 3.18, 3.7, 0.15 setting) all addressed and recomputed correct.

## HIGH
1. **5.18 (C8M-3.6) part (c), scope_out violation.** "hose A is blocked for the first 5 minutes while hose B runs; then both run." scope_out line: "Combined work-rate problems with three or more agents, staggered start times, or partially completed work left for another agent" (every book example has the two agents working the whole time together). The arithmetic is right (150 L, then 450 L at 50 L/min = 9 min, 14 in all) but the item is out of scope. Fix: replace (c) with an in-scope step (e.g. "a third hose is not allowed; if hose B alone delivered half its rate how long would A and B take together": 600/35 min), or merge (c) into (b) and make the item 4 marks with a 4-line scheme (adjust the 5 steps).

No wrong key, no second defensible answer, no option-value clash found in any of the 49 changed items.

## MEDIUM
1. **1.11 (C8M-3.2) parts (d) and (e)**: "A ruler reading can be off by 1 mm ... which map is most trustworthy." Measurement precision and ruler error are not in scope_in (only RF conversion; scope_out excludes measuring with a ruler), and the chapter never discusses reading error. Arithmetic is right (2.5 km, 10 km, 6 km). Fix: reframe (d)/(e) as "map distance is rounded to the nearest whole cm: which map loses least km" (still pure RF conversion), or replace with a reverse conversion.
2. **5.14 (C8M-3.6) food-provisions MCQ with a mid-way change** ("after 4 days, 30 students go home"): key 25 days is right (150 x 20 / 120) and the distractor 30 is a real slip. It sits close to the scope_out "partially completed ... left for another agent" idea (partly consumed stock). Book Example 5 only has a change at the start. Acceptable if the owner reads provisions as in scope; otherwise start the change at day 0 with new numbers.

## LOW
1. 5.7(c): P starting at 4:30 finishes exactly at the 8:30 deadline (zero margin); the answer depends on "by" being inclusive. Make the early start 4:15 or the deadline 8:45 so both options clearly meet it. (Also the choice is decided by the two costs given, not the maths.)
2. 5.11(c): "full before those 3 hours are over" with a fill time of exactly 3 h: key is No, but a reader can say "just manages". Reword "at least 15 minutes before the function starts" (then 3 h fails clearly).
3. 4.8 (AR): both statements are the book's one-line pie-chart rule (15% = 54 deg, 3.6 per 1%) and R plainly explains A; recall level. v2 LOW not acted on; make A a slip case (percentage used as degrees) with R true but not explaining.
4. 2.7 stem typo: "600 g of ghee, He had already added" should be a full stop.
5. 0.7, 0.9, 0.18, 1.6, 3.7, 3.20(a) remain single-step scale items (1 mark); acceptable but they are near recall for a bank with no easy slots.
6. 5.6(d) "state one assumption": answer is open; mark scheme should list accepted answers (same rate for all machines, same hours per day).
7. 1.11(e) stem hands over that Qasim's reading was a slip, partly answering (b); drop that sentence.

## Counts and template checks (whole file)
- Types: short_answer 50, mcq 27, long_answer 26, multi_statement 6, fill_blank 6, match 6, assertion_reason 6.
- multi_statement keys: 1&3, 2&3, 1&2, 2, 1, 3 (six different; 5.5 is now 3 only, with a false statement 1 and 2). Three-statement format used (DPS standard).
- assertion_reason keys: all four outcomes (A false/R true 1, both true+explains 2, both true no-explain 2, A true/R false 1).
- claim_check: Yes 2, partly right 2, No 2. true_false: False 3, True 3 (5.20 True now probes the "subtract the machines" slip).
- All mcq/match/ar/ms items: correct answer at o[0], 4 distinct options, no option equal in value to the key; correct option is the longest in 0 changed items. No option named by position. Step marks equal marks in every long item (checked in code).
- Not templated: slot orders differ across concepts; repetition clusters in v2 reduced (cement register gone from 0.15, 2.19 now a dye mix, triangle items cut).

## Verdict per concept
- C8M-3.1: keys all right; load-ready.
- C8M-3.2: keys right; load-ready after MEDIUM 1 (or accept).
- C8M-3.3: keys right; load-ready.
- C8M-3.4: keys right; load-ready.
- C8M-3.5: keys right; load-ready.
- C8M-3.6: keys right; NOT load-ready until HIGH 1 (5.18(c) scope_out) is replaced.

Counts read: 49 changed items (127 in file). HIGH 1, MEDIUM 2, LOW 7.

**Verdict: not load-ready** (one scope_out HIGH in 5.18(c); fix and recheck that item only, then load-ready).
