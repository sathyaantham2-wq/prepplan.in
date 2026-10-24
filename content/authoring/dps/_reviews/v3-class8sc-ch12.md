# Review v3: class8sc ch12 (SCI8, hecu112, How Nature Works in Harmony)

Read: all 126 questions (20/20/22/22/21/21) in content/authoring/dps/class8sc/ch12.json, every one, against pages 190-209 of hecu112 and the scope file content/authoring/class8sc/ch12.json. Indexes are 0-based in the NEW order.
Recomputed in python: every number is correct (4/25 = 16%; 18/50 = 36%; 15/3 = 5; 56%; 3.25; 78%; 23.7%; 35/8 = 4.4; 90/35 = 2.57; averages 19 and 5; 570/150/660; 2400/80 = 30; 80/8 = 10; food web of 12.4 idx 10 enumerates to exactly 5 chains, hawk at levels 3, 4 and 5). Step marks equal marks on all items with steps. Correct option at o[0] on all 46 option items, no duplicate options, no option named by position.

Counts: HIGH 1, MEDIUM 17, LOW 9. Verdict: NOT load-ready; pass after fixes (one real HIGH, one loader-format defect, the rest are repetition and recall).

## v2 status

- v2 HIGH (12.2 direct/indirect, old idx 10): FIXED for the item itself. 12.2 idx 8 now defines the terms in the stem; the key is unique ("Fish taking in oxygen" is neither effect, "fewer larvae" and "fewer small animals" are direct). BUT the fix left the chapter section inconsistent: see the new HIGH at idx 4 and MEDIUM at idx 7 and idx 0 below. The definition lives in one stem only.
- v2 claim ties: 12.1 idx 2 now "partly right" with "no part" wording, clean. 12.5 old idx 14 now "farmers are to blame, not the loss of frogs" (12.5 idx 6): key "wrong" is now unique. Fixed. 12.1 old "only because" claim removed. Fixed.
- v2 12.5 balance rule: FIXED (12.5 idx 19 supplies the rule in the stem; key follows it).
- v2 strawmen: mostly converted to two-plan trade-offs: 12.1 idx 4, 6; 12.3 idx 12, 20; 12.4 idx 0; 12.5 idx 1, 12; 12.6 idx 2, 3. Each has one data-supported answer except those noted below (12.3 idx 12(d), 12.5 idx 11(d), 12.6 idx 2(d)). 12.1 idx 6(d) and idx 4(d) are acceptable but still lean.
- v2 template: FIXED. Slot order is no longer identical across concepts (mark sequences differ in every concept); correct option is the longest on only 3 of 46 option items (was 23 of 47). multi_statement keys: 2&3, 1&3, all three, 1 only, 1&2, 2 only (good spread). assertion_reason keys: 2x R explains A, 2x R not explanation, 1x A true R false, 1x A false R true (good). Claim-check verdicts are UNCHANGED at 4 wrong / 2 partly right / 2 right (see MEDIUM).
- v2 recall items: partly fixed; the one-line-fact items listed under MEDIUM remain.
- v2 repetition caps: NOT fixed (see MEDIUM). Several ideas still run to 4-7 items per concept.
- Three-statement multi_statement: all six items use three statements, as the DPS standard requires.

## HIGH

- C8SC-12.2 idx 4 (5 marks, plan the mosquito comparison), point (5) "whether that effect would be direct or indirect, with the reason". The stem asks about fish reducing "the mosquitoes flying around" the pond, i.e. adults. Under the definition the pack itself uses in idx 8 (direct = a change in an organism the fish themselves eat; indirect = passed on through another organism), the effect on flying adult mosquitoes passes through the larvae the fish eat, so it is INDIRECT, exactly the logic the v2 HIGH used for adult dragonflies. The key says "The effect on larvae is direct" and then speaks only of "other organisms" as indirect, so a student who correctly writes "indirect on the adults, direct only on the larvae" has a defensible answer the key does not credit, and one who writes "direct" is credited. Two defensible answers on a marked step, the same defect class as the v2 HIGH.
  Smallest fix: change (5) to "whether the effect of the fish on the mosquito LARVAE in the water is direct or indirect, and whether their effect on the adult mosquitoes is direct or indirect", and make the key and step say "direct on larvae (eaten by fish), indirect on the flying adults (through the larvae)"; or restate the meanings in the stem.

## MEDIUM

Direct/indirect consistency in 12.2
- C8SC-12.2 idx 7 (d) key: "Fish affect dragonflies directly but seeds only indirectly". By idx 8's definition fish affect dragonfly LARVAE directly and adult dragonflies indirectly (the stem's table counts adult dragonflies seen). Contradicts idx 8 and re-creates the v2 contradiction. Fix: "Fish affect dragonfly larvae directly, and adult dragonflies, bees and seeds only indirectly."
- C8SC-12.2 idx 0 and idx 4: both ask "direct or indirect" with no definition in the stem; the book gives only a figure caption (red arrows direct, green indirect), so the premise is not on the page for a student. idx 0's answer (cat on sparrows direct, caterpillars and leaves indirect) agrees with the idx 8 definition, so it is consistent, just unstated. Fix: add the one-line meaning to both stems (or move the definition into the pond stem used by all of them).

Second defensible answer, loader or fact risk
- C8SC-12.3 idx 12 (d) "a dark storeroom with rich garden soil and a tap for daily watering, or a sunny verandah where only sandy, poor soil is available". Key: verandah "with daily watering". The stem gives water only to the storeroom; Pot 3 (sunny, never watered) wilted, so a student can defend the storeroom on the stem as written (the verandah has no stated water). Fix: add "water can be carried to either place" to the stem. Also drop "adding compost to the sand" from the key (not in the pots).
- C8SC-12.4 idx 3 (mcq) `a` is "Snakes and hawks still eat mice" but o[0] is "Snakes and hawks also feed on mice". The text differs; if the loader checks `a` against the options the item fails or the key is not found. Make `a` identical to o[0].
- C8SC-12.1 idx 9 (5 marks, five organisms vs the lawn): "Frogs: not fully", "Ducks: no. Ducks live on the pond and feed in its water", "snails live in the water". The book lists these as pond inhabitants only; it does not say ducks need water to feed, and the key's "not fully" for frogs is a hedge, not a one-answer step. Fix: use only organisms the book places in the water with a need the chapter states (fish: oxygen from water and food from small plants and animals; lotus, algae, diatoms, duckweed: water plants), and make the claim "can simply move" false for each.

Claim-check template
- Verdict mix still 4 wrong / 2 partly right / 2 right: wrong at 12.3 idx 8, 12.5 idx 6, 12.5 idx 14, 12.6 idx 17; partly right at 12.1 idx 2, 12.2 idx 9; right at 12.4 idx 5, 12.6 idx 12. 12.5 holds two "wrong" in one concept. Fix: turn 12.5 idx 14 ("An orchid is a parasite because it lives on another plant") into a partly right claim, e.g. "...because it lives on another plant, and the tree is harmed a little as a result", verdict: right that it lives on the tree, wrong that parasitism follows. Leave one more "right" as is.

Weak decision parts (the data does not fully settle it)
- C8SC-12.5 idx 11 (d): the spray "kills every insect on the mustard while it flowers" so the choice is made by the stem, not the data; no figures for the beehive cost or the leaf damage, and "Rs 4,000" is never used. Fix: give two numbers (e.g. pollinated flowers lost to spray vs leaf area saved) or drop the amount.
- C8SC-12.6 idx 2 (d): Farm Y still out-yields Farm X in year 10 (21 against 18) and a straight-line trend (Y falls about 0.44 a year, X rises about 0.1 a year) has Y ahead for roughly another 14 years; "move to X's methods" rests on soil rows, not on the yield trend the key cites ("Y's yield is falling while X's holds"). Fix: add a cost row (five sprays cost Rs ...) or ask "Over thirty years, which farm will still be productive? use the humus and earthworm rows".
- C8SC-12.1 idx 4 (d): the stem itself says the food amount stayed the same while the fish kept dying, so Plan 1 (double the food) is refuted in the stem; keep, but make Plan 1 look better (e.g. "food rose in April"), so the table is needed to dismiss it.

Repetition (more than two items on the same idea; the v2 cap was not applied)
- 12.1: fish gets food (biotic) and oxygen (abiotic) at idx 1, 4(a), 5, 19; conditions varying within one habitat at idx 0, 10, 15, 18 (and 8(4)); elephant / habitat loss at idx 2, 6, 14, 15, 16. Fix: keep two elephant items (6 and 16), recast 2 and 14, drop idx 19 or idx 5.
- 12.2: Pond A/B study at idx 4, 7, 8, 9, 15; pollination and flower parts at idx 11, 13, 16, 17 (idx 11 and idx 13 are the same closed-room scenario); idx 5 and idx 18 use the same 20 plants P / 5 plants Q patch, and idx 1 and idx 12 both ask "same kind, same requirements, competition"; the pond community chain (snails, duckweed, ducks) at idx 10, 14, 19. Fix: merge 11 with 13, drop 17 or 16, replace 18 with the community-vs-population question in the garden.
- 12.3: classify an interaction into biotic-abiotic / abiotic-abiotic / biotic-biotic at idx 1, 7, 17, 18, 19 (five); classify ecosystems as aquatic, terrestrial, human-made at idx 0, 14, 18, 20(c), 21 (idx 0 and idx 21 are the same valley); roots hold soil at idx 0(4), 4, 16, 20(d).
- 12.4: the millet numbers 2400 / 80 give the same 30 in idx 4 and idx 13(b); trophic-level counting at idx 2, 9, 10(c), 11, 13, 21; herbivore / omnivore labelling at idx 0(b), 6, 8, 11, 12(2), 17, 18; the mice-with-owls-snakes-hawks web in idx 3 and idx 5; "chain must start with a producer" at idx 12(1), 16.
- 12.5: parasitism with ticks or leeches at idx 0(3), 3, 9, 11, 13, 14, 16 (seven); mutualism with bees at idx 0(1), 3, 11, 17; bats and pests at idx 4 (sample) and idx 10.
- 12.6: organic manure / Kunapa Jala / organic farming at idx 14, 18(5), 19, 20; pesticide resistance at idx 9, 10, 19; humus and erosion at idx 2, 8, 9, 13.
  Fix across the chapter: cap each at two; replace the surplus with scope_in material not yet used (12.1 forest vs pond oxygen; 12.2 population versus community in one count; 12.3 Table 12.3 abiotic-abiotic pairs; 12.4 decomposer versus consumer; 12.5 competition data; 12.6 protected-area types, Green Revolution crisis dates).

Recall in disguise / easy (the bank allows no easy items: answer is one line of the page)
- 12.1: idx 11 (count abiotic in a list), 16 (corridor), 17 (find the wrong column), 3 (name a biotic and an abiotic part), 8 (compare pond and forest from the book), 7 and 18 (book lines).
- 12.2: idx 5, 18 (counting populations / 20 divided by 5), 10 (key is the only feeding chain among irrelevant options), 12 (competition line), 14(a), 15.
- 12.3: idx 7 (wind lifts sand), 11 (plants also respire), 13 (community versus ecosystem), 15 (mango tree), 16 (roots hold soil), 21 (count ecosystems), 14 (true statement, no misconception).
- 12.4: idx 3, 6, 8, 9, 17, 18, 19, 21 (label or level from the book's list); idx 15 and idx 12 are 5-mark restatements of pages 198-201; idx 16 is tagged Hardest but is the "chain starts with a producer" line.
- 12.5: idx 2 (Johnsingh line), 5 (Activity 12.9 restated), 9, 17, 20 (natural change), 0 (name five relationships).
- 12.6: idx 1, 5, 6, 9 (a matching of page 206 sentences), 10, 12, 16 (3 times, then a book line), 20, 11 (list three benefits), 7 (page 205 retold), and 15 below.
  Fix: do not raise every item; convert at least these to decisions or derivations: 12.3 idx 11, 16; 12.4 idx 8, 18; 12.5 idx 2, 9; 12.6 idx 1, 9, 10, 16, 20. Keep at most one "retell the page" 5-marker per concept (12.4 idx 15 and 12.6 idx 18 are the two retells to keep or rewrite).
- C8SC-12.6 idx 15 fill_blank "protected areas named in the chapter" is name recall from a list, not application. Replace with a computed blank (e.g. humus fell from 2.5% to 0.8%, the percentage left is ___) or a classification that needs reasoning.

Weak distractors (not real chapter confusions)
- 12.4 idx 3 ("Mice are herbivores, so nothing eats them", "Each animal is eaten by only one kind"); 12.4 idx 19 ("Snakes have more food, as mice compete"); 12.5 idx 2 ("hunt other tigers", "eat the grass"); 12.6 idx 1 ("Only producers, since consumers harm parks", "Weekly pesticide sprays"); 12.2 idx 10 (three irrelevant pond facts); 12.1 idx 16 ("Planting sugarcane and bananas right beside the village"). Fix: use look-alike chapter terms (consumer vs decomposer, direct vs indirect, mutualism vs commensalism).

## LOW

- C8SC-12.1 idx 6 (d): a fence is a defensible short-term answer; the key leans on the book's corridor claim. The stem says "do more for the village over the next ten years", which holds it; add one sentence on cost per year if you want it airtight.
- C8SC-12.2 idx 3 (a): "all four kinds counted ... together a community" is loose, since the community is every biotic component of the habitat. Say "the four kinds of organism counted".
- C8SC-12.2 idx 6: parts (a) and (b) are pure arithmetic (average x area); only the word population comes from the chapter. Keep (c), which uses the idea.
- C8SC-12.2 idx 16: removing petals and sepals does not change the key (pollination possible); true, but the chapter says nothing of petal function, so the wrong options "petals make the pollen" / "sepals receive pollen" are safe only because the stem names the parts; fine.
- C8SC-12.4 idx 12 (3): "grass -> hare -> vulture, third level" is chain-position-correct but the book says large carnivores like vultures "occupy the next level" after small carnivores (fourth); say "at least the third level in any chain".
- C8SC-12.4 idx 0 (c) is an open construction ("any valid chain earns the mark"): acceptable as an open part of a case study, not an MCQ; no change needed.
- C8SC-12.5 idx 10 and idx 4's sample answer both use bats roosting in a tree; vary one.
- C8SC-12.5 idx 1: tigers 17 in 2018 vs "grazing stopped between 2018 and 2022" is consistent with the data; no change.
- C8SC-12.6 idx 12: the book's "it reduces the population of natural predators" is ambiguous (fertiliser vs pesticide); the key follows the sentence literally, acceptable.

## Per-concept verdicts

- C8SC-12.1: pass after fixes (repetition of fish needs and elephants; several one-line items; idx 9 hedged keys).
- C8SC-12.2: rework three items (idx 4 HIGH; idx 7(d); definitions in idx 0 and 4), then cap pond A/B and pollination repeats.
- C8SC-12.3: pass after fixes (idx 12(d) water premise; five items on classifying an interaction; recall).
- C8SC-12.4: pass after fixes (idx 3 `a` text; repeated 2400/80 data; recall labels).
- C8SC-12.5: pass after fixes (second "wrong" claim; idx 11(d); seven parasitism items).
- C8SC-12.6: pass after fixes (recall-heavy 1-markers, name-recall fill_blank, idx 2(d), organic-farming repeats).

Final verdict: not load-ready. 1 HIGH (12.2 idx 4), plus a loader-format defect (12.4 idx 3). After those two, the direct/indirect wording, and the 12.3 idx 12 premise, the chapter is acceptable to load; the repetition and recall MEDIUMs should be fixed in the same pass.
