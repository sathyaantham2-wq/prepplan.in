# v3 review: DPS Class 7 Science ch03 (Electricity), gecu103

Source: content/extracted/gecu103/pages/001-018. Questions read: 127, every one (3.1 22, 3.2 21, 3.3 21, 3.4 21, 3.5 21, 3.6 21). Keys were recomputed independently (counts, combinatorics, trial tables, sums, MS/AR truth values, match pairings) before being compared with the stored key. 0 wrong keys.

Result: HIGH 0, MEDIUM 8, LOW 11. Verdict: PASS (with small fixes).

## v2 findings: status

- v2 HIGH 3.2#19(c) (LED "longer wire at the cap end": 1 or 2 answers): FIXED. Now 3.2#4(c) fixes the LED at the lamp end with the longer wire to the lamp end of the battery. Recomputed: only "all caps towards the lamp" makes that end positive, so 1 is the unique answer.
- v2 HIGH 3.3#15 (dead cell second answer): FIXED. Now 3.3#1 says "cells ... known to be good".
- v2 strawman case-study last parts (3.1#21d, 3.2#21d, 3.3#20d, 3.4#22d, 3.6#22d): FIXED. Last parts are now real choices (3.1#6d, 3.1#14d, 3.3#3d, 3.4#12d, 3.6#10d, 3.6#14d). 3.4#5(d) is rebuilt (see M3).
- v2 5-mark steps with no stem question (3.4#20): FIXED (3.4#8 asks for the explanation).
- v2 four-statement MS (3.6#7): FIXED, all six MS items now have 3 statements.
- v2 repeated ideas: only partly fixed (M4). Slot templating: improved (case studies no longer all last; MS/AR/match scattered).
- v2 "67% easy-in-disguise": down to about 35% (see list). Text is largely new.

## Recompute log (all agree with keys)

3.1: #2 7 toggles = odd, so position flips (glowing). #7 fans 2 + geyser + fridge = 4. #11 five headings (Transportation, Heating and Cooling, Cooking, Others, Entertainment). #12 two sources allowed. MS #10 = S1 T, S2 F, S3 T ("1 and 3 only"). Headings checked against p.1 of the book (radio under Entertainment, immersion rod under Heating and Cooling, microwave under Cooking, computer under Others, Communication and seven headings exist).
3.2: 4 cells 3 joints; 6 cells 5 strips; 2^3 = 8 arrangements, 2 work, LED glows in 1. #6 joints: 1-2 correct, 2-3 disc-to-disc. #7 two wrong joints. #10 trials 1 and 4 glow, trial 2 disc-disc, trial 3 cap-cap, LED only trial 1. #13 right cell cap downward. MS #5 = F T T. AR #11 A T R F; #16 both T not explanation.
3.3: LED longer wire total 2.4 + 2.6 + 2.2 = 7.2. #18 glowing trials 12 + 4 = 16, dark 4. #15 L2 and L4 LEDs (trials 2 and 1), L3 fused. MS #6 all true (T T T). AR #13 A F R T. Match #21 1-a 2-b 3-c 4-d.
3.4: #4 only the cell changes the outcome. #5 attempts 1 and 4 glow. MS #7 = T T F. Match #21 correct.
3.5: #6 A glows, B/C/D dark; B is the one fixed by the switch. #9 X glows, Y has short-to-short. #10 positive is the left end, LED drawn against current. #16 three joints. #17 X 2 joints, Y 0 joints, base to right end after mirroring. #20 LED glows (right end long). #21 4 drawings, 1 glows. MS #1 = F T F ("2 only").
3.6: #3 dark for plastic ruler, rubber eraser, ceramic cup = 3. #14 spoon, foil, key glow. MS #13 = T F F. Match #11 correct.
Book facts checked in text: cautions about wet hands/wet areas/damaged insulation (p.14), "Silver, copper and gold are the best conductors", ceramics as insulators, '+'/'-' printed inside compartments (p.9), IEC/ANSI/IEEE (p.12), Bhakra Nangal opening.

Template checks (read by hand and by script): no Remember/Easy; Analyse 72, Evaluate 29, Apply 16, Create 10 (no Understand, so Understand 0%); Hard 103, Hardest 24. Step marks sum to marks everywhere. Scenario mcq per concept 4, 4, 4, 5, 3, 4 (min 3). Chapter minimums: fill_blank 6, true_false 6, match 4 met; claim_check 6; case studies 2 per concept. Correct MCQ option is the longest in 5 of 24 (21%, fine). No positional option references ("option (b)" etc.) anywhere. MS 3 statements everywhere. AR spread: explains 2, not explains 3, A true R false 2, A false R true 1. T/F verdicts False 4, True 2 (ok).

## MEDIUM

M1. 3.1#2 (fill_blank "lamp is glowing" after 7 slides): a dark torch lamp may be dark because the cells are dead or a joint is loose, in which case sliding never lights it; "dark" is a second defensible answer. It is also a parity puzzle that tests nothing from the chapter. Fix: state that the cells and joints are good and the lamp is dark only because the switch is OFF, or replace the item.
M2. 3.2#10(d): "Which rule is enough for the incandescent torch, and which for the LED torch?" Rule Y (both caps towards the lamp) is also enough for the incandescent torch (trial 1 glows), so "Y for both" is correct yet the key and step mark want "X for incandescent, Y for LED". Fix: ask "which rule is the least a Class 6 child needs for each torch".
M3. 3.4#5(d): the stem says "same cell" but attempt 2 is "built the next day"; the key's "not supported because the same cell lit the lamp in 1 and 4" does not rule out a cell that went flat overnight. Fix: say attempt 2 uses the same cell, same day, or let the answer be "not yet supported; check the switch contact first because ...".
M4. Repeated ideas (residual): 3.2 "a cell turned round puts like terminals at its joints" is the core of #5(S2), #6, #7, #9, #12, #15, #19, #20 (8 of 21); 3.3 "two trials: glows both = incandescent, one = LED, none = fused" in #2, #3, #7, #8, #10, #14, #15, #17, #18, #21 (10 of 21); 3.5 "triangle points positive to negative" in #1, #2, #3, #6, #10, #14, #17, #20, #21 (9 of 21); 3.6 plug top insulator/connectors conductor in #1, #2, #6, #13, #16, #18, plus copper cost in #1, #11, #21. Fix: swap two or three per concept for other ideas (3.2 the Fascinating Facts battery meaning; 3.3 book Q7/Q9 style faulty-lamp reasons; 3.5 the cell/battery symbol only; 3.6 DC/AC and tester care).
M5. claim_check verdicts: 5 of 6 are "No" (3.2#17 even concedes the shopkeeper is partly right). Make one or two "Yes" or "Partly" with a subtle trap.
M6. 3.1#21: Display 1 versus Display 2: the weak side is built from the forbidden thing (visitors switch on mains appliances) so the choice is near-forced, and the rubric step says "or a reasoned choice" while the key says "Recommends Display 2". Same pattern in 3.1#14(c) (wall-socket lamp versus cell torch) which is a recall of the caution. Fix: give Display 1 a legal feature (appliances shown on a poster, not powered) or align the step text.
M7. Easy-in-disguise remains at about 45 of 127 (35%), mostly the 1-2 mark lookups: 3.1#1, 4, 5, 9, 10, 12, 13, 15, 16, 19, 20, 22; 3.2#2, 9, 11, 14, 16, 17, 18, 21; 3.3#7, 10, 11, 13, 16, 19; 3.4#1, 7, 9, 15, 19, 20, 21; 3.5#4, 5, 8, 11, 15, 16, 19; 3.6#1, 4, 8, 9, 11, 16, 18, 21. Acceptable for a Hard/Hardest label mix only if the paper builder treats them as recall/understand; consider relabelling a few to Understand rather than Analyse.
M8. 3.2#6(d): the coach says a fourth cell "will surely be brighter". The book says more cells give energy for a longer time and/or more energy; "more energy" can reasonably be read as brighter, so "partly supported" is the author's reading. Accept "supported, with the cell placed disc to cap" in the rubric or reword the claim to "will last as long as before".

## LOW

- 3.1#3 and #13: grouping by place/other basis is open-ended; key is only one acceptable answer (fine, rubric says any consistent basis).
- 3.1#8 and 3.3#5: the "reverse" model answers are fine but easy to pattern-match.
- 3.2#15(e): the printed '+/-' symbols are in the book (p.9) but the part is a one-line recall inside a 5-mark case study.
- 3.2#17: "Is he correct? No" while the answer concedes a single cell is also called a battery; say "Only partly".
- 3.3#3(d) and 3.3#12 justification: the key names incandescent for careless children; "LED with the longer wire marked" is also defensible in #12; the rubric should accept any reasoned choice (it does in #3, not in #12).
- 3.3#6: all three statements true (1, 2 and 3): valid but a weak discriminator; make one false.
- 3.3#8(b): "probably fused" for Group 4 (LED with a loose end would also fit); wording is hedged, ok.
- 3.4#6: stem does not say which drawing pin holds the safety pin's ring, so the order in (a) after the lamp case depends on the build; (b) is unaffected.
- 3.4#14(b) over-reads "he makes sure the switch is ON" as "already ON".
- 3.4#19 true_false is True with no real misconception.
- 3.5#17(c) is trivial after (a)-(b) (mirror image so base goes right); 3.5#10(d) has one sensible choice.

## Verdict

PASS. No HIGH; the two v2 HIGH items are fixed, every key recomputes, no scope violation, no positional option references, case studies are now real trade-offs. Remaining work is M1-M3 (small stem fixes), repeated-idea thinning (M4) and claim_check mix (M5).
