# Review v2: Class 9 Social Science, Part I ch 4 "Early Humans and Beginning of Civilisation" (iest104)

File: content/authoring/dps/class9s/ch04.json (8 concepts, 160 items, 20 per concept, 45 marks per concept, 360 in all). Chapter file not edited.

## Method
- All 34 textbook pages (iest104/pages/001-034) read; every fact checked against them. Scope from content/authoring/class9s/ch04.json.
- Every number recomputed in code before reading the author's answer: 12-7.5=4.5 and 12/4=3; 5000/250,000 m = 2 cm; 5000/3,000,000 = 0.167 per cent; 3.3-2 = 1.3 million; 300,000-125,000 = 175,000 and 1.3M/175,000 = 7.43; 40x45 min = 30 h, 15/40 = 37.5 per cent, 30/15 = 2 h; 2,000,000/12,000 = 166.7; microblade shares 7.7 and 90.0 per cent; 4,000,000/30,000 = 133 shelters, 47 closed; 60x240 = 14,400 (2,400 short, 10 families); 3x2400 = 7200 = 0.8 of 9000; 45 = 32+8+4+1; 1+2+4+8+16 = 31 < 40; tank volumes 800 and 4000 m3, 200 days, Rs 12,000 and Rs 12,500 per extra day; 12x70/50 = 16.8 and 12x40/20 = 24; 2334-2154 = 180, 2154-1700 = 454; 3 h = 10,800 s; 1792 vs 3200 = 1408; Cleopatra 69-18 = 51 BCE, 30th year 21 BCE, after her death; 1822-1799 = 23; 0.25x40 = 10, 30/0.25 = 120; digging 1800/360 = 5 and 1800/336 = 5.36 -> 6; 554, 790, 236; 45+30+60 = 135; 680+1600 = 2280. All numbers and keys are correct.
- Programmatic: every mcq/match/AR/multi_statement key text is option 0 and the answer text starts with it; no duplicate options; no positional references except the standard AR wording; rubric marks sum to item marks for every short/long answer; each concept has exactly 1 assertion_reason, 1 multi_statement, 1 rev=true and 8/4 short/long answers. The key is the longest option in 10 of 35 plain mcq (no length cue); in match/AR/multi_statement the key is longest by nature of the format.
- The loader --check was not run (needs .env); format not machine-verified.

## Counts
HIGH 1, MEDIUM 7, LOW 12.

## HIGH
1. C9S-4.8 [19] assertion_reason, Zhou kings: the key says "both true, R is not the explanation", but the file's own C9S-4.8 [2] mcq makes heaven's appointment the reason for dismissal ("he could be dismissed, since heaven's appointee must see his people prosper"). A student who reasons that a heaven-appointed king loses the mandate when his people suffer has a defensible second answer (R is the correct explanation). The chapter only says "appointees of heaven, but they could be dismissed when their people did not prosper". Fix: replace R with a clearly unrelated true fact (public officials examined in archery, horsemanship...), or drop the causal framing in [2].

## MEDIUM
1. C9S-4.2 [13] mcq: key reasons that Homo erectus "left Africa 1.3 million years after the first tools, so cannot be the first tool maker". The exit date does not show when erectus first existed or made tools; a species can exist long before it migrates. The chapter's real evidence is the Fig. 4.6 caption (erectus lived about 2 million years ago). The key option is still the only defensible one, but the stated logic is invalid. Same 1.3 million subtraction also appears in [7](a) and [9](b).
2. C9S-4.2 [16] case study: "In one afternoon the club makes 40 replica handaxes at about 45 minutes each" works out to 30 hours, which is impossible in an afternoon (and then "18 hours left in the term"). Stem contradicts its own arithmetic. Fix: say "over the term" or "across the club".
3. C9S-4.4 [5] case study: the granary holds 12,000 kg and the village cannot build another, yet option "ask ten families to grow more grain" has nowhere to store it. The decision is not a real trade-off as written; add spare storage or drop the grain option.
4. Repeated ideas inside concepts (same fact tested 3 to 4 times, adds little):
   - 4.1: share of 5000 in 3 million years in [6], [7], [8], [15]; the pre-writing versus post-writing table in [9], [12], [17], [19].
   - 4.2: the 3.3 versus 2 million gap in [7], [9], [13].
   - 4.3: climate warming at 12,000 years and the population explosion in [2], [9], [17], [19].
   - 4.4: date subtractions around Mehrgarh in [7], [9], [10](b), [17]; "not the same time everywhere" in [4], [6], [18].
   - 4.5: binary weights in [4], [5], [9], [14].
   - 4.6: Meluhha/Dilmun trade in [7], [8], [14]; Babylon's decline in [11], [15], [19].
   - 4.7: quarter-day drift in [9], [15], [20].
5. C9S-4.5 [20] short answer asks how "each" of two developments later appeared in the civilisation; the chapter says only that graffiti and seals were forerunners of the script and seals. Nothing is said about how the perimeter wall later appeared, so the question is unanswerable for that option.
6. C9S-4.6 [7] case study: Meluhha is "generally identified with the Sindhu-Sarasvati civilisation", not a present-day region as (a) asks. Also the decision turns on per-day value, which only matters if the merchant can repeat trips; the stem says she sails once this season. As written it is a pre-decided calculation.
7. Difficulty labels: every item is Hard (128) or Hardest (32); there are no Easy or Medium items, although many are plain recall (see LOW 1). This blunts the difficulty mix in blueprint and adaptive selection (same issue as ch03).

## LOW
1. Easy in disguise, labelled Apply/Hard: fill_blank 4.1 [6] (26 lakh = 2.6 million), 4.2 [17] (2-0.5), 4.3 [13] (50,000-12,000), 4.4 [17] (7000-2000), 4.6 [17] (3200-1792), 4.7 [17] (365 = 12x30+5), 4.8 [4] (1600-1046); 4.6 [9] (3x60x60); 4.7 [19] (goldsmith placement); 4.3 [10] (list three tool types); 4.6 [4] and 4.7 [14] (five-mark recall dumps labelled Analyse/Evaluate).
2. Easy "NOT" mcqs with one absurd option: 4.2 [2] (written accounts left by ancestors), 4.5 [11] (iron tools in Early Harappan), 4.6 [19] (great Euphrates flood), 4.7 [11] ("could not own property" is the exact opposite of the stem's own option), 4.8 [16].
3. Weak distractors in several mcq: 4.2 [13] options 2 and 3, 4.2 [11] options 2 and 4, 4.3 [7] option 2, 4.6 [14] options 2 to 4 (Meluhha as Egypt or Babylon), 4.8 [2] option 3.
4. Strawman claims that restate the chapter: 4.3 [9] (Ruchi, "Yes"), 4.7 [16] (Farid, "Yes"), 4.7 [3] (Cleopatra shows all women could rule), 4.1 [4] (Rohan).
5. 4.5 [3] multi_statement has all three statements true and copied from the text; no false statement to catch.
6. 4.1 [17] answer adds "writing only records what its writers chose to mention" and 4.8 [18] adds "not only by birth": reasonable inferences but not in the pages.
7. 4.6 [6] "Sumerians: who built Ur" slightly overstates "evolved into a city-based civilisation at Ur and several other cities".
8. 4.6 [10](b) "how much longer from 2154 BCE did the Assyrians last than the Akkadian" is ambiguous (454 years since 2154 versus 180 years of Akkadian); wording needs tidying.
9. 4.5 [17] and [10]: the Dholavira and Lothal water systems are in the sidebar on p.80 (Sumerian section), outside the p.74-77 scope range for the Early Harappan concept. Defensible, since the chapter ties them to the Early Harappan gabarbands.
10. 4.7 [7] (flood "every summer") and [8] (Inundation "autumn") draw on two statements that disagree inside the book (p.85 and p.85/86). Keys stand either way (winter is false), but a student can notice the clash; consider avoiding the season in one of them.
11. 4.7 [4] and [5] (ka belief, mummification) sit near the scope-out item "detailed religion and philosophy"; kept to what the chapter says, so acceptable.
12. 4.3 [12] answer uses the undefined label "cluster plan"; 4.8 [5] (c) every item can be dropped and fits, so the choice is not constrained.

## Checks passed
- Keys: all single-best; AR outcomes spread across all four types (explains 4.1, 4.2, 4.7 [10]; not-explains 4.3, 4.6, 4.8 [19] flagged above; A false/R true 4.4, 4.5), false statements in multi_statement spread across 1, 2, 3.
- Case studies compute exactly from stem data, bar the stem glitches in MEDIUM 2, 3, 6; most end in a real trade-off.
- Facts all from this book (pp 61-94); nothing from outside found beyond the LOW 6 inferences. Rosetta Stone, Papyrus Ebers, Sed festival, Kemet, gabarbands, Zhou officials, oracle bones, logographic script all match the pages.
- No positional option references; no scope violation against the scope-out list (Greek/Roman history, later Indian kingdoms and dating methods are absent).
- Reversal items present once per concept; exactly 20 approved items each, marks consistent.

## Verdict
Needs a small fix pass, not a rewrite: one HIGH (an AR whose key is contestable and contradicted by [2]) plus three stem or logic repairs (4.2 [13], 4.2 [16], 4.4 [5]). Everything else is repeated ideas and easy items under Hard labels.
