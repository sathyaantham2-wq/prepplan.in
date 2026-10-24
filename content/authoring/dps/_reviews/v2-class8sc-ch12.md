# Review v2: class8sc ch12 (SCI8, hecu112, How Nature Works in Harmony)

Read: all 127 questions (21/20/22/22/21/21), every one, against pages 190-209 of hecu112. Numbers recomputed in
python (all correct). Keys at o[0] confirmed on all 47 option items. Step marks sum to marks on every item. Indexes are 0-based.

Counts: HIGH 1, MEDIUM 18, LOW 9. Verdict: NOT load-ready as is; pass after fixes.

## HIGH

- C8SC-12.2 idx 10 (mcq) "Which finding belongs under 'indirect effects of fish'?" key "More bees and butterflies near the pond with fish".
  Option 1 "Fewer dragonflies flying over the pond with fish" is also an indirect effect on the author's own logic: the
  pack says fish eat dragonfly LARVAE, not adults (idx 5 Statement 1 is false for exactly that reason), so fewer adult dragonflies
  is one step removed. Yet idx 16 labels "fewer dragonflies" a DIRECT effect. Two defensible answers and an internal contradiction.
  Fix: replace option 1 with a clearly direct finding (e.g. "Fish eating dragonfly larvae in the water" is already o2, so use
  "Fish taking food from small plants and animals"), and make idx 16 call only "fish eat larvae" direct and "fewer dragonflies" indirect, or the reverse, consistently.

## MEDIUM

Tie / second-verdict risk
- C8SC-12.1 idx 14 claim_check "Elephants enter farms in Jharkhand only because the rainfall has changed." Key "partly right", but the word "only" makes the claim simply wrong; a marker could accept "wrong". Fix: drop "only" ("mainly because"), or key "wrong" and keep the mark scheme.
- C8SC-12.5 idx 14 claim_check "the harm to soil and water was caused by farmers using too many pesticides." The book says pesticide use did harm the environment, so "right" is defensible; "partly right" rests on a root-cause reading the stem does not ask for. Fix: add "farmers are to blame, not the loss of frogs" or "only".
- C8SC-12.5 idx 10 (fish counts 120,150,135,125): the key's rule "a narrow range, returns within it" is the author's inference; the book says only that balance is "dynamic, not fixed". The stem gives no rule for "narrow" (a 25% swing). Acceptable only if the rule is supplied. Fix: state in the stem "a balanced ecosystem keeps numbers stable around a level, although they may rise and fall", or ask only "does a changing count alone prove imbalance?" and delete "narrow range".

Recall in disguise / easy (the bank allows no easy items; each answer is a one-line fact or a vocabulary item)
- C8SC-12.1 idx 17 (5 marks "Justify ... elephant ... chain"): recitation of page 191, not justification. idx 12 and idx 13 likewise (book sentences).
- C8SC-12.2 idx 3 (population: rohu fish on one morning), idx 7 (stamen/carpel), idx 6 (net bags, pollination), idx 16 (5 marks: pond A/B passage retold in five points). idx 4 (average of 15, 9, 12) and idx 14 (averages, x30, ratio) are arithmetic only; the chapter adds nothing beyond the word "population".
- C8SC-12.3 idx 3 (fill_blank "terrestrial", banyan is named in the book), idx 7 (level order), idx 12 (two ecosystem types), idx 18 (5 marks, page 197 retold), idx 19 (level order again).
- C8SC-12.4 idx 4, 7, 8 (classification by definition), idx 10 (word parts auto/hetero/troph), idx 13 (dung beetles), idx 16 (heterotroph counts from the book's own lists), idx 18 (compare producers/consumers/decomposers, a table recited).
- C8SC-12.5 idx 1 (frogs caught, so more pests: the book's one line, with absurd options "fewer insects, as frogs ate crops"), idx 2 (assertion-reason that restates Activity 12.9), idx 3, idx 6 (fill_blank "parasitism", definition handed over), idx 8, idx 11, idx 12, idx 13 (a) , idx 17 (5 marks, page 202 retold), idx 16 (the sample answer is the book's pond-pollution chain).
- C8SC-12.6 idx 1, 4 (fill_blank "monoculture" with its definition in the stem), 6, 7, 8, 9, 10, 12, 13 (lists from pages 203-206), idx 17 (5 marks: the pages 205-206 retold).
  Fix across the chapter: turn each into a decision or a derivation (supply a small data set or scenario whose answer needs the chapter idea), keep at most one "retell the page" 5-marker per concept, and drop at least one fill_blank of the three name-recall ones (12.3 idx 3, 12.5 idx 6, 12.6 idx 4) in favour of a computed value.

Strawman last parts of case studies (the wrong plan is plainly silly)
- C8SC-12.1 idx 19 (d) lights and drums vs restoring the corridor; idx 20 (d) "a habitat must be big" (the stem's own record shows ants and a spider on the bark).
- C8SC-12.3 idx 20 (d) clear the grass vs keep a strip; idx 21 (d) "water is the only non-living thing" (Pots 2 and 3 refute it at a glance).
- C8SC-12.5 idx 0 (d) weekly spraying vs stop the waste; idx 20 (d) import tigers vs protect prey; idx 19 (d) scrape ferns.
- C8SC-12.4 idx 20 (d) scrape the fungus 'to keep the forest clean'.
  Fix: give each (d) two plans with a real cost and a real benefit (e.g. spraying cuts this season's loss, while the cause-fix pays off slowly) so the data decides.

Weak or silly distractors (not real chapter confusions)
- C8SC-12.4 idx 2 ("Mice are producers", "change into carnivores", "Grass stops growing without owls"); C8SC-12.5 idx 1, 3, 6, 8; C8SC-12.6 idx 6 ("pests turned into pollinators"), 7, 8 ("No sunlight or soil at all"), 9.
  Fix: use look-alike chapter terms (consumer vs decomposer, direct vs indirect effect, commensalism vs parasitism).

Repeated ideas (more than two per concept)
- Elephant/forest-loss chain in 12.1: idx 2, 3, 6, 7, 13, 14, 15, 17, 19 (nine items).
- Snake-by-night/rodent-by-day in 12.1: idx 1, 5, 7, 11, 18.
- Pollination in 12.2: idx 5, 6, 7, 9, 11, 12, 17 (seven items); pond A/B study: idx 2, 5, 10, 13, 16, 18.
- Photosynthesis/sunlight as the interaction in 12.3: idx 9, 13, 17, 18, 21. Four-level hierarchy: idx 7, 14, 19.
- Pond pollution chain in 12.5: idx 0, 16, 17 (a table version, a "not frog" version that can only be this chain, and the page itself). Frog-legs: idx 1, 2, 14. Johnsingh/predator-prey: idx 8, 13, 18, 20.
- Sundarbans protection in 12.6: idx 1, 2, 5, 13, 20.
  Fix: cap each at two; replace the surplus with a different idea from scope_in (12.1: table 12.1 items, forest vs pond oxygen; 12.2: community vs population in the garden count; 12.5: competition data; 12.6: protected-area types, humus numbers).

Template (counts)
- Slot structure is identical in all six concepts: nine 1-mark items, then five 2-mark shorts, three 3-mark, two 5-mark long answers (a "Justify ... in five points" and a "Compare ... on five points"), then two 4-mark case studies; mark list tails [2x5, 3x3, 5, 5, 4, 4] match in every concept. The five-mark pair appears in 12 of 12 slots as justify/compare/analyse-in-five-points.
- Correct option is the longest on 23 of 47 option items (49%); in 12.1 five of nine, in 12.2 four of seven. The 12.1 idx 0, 2, 4 and 12.2 idx 6, 7 are visibly longer.
- Claim-check verdicts (8 items): wrong 4, partly right 2, right 2. Fix one "wrong" into "partly right" (12.2 idx 13 or 12.5 idx 15).
- multi_statement keys across the six: 1&3, 2&3, all three, 1 only, 1&2, 2 only: spread is good. assertion_reason keys: 2x "R explains A", 2x "R not explanation", 1x A true R false, 1x A false R true: good. true_false verdicts: 4 False, 2 True: acceptable.
- Case-study last parts that need no chapter: 12.1 idx 19 (a) and (c), 12.5 idx 20 (a) are table reading and a ratio.

## LOW

- C8SC-12.1 idx 2: "tackles the cause the chapter describes" but a corridor does not reverse habitat loss; say "keeps elephants away from homes".
- C8SC-12.1 idx 20 (a)/(d): fungus is counted as biotic, correct; fine. But idx 0 and idx 20 both use bark-as-habitat.
- C8SC-12.2 idx 12 (b-style) idx 11/12 ask for "two reasons" that are one chain split into two marks.
- C8SC-12.3 idx 3 fill_blank "terrestrial": "land" or "natural" are plausible competing answers; give a fuller cue or a different blank.
- C8SC-12.3 idx 20 (a): observation 7 (rice fields take water from the lake) could also be read as abiotic-abiotic; reword to name the paddy plants.
- C8SC-12.4 idx 9: the rule "level = steps from the producer" for the crow is the author's extension (the book names levels only for herbivores and carnivores); put the rule in the stem.
- C8SC-12.4 idx 20 (a): bracket fungus counted as a heterotroph (4) agrees with the book's definition but the Snapshots list decomposers apart from consumers; add "by the definition of heterotroph in the chapter". idx 20 (c): "using only this table", the dhole's diet is not given beyond "animals", and sal tree -> crow -> dhole is also valid; say "any valid chain earns the mark".
- C8SC-12.5 idx 15 tagged Hardest but is a one-step use of the definition.
- C8SC-12.6 idx 0 true_false is a plainly true two-sided statement with no real misconception; give a false version (e.g. "synthetic fertilisers only harm soil and never helped India").
- C8SC-12.6 idx 14: the book's "it reduces the population of natural predators" is ambiguous (fertiliser or pesticide); key follows the text literally, acceptable.

## Facts and arithmetic (all checked)
12.1 idx 19: 15/3 = 5, 52-41 = 11. 12.1 idx 20: abiotic counts 2 and 2. 12.2 idx 1: 20/5 = 4; idx 4: 12; idx 14: 19, 5, 570, 150, 3.8; idx 18: 55, 90/35 = 2.57; idx 19: 55, 15, 26/9 about 2.9. 12.3 idx 8 (1 aquatic, 1 human-made), idx 21: 3/6 = 1/2. 12.4 idx 0: 3; idx 16: 8 and 3; idx 17: five chains, hawk at levels 3, 4, 5 (verified by enumeration). 12.5 idx 0: 3.25; idx 20: 56%. 12.6 idx 19: 16%; idx 20: 23.7% and 35/8 = 4.4 (more than four times). No factual errors against the pages; no unsafe tasks; no option named by position; no scope_out violation (the pack uses pages 190-209 only; the Probe-and-ponder and Keep-the-curiosity-alive questions are not copied, though 12.4 idx 15 is close to Keep-the-curiosity-alive 4, which is the same idea in a changed form: acceptable).

## Per-concept status
- C8SC-12.1: pass after fixes (repeat cap, three recall items, two strawmen, claim idx 14 wording).
- C8SC-12.2: rework the HIGH item idx 10; arithmetic-only and recall items; cap pollination.
- C8SC-12.3: pass after fixes (recall items, two strawman decisions, repeated photosynthesis).
- C8SC-12.4: pass after fixes (recall-heavy 1-markers, weak distractors in idx 2, strawman idx 20 (d)).
- C8SC-12.5: pass after fixes (idx 10 rule, idx 14 tie, repeated pond-pollution and frog items, recall).
- C8SC-12.6: pass after fixes (almost all 1- and 2-mark items are page recall; weak distractors).

Verdict: not load-ready; 1 HIGH plus a recall-heavy 12.5 and 12.6. Re-check after the author rewrites those items.
