# Review v3: class8s p1ch01 (SST8, Natural Resources and Their Use, hees101)

Pack: `content/authoring/dps/class8s/p1ch01.json`, all 141 questions read (20, 21, 20, 20, 20, 20, 20), no sampling.
Pages: `content/extracted/hees101/pages/001-020.txt` (book pp 1-20). Indices are 0-based inside each concept's
`questions` list (the fixer reordered every concept, so these are NEW indices). Scratch: `scratchpad/v3-class8s-p1ch01/`.

Mechanical checks (python, all 141): step marks sum to marks in every written item; every `a` of an mcq/match/AR/MS
starts with its o[0]; no wrong option equals the key or is a duplicate; no option named by position in any answer or step;
no 4-mark long answer lacks the case_study tag; no Remember, no Easy.

Counts: 29 mcq, 8 assertion_reason, 7 multi_statement (all 3-statement), 6 fill_blank, 7 match, 54 short_answer (7 true_false,
7 claim_check), 30 long_answer (14 case studies). Bloom: Understand 6 (4%), Apply 37, Analyse 61, Evaluate 27, Create 10
(Analyse/Evaluate/Create 70%). Difficulty: Hard 113, Hardest 28.

**Result: 1 HIGH, 9 MEDIUM, 9 LOW. Not load-ready until the one HIGH is fixed (a one-word fix); MEDIUMs are advisable.**

---

## v2 status

| v2 item | Status now |
|---|---|
| H1 river case (1.3) | FIXED. Now 1.3 [2], Veli and Tara on separate rivers. Premises all in the stem (3 years ago both factories discharged non-decaying waste, no fish below either; Veli treated, fish returned; Tara did not, still none; fish above both). (a) cycle intact upstream; (b) waste breaks the cycle; (c) Nature restored once the cause was removed; (d) two predictions, each one answer (no fish if nothing changes; fish likely to return if treated, "as below the Veli"). The old false analogy is gone. No second answer. |
| M1 special steel (1.5) | FIXED. Now 1.5 [6]: "(illustrative; not a real place)", only the book's premise (resources + knowledge and skills give unique products others trade for). No ancient/ore/traders invented; Wootz appears only in the key as the book's example. New weakness: the stem nearly restates the key (see M9). |
| M2 true_false (1.5) | FIXED. 1.5 [0] false claim "India has avoided the curse because it has very few natural resources" is contradicted by the book: p4 "India's geographical diversity provides us with a wide variety of natural resources", p8 "India has significant quantities of coal reserves", p11 "India has generally avoided this curse by investing in the development of such industries". The key cites coal and the investment. Good. |
| M3 claim_check (1.1) | FIXED. 1.1 [0] vein 8 km under a mountain "beyond every drill": verdict No, unambiguous, the key names the failing condition. |
| M4 strawman endings | PARTLY. Real data-driven decisions now in 1.3 [15], 1.4 [17], 1.6 [6]. Still dominated or non-decisions: 1.2 [12](d), 1.5 [8](d), 1.7 [3] (see M2, M3). |
| M5 parts needing no chapter | PARTLY (see M4 below). |
| M6 repetition | PARTLY (see M5). |
| M7 copied frames | FIXED (essay-sentence frame and Tenzin/Meena classification frames are gone). |
| M8 identical slot order | FIXED for order (sequences differ in all seven concepts); new template found in "(b) Using (a)" (M6). |
| M9 recall in disguise | PARTLY (M7). |
| M10 1.7 [17] key was inference | FIXED. Now 1.7 [15] asks only for book-stated recommendations; but it is a 5-mark recall list (M7) and (b) has a second plausible answer (M8). |
| M11 1.7 step 4 beyond book | FIXED. 1.7 [13] steps are now the book's fairness material plus lokasangraha; alliance and future-generations claims removed. |
| M12 distractor tells | MOSTLY FIXED. Key is strictly longest in 8 of 29 MCQs (28%), second-longest in 11 (38%). Extreme words (only, always, never, all, every, any, cannot, exactly, certain, alone) in 14 of 87 wrong options (16%) against 1 of 29 keys (3%): mild (L3). |
| L15 no "all three" MS key | FIXED (1.3 [10]). |

---

## HIGH

**H1. C8S-1.7 [6] fill_blank: a second defensible word, introduced by the fix pass.**
Quote: "A farmer in Kerala follows a traditional recommendation and grows maize, beans and pumpkin together in one field
instead of maize alone. This practice is called ___ cropping." Key: "mixed".
Problem: the book uses two terms. p16 (Vrikshayurveda) says "crop rotation and mixed cropping"; p12 lists "multi-cropping" among
the traditional soil practices, and p17 says the Sikkim family "started growing multiple crops across the year". "multi" is a
correct book word for the same practice, and `fill_blank` is machine-matched with no alternates, so a student who writes
"multi" loses the mark.
Smallest fix: make the blank unambiguous, for example "Vrikshayurveda advises crop rotation and ___ cropping, in which plants
are grown together in one field to protect the soil." Or change the item to a computed blank. (The 1-line fix is the only thing
standing between this chapter and "load-ready".)

---

## MEDIUM

**M1. C8S-1.1 [3] (mcq, "part of Nature, not created by humans"): the hedge distractor is arguably also Nature.**
Quote: o2 "A hedge planted and trimmed by the school gardener". The key says it was "made by people".
Problem: the book says trees "exist independently of humans" and Nature is life and non-life forms "not created by humans". People
plant a hedge; they do not create the plants. A sharp student can defend the hedge. The intended answer (self-seeded sapling) is
clearer, but the stem asks for "the one item".
Fix: replace o2 with something wholly human-made (for example "A fence of cut bamboo poles put up by the school gardener"), and
keep the canal and tank.

**M2. Case studies that end in a dominated or non-decision (v2 M4 residue).**
- 1.2 [12](d): "The panchayat can hire one extra clerk for one committee." Complaints are 45 (life), 10 (materials), 9 (energy), so
  the data decide it; there is no cost or competing need to weigh.
- 1.5 [8](d): "Judge the brochure ... is its picture complete?" 1,500 displaced against "a few families" makes the answer forced; the
  brochure is the strawman source. Give the brochure one true, weighty point in its favour, or ask which of two plans to back.
- 1.7 [3]: the Sikkim farm (recomputed: Pema year 1 = Rs 1,12,500; five-year totals Rs 6,97,500 against Rs 7,50,000, behind
  Rs 52,500; running gap -37,500, -67,500, -82,500, -82,500, -52,500, -22,500, +7,500 so overtakes in year 7: all correct). But
  the last part is "which year" plus "name a gain": arithmetic and recall, not a decision. Add "Pema's family is Rs 52,500 behind
  and in debt at the end of year 5: should it have switched back, and what in the chapter and the figures says?"
Also 8 of the 14 case studies end with "Predict ..." (1.1 [7], 1.1 [8], 1.2 [1], 1.3 [2], 1.4 [3], 1.5 [11], 1.6 [19], 1.7 [5]): an
ending template (57%). Turn three of them into "choose between two plans".

**M3. C8S-1.5 [11](d) (river sharing, case): "whether the sharing agreement still matters" has an arguable second answer.**
Quote: wet year, 150 units against wants of 130. Key: tension eases and the agreement "still matters because in dry years the
water is short again".
Problem: the question is about the wet year; a student can answer "in that year it no longer matters". The key depends on a dry
year the part does not mention. Arithmetic is right (130 - 100 = 30; 70/130 x 100 = 53.8; 60/130 x 100 = 46.2).
Fix: ask "will the agreement still matter in the next dry year, and why" or drop the second half of the prediction.

**M4. Parts answerable from the stem alone (v2 M5 residue, one-arithmetic-part cap exceeded).**
1.3 [1](a)-(c) (40 x 350, 14,000/275, 40 x 275; only (d) and (e) need the chapter); 1.4 [17](b)(c) and 1.4 [8](a)(b); 1.5 [11](a)(b)
(both sums, pure stem arithmetic); 1.6 [2] fill_blank (80% of 1,500, the 80% is in the stem); 1.6 [3](a)(b)(c); 1.6 [11](a);
1.6 [19](a)(b); 1.7 [3](b)(c) ((b) is named in the stem); 1.7 [5](a). All numbers are correct (recomputed). Cap pure-arithmetic parts
at one per case study by tying a second calculation to a chapter idea (for example "the chapter's condition for timber to stay
renewable: what yearly harvest does it allow?").

**M5. Residual repetition above the "three per idea" cap, by count.**
- 1.5: paradox of plenty / raw-ore-versus-industry in [0], [1], [7], [15], [16], [18], [19] (7), with [18] (Region P / Q) and [19]
  (Country X / Y) near-duplicates of the same frame and answer; Kaveri / Nature ignores boundaries in [3], [4], [10], [11], [13]
  (5); Wootz / trade in [4], [5], [6], [10], [14] (5); benefits and costs near industry in [2], [4], [8], [10], [12] (5).
- 1.6: the three Punjab causes in [0], [1], [6], [8], [12], [14], [15], [16] (8); the groundwater chain deficit - cost -
  unavailability in [5], [11], [19]; deficit sums in [3], [11], [19].
- 1.3: waste that cannot decay breaks the cycle in [0], [2], [4], [7], [9], [10], [11] (7); restoration versus regeneration
  in [4], [13], [17], [18], [19] (5; [17] and [18] share an identical "(a) which? (b) Using (a), what more?" frame).
- 1.4: harvest-versus-regrowth arithmetic in [3], [9], [10], [13], [15], [17] (6).
- 1.7: unfair access to a basic resource in [11], [13], [16], [17], [18] (5); lokasangraha in [1], [2], [11], [13] (4).
- 1.1: "cultural condition fails" (sacred grove or worshipped hill) in [5], [8], [13], [15], [19] (5); 1.2: categories / criteria as a
  shortcut in [0], [4], [8], [14](e), [18] (5).
Fix: cut each to three: merge 1.5 [18] and [19] (keep one), drop 1.5 [1] or [16], drop 1.6 [15] or [12], drop 1.3 [18], keep
only one of 1.3 [9] / [7], drop 1.7 [17] or [18].

**M6. "(b) Using (a)" template.** 21 of the 28 two-mark short answers (excluding true_false) begin (b) with "Using (a)" (75%); v2 asked
for about a third. In several the link is cosmetic: 1.2 [18](b), 1.5 [9](b), 1.5 [15](b), 1.7 [7](b), 1.6 [11](b). Rephrase about
10 of them ("So what would change if...", a fill-the-gap, a two-reason form) and let some (b) parts stand alone.

**M7. Recall in disguise (answer is one or two sentences of the book), about 30 items.**
Strongest: 1.1 [2] (the book's meaning of "exploitation") and [6](a); 1.2 [10] (microhydel = flowing water into electricity), [16]
(granite counter = materials), [18](a), [20]; 1.3 [11] (the blank is "regeneration", the book's own phrase), [14], [16]; 1.4 [0](a),
[2], [11], [14](a); 1.5 [6] (the stem restates the key nearly word for word), [12], [14]; 1.6 [0] (four-fact match), [4], [9](a),
[13]; 1.7 [0], [1], [2], [7](a), [9](a), [15] (5 marks, five book facts: pest repellents, rotation and mixed cropping, ploughing, seed
steps, meaning of the word), [18], [19](a). For each, add a decision, a consequence or a number that needs the idea, or turn into a
misconception catch. The chapter-level Bloom mix passes; the labels flatter several of these.

**M8. C8S-1.7 [15](b): a second plausible Vrikshayurveda link.**
Quote: "(b) soil degraded by improper use of chemical fertilisers" with key "crop rotation and mixed cropping to maintain soil health".
Problem: the same paragraph also gives "elaborate recommendations on the specific plants to be grown on different soil types".
A student naming that is correct and scores 0. The stem also says "The chapter describes three farm problems and the traditional
answers", but the chapter does not pair them; the pairing is the author's.
Fix: accept "plants suited to the soil type" in the key, or say "the recommendation that the book says maintains soil health".

**M9. C8S-1.6 [8] (assertion-reason): the "does not explain" verdict is contestable.**
Quote: A "Over-pumping of groundwater by farmers is still prevalent in much of India today." R "High-yielding varieties of wheat and paddy
need more water than traditional seeds." Key: both true, R not the explanation, because the book ties "still prevalent today" to
free power.
Problem: the book says HIGH-yielding varieties "required more water ... and farmers began to extract groundwater to meet this need";
a student can argue R is part of why pumping is so widespread. The book attaches the parenthesis "a situation still prevalent in much
of India today" to the free-power sentence only, so the key is the more careful reading, but it is not the only defensible one.
Fix: swap R for a clearly separate true statement (for example "Almost 80 per cent of Punjab's area is classed as over-exploited"),
or make A the free-power claim and R the high-yielding-variety claim so that "does not explain" is plain.

**M10 (verdict-level). C8S-1.7 [14] claim_check: "Partly right" versus "No".**
Quote: Kavya says "Vrikshayurveda shows that traditional knowledge alone can solve farming's problems today, so modern technology is
not needed." Key: partly right. Her conclusion is the false one; "No, because 'alone' and 'not needed' are wrong, though
Vrikshayurveda is valuable" is equally defensible, and the verdict is a mark. Keep the three-step structure but make the claim
single-barrelled ("Vrikshayurveda shows that modern technology is not needed"), key No; or build a clear two-part claim (one right, one wrong) and
ask for the verdict on each part. Verdict mix across the chapter is fine either way (No 3, Yes 2, Partly right 2).

---

## LOW

- **L1. C8S-1.7 [0] and [10] keys mention options that do not exist.** [0]'s key says the chapter "does not say the dust fertilises
  crops, that only factory workers are harmed, or that the only harm is noise"; [10]'s says "importing cement" and "a taller
  chimney". Options now are different ([0]: partial-effect sets; [10]: taller chimney, fresh plastic sheets, more cement with water).
  Edit the explanation to match the live options.
- **L2. C8S-1.5 [18] mcq: the correct option "The paradox of plenty" (21 characters) is the shortest by a wide margin** (others 46-57).
  Lengthen to match.
- **L3. Extreme words in wrong options (14 of 87 against 1 of 29 keys).** Worst: 1.3 [14] (only, any), 1.4 [11] (not by any glaciers at
  all), 1.5 [12] (every, only, certain), 1.7 [18] (only, exactly). Soften about half.
- **L4. C8S-1.4 [4] AR: "India's iron ore reserves, though large"** is not in the book (the book says India has significant *coal*
  reserves). Say "A country's iron ore reserves, though large".
- **L5. C8S-1.6 [7] mcq: "old ponds, lakes and water tanks"**: the book says "ponds and tanks". Drop "lakes".
- **L6. C8S-1.5 [5] step 3: "Such trade brought wealth"** is an extension; the book says only that trade fuelled the development
  of large empires in India.
- **L7. C8S-1.6 [6](d)**: "a farm economy that still works 20 years from now" does not name the metric (Abhay's farm still earns
  Rs 44,000 in year 20). Add "judged by total income over the 20 years" or accept the stated reasoning. All numbers verified:
  (b) 5,60,000 and 4,40,000; (c) Bhavna first ahead in year 14 (13,16,000 against 13,40,000); after 20 years 16,40,000 and
  19,40,000.
- **L8. C8S-1.4 [17] timing.** "Empty in 10 years" and Rs 25 lakh assume the 3,000 fish breed before each year's 5,000 catch (net -2,000 a
  year, which the stem's "assume this stays constant" supports). If breeding is read as year-end, the lake empties in year 9 with
  44,000 fish caught. Add "breeding adds 3,000 to the lake each year, before that year's catch" to the stem.
- **L9. C8S-1.3 [17](b) and [18](b)**: "if the pond had been cleaned but no new life ever appeared" and "what more would have to happen for
  regeneration" blur the book's two words (plants growing back from seeds is regeneration in the book's own forest example, yet the
  key counts the returning grass as restoration only). Keep the key but state "a return to the earlier plant cover" in the stem.
- Also noted (accepted): 1.7 [16] statement 2 ("Jaisalmer fort ... shown among traditional materials in use") is slightly stretchy (a figure,
  not a sentence of the text); 1.5 [9](a) "which two effects does this most affect" could also name conflict; 1.2 [4] o2 is a weak
  distractor; 1.7 [12] stem says "pests" though the farm's stated problems are water, chemicals and soil.

---

## The specific checks requested

| Item | Result |
|---|---|
| 1.3 [2] river (Veli, Tara) | Each part has ONE answer; all premises in the stem; no false analogy. Pass. |
| 1.5 [6] special steel | Labelled "illustrative; not a real place"; only the book's premise; key cites Wootz as the book's example. Pass (recall note in M7). |
| 1.5 [0] true_false | The false claim is contradicted by the book (pp 4, 8, 11). Pass. |
| 1.4 [17] fish cooperative | (a) 3,000; (b) stock falls 2,000 a year, empty in 10 years, 10 x 5,000 x 50 = Rs 25 lakh; (c) 3,000 x 60 x 20 = Rs 36 lakh; (d) +Rs 11 lakh, so the 3,000 catch. One decision, no tie; the break-even is year 13.9, so the 20-year horizon stated in (d) decides. Only the timing note L8. |
| 1.6 [6] Bhavna / Abhay | Verified in code: Bhavna's running total first exceeds Abhay's in year 14. One decision. Note L7 only. |
| 1.7 [3] Sikkim farm | Verified: overtakes in year 7. Numbers correct; last part is not a decision (M2). |
| 1.3 [15] forest | 3 x 1.8 = Rs 5.4 lakh, rise Rs 3.6 lakh against Rs 3 lakh offered: net -Rs 0.6 lakh a year, plus the erosion loss. No tie. The proportionality assumption is stated in the stem. Pass. |

All other numbers recomputed and correct: 1.1 [4] 3,000 margin; 1.1 [7] 2,500 vs 3,200 m, loss 1,500, margin 1,000, loss 200; 1.2 [1]
1,500/500, 450/1,050, 150/1,350; 1.2 [12] 45/10/9 of 64 (70%); 1.3 [1] 14,000, 50.9 so 51, 3,000 short; 1.3 [5] 75, 1,750/275 = 6.36 so 7;
1.4 [3] 2,500 and 60 years, Uma 480 against 450 loses 30; 1.4 [8] 50, 40, 5 years either way; 1.5 [8] 300 x 5 = 1,500; 1.6 [3] 17 m,
41.7 so 42, 65; 1.6 [19] 300 and 1,09,500; 1.7 [5] 30 per cent.

## Template check (counts)

- Claim-check verdicts (7): No 3 (1.1, 1.3, 1.6), Yes 2 (1.2, 1.5), Partly right 2 (1.4, 1.7). Good mix.
- true_false verdicts (7): False 4 (1.1, 1.3, 1.5, 1.7), True 3 (1.2, 1.4, 1.6), 43% True. Misconceptions real in all; 1.4 [10] True is a near-restatement of the book (M7).
- Assertion-reason (8): both true and explains 3 (1.2, 1.4, 1.5), both true but not 2 (1.3, 1.6), A true R false 2 (1.2, 1.7), A false R true 1 (1.1). All four outcomes.
- multi_statement keys (7): "2 and 3", "1 and 3", "all three", "3 only", "2 only", "1 only", "1 and 2": fully spread, one "all three".
- Correct MCQ option longest 8 of 29 (28%), second-longest 11 (38%): no engineered length pattern.
- Slot order: differs in all seven concepts (first item types: sho3, lon5, sho2, sho2, sho2, mat1, mcq1).
- "(b) Using (a)" in 21 of 28 two-mark short answers: templated (M6).
- Case study endings: "Predict" in 8 of 14 (M2).
- Ideas above three per concept: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 (M5), worst in 1.5 and 1.6.

## Per-concept status

| Concept | Read | Keys | Status |
|---|---|---|---|
| C8S-1.1 | 20 | all correct; [3] hedge arguably also Nature (M1) | Fix M1 |
| C8S-1.2 | 21 | all correct | Optional: M2 ([12](d)), M6, M7 |
| C8S-1.3 | 20 | all correct; river H1 fixed; forest decision verified | Optional: M4, M5 |
| C8S-1.4 | 20 | all correct; fish case verified | Optional: M4, M5, L8 |
| C8S-1.5 | 20 | all correct; [11](d) arguable (M3) | Fix M3; M5 near-duplicate [18]/[19] |
| C8S-1.6 | 20 | all correct; Bhavna/Abhay verified; [8] AR contestable (M9) | Fix M9 |
| C8S-1.7 | 20 | all correct except [6] (H1); [14] verdict arguable (M10); [15](b) (M8) | Fix H1, M8, M10 |

## Verdict

**Not load-ready.** One HIGH (1.7 [6], a one-word fix). After H1, M1, M3, M8, M9 and M10 (each a small edit) the keys are all
single-answer, the arithmetic is correct and every v2 HIGH/MEDIUM that could change a mark is closed; the remaining MEDIUMs (M2, M4-M7)
are quality residue the owner may accept. A short check of the edited items is enough; a full third read is not needed.
