# Review v3: SST8 Part II ch3, A Journey Through Indian Architecture (hees203)

Pack: `content/authoring/dps/class8s/p2ch03.json` (9 concepts, 187 questions). Pre-edit copy diffed by index: 98 items changed. Every one of the 187 was read, all facts checked against `content/extracted/hees203/pages/` (all 40 pages read), all arithmetic recomputed in python.

Counts: HIGH 2, MEDIUM 24 (of which 7 chapter-wide), LOW 9. Verdict: NOT load-ready until the two HIGH items are fixed (both are small local edits). After them: load-ready.

## Mechanical checks (clean)
- Step marks sum to `m` on every item with steps. Correct option is `o[0]` and `a` equals `o[0]` on every MCQ/AR/MS/match. No duplicate option, no option named by position.
- Option length: correct is longest in 11 of 42, shortest in 10, middle in 21. This matches the author's report, and the old "never extreme" tell is gone. I read the rewritten options: no distractor became defensible and there is no garbled filler.
- Claim-check verdicts: No 5, Partly right 3, Yes 1. true_false: False 6, True 3 (33% True). AR: R-not-explaining 4, A false 2, R explains 2, R false 1. multi_statement keys: "1 and 2" 3, "2 and 3" 2, "1 and 3" 1, "1 only" 1, "2 only" 1, "3 only" 1 (three statements throughout; "all three" never keyed, LOW).
- Slot order differs concept to concept. Marks counts are the same fixed mix (8-9/5/3-4/2/2), as v2 said. Labels: Analyse 82, Evaluate 49, Apply 47, Create 9; no Remember or Easy; Understand 0.
- Scope: no scope_out name is used except the p.121-122 caption issue below.

## v2 HIGH status (all seven confirmed fixed)
- 3.1 [10] (was 3.1 H1 "sentinel"): now a timeline gap. The stem prints only 300 BCE; 2600 BCE (Dholavira, Fig. 3.2) must come from the chapter. 2600-300 = 2300. FIXED, one answer.
- 3.1 [12] claim check: verdict "No". Every conjunct is wrong or unsupported (everything about brick, no stone at all, same layout), so "Partly right" is not defensible. FIXED. 3.2 [11] "Partly right" is correct (brick or stone is right, "only Buddhists" is wrong by p.93, "common in Jainism too").
- 3.3 [0]: errors are "all of one design" (p.97: "very diverse") and "only highly sophisticated ones count" (p.97: simple ones such as a humble village pond are in the tradition). Both are contradicted on the page, and they are distinct. FIXED.
- 3.6 [1]: "any two numbered features" in (a). (b) offers a closed pair (workers vs courtyard capacity), so the answer is the courtyard, 25,000. One answer. FIXED.
- fill_blanks: 3.6 [18] needs 25,000 from p.108 (stem says "the limit the chapter gives"), 25,000/50 = 500. 3.7 [0] needs 60 km from p.111, 60/15 = 4. 3.8 [11] needs "four" from p.115, 3,600/4 = 900. Each needs a chapter fact the stem lacks and has one natural answer. FIXED.
- 3.8 [2] step line now credits calligraphy to Arabic and marble screens to Indian; geometric patterns are no longer assigned. FIXED.

## Redesigned case studies: one answer, no tie
- 3.3 [12] fund Rs 3.5 lakh: (3.5-0.8)/1.2 = 2.25, so 2 full years; 5-3.5 = 1.5 lakh short. M is the only affordable option. One answer, but trivial (see MEDIUM).
- 3.3 [18] silt: 100x0.4x0.5 = 20 t reaches Tank 3, x0.6 = 12 t. Limit 15 t, so Plan B only. One answer.
- 3.6 [3]: 25,000-18,400 = 6,600; 7,500-6,600 = 900 over; 6,600-6,000 = 600 left. Group C only (B and C together would be 13,500). One answer.
- 3.7 [6] fountains: Plan 1 Rs 6 lakh; Plan 2 3 + 1.5x10 = Rs 18 lakh; break-even 3+1.5n = 6, n = 2. The stem states the palace outlasts 10 years, so Plan 1 is the single answer.
- 3.9 [19] haveli: hotel 20-12 = +8 lakh; museum 4-12 = -8 lakh. The stem states the family's criterion (no extra money from its own pocket), so the data settle it and hotel is the one answer. It is not a values choice as written. A reader could add "museums preserve heritage" (p.110), but the question asks which plan meets the stated wish. Fine.
- 3.9 [1]: 6-5 = 1; 6/40 = 15%. Q is the one answer (P is already funded).
- 3.5 [6] (d): 1101-600 = 501 > 300. Correct on the narrowest reading, and the stem states that reading.

---------------------------------------------------------------------
## HIGH

**H1. C8S-3.3 [17] (5 marks) "...then rewrite the one that is wrong in more than one respect."** Key rewrites S3 ("Temple reservoirs were used for water-based rituals only"). S3 is wrong in exactly one respect (rituals only; the book says harvesting as well). S1 ("Harappan wells could collapse inward, so the Harappans gave up bricks") is wrong in two respects (the wells could not collapse inward; the bricks were the reason). S2 ("only stored rainwater; nobody gathered there") is arguably two as well. The instruction singles out a statement the key does not pick, so a student who rewrites S1 correctly loses the mark. Fix: change the stem to "rewrite any one wrong statement correctly" (keep the S3 rewrite as the sample and add that a correct rewrite of S1 or S2 also earns the mark).

**H2. C8S-3.9 [10] (5 marks) marking scheme asks for a point the question never asks.** The question asks for three verdicts plus a rewrite of S3 (four parts). The five steps add "The chapter's description of the design: rooms around a central courtyard" as a fifth mark. A complete, correct answer scores 4/5, and the AI marker will either deduct or invent the point. Fix: either add "(d) State in one line the design the chapter calls common in traditional houses" to the stem, or give S1/S2/S3/rewrite one mark each and make the fifth mark a stated, asked part (for example, two marks for S3's evidence and rewrite).

---------------------------------------------------------------------
## MEDIUM

### Chapter-wide
- **M-A. Recall in disguise remains the largest weakness.** The 18 five-mark items and about 12 two-mark items are chapter lookups in sequence (a)-(e), each one mark. The worst are the "which monument does this feature belong to" tables (3.6 [21], 3.7 [9], 3.8 [3], 3.5 [16], 3.2 [9]), with 3.4 [0], 3.4 [6], 3.5 [5], 3.7 [8] and 3.8 [10] close behind. The last concept (3.9) has no 5-marker that is a real comparison either. The five-mark slots now need a stated situation or data applied, not another lookup table.
- **M-B. Case studies are better but mostly end in a lookup or a decision the stem settles.** The new numeric ones (3.3 [12], 3.3 [18], 3.6 [3], 3.7 [6], 3.9 [19]) are sound. The rest end with a lookup (3.1 [2](d), 3.2 [1](d), 3.8 [1](d), 3.8 [7](b)-(c), 3.5 [6](a)-(c)) or a decision fixed by the stem (3.4 [1](d) "has resolved", 3.4 [5](d), 3.3 [12](d) because N is unaffordable). Strawman flavour: 3.3 [18] Plan A (leave as is), 3.9 [1] P (already funded), 3.7 [1] builder, 3.6 [0].
- **M-C. Case-study parts answered by their own stem.** 3.7 [6](a) (the stem describes the Persian-wheel system; it also duplicates 3.7 [18](a)); 3.9 [19](a) (the stem already says it is hard to maintain and too large); 3.6 [0](b) (the stem says the sketch shows full-size minarets); 3.1 [0](a) (partly). Fix each by moving the fact out of the stem or dropping the part.
- **M-D. Repetition above about twice in a concept.** 3.1 brick/stone at [0],[1],[12],[18]. 3.2 Udayagiri 2nd century BCE at [1],[2],[5],[7],[12]; Ellora timber roof at [2],[8],[16],[17]. 3.3 trapezoid brick at [5],[8],[14],[17],[19]. 3.4 south/north names at [0],[1],[10],[11],[19] and east alignment at [0],[1],[14]. 3.5 carve-then-fire at [2],[8],[9]. 3.6 Shah Jahan capital move at [4],[6],[19], mihrab/Mecca at [7],[10],[12],[16], "Jama" meaning at [2],[7],[17]. 3.7 fort siting at [8],[10],[12],[14] and fountains at [6],[7],[18]. 3.8 Taj three cultures at [1],[2],[10],[12],[14] and the pollution story duplicated in [7] and [10](d). 3.9 Indo-Saracenic at [3],[7],[18],[20], the 4,500-year courtyard at [2],[10],[12], haveli upkeep at [8],[19]. Cut each to about two.
- **M-E. Scope file still contradicts itself on captions (carried from v2 M-E, not fixed).** scope_out says plates on pp.121 and 122 "carry only a caption ... nothing is authored from a caption alone". Items 3.9 [0], [3], [9], [13], [17] and [7](e) rest on those captions (stambha, sloped tiled roof, Madras High Court 1892 and its facade, the Mysuru Maharaja laying the stone). scope_in lines for churches and colonial architecture name the same facts, so I treat the items as in scope. The scope file should be corrected so the next author is not told two things.
- **M-F. Claim-check mix:** Yes is only 1 of 9 (11%; target about a quarter). Turn one "No" in 3.4 or 3.9 into a Yes.
- **M-G. fill_blank is page vocabulary in four of eight.** 3.2 [7] "Jain" (the stem gives "dwellings"), 3.3 [19] "inward" (a sentence cloze; "inwards" will not match), 3.4 [19] "vimana", and 3.5 [13] (arithmetic fine, story arbitrary). The three repaired ones (3.6 [18], 3.7 [0], 3.8 [11]) are right.

### C8S-3.1
- [2] (b) "Name the detail in the other caption that the chapter does not state at all": the flag, but "guards checked every visitor" is also not stated (the book says "would have screened"). Add "among the details of the pillar" or ask "what is claimed about the pillar". (d) is a lookup.
- [14] (a) is quoted in the stem; (b) "which two parts go beyond": compass instruments and "exactly", but "every lane" is a third overreach. Fix: "name any two".
- [19] S3 ("the plan proves ...") is keyed "partly right"; "wrong" is also defensible because "proves" is the claim. Fix: key either verdict with the reason, or change the key to accept both with the evidence.
- [0] (c) predicts a sentinel room by analogy from one site; accept "guard room or smooth stone".
- [6], [8], [11] are one-step lookups.

### C8S-3.2
- [9] (d) "Name one thing both share": railings, but "both are in Madhya Pradesh" (p.93) is equally correct. Accept both.
- [18] (d) the sample rewrite of Note Q is Note P verbatim. Ask for a rewrite that keeps "stone" and does not claim "first".
- [1] the scholar in (c) is a strawman; (d) is a lookup.
- [8] 5 marks, mostly lookups; "must" overstates. [15] true_false with True verdict and no misconception.
- [7] fill_blank answer is a name copied from the page.

### C8S-3.3
- [9] "Water harvesting" is the shortest option by far and the stem restates the ritual use; lookup.
- [7] (b) lookup list; [6] distinguishes "terracotta rings" from "bricks" only by vocabulary (baked clay is also what bricks are).
- [14] "square bricks would not lock" is the author's inference, not the book's (acceptable as a show-it, flagged).
- [12] (d) is settled because N costs 5 lakh against 3.5; give N a partial benefit or a smaller cost.

### C8S-3.4
- [1] (b) "Plot B does not meet" overstates: the book says "generally" east-west.
- [5] (c) is an unrelated lookup (shilpashastra); (d) is trivial.
- [16] depends on Fig. 3.18 labels (prakara, secondary shrines, pradakshina corridor), which the stem does not describe. Ask for what the text says about enclosures (prakaras) and secondary shrines instead.
- [7] (a) "two responses": the key lists bhakti and contemplation, and "celebrate life" muddies it.

### C8S-3.5
- [19] (ii) "ornamental patterns covering every surface" is Dilwara's phrase, but Bishnupur's "elaborate surface decorations" invites a 2-2 tie. Reword (ii) to "tirthankara carvings" and (iii) separately, or state "patterns on every surface".
- [16] (5 marks) the tour operator "can include only one", but no choice is asked; (a)-(e) are lookups.
- [6] (a)-(c) lookups; (d) restates the chapter's wording in the stem. [10], [12], [17] are lookup pairs (Sharada Peetha at [6],[17]).

### C8S-3.6
- [0] (c)-(d) argue from silence; (b) is answered by the stem.
- [1] (b) is obvious once the pair is closed. Acceptable but light.
- [14] minaret definition and "on either side of the domes" (also asked in [7](b)).
- [13] true_false True with no misconception.

### C8S-3.7
- [7] AR: R ("helped keep the area cool") restates A ("air-conditioners"). "R explains A" is arguable; "R true but not an explanation" is also defensible. Reword R with the mechanism the book states (water flowing down terracotta pipes from overhead tanks created the fountains), or keep and accept.
- [8] (d) "a fort whose palace had quarters for several groups": Mehrangarh, but Agra's fort (palaces, quarters for maids and servants) is arguable. Say "the fort at Jodhpur".
- [15] stem restates o0. [2], [13], [20] lookups.

### C8S-3.8
- [7] (a)-(c) lookups; (d) only restates the chapter's step.
- [20] four-way vocabulary match of the star symbols; recall.
- [13] and [8] are page sentences with stems that echo the key.

### C8S-3.9
- [1] P is already funded, so the choice is not a trade-off; give P a stated need too.
- [4], [18] are lookups; [16] repeats the closing bullets.

---------------------------------------------------------------------
## LOW
- 3.2 [19] stem says "in this concept" (internal bank wording leaks into a student-facing stem). Delete.
- 3.7 [18] (b) "without machines" is the author's phrase; the book says only "eco-friendly air-conditioners".
- 3.8 [10] (d) "what did the city do": the book says a ban was imposed (after the committee and PIL), not by "the city".
- 3.5 [18] "Lingaraja to Vishnu" is an invented confusion, not a chapter one.
- 3.1 [16], 3.3 [6], 3.4 [14] have absurd distractors (granary, wooden planks).
- 3.3 [1] "silted up" is not on the book's list; (o0 still unique).
- 3.6 [18] reuses the 25,000 used in [3] and [1]; fine, but served together it leaks.
- multi_statement never keys "all three" (key spread has no all-true item).
- 3.5 [13] arithmetic is trivial once "five" is known.

---------------------------------------------------------------------
## Per-concept verdicts
- C8S-3.1: pass after fixes (no HIGH; M on [2],[14],[19], repetition).
- C8S-3.2: pass after fixes (no HIGH; repetition, [9](d), [18](d)).
- C8S-3.3: needs fix H1 ([17]); then pass.
- C8S-3.4: pass after fixes (no HIGH; vocabulary repetition, [16] figure dependence).
- C8S-3.5: pass after fixes ([19] tie risk, [16] frame).
- C8S-3.6: pass (MEDIUM only).
- C8S-3.7: pass after fixes ([6](a) stem-answered, [7] AR arguable).
- C8S-3.8: pass (MEDIUM only).
- C8S-3.9: needs fix H2 ([10]); then pass.

## Verdict
**Not load-ready as it stands: 2 HIGH (3.3 [17] key versus the stem's own instruction; 3.9 [10] unattainable fifth mark).** Both are one-line edits. After them there is no wrong key, no second answer and no fact or arithmetic error in the 187 items (every number recomputed, every fact read off the page). The remaining weakness is thinking depth (recall tables in the five-markers) and repetition, which are MEDIUM and can be loaded with and fixed later.
