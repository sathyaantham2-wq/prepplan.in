# Review v2: DPS bank, CBSE Class 7 Science ch 2 (Exploring Substances), gecu102

File: content/authoring/dps/class7sc/ch02.json. Read all 107 questions (22+22+21+21+21), no sampling. Every key was decided from textbook pages 001-016 before reading the key; all numbers recomputed in python; every case-study part done in order. Compared with the backup (content/authoring/dps-v1-backup-2026-10-08/class7sc/ch02.json, also 107 items) and with the older review class7sc-ch02.md.

## Counts read
- Types: short_answer 43, mcq 23, long_answer 20 (10 are 4-mark case studies, tagged case_study), assertion_reason 6, multi_statement 5, match 5, fill_blank 5, true_false 5 (tagged, inside short_answer). Marks per concept 49/49/46/47/46.
- Bloom: Apply 42, Analyse 40, Evaluate 14, Understand 6 (5.6%), Create 5; no Remember. Analyse+Evaluate+Create = 59/107 = 55%. Labels Hard 87, Hardest 20, no Easy. Loader floors met.
- Step marks equal `m` for every item with steps (0 mismatches). No answer or step names an option by position (0 hits).
- TEXT-IDENTICAL TO THE BACKUP: 64 of 107 (14+12+12+14+12). All 64 are identical in every field (label, marks, key, options, steps), so no relabelling happened; they were simply kept. 2.1 #7 is a 65th near-identical (only "lime fruit juice" changed to "lemon juice"; the fix the owner mentioned). 43 items are new or rewritten (the backup's 10 mcq/Remember, 10 mcq/Understand, 8+5 short Understand/Remember, 4 match/Remember, etc. were replaced).
- Of the 64 kept items, 31 are on the EASY LIST below, so the rewrite kept the easiest old items and replaced mostly the loader-flagged ones. 18 of the 43 new items are also on the EASY LIST.

## HIGH (wrong key, second defensible answer, fact or arithmetic error)
None found. Every key matches the book and my recomputation (31-28=3; 34-29=5; 12-5=7 strips; 2 mL = 40 drops, 40-35=5; 30 x 2.5 = 75; 3 x 24 = 72, 100-72 = 28). No MCQ, match or statement item has a second defensible answer (checked every option set). The olfactory block that was HIGH in the older review is now handled safely: 2.3 #7 and #18 state only the book's definition and hedge ("if the odour changes in an acid or a base"); no item claims the onion result (smell vanishes/stays) as a book fact. Note the scope file's `rule` for C7SC-2.3 still states that result (the book does not, p.16); the author should delete that sentence from the scope file so no later pass reintroduces it.

## MEDIUM

1. EASY-IN-DISGUISE (the main defect): 49 of 107 items (46%) have an answer that is one book line or a one-step lookup of Table 2.2, the red-rose rule, the turmeric rule or the equation, whatever the Bloom label. The full list is the EASY LIST at the end; a further 32 are borderline (two chained lookups; listed separately). The author's relabelling to Apply/Analyse did not change the thinking. Typical forms: "predict the colour of sample X with indicator Y" (2.1 #21, 2.2 #12, 2.3 #4/#11/#21, 2.4 #1/#19); "differentiate/state" (2.1 #20, 2.2 #9, 2.3 #5, 2.5 #8); statement/AR items whose statements are verbatim book sentences (2.4 #13, all-true; 2.5 #1/#14); 5-mark items that are the book's activity or sections restated (2.2 #17/#20, 2.3 #7, 2.4 #3/#6, 2.5 #9). Fix: give the data in a new form and ask for the consequence (an unknown to deduce from two or three observations, a quantity to compute with a chapter rule, a plan that must survive a constraint), as the stronger items already do (2.1 #2, 2.3 #20, 2.4 #8/#10, 2.5 #5/#19).
2. Fill_blank items that need no chapter: 2.4 #7 ("29 to 34 degrees C ... raised by ___": answer 5, a bare subtraction) and 2.5 #10 ("Rs 30 per kg ... 2.5 kg ... Rs ___": 75, a bare multiplication; the chapter fact is given in the stem). Standard s12: must be "a computed value, a reasoned term, a rule applied". Fix: make the number depend on a rule, for example "Lime costs Rs 30 per kg. Plot P (blue litmus red) and plot Q (red litmus blue) each need 2.5 kg of the right treatment; lime is bought only for the plot that needs it: Rs ___" or "After 4 drops of lime water the litmus is red; each drop is 0.05 mL; the acid needs 35 drops ... ___ mL".
3. Strawman or obvious last parts of case studies: 2.5 #7 (d) "The engineer wants to use the batch 3 dose to be safe. Which batch dose should the factory adopt?" (the engineer's reason is absurd; (a)-(c) already say batch 2 is neutral). 2.4 #4 (d) "She wants a neutral liquid for disposal. Which beaker?" (the stem states beaker 1 leaves both papers unchanged). 2.2 #16 (d) offers "blue litmus alone" vs the extract, and the key is that blue litmus alone cannot separate basic from neutral, which (b)-(c) already show. 2.3 #1 (d) "is the plan sufficient?" is yes by a margin of 7 against 20 strips with no cost on the other side. 2.2 #17 (5 marks) "justify whether the school can use red rose extract" has the book's own answer ("another acid-base indicator"). Fix: for each, give the decision two real costs (two treatments at different Rs and speed; two indicators each failing on a different sample; a limited number of strips so the plan is NOT enough).
4. Case-study parts that are answered in the stem or one line: 2.1 #3 (a), (b), (c) are one-line lookups (only (d) is thinking); 2.4 #4 (a) the 3 degrees is the stem difference, (b) the stem says both papers unchanged; 2.4 #12 (a)-(c) are three one-line book facts; 2.5 #21 (a)-(b) are lookups, and (d) "check for nutrient deficiency" is the book line but its Rs 28 has no price to act on. Parts should climb; make (b)/(c) need a combination of two chapter rules.
5. Repeated ideas inside a concept (anti-template rule, about two uses per idea): 2.2 hydrangea in 9 of 22 items (#1, #2, #5, #11 stmt 3, #13, #14 match, #18, #21, #22 R); 2.4 lemon juice + lime water Activity 2.7 in 13 of 21 and the heat/temperature idea in about 5 (#2, #4, #7, #12, #14); 2.5 "neutral soil but weak plants" in 6 of 21 (#4 stmt 3, #5 Farmer Z, #11 row 3, #13, #15, #21) and the red-ant vinegar-versus-baking-soda idea twice (#3 and #18); 2.1 karela/bitter in 4 (#8, #13, #15, #19) and slippery in 5; 2.3 onion/olfactory in 5. Fix: cut each to two and use the freed slots for the untouched ideas (lichen/litmus source beyond one item, turmeric preparation, rose-extract preparation, formic acid beyond one item, soil nature to remedy chains with numbers).
6. 2.3 #14 (a): the key says "the change in odour shows the medium is basic". An odour change by itself shows only that onion is an olfactory indicator; an olfactory indicator changes odour in acidic OR basic media (book, p.16). That it is basic comes from baking soda being a base (2.1), not from the change. Fix the key: "Onion works as an olfactory indicator (its odour changes in an acidic or basic medium); baking soda solution is a base" and drop "the change ... shows the medium is basic".
7. Assertion-reason key spread is templated: 5 of 6 are keyed "both true, R does not explain A" (2.1 #5, 2.2 #22, 2.3 #15, 2.4 #9, 2.5 #1); only 2.5 #14 is "R explains A". No item has A true/R false or A false/R true, so the student learns "R is the irrelevant true fact". In the five, R is an unrelated book sentence (ginger family, calcium hydroxide, lime is a base, hydrangea blue), so the item is solved by noticing R is off-topic, which is the "R almost restates / is off-topic" weakness. Fix: make three of them R-explains, one A-true/R-false (for example R: "Turmeric paper turns red in acids"), one A-false/R-true; give R a real explanatory link.
8. multi_statement 2.4 #13 has no false statement (key "1, 2 and 3", all three are verbatim book sentences, the answer says "taken from the chapter"). It tests no misconception and a student can tick all. Rewrite with one statement carrying a one-word error (for example "neutral solution turns red litmus blue", "heat is absorbed"). The key spread otherwise is good (2 and 3 only; 1 and 3 only; 1 only; 1, 2 and 3; 1 and 2 only) and the false statement is not always the same position (statement 1 in 2.1, 2 in 2.2, 2/3 in 2.3, none in 2.4, 3 in 2.5), so only 2.4 is a problem.
9. true_false: verdict mix 2 False (2.1 #16, 2.3 #8), 3 True (2.2 #7, 2.4 #2, 2.5 #13) = 40% False, inside the 25 to 75% band. But the three True items have no misconception to catch and the reason is one book sentence (2.2 #7 extract-red and litmus-red sets match; 2.4 #2 heat released; 2.5 #13 neutral soil, weak plants, which is the book's own sentence). The False ones are good (2.1 #16 is a real chapter slip; 2.3 #8 is a real confusion but its correction is the bare definition of olfactory indicator). Fix: make one True item a counter-intuitive one (for example "A solution that turns neither litmus paper red nor blue may still taste sour"? is NOT in the book, so avoid; use "Turmeric paper that stays yellow in a liquid does not prove the liquid is acidic": True) and add a False that needs a two-step correction.
10. Per-item mark value: several 1-mark MCQs with a "scenario" tag are lookups (2.1 #1, #14 lichen, #21; 2.3 #4, #11; 2.4 #1, #11, #16; 2.5 #6, #15). The 8+ one-mark floor is met by items that mostly test a single fact. Replace at least half with a "two observations, one conclusion" or "which test result would NOT be possible" form.

## LOW

11. 2.1 #13 (match): row 4 "The liquid tastes bitter but both papers stay as they were" can be matched to "Neutral, like salt solution" as well as to the karela note; the intended pairing (4-d) is only unique because the three other rows are taken. State "(Column II item d is used once)" or change row 4 to "The juice of karela tastes bitter".
12. 2.1 #18 (fill_blank): answer "acidic"; a student may type "acid", which a machine will reject. Prefer "The liquid turns red litmus blue ... is ___ in nature" with a one-word key, or add "acid" as an accepted variant if the loader allows aliases. Also only the blue-litmus fact is needed (the other two observations are redundant).
13. 2.2 #10: "The two are mixed in a third tube. State ... the colours the extract could show in the mixture." Say "with a few drops of red rose extract in the third tube" so the extract is present.
14. 2.4 #10 (b): "Name the two substances and the form of energy that are formed or released along with each other" is garbled; reword "Name the two substances formed and the form of energy released."
15. 2.4 #1: the book only asks "Can you predict why there is a change in colour?" for the extra drop; the key "turns red again" is a reasonable inference but not a book statement. Acceptable as is; keep the "only just turned blue" wording.
16. 2.2 #2 and 2.2 #21 (b): "make the soil basic by adding lime" for pink hydrangeas is an inference from "lime is a base" plus the hydrangea fact; the book only asks "Can gardeners alter the colour?". Acceptable; the key text "to neutralise the acid and make the soil less acidic" in 2.2 #21 (b) does not reach pink (needs excess); say "make it basic".
17. 2.3 #2: spraying red rose extract (itself red) over a sheet in the Anaya case would colour the whole sheet; the "moon does not appear if neutral" reading is idealised. Acceptable at Class 7.
18. 2.3 #1 (d): "5 bottles turn red" and "plan sufficient": add the data that 20 strips include a waste allowance so the sufficiency has a real margin question.
19. Concept 2.4 description names Acharya P.C. Ray but no item now touches him. That is fine (trivia was cut) but the scope description should drop the name or one two-mark item should return.
20. Wrong options that are not strong chapter confusions: 2.4 #16 "A stronger acid" (weak); 2.5 #15 "Too much lime was added" (reasonable); 2.1 #17 distractors are fine.
21. Names reuse the book's own characters (Gurbir, Keerthi, Ashwin) in unlike roles: 2.1 #11 "Gurbir says lime water is the same as lime juice" uses the book's Gurbir (industrial-lake friend). Harmless.

## Template check (counts, not impressions)
- Slot order differs by concept: strings of type/marks for the five concepts are all different (2.1 starts mcq, short, case; 2.2 starts two mcq; 2.3 starts two case studies; 2.4 mcq, true_false, 5-mark; 2.5 AR first). Not slot-for-slot templated. Pass.
- Claim-check verdict mix: 2.1 #6 Yes, 2.2 #3 No, 2.3 #10 No, 2.4 #18 Partly, 2.5 #18 No = 1 Yes / 1 Partly / 3 No (60% No). Within the "about half No" guidance. Pass.
- Correct MCQ option is the longest in 7 of 23 MCQs (30%; strictly longest in 6). No stand-out padding. Pass. (Correct option is stored first in every list; the loader shuffles.)
- multi_statement key spread: five different keys. Pass except 2.4 #13 (item 8 above).
- AR: 5 of 6 same key (item 7 above). Fail.
- true_false: 2 False / 3 True. Pass on mix; see item 9.
- fill_blank: 5 items, each one word/number; machine-matchable ("acidic", "red", "1", "5", "75"); two need no chapter (item 2).
- match: 5 items, four-to-four, all options pairings, keys unique; they pass the format but 2.4 #14 and 2.5 #11 are recall of the activity or situations.
- Repeated ideas: item 5 above.
- Option named by position: none.

## Scope
scope_out has one line ("Exercises needing coloured figures"). No item needs a figure. Nothing in the file goes beyond the book; the lime/lemon fix is carried through (lemon juice is used for the acidic fruit everywhere; "lime" is used only for chuna or lime water or the soil lime).

## Per-concept verdict
- C7SC-2.1 (22): keys correct; facts match pp. 8-11. 8 clear easy items (#11, #14, #15, #18, #19, #20, #21, #22) plus 6 borderline; heavy on karela/slippery. Pass after fixes.
- C7SC-2.2 (22): keys correct; pp. 11-14. 9 easy (#5, #7, #9, #12, #17, #18, #19, #20, #22); hydrangea is 9 of 22. Pass after fixes.
- C7SC-2.3 (21): keys correct; pp. 14-16; the onion claim is safely hedged. 9 easy (#4, #5, #7, #8, #9, #11, #15, #18, #21); #14 key wording. Pass after fixes.
- C7SC-2.4 (21): keys correct; arithmetic right. 13 easy (the weakest concept): #1, #2, #3, #5, #6, #7, #9, #11, #13, #14, #16, #17, #19; Activity 2.7 over-mined. Rework of about half.
- C7SC-2.5 (21): keys correct (72, 28, 75). 10 easy (#1, #6, #8, #9, #10, #12, #13, #14, #15, #20); neutral-soil idea in 6 items; strawman in #7 (d). Pass after fixes.

## Overall
No wrong key and no fact or arithmetic error: the factual layer is sound, the template is gone and the item types are all present. But the rewrite did not remove easy items: 49 of 107 are one-line lookups or one-step applications (31 of them untouched from the backup), plus 32 borderline. Verdict: pass after fixes (not yet to the "no easy items" standard; 2.4 closest to rework).

## EASY LIST
Format `concept#position: reason`. (K) = text-identical to backup; (N) = new item added by the rewrite. These are the clear ones (a single book fact or one-step lookup).

C7SC-2.1
- 2.1#11 (K): "Gurbir says lime water is the same as the juice of a lime": the book's boxed note (p.8), one fact.
- 2.1#14 (N): lichen = fungus + alga, litmus natural from lichens; one sidebar line (p.10) dressed as a trip scenario.
- 2.1#15 (N): vinegar blue to red, baking soda red to blue, slippery, karela; four one-line lookups.
- 2.1#18 (N): fill_blank "turns blue litmus red ... ___ in nature" -> acidic; the single rule (the other two observations add nothing).
- 2.1#19 (N): "conclusion NOT supported": karela is bitter but not basic; the one book line (p.11).
- 2.1#20 (K): "Differentiate acidic and basic on litmus and taste/feel"; recall of pp.10-11.
- 2.1#21 (K): amla juice on blue and red litmus; one-step table lookup.
- 2.1#22 (K): "a sample turns red litmus blue: nature; name one basic and one acidic sample"; recall.

C7SC-2.2
- 2.2#5 (N): pink hydrangea means basic soil, extract green, make acidic for blue; two book facts.
- 2.2#7 (N): true_false extract red implies blue litmus red; one book correspondence, verdict True, no misconception.
- 2.2#9 (K): "Differentiate litmus and red rose extract colours"; recall of two rules.
- 2.2#12 (K): soap solution and sugar solution with red rose extract; one-step.
- 2.2#17 (K): 5 marks compare litmus and extract; restates the book; the decision is the book's own conclusion.
- 2.2#18 (N): two hydrangeas, blue and pink: soil differs, make acidic; hydrangea fact (p.14).
- 2.2#19 (N): Kabir's plan, change = use fallen petals; the book's one advice line (p.12).
- 2.2#20 (K): 5 marks predict four samples with the extract then blue litmus; rule applied four times.
- 2.2#22 (K): AR with unrelated R (hydrangea); R off-topic is the whole answer.

C7SC-2.3
- 2.3#4 (K): three drops on one turmeric strip; one rule (acid and neutral both yellow).
- 2.3#5 (K): "Differentiate turmeric paper and litmus paper"; recall of the book's contrast (p.15).
- 2.3#7 (K): 5 marks "write Neha's plan" = the steps of Activity 2.6 (p.16).
- 2.3#8 (N): true_false that olfactory indicators change colour; correction is the definition (p.16).
- 2.3#9 (N): three drops on turmeric paper, count those singled out; one rule applied three times.
- 2.3#11 (K): lime water vs lemon juice writing on turmeric paper; one-step rule.
- 2.3#15 (K): AR, R "ginger family" is off-topic; solved by noticing R is irrelevant.
- 2.3#18 (N): which observation shows onion as olfactory indicator; the definition (smell changes).
- 2.3#21 (K): lime water and tap water on turmeric cloth; one-step rule twice.

C7SC-2.4
- 2.4#1 (K): one more drop of lemon juice after blue; book's own predict question.
- 2.4#2 (N): true_false that temperature rises on neutralisation; the equation term "heat".
- 2.4#3 (K): 5 marks Dev, vinegar + washing powder; Activity 2.7 with swapped reagents.
- 2.4#5 (K): why neither litmus changes after neutralisation; one-line definition.
- 2.4#6 (K): 5 marks "any amount of base makes it neutral" is wrong; the book's "sufficient quantity" restated, absurd claim.
- 2.4#7 (N): fill_blank 34 - 29 = 5; a bare subtraction, no chapter content.
- 2.4#9 (K): AR warmth versus calcium hydroxide; R off-topic.
- 2.4#11 (K): neither litmus changes after mixing: neither acidic nor basic; definition.
- 2.4#13 (K): multi_statement, all three statements verbatim book sentences, key "1, 2 and 3".
- 2.4#14 (N): match of the four stages of Activity 2.7; sequence recall.
- 2.4#16 (N): "something in neither starting liquid" = a salt; the equation (p.18).
- 2.4#17 (K): write the word equation and the heat term; equation recall.
- 2.4#19 (K): vinegar + lime water: salt and water, no litmus change; equation recall.

C7SC-2.5
- 2.5#1 (K): AR fertiliser/lime; R unrelated.
- 2.5#6 (K): extract green means basic, add manure; two chained book lines.
- 2.5#8 (N): "Differentiate treatment of acidic and basic soil"; p.18-19 recall.
- 2.5#9 (K): 5 marks the four situations (ant, acidic soil, basic soil, factory waste) and remedies; Situations 1-3 restated.
- 2.5#10 (N): fill_blank 30 x 2.5 = 75; bare multiplication.
- 2.5#12 (K): fertiliser makes soil acidic, lime; Situation 2 restated.
- 2.5#13 (N): true_false neutral soil, weak plants; the book's own sentence (p.19).
- 2.5#14 (K): AR ant bite, R explains A; Situation 1 restated.
- 2.5#15 (K): unchanged extract, weak plants: nutrient lack; the same book sentence.
- 2.5#20 (K): reverse "a soil where manure is right"; basic soil plus manure, one line.

Counts: clear easy 49 (K 31, N 18): 2.1 = 8, 2.2 = 9, 2.3 = 9, 2.4 = 13, 2.5 = 10.

BORDERLINE (two chained lookups; fix if the concept still needs easier ones removed)
2.1#1, #5, #9 (two of three statements verbatim), #12, #13, #17; 2.2#1, #2, #4, #6, #8, #11, #13, #14, #16; 2.3#3, #6, #13, #17, #19; 2.4#4, #12, #15, #18, #21; 2.5#2, #3, #4, #11, #16, #17, #18. Total 32 (K 17, N 15).
