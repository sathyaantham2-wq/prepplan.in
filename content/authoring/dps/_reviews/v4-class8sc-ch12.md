# Review v4: class8sc ch12 (SCI8, hecu112, How Nature Works in Harmony)

Read: all ~60 items changed since orig-v3.json (diffed by index: 12.1 x10, 12.2 x9, 12.3 x6, 12.4 x7, 12.5 x7, 12.6 x9), plus every one of the 20 items of 12.2 for direct/indirect use. Facts checked against hecu112 pages 191-206 and 209. Indexes 0-based, same order as v3.
Recomputed in python: 4/25 = 16%; 18/50 = 36%; 15/24 = 62.5%; 0.8/2.5 = 32%; 12.5 [11](d) 80 x 0.9 = 72 against 35; 12.6 [2](d) Y falls 4/9 a year, X rises 1/9, lines cross at t = 14.4 years from year 1 (about 5.4 years after year 10), at 30 years Y 11.7 against X 20.3; 600/120 = 5, 120/12 = 10; 35 - 27 = 8; 3/6 = 1/2; 6:4 = 3:2; heterotrophs 6 of 8. All correct.
Whole-file checks (code): `a` equals o[0] on all 46 option items; no wrong option equals the key; no duplicate options; step marks sum to marks on every item with steps; no option named by position; all six multi_statement items use three statements.

Counts: HIGH 0, MEDIUM 3, LOW 8. Verdict: **load-ready** (the MEDIUMs are premise wording and recall, none changes a key; fix them if there is time, otherwise load).

## v3 status

- v3 HIGH 12.2 [4] part (5): FIXED. The stem now defines direct/indirect and asks separately about larvae and adult mosquitoes; key and step say "direct on larvae (eaten by fish); indirect on adults (through the larvae)". One answer.
- v3 12.2 [7](d): FIXED. Key: fish affect dragonfly larvae directly; adult dragonflies, bee visits and seeds only indirectly. Consistent with the table (dragonflies rise P to R, bee visits and seeds fall) and with [8].
- Definition stated in the stem of 12.2 [0], [4], [7], [8], [17]: CONFIRMED, same meaning each time ([0] words it as "something the cat itself catches", equivalent). The full 12.2 scan: only those five items use the terms. Checked each key against the definition: [0] sparrows direct, caterpillars and leaves indirect; [4] larvae direct, adults indirect; [7](d) as above; [8] "More bees and butterflies" is the only indirect finding (larvae and small animals are direct, oxygen is neither); [17] spiders direct (decrease), seeds indirect. No inconsistency left. Other chapters' "directly" (12.4 [1](d), 12.5 [10](a)) are ordinary-sense uses with no direct/indirect contrast; see LOW.
- v3 12.4 [3] `a` vs o[0]: FIXED, identical ("Snakes and hawks also feed on mice").
- v3 12.3 [12](d): FIXED. Stem says water can be carried to either place; Pot 2 (dark, watered, rich soil) 0 leaves against Pot 4 (sunny, watered, sand) 3 leaves, so the verandah is the only data-supported answer. "Compost" removed from the key.
- v3 12.5 [11](d): FIXED, 72 against 35 gives a numeric decision. v3 12.6 [2](d): FIXED, stem states the steady-rate assumption, trend arithmetic holds. v3 12.6 [15]: FIXED, now a computed blank, answer 32 correct. v3 12.5 old second "wrong" claim: FIXED (12.5 [14] now partly right). v3 12.1 [9] hedged organism key: replaced by a five-point forest analysis (6 biotic, 4 abiotic, ratio 3:2, 2 animals, 2 plants, 2 fungi/microbes), all correct.
- Claim-check mix now balanced: right 3 (12.3 [8], 12.4 [5], 12.6 [12]), partly right 3 (12.1 [2], 12.2 [9], 12.5 [14]), wrong 2 (12.5 [6], 12.6 [17]); true/false items False x4, True x2.
- multi_statement keys: 2&3, 1&3, all three, 1 only, 1&2, 2 only (spread good). assertion_reason keys: 2 explains, 2 not explanation, A true R false, A false R true.
- Correct option is the longest on 10 of 46 option items (22%; was 3 in v3). Two of the ten are assertion_reason items whose options are fixed texts, so 8 of 44 (18%), below the 25% chance rate. Not a template.

## HIGH

None.

## MEDIUM

- C8SC-12.4 [13](c) "The bacteria and the mushroom are heterotrophs but not consumers in the chapter's sense." The book (p.198) defines "consumers or heterotrophs" as the same thing, and the stem itself calls them heterotrophs, so the stem contradicts its own premise; the book only separates decomposers from consumers in the closing summary (p.208). Same wording issue in [18] ("both consumers because neither makes its own food": by p.198 that statement is literally correct, so the "student says" setup is not a misconception, though the key, "breaks dead matter into simpler substances and returns nutrients", is still the one defensible option). Fix: [13](c) "Bacteria and mushroom are decomposers. What do they do that a goat or a tiger does not?"; [18] "a mushroom and a mouse both depend on other organisms for food. Which point from the chapter shows what the mushroom does that the mouse does not?"
- C8SC-12.1 [3] (Create, 3 marks) "if your list shows only water and soil and one other" then "how many more abiotic entries the chapter's list would add". The count is 2 only if the student's "one other" is a chapter item (sunlight, air or temperature); with any other (rock, mud) it is 3. So the numeric part has more than one defensible answer depending on the student's own list, and the stem is awkward to read. Fix: fix the three entries in the stem ("abiotic entries: water, soil and sunlight") and ask the student to write four biotic ones and say which two chapter abiotic components are missing (air, temperature).
- C8SC-12.5 [5] assertion_reason, A: "Banning the export of frog legs helped limit the use of synthetic pesticides." The book (p.202) says the ban was imposed "to prevent further ecological damage"; it does not say the ban reduced pesticide use. A is an inference, so "A true, R explains A" rests on a claim not on the page. Fix: A = "India banned the export of frog legs to prevent further ecological damage"; R = "Frogs eat insects, so fewer frogs let pests and pesticide use rise" (still R explains A).

## LOW

- C8SC-12.1 [0] (heron and fish oxygen) and [16] (corridor between forest blocks) are one-line book facts (p.192 and p.191) dressed as scenarios; [14] (microbes are biotic, name plants and animals) likewise. Acceptable by number, but they are the weakest items in 12.1.
- C8SC-12.1 [9](4) "which listed abiotic component changes between day and night": the list holds sunlight, air, temperature; the key takes temperature (and sunlight). Say "which listed condition is warm by day and cool at night".
- C8SC-12.1 [4](d) Plan 1 is still refuted by the stem sentence ("kept dying" while food rose); fine as a data decision since the table shows food 100 to 200 with fish 50 to 18.
- C8SC-12.2 [19] assertion A: the five organisms listed (fish, frogs, snails, lotus, algae) are not all the biotic components of a pond, so "together form a community" is loose; say "the plants, animals and microorganisms of a village pond together form a community".
- C8SC-12.3 [8] verdict "Right": correct by definition, and the example for each kind is on Table 12.3; keep, but it is a definitional claim rather than a data claim.
- C8SC-12.5 [14] "partly right": the "right part" (the orchid lives on the tree) is trivial, and a student answering "wrong" has a defensible reading; the key's reasoning (parasitism needs harm, the book shows the branch unaffected) is sound. Accept as is.
- C8SC-12.4 [3] distractor "Food chains cannot be linked into a food web" and 12.4 [19] "Snakes have more food, as dead mice are easy prey" are weak but not defensible as keys.
- Residual repetition (MEDIUM at most, not near-duplicate): 12.1 classification of fish needs (biotic vs abiotic) at [2], [4](a), [5]; 12.5 mutualism with bees at [0], [3], [11](a), [17] and parasitism with ticks at [0], [3], [11](c), [14]. Cap not applied strictly, but every item asks a different question. 12.5 [10](a) and 12.4 [1](d) use "directly" in the everyday sense with no direct/indirect contrast; harmless.

## Per-concept verdicts

- C8SC-12.1: load-ready (fix [3] if time).
- C8SC-12.2: load-ready; the direct/indirect set is now consistent and every key unique.
- C8SC-12.3: load-ready.
- C8SC-12.4: load-ready (reword [13](c) and [18] premise if time).
- C8SC-12.5: load-ready (reword [5] A if time).
- C8SC-12.6: load-ready; all arithmetic confirmed, every changed item has one answer.

Final verdict: **load-ready**. 0 HIGH, 3 MEDIUM, 8 LOW.
