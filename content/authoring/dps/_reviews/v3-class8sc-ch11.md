# Review v3: class8sc ch11 "Keeping Time with the Skies" (SCI8, hecu111)

Re-review after one fix pass. File: content/authoring/dps/class8sc/ch11.json, 123 questions (21+20+20+21+20+21). Changed items found by text-diff against scratchpad/fix-class8sc-ch11/orig.json (about 70 changed, plus 11.6[13] and [19] option rewrites); all changed items read, dates and numbers recomputed in python/by hand, facts checked against pages 177-186. Indices 0-based within the concept. Structural checks run on all 123: o[0] equals the key, four distinct options, step marks sum to marks, no option named by position.

## v2 status
- HIGH 11.6[16] (satellite, 40 working satellites): FIXED. Stem now gives the deciding facts (busy band, open-ocean landing). Plan 2 is the only defensible choice; no escape clause. Steps 5 x 1 = 5.
- HIGH 11.6[18] (80% / 20%, district already has a boat service): FIXED. Job A only; Job C is covered by the existing service, Job B does nothing for floods. No escape clause. Steps 4 x 1 = 4.
- MEDIUM claim-checks 11.1[8], 11.4[5]: FIXED, key is "partly right" only, each claim has a clear verdict.
- MEDIUM 11.1[5](c): FIXED ("Only on this one day of the month is half of the Moon lit"; key rebuts correctly).
- MEDIUM 11.1[2]: FIXED. Lunar arithmetic: full Moons 5 Oct and 3 Nov (29 d) give new Moon about 19.5 Oct, last quarter about 12.4 Oct, first quarter about 27 Oct (not offered). Illuminated fraction by cosine model: 7 Oct about 0.95, 30 Oct about 0.83, 23 Oct about 0.10, so the ranking 7 > 30 > 23 is clear. Only 12 Oct is a half circle. (d) is now a genuine decision.
- MEDIUM 11.2[18](e): FIXED (6:45 p.m., 6:10 + 35 min; (b) now says sunrise of the morning after the moonrise). Recomputed: 7 x 50 = 350 min, 6:10 pm + 5 h 50 = 00:00; 29.5 x 50 = 1475 min = 24.6 h.
- MEDIUM 11.6[13] duplicate options: FIXED, four distinct options, one correct.
- Other v2 MEDIUMs (easy-in-disguise, repeated ideas): partly addressed, see M1 and M2.

## HIGH (1)

H1. C8SC-11.5 idx 2 (case study, sunrise rule, Imphal / Kolkata / Delhi / Ahmedabad). The stem sets the rule "the festival is held on the day on which the required lunar phase is in progress at sunrise" and also says the phase "is still in progress at sunrise on 3 November everywhere in India". Together these make the rule satisfied at sunrise on BOTH 2 and 3 November for Kolkata, Delhi and Ahmedabad, so the stem itself gives those cities two valid days. The key (b), (c) and (d) silently assume a "first sunrise on which the phase is in progress" rule that the stem never states (the book does not state it either). So (b) "in which city does the festival fall on 3 November instead of 2 November" and (d) "decide the date: 2 November" are not forced; a careful student can say 3 Nov is also valid for the other three, or that the date for the central location is 2 or 3 Nov. This is a second defensible answer on the last (decision) part. Smallest fix: change the rule to "the festival is held on the first sunrise at which the required phase is in progress" and drop the sentence "and is still in progress at sunrise on 3 November everywhere" (or replace with "the phase lasts less than a day, ending before sunrise on 3 November"). Then (b) Imphal, (c) Ahmedabad only, (d) 2 Nov all follow uniquely.

## MEDIUM (3)

M1. C8SC-11.6 still book-recall heavy. One-line book facts or name-to-purpose lookups: idx 0 (debris = dead satellite and rocket part), 1 (large stage reaches ground), 4 (Moon is a natural satellite), 5 (Bhuvan/AstroSat/communication statements), 7 (match mission to need), 8 (weather monitoring; Cartosat and Bhuvan), 10 (800 km not 8 km), 17 (weather monitoring), 19 (odd one out), and parts of 20. Cartosat/Bhuvan is asked in idx 2, 5, 8, 12, 16 context, 18 (six times). v2 asked to keep about four. Fix: replace idx 8, 17 and one of 1/5 with a step beyond the book (for example an orbit-count or distance comparison, or a "which of these two plans/jobs" item with a deciding fact in the stem).

M2. Easy-in-disguise items still present (answer is one book line, labelled Hard): C8SC-11.5 idx 0 (Holi vs Diwali night), 9 (sunrise earlier in the east, one fact), 17 (look just after sunset in the west), 19(c); C8SC-11.3 idx 18 ("6 hours", then why a leap day every four years), 19(iv) (shortest shadow = highest Sun), 4 and C8SC-11.4 idx 3 (single multiplication/subtraction fill_blanks, 1461 and 5); C8SC-11.1 idx 15(b). They are acceptable only if the bank tolerates a few 1-2 mark items; otherwise add a second step (a date, a count, a prediction).

M3. C8SC-11.5 idx 2 also needs "Imphal 5:38 a.m." style times flagged "illustrative" (the stem does flag them) but the 3 Nov premise that the phase lasts over 25 hours is outside what the chapter teaches; remove it as part of H1.

## LOW (5)

L1. C8SC-11.2 idx 18(e): the key predicts about 6:45 p.m. using the book's rounded 50 min/day. The real mean delay is about 48.8 min/day, giving about the same clock time as before. Key already accepts "between 6 and 7 p.m.", so only add "(the chapter's 50 minutes is rounded)" if you want to avoid teaching a false 35-minute drift.
L2. C8SC-11.3 idx 3 Statement 1 ("mean solar day is the time from one sunrise to the next"): the book defines it from highest Sun to highest Sun (shortest shadow); sunrise-to-sunrise is only approximately a day. Marked false on the book's definition, defensible, but safer as "from one sunset to the next sunset" replaced by a clearly false claim such as "from the shortest shadow of the year to the next shortest shadow".
L3. C8SC-11.6 idx 4 true_false: the key is "True"; add the common misconception ("only launched things are satellites") in the stem, or make the claim false (for example "the Moon is not a satellite because nobody launched it" and ask for correction).
L4. C8SC-11.6 idx 20 (d) asks why the chapter builds calendars on the Moon; the key is an opinion paraphrase, not stated in the book. Step mark is easy to award, but consider dropping part (d) or giving 1 mark for "natural, repeating, observable".
L5. C8SC-11.5 idx 11 (ii) step reads "about 18 to 19 days later" while the sample key says "about 19"; align the wording (29.5 - 11 = 18.5).

## Checks run, with counts
- Keys: all 123 recomputed or fact-checked; no wrong key. Single defensible answer everywhere except H1.
- Scope: nothing beyond the book (steering a satellite down is supplied by the 11.6[16] stem). No unsafe task (no looking at the Sun or an eclipse; 11.2 daytime Moon is fine).
- Options: all mcq/ms/ar o[0] = key; correct option longest in 5 of 15 mcq (11.1 2/5, 11.2 0/4, 11.3 1/4, 11.4 2/4, 11.5 0/3, 11.6 0/4): no length tell.
- multi_statement (three statements) keys: 1&3 x3, 2&3, 1 only, 2 only, 1,2,3: no spread problem.
- assertion_reason keys: both-true-explains 2, both-true-not-explains 2, A false R true 2, A true R false 1: spread ok.
- claim_check verdicts: partly right 2, right 2, wrong 4 across chapter: mixed.
- Slot order differs across concepts; no identical order. Repeated ideas now at most about 3 per concept, except Cartosat/Bhuvan (M1).
- Step marks sum to marks for every item; case-study parts mostly climb; last parts are decisions in 11.1[2], 11.5[2] (broken by H1), 11.6[16], 11.6[18].

## Verdicts per concept
- C8SC-11.1: pass.
- C8SC-11.2: pass (L1).
- C8SC-11.3: pass (M2, L2).
- C8SC-11.4: pass (M2).
- C8SC-11.5: fix idx 2 first (H1), then pass.
- C8SC-11.6: pass after fixes for variety (M1); both v2 HIGHs resolved.

Counts: 123 read; HIGH 1, MEDIUM 3, LOW 5.

Overall verdict: NOT load-ready until H1 (11.5 idx 2) is fixed; this is a two-line stem edit. The v2 HIGHs are resolved. After H1, load-ready (M1 and M2 are quality notes, not blockers if the owner accepts them).
