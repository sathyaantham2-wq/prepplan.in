# Review v2: class8s p1ch01 (SST8, Natural Resources and Their Use, hees101)

Pack read: `content/authoring/dps/class8s/p1ch01.json`, all 144 questions (21, 21, 21, 21, 20, 20, 20), no sampling.
Checked against the extracted pages 1-20 of `content/extracted/hees101/pages/`. Every number was recomputed in python
(all correct: see "Arithmetic" at the end). Indices are 0-based positions inside the concept's `questions` list.

Counts read: 28 mcq, 11 assertion_reason, 7 multi_statement, 7 fill_blank, 7 match, 49 short_answer (7 true_false,
8 claim_check), 35 long_answer (14 case studies). Bloom: Understand 14, Apply 36, Analyse 63, Evaluate 25, Create 6.
Keys: every correct option is at o[0]; step marks sum to marks in every item; no option is named by position;
no `Remember`, no `Easy`.

Result: 1 HIGH, 12 MEDIUM, 14 LOW. Not load-ready until the HIGH and the MEDIUM items are fixed.

---

## HIGH

**H1. C8S-1.3 [18] (river case study), parts (c) and (d): the scenario contradicts the keyed reasoning.**
Quote: "Below the point where a tannery discharges its untreated waste, no fish ... Further downstream, a stretch below a
second factory that began treating its waste three years ago now has fish again."
Problem: the second stretch is downstream of the tannery, which still discharges untreated waste, so that water still
carries the tannery's waste. The key for (c) says "once the cause of damage stopped, Nature restored the stretch", but the
cause upstream has not stopped. A sharp student can defend a second answer (the river dilutes or cleans itself with
distance), and (d) "fish would return below the tannery, as they did below the second factory" rests on a false analogy.
Fix: put the second factory on a different river or tributary, or make it the only polluter (for example "a second town
on a neighbouring river, whose factory began treating its waste three years ago"), so that the only difference between
the two stretches is the waste. State the 3-year timeline for both.

---

## MEDIUM

**M1. C8S-1.5 [6] (the "special steel" MCQ).** Judgement asked for in the task.
Quote: "In ancient times, a region that had good iron ore and skilled smiths became known far away for a special steel,
and traders came to it from distant lands."
- Labelling: it is not marked hypothetical. Nearly every other invented scenario in the pack says "(illustrative)"; this
  one does not, and it reads like a history statement.
- Fidelity: it does not misstate history. It names no place and no date, and Wootz steel is in fact attested from early
  centuries in India. But the book says only: "National and international trade depend on the geographical location of
  natural resources. Combined with human knowledge and skills, these can create unique products like the Wootz steel. As
  we know, trade fuelled the development of large empires in India." The book gives no era, does not say the inputs were
  "iron ore and skilled smiths", and does not say traders came "from distant lands". Those three details are the author's,
  and the key then says "as with Wootz steel", presenting them as the book's.
- The item can be answered without the book: the other options ("always grow more slowly", "iron is renewable") are
  strawmen.
Fix: label it "(illustrative; not a real region)", drop "In ancient times" and "traders came from distant lands", or
rewrite with only what the book says ("A region's resources, combined with its people's knowledge and skills, produce a
unique product that other places want to trade for"). Keep the Wootz mention in the key only as the book's example.

**M2. C8S-1.5 [7] true_false: the False verdict rests on a comparison the book does not make.**
Quote: "It is easier to reach a water-sharing agreement between neighbouring countries than between the states of one
country." Key: False, "even states needed negotiation, and agreements between countries are not easy".
Problem: both being hard does not refute "easier". The book says only "Of course, reaching such agreements between
neighbouring countries is not easy."
Fix: make the false claim something the book does contradict, for example "Because the Kaveri flows through one country,
its water was shared without any negotiation" (False: negotiations and deft management were required).

**M3. C8S-1.1 [11] claim_check: verdict is arguable.**
Quote: Ananya says deep-ocean petroleum "is a natural resource, because it occurs in Nature and it is valuable to
humans". Key: "partly right".
Problem: the book's short definition (page 3) is exactly what she quotes, and the three conditions (page 2) say it is
not yet "called a resource". "No" and "partly right" are both defensible and the verdict is worth 1 mark.
Fix: make the claim unambiguous. For example "Ananya says: petroleum under the deep ocean is a resource because it is
valuable. Right? " with key "No", or give the partial-credit structure in the stem ("Ananya gives two reasons; which is
right and which is incomplete").

**M4. Chapter level: the last part of the case studies is a strawman or has no real trade-off.**
Count: 14 case studies; 6 end by asking the student to judge a foolish claim, 3 end with "which is the correct one",
3 end with a "decision" the data decides on one side. Only 1.4 [18] has a real quantity to decide.
- Foolish claim to judge: 1.1 [16](d) headline "worthless, will never be a resource"; 1.2 [0](d) friend's "same thing
  in two groups must be a mistake"; 1.3 [17](d) brochure "forest gives this village nothing"; 1.5 [17](d) newspaper "river
  is ours, passes through us first"; 1.6 [18](d) report "no real problem, we will drill deeper"; 1.7 [0](d) neighbour
  "organic farming has failed here".
- Elimination: 1.1 [17](d) "which row did she get right"; 1.4 [19](d) "which sentence is correct" (the only sentence
  quoting the book's condition); 1.7 [18](d) "which claim does the chapter support" (the only claim with no negative wording).
- Dominated decision: 1.2 [18](d) the stem states the panchayat's aim (drinking water, building, power separately), so
  use-based committees are forced; 1.5 [16](d) District Q has 3.75 times the value and 9 times the jobs; 1.6 [17](d)
  Village B has the higher water table and no stated cost or loss.
Same flaw in 3-mark claim-checks: 1.7 [14] "Dev says ... only a problem for people inside the factory" (the exact named
strawman frame the skill forbids) and 1.7 [13] "Kavya says traditional knowledge has nothing to offer".
Fix: give each last part data that supports both sides. Examples: 1.5 [16] give Q higher cost, pollution or a lower
margin so the choice is not free; 1.6 [17] give B a lower yield or income in the first years and A a higher yield; 1.7
[0] give the first-year drop a possible second cause; 1.2 [18] drop the sentence stating the aim and ask which committee
structure the panchayat should choose, using a trade-off between simplicity and fit. Replace at least half of the six
"judge a silly claim" endings with "choose between two defensible plans" or "which of two partly right readings is
better".

**M5. Parts that need no chapter (answerable from the stem alone).**
Arithmetic parts that the stem fully supplies, so the chapter is only needed in the last part or two:
1.3 [17](c) 1.8 lakh x 5 (and "some years ago" in the stem gives no number of years; 5 appears only in the question);
1.4 [17](a)-(d) (4 of 5 marks, only (e) needs the chapter); 1.4 [18](a)-(c); 1.4 [20] fill_blank (50 / 2);
1.5 [16](a)(b) and [17](a)(b); 1.6 [2] fill_blank (9 - 6); 1.6 [8](a); 1.6 [16](a)-(c) (3 of 5 marks);
1.6 [18](a)(b); 1.7 [0](a)(b); 1.7 [7] fill_blank (100 / 15).
Fix: tie each calculation to a chapter idea so the student must know the idea to set it up (for example "the chapter's
condition for timber to stay renewable: what yearly harvest does it allow?" rather than "how many years will it last").
At most one part per case study should be pure arithmetic.

**M6. Repetition: ideas used far more than twice in one concept (the author admitted only 1.2 and 1.3).**
- 1.1: sacred grove / worshipped place as the failing cultural condition in [1], [5], [12], [13], [14], [15], [17] (7);
  deep or seabed petroleum as the failing technology/economy case in [0], [5], [8], [11], [13], [16], [19] (7); the word
  'exploitation' defined in [3], [6], [14], [19], [20] (5); plastic button in [3] and [18].
- 1.2: "sort a village's resources into life / materials / energy" as a case study [0], a long answer [16], and a
  case study [18] (three times, near-identical move); water counted in two groups in [0](d), [4], [9], [16](d);
  naming/categories as a shortcut in [4], [7], [10], [17]; microhydel in [0], [9], [16].
- 1.3: ecosystem function/service in [0](e), [2], [4], [10], [16], [17], [19] (7, with the frame "forest does X, villagers
  benefit" in [4], [10], [17], [19]); oxygen 275/350 in [0], [14], [20], with [0](b) and [14] the same round-up
  calculation; factory waste poisoning a river in [2], [6], [11], [13], [18]; replant the original species in [6], [7], [15].
- 1.4: "stock / yearly rate gives years left" in [14], [17], [18], [20] (four times); coal and the 50-year figure in [0],
  [6], [9], [16], [17], [19], [20]; the spawning-season practice in [3], [15], [18].
- 1.5: paradox of plenty in [1], [4], [8], [9], [13], [15], [16], [19] (8); Kaveri / Nature ignoring boundaries in [0],
  [2], [3], [7], [10], [12], [17], [19] (8); Wootz / trade / empires in [0], [3], [6], [14], [19]; benefits and costs
  near industry in [0], [5], [11], [18], [19]; raw ore versus processed value in [1], [8], [13], [16].
- 1.6: the three Punjab causes (HYV water, free power, chemicals) in [0], [3], [10], [12], [15], [17], [19]; the
  recharge-versus-draw deficit sum in [2], [8], [16], [18]; "drilling deeper is no fix" in [1], [6], [18](d).
- 1.7: Sikkim in [0], [3], [9], [13], [15]; Vrikshayurveda in [3], [9], [13], [17], [19]; cement dust harm in [1], [14],
  [18](b); mud as an alternative in [2], [6], [18].
Fix: cap each idea at 2 per concept. In 1.5 merge or replace six of the eight paradox items and five of the eight
Kaveri items with items on the chapter's other ideas (displacement near industry, uneven distribution in India's
states, the "challenge remains" sentence, the Fig. 1.11 legend only if an original map exists). In 1.3 drop one of the
three oxygen items and two of the function/service items. In 1.4 keep two of the four stock-and-rate sums.

**M7. Case-study frames copied between concepts.**
1.4 [19] and 1.7 [18] are the same frame ("four sentences/claims from an essay, (a) correct C1, (b) what has C2 left
out, (c) correct C3, (d) which is right"). 1.1 [17] (Meena's table) and 1.2 [0] (Tenzin's chart) are the same frame
("a student's classification, find her errors"). Together with M4 and the 1.2 triple in M6, about a third of the chapter's
case studies are one of two moves.
Fix: change at least 1.4 [19] and 1.2 [0] to a different move (a data table to interpret; a two-source comparison; a
timeline) so no frame appears twice in the chapter.

**M8. Slot order is identical across all seven concepts (templated structure).**
Every concept is: a block of 1-mark items, then exactly five 2-mark items, then three 3-mark items, then two 5-mark
items, then two 4-mark case studies, with the extras after. Inside the blocks the pattern repeats: the true_false is the
first or second 2-mark item (position 8 in six concepts, position 7 in two); the 3-mark block is always claim_check, then reverse or
show_impossible, then a "describe/give reasons" long answer; the 5-mark pair is always one "justify/compare" plus one (a)-(e)
item; nearly every (a)/(b) 2-mark item has (b) beginning "Using (a),". The author's file also gives every concept one
claim_check, one true_false and one "differentiate", so a reader can predict the next item type.
Fix: shuffle the order of items within each concept; use "Using (a)" in about a third of the (a)/(b) items; vary the
2-mark forms (give the two-reason, the fill-the-gap-with-reason and the "what would change" forms).

**M9. Recall in disguise: items whose whole answer is one sentence of the book.**
The standard says no easy items whatever the Bloom label. Strongest cases (book sentence in brackets):
1.1 [2] AR (Nature = not created by humans); 1.1 [4], [6], [18]; 1.2 [5] AR (both statements are consecutive sentences of p.4);
1.2 [7] (living/non-living example), [9], [11]; 1.3 [3] AR, [7], [19]; 1.4 [0], [1], [2] (answer 300 is the stem number),
[5], [9](a), [15] (the DON'T MISS OUT box, 3 marks); 1.5 [2], [4], [9], [10] (both parts one sentence); 1.6 [3], [4], [5],
[7] (true_false is the verbatim sentence "this concern is not particular to Punjab", key True, no misconception), [10],
[14] (three book facts for 3 marks), [19]; 1.7 [1], [5], [9](a) (what the word means), [10] (two features from a single
sentence), [11](a), [12](a), [15] (four tasks and the book's list in 3 marks). The chapter-level Bloom mix passes, but about
45 of 144 items (30 per cent) are recall once the label is ignored.
Fix: for each, add a decision, a consequence or a number that needs the idea (see M5 for the mechanism), or turn it into a
misconception catch; replace the 1.6 [7] true_false with a false claim built on a real slip.

**M10. C8S-1.7 [17] (5 marks): "the problem each recommendation avoids" has many defensible answers.**
The book never says that irrigation advice avoids groundwater over-extraction, that soil-matched planting avoids
degradation, or that careful ploughing avoids a described modern problem. Keys for (a), (b) and (e) are the author's
inference; a student who names a different link (for example "(b) avoids wasting water") is correct but loses the mark.
Fix: restrict the item to the three links the book supports (natural repellents versus chemicals in groundwater, mixed
cropping and rotation versus soil degradation, ploughing that keeps soil life), or give the problem in each part and ask
only for the recommendation.

**M11. C8S-1.7 [16] step 4 claims more than the book.**
Quote of key: "fairness also runs across time ... and through the solar alliance India has shared expertise and affordable
financing with developing nations." The book frames the alliance as "environmental responsibility and economic opportunity",
not fairness, and the judicious-use paragraph says "last long enough for humanity" not "future generations".
Fix: replace step 4 with the book's own fairness material (the Section's water and air points are already steps 1-3); add
the book's remark that distribution of "basic ones like water and clean air, is often unfair to some sections of society"
as the second proof, and drop the alliance and the future-generations claim.

**M12. Distractor tells (chapter-level counts).**
- The correct MCQ option is exactly second-longest in 18 of 28 MCQs (64 per cent) and strictly longest in 1: an engineered
  length pattern a test-wise student can use.
- Extreme words (only, always, never, all, every, any, cannot) appear in 26 of the 84 wrong options (31 per cent) and in 1 of
  the 28 keys (4 per cent). Items where two or three wrong options carry "only/always": 1.2 [3], [7]; 1.3 [7]; 1.4 [6];
  1.5 [5], [6]; 1.7 [1], [4], [5].
- Many wrong options are silly rather than chapter confusions: 1.3 [5] (pipe untreated waste to a distant river, clear more
  forest), 1.4 [4] o[2] (traditional bans cut the tuna's food), 1.5 [1] o[1] (P, which is rich in ore, is "short"), 1.6 [5]
  (stronger chemical fertilisers, free power), 1.7 [1] (dust makes yields grow faster), 1.7 [6] (cement mixed with more water),
  1.1 [18] o[2].
Fix: vary key length (the key should be the longest in about a quarter of items, the shortest in a quarter); make wrong
options plausible half-truths from the chapter's own look-alikes (for example in 1.7 [1], "Dust harms lungs but leaves crops
alone").

---

## LOW

- **L1. C8S-1.1 [7]**: "A jeweller in Jaipur buys gold ... a farmer's hillside in the same state holds a little gold".
  Rajasthan has no obvious working gold mine; "the same state" invites the reader to place the mine there. Say "buys gold
  dug from a mine in Karnataka" or drop the state. Also (b) just restates the stem ("costs more than it is worth").
- **L2. C8S-1.1 [20](a), [6], [10]**: (a) is the book's own one-line explanation of the word; fold into [14] (5 marks) and
  replace.
- **L3. C8S-1.2 [6]**: option b "a grouping by a criterion other than use" for the coal item imports the renewable
  criterion (concept 1.4) into a use-based concept; fine for scope, but the phrase is circular for the other three options.
- **L4. C8S-1.2 [15]**: the stem says "three areas" (any three), but the step marks require buildings, transport and
  production, the book's own list; a student giving schools, water pumps and phones is correct and scores 1 for the final
  step only. Give the stem three named areas, or accept "any three with a reason".
- **L5. C8S-1.2 [3], [7]; 1.4 [1] and others**: tagged `scenario` though there is no scenario (28 of 28 MCQs carry the tag).
  Tag only the true scenarios; the loader's "3+ scenario" check passes for every concept even when the count is lower.
- **L6. C8S-1.3 [0](e)**: asks "function or service?" and the key is "both". Reword to "Is it a function, a service, or
  both? Explain." so a student who answers "both" is not guessing against the stem.
- **L7. C8S-1.3 [9](b)**: "a plastic wrapper ... cannot decay" is not in the book (the book says only that industrial wastes
  often cannot decay). Use "the factory wastes the chapter describes" in the stem.
- **L8. C8S-1.3 [15] step 3**: the book gives two links (food and shelter, life returns); "natural cycles resume" is the
  author's extension. A book-faithful answer scores 2/3.
- **L9. C8S-1.3 [3] AR**: R restates the mechanism of A (a fallen tree decomposes, so no waste); the "explains" key is
  correct but R is nearly A again. Use a reason about the no-waste principle rather than the same example.
- **L10. C8S-1.4 [6]**: the stem's premise "Coal is still forming slowly underground today" brushes scope_out ("How coal and
  petroleum are formed underground; the chapter says only that they formed over long periods"). The key does not depend on it,
  but say "Coal takes a very long time to form" instead.
- **L11. C8S-1.4 [10](a) and 1.6 [11](a)**: name rising temperatures and climate change; scope_out says the mechanism is not
  taught. Both items use only the two factors the book names, so keep them but do not extend into mechanism.
- **L12. C8S-1.4 [19] S1**: the key says "reshaping old gold does not create new gold in Nature". That recycling argument is
  not in the book (whose opening quotation even praises "repurposing used resources"). The verdict "gold is non-renewable"
  is right; mark on the book's definition (cannot be replenished at the rate we use it).
- **L13. C8S-1.5 [8], [16] (and [1], [13])**: price-per-tonne comparisons of raw versus processed value sit close to
  scope_out "how value is added to a raw material" (deferred to Factors of Production). Keep the idea (products of higher
  value) and drop rupee-per-tonne arithmetic from at least [8]. Also [8] calls goods "worth" Rs 12,000 "earnings"; no costs.
- **L14. C8S-1.6 [16](d)**: "inaccessible till depths of about 30 metres" is the book's ambiguous wording; the key reads it as
  "water above that depth is gone". State the meaning in the stem or accept either reading. Also 1.5 [11] is labelled Evaluate
  but is a list.
- **L15. multi_statement keys across the chapter**: 2 and 3 (1.1), 1 and 3 (1.2), 1 and 2 (1.3), 3 only (1.4), 2 only (1.5),
  1 only (1.6), 2 and 3 (1.7). The spread is good, but "all three" never occurs and every item has a false statement built on
  an absolute word ("never", "only", "evenly", "cannot"), so a student can learn that at least one statement is always false.
  Make one key "all three" (1.3 or 1.6).

---

## Per-concept status

| Concept | Read | Keys | Status |
|---|---|---|---|
| C8S-1.1 | 21 | all correct, one defensible, except [11] verdict arguable (M3) | Fix M3, M4 (case endings), M6 repetition |
| C8S-1.2 | 21 | all correct | Fix M4 ([18] forced, [0](d)), M6 triple case-study, M7, M9 |
| C8S-1.3 | 21 | [18] has a scenario contradiction (H1); numbers correct | Fix H1, M4, M5, M6 |
| C8S-1.4 | 21 | all correct | Fix M5, M6 (stock-and-rate x4, coal x7), M7 |
| C8S-1.5 | 20 | all correct; [7] verdict rests on an unstated comparison (M2); [6] unlabelled (M1) | Fix M1, M2, M4, M6 (paradox x8, Kaveri x8) |
| C8S-1.6 | 20 | all correct | Fix M4, M5, M6, M9 ([7] verbatim) |
| C8S-1.7 | 20 | all correct | Fix M4, M7, M10, M11 |

## The C8S-1.5 "special steel" item, one-line answer
Not labelled hypothetical, and it adds details the book does not state (ancient, iron ore and smiths, traders from distant
lands). It does not state a false fact about Wootz steel, but it should be labelled "illustrative" and trimmed to what the
book says (M1).

## Template check (counts)
- Claim-check verdicts across the chapter (8): No 4 (1.3, 1.6, 1.7, 1.7), Yes 2 (1.2, 1.5), Partly right 2 (1.1, 1.4):
  mix acceptable; 1.7 has two "No" in one concept and both claims are strawmen (M4).
- True/false verdicts (7): False 4, True 3 (43 per cent True, inside 25-75 per cent). Misconception quality: good except
  1.6 [7] (verbatim sentence) and 1.5 [7] (M2).
- Assertion-reason outcomes (11): both true and explains 4, both true but not 3, A true R false 2, A false R true 2: all four
  outcomes present.
- Correct MCQ option longest: 1 of 28 (strictly), second-longest 18 of 28 (M12).
- Slot order identical across 7 of 7 concepts (M8).
- Ideas tested more than twice per concept: all seven concepts (M6).

## Arithmetic (all recomputed in python; none wrong)
1.1 [16] 7,500 - 6,000 = 1,500; 6,200 - 5,200 = 1,000. 1.3 [0] 40 x 350 = 14,000; 14,000 / 275 = 50.9 so 51; 14,000 - 11,000
= 3,000. 1.3 [14] 1,750 / 275 = 6.36 so 7 (7 x 275 = 1,925; 6 x 275 = 1,650). 1.3 [17] 1.8 x 5 = 9 lakh. 1.4 [14] 15,000 / 600 =
25. 1.4 [17] 50, 40, 10, 50. 1.4 [18] 20,500; -2,000; 10 years. 1.4 [20] 25. 1.5 [8] 300 and 1,200 crore. 1.5 [16] 2,000, 7,500,
5,500 crore. 1.5 [17] 30 short; half. 1.6 [2] 3; [8] 4 and 40; [16] 17 m, 41.7 so 42, 65; [18] 300 and 1,09,500. 1.7 [0] 1,12,500;
1,80,000. 1.7 [7] 6.67 so 7.

## Verdict
**Not load-ready.** Pass after fixes: fix H1, then M1-M12 (the strawman endings, the arithmetic-only parts, the repetition
and the slot templating are the bulk of the work); L-items are cleanup. Request a second review after the fix pass.
