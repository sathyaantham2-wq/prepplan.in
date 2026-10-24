# Re-review v3: dps/class8sc/ch01.json (SCI8, hecu101, 121 questions, 271 marks)

Method: all 121 items read, answer decided before the key; every changed item (71, matched by text against orig.json) checked against pages 001-007; all numbers recomputed in python. Indices are 0-based within the concept, in file order (the file is now shuffled relative to v2, so v2 numbers do not apply).

Counts read: 121 questions, 6 concepts (1.4 has 21). Types: short_answer 45, long_answer 27, mcq 27, fill_blank 6, multi_statement 6, assertion_reason 6, match 4. Bloom: Analyse 55, Evaluate 29, Apply 22, Create 8, Understand 7 (6%). Difficulty: Hard 97, Hardest 24 (no Easy, no Remember).
Machine checks, all clean: step marks sum to `m` on every stepped item; correct option is o[0] on all 43 option items; no wrong option equals the key; no duplicate options; no positional references ("option (b)" etc.); three statements in all 6 multi_statement items.
Correct-option-longest: 14 of 43 (33%). `multi_statement` keys: 1&3, 2 only, 1&2, all three, 2&3, 1 only (spread good). AR keys: both+explains (1.1, 1.2), both without (1.3, 1.6), A true R false (1.4), A false R true (1.5). Claim-check verdicts: No 3, Partly right 2, Yes 2 (good mix). true_false verdicts: False 4, True 2. Slot order differs between concepts (multi_statement at positions 18, 13, 4, 1, 4, 4; AR at 19, 10, 11, 18, 10, 12).

## v2 status

All v2 MEDIUM/LOW items were addressed; most are really fixed, a few only partly.

| v2 | Status |
|---|---|
| M1 1.4 fill_blank 12 x 29.5 | Fixed. Replaced by the "how many of three conditions does the planet meet" fill_blank (1.4 [9], answer 2, chapter-dependent). |
| M2 1.6 average fill_blank | Mostly fixed. Q2 is now a claim_check. Arithmetic stays inside 1.6 [7] (a), [8] (a), [11] (b)(c) but each is scaffolding for a chapter-dependent last part. Partly open (see M-5). |
| M3 1.2 appliance classification | Fixed. Premises are now in the stems (match 1.2 [2]: "pump whose motor spins", "blanket whose wires get warm"; hair dryer 1.2 [16] gives coil and motor). |
| M4 recall in disguise | Partly fixed. About 40 items were rebuilt as scenarios; statement-truth and one-line items remain (see M-3). |
| M5 strawmen | Mostly fixed. 1.4 [0] pond now has half-net vs no net; 1.2 [14] and 1.3 [9] rebuilt. Case-study (d) parts are still mostly determined by the data (see M-2). |
| M6 1.5 Q1(c) | Fixed (1.5 [16] (c) now needs the chapter's "very thick layer" check). |
| M7 1.4 match | Fixed (1.4 [15]: items now "why a different part is lit" = d, "early humans made the first calendars" = c; one defensible key). |
| M8 1.5 claim "only" | Fixed (1.5 [12] Mehul: first half right, second wrong, a clean "partly right"). |
| M9 pond key | Fixed (1.4 [0] key says water (lotus, fish, grass), sunlight (lotus, grass), consistent with the table). |
| M10 Moon claim | Fixed (1.4 [6] no longer claims the Moon "does not change shape"). |
| M11 puri open question | Fixed (1.5 [6] (c) says the puffing is not completely understood). |
| M12 templating | Partly fixed. Slot order and claim_check/true_false placement now vary; "Differentiate" frame is gone. The (a)/(b) 2-mark frame still appears 19 times (see L-3). |
| M13 repeated ideas | Partly fixed; 1.5 and 1.6 are still dominated by two or three ideas (see M-4). |
| M14 case-study climbing | Fixed for the three flagged studies (1.2 [0], 1.1 [8], 1.4 [0] now have parts that need the chapter). |
| L1-L11 | L1 (kite) fixed 1.1 [10]; L2 fixed ("conclusion drawn", 1.1 [4]); L3 fixed (1.1 [14]); L4 fixed (1.3 [15] match is now class vs example); L5 fixed (true_false 4 False / 2 True); L6, L7 replaced; L9 fixed (1.6 [8] has a Notes column); L8 partly (1.4 [12] distractor "only the fish" is closer). |

## HIGH (1)

1. **C8SC-1.3 [10]** (long_answer, 5 marks, Evaluate/Hardest, iron/sulphur): the stem says "A teacher prepares **five** samples and describes each one", but only (i) to (iv) are listed (four), and the task says "Classify (i) to (iv)". Stem count error; a student will hunt for a missing (v).
   Fix: change "five samples" to "four samples". Everything else in this item is accurate against the stem (iron + sulphur ground together stays magnetic; after strong heating a black non-magnetic solid, a compound; oxygen alone an element); marks 1+1+1+1+1 = 5.

## MEDIUM (5)

1. **C8SC-1.6 [5]** (case study, Kabir atta/maida, part (c)): "Decide the conditions for that trial so it can be compared fairly with Trial 1." The key is maida, 3 mm, hot oil (flour only changes). But atta, 3 mm, boiling hot oil also differs from Trial 1 in exactly one thing and compares fairly with Trial 1 (it allows an oil-temperature comparison, and fairly compares flour against Trial 2). The stem's opening sentence (flour question) points to the key, but the part itself does not say so.
   Fix: write "so that his flour question can be answered by comparing it with Trial 1" and keep the 2 marks for maida/3 mm/hot oil.

2. **Case-study decisions are mostly determined by the data, not trade-offs** (the style rule says "a real trade-off the data supports both ways"). Clear winners: 1.2 [0] (breakfast 70 vs vaccine camp 16; second plan is a strawman), 1.2 [14] (Slide 1 follows from the stem), 1.3 [14] (Friday, smallest allowed difference), 1.4 [19] (d) (Night 30 + 29 = 59 is pure arithmetic, not a decision), 1.5 [14] (S: the most settings that fit), 1.1 [8] (Motto 3 is the book's sentence). Good ones: 1.6 [11] (Rs 96 vs Rs 90 with wasted dough), 1.1 [6], 1.4 [0].
   Fix: for two or three of these, make the loser attractive. For example 1.2 [0]: the vaccine camp also protects the 16 from a repeat outbreak, so the choice depends on what is lost; 1.4 [19] (d): ask which night to hold a fair whose lamps are fixed, not the next purnima date.

3. **Recall in disguise (the answer is a one-line book fact), whatever the label.** One-mark and 2-mark statement-truth slots:
   - 1.1: [2] (true_false, world getting warmer), [19] AR (A and R restate the same sentence).
   - 1.2: [7] true_false (ball falls because a force acts), [10] AR, [11] claim (heating vs magnetic), [13] statements, and [12], a 5-mark item that negates five one-line facts.
   - 1.3: [3] true_false (room of air), [4] statements, [11] AR, [13] claim (rice and stones), [16] (order of topics).
   - 1.4: [1] statements (all three true, each one line), [3] glasses MCQ, [10] true_false, [13] claim, [18] AR.
   - 1.5: [0] (rewrite the book's own question with "batura"), [4] statements, [10] AR, [18] true_false, [19] (a).
   - 1.6: [4] statements, [10] true_false, [19] MCQ.
   About 28 items. The source chapter is a thin orientation chapter, so some are unavoidable, but per the brief they should not carry 2 to 5 marks. Fix: 1.2 [12] should be cut to a 2-mark item or rebuilt as a "find the one wrong sentence and say what it should be" with fewer, harder lines; 1.5 [0] should ask for a scientific question about a new situation (a batura on a different stove) instead of swapping one noun.

4. **Repeated ideas** (style rule: about twice per concept).
   - 1.5: "which thing is controlled and which observed" is classified in [2], [5], [8], [9], [10], [11], [18] and part of [12], about 8 times.
   - 1.6: "notes of what you see" in [0], [8] (d), [9], [12], [15]; "yes/no vs measured" in [1], [8] (c), [10], [11], [18]; "change only one thing" in [5], [7], [8], [16].
   - 1.4: [4] and [14] both test the three Earth conditions with fictional planets, plus [9] a third time.
   Fix: keep two per idea; replace the extra items with untested content (kite vs root distinction in 1.5, the puri-puffing-not-understood idea in 1.6, rough surface vs mirror in 1.4).

5. **Parts answerable from the stem alone** (a case study or two-part item should not give its own answer):
   - 1.5 [14] (c) and (d): reading the table (which finish in 40 min, which has most settings) needs no chapter; only (a) and (b) do.
   - 1.1 [9] (a): "what does her record show" is read off the three 5 s values; (b) needs the book.
   - 1.2 [18] (a)(b): reading and subtracting the speed row (the chapter enters at (c)).
   - 1.3 [14] (a) and (c), 1.6 [11] (b) and (c), 1.6 [8] (a): arithmetic only; chapter enters elsewhere.
   Fix: acceptable where the last part needs the chapter and carries the marks (1.1 [9], 1.2 [18], 1.6 [8] are fine); for 1.5 [14] move one mark from (c) to (a)/(b), or ask in (c) which of the chapter's habits the lost 5 minutes would cost.

## LOW (5)

1. **C8SC-1.6 [3]** (Puri 2 "no" with 8 s): "no" with "8 s" could mean the group stopped waiting at 8 s; the key allows only "one entry is wrong". Fix: add "the group's rule is that the time column records only the time at which a puri puffs".
2. **C8SC-1.1 [17]** Line 2 ("Investigation means our answers can change, and each answer opens new questions") is also partly what Grade 8 says (observations improve understanding). Fix: use an unambiguously Grade 7-only sentence for the swapped line.
3. **Template: (a)/(b) 2-mark frame** appears 19 times in the 45 short answers (1.1 [9], [11]; 1.2 [9], [16], [17]; 1.3 [5], [17], [18]; 1.4 [5], [8], [11], [16]; 1.5 [0], [1], [19]; 1.6 [7], [13], [14], [17]), at 2 to 4 per concept, with (b) very often "why/what must now be..." Fix: vary a few into one-sentence data-reading, odd-one-out or error-spotting items.
4. **C8SC-1.4 [11]** (a) key says the grandparents plan "lacks measuring"; "lacks careful observation" is also defensible from the same sentence. Fix: accept both in the step mark.
5. **C8SC-1.1 [14]** option 3 "Testing the tip breaks the root, which means ideas we must never change" is contrived; and **1.2 [8]** options 2-4 do not show anything about microbes, so they are weak distractors. Fix: use closer chapter confusions (for example "it was found in village water, so it must be a harmful microbe").

## Facts and arithmetic verified (changed items)

All recomputed and correct: 1.1 [10] pages 55, 57, 59, 61 = 4; 1.2 [0] 200 - 184 = 16 and 70 - 16 = 54; 1.2 [15] helpers = 2; 1.2 [18] rises 15 km/h (0-20 s), falls 15 km/h (50-70 s); 1.3 [14] differences 2, 7, 16, 1, Friday 5, Town B 1002; 1.3 [2] pair S-T 8 hPa vs M-N 0; 1.4 [4] planet checks 1/3, 1/3, 2/3; 1.4 [9] = 2; 1.4 [19] 30 - 1 = 29, 30 + 29 = 59; 1.5 [13] 3 ways x 4 = 12; 1.5 [14] only S fits and has 3 settings; 1.6 [5] 6 s / 3 s = 2x; 1.6 [7] 12/4 = 3; 1.6 [8] averages 3, 6, 14 s; 1.6 [11] 18 and 12 puffed, Rs 90 and Rs 96; 1.6 [17] 7 - 4 = 3 s; 1.6 [18] = 2. Outside-book facts are supplied in stems and accurate (iron/sulphur, imaginary planets, hPa values, frogs and insects, a hair dryer coil and motor). No scope_out line is violated (no item gives a mechanism for puri puffing; the Shaka calendar is not used; Chapter 2-13 content stays at the one-paragraph preview level).

## Per-concept verdicts

- C8SC-1.1: keys sound; pass (recall items 1.1 [2], [19] only).
- C8SC-1.2: keys sound; pass after fixes (1.2 [12] five-mark negation list; case-study decision 1.2 [0]).
- C8SC-1.3: **one HIGH** (1.3 [10] says five samples, lists four); otherwise sound.
- C8SC-1.4: keys sound; pass (1.4 [19] (d) is arithmetic only).
- C8SC-1.5: keys sound; pass after fixes (repeated control/observe classification, 1.5 [14] (c)(d)).
- C8SC-1.6: keys sound; pass after fixes (1.6 [5] (c) has a second defensible trial; repeated notes/measure ideas).

## Template read

Templated: no longer. Slot orders differ, claim-check and true_false placement vary, key spread is good, correct-longest 33%. Remaining pattern: the (a)/(b) 2-mark frame (19 uses) and the two repeated themes in 1.5 and 1.6.

Counts: 1 HIGH, 5 MEDIUM, 5 LOW.

Verdict: NOT load-ready until HIGH 1 (1.3 [10] "five samples") is fixed; with that one-word fix and MEDIUM 1 (1.6 [5] part (c) wording) the pack is load-ready. The MEDIUM 2-5 items are quality improvements, none changes a key.
