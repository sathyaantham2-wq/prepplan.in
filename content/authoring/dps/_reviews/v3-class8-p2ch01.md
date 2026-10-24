# Re-review v3: Class 8 Maths Part II ch1 "Fractions in Disguise" (dps/class8/p2ch01.json)

Method: diffed against the pre-edit copy (54 changed items: C8M-1.1 x9, 1.2 x9, 1.3 x11, 1.4 x7, 1.5 x7, 1.6 x7... counted by index below), recomputed every changed key and every case-study part and step mark in python and by hand, checked scope_in/scope_out and book pages (GST on p.28, bill check p.19). Indices are 0-based inside the concept.

## v2 status

- Item 1 "percentage points": FIXED. The phrase now occurs 0 times in the file (grep). C8M-1.3 q21 defines the margin in the stem ("measured as the difference between the student's percentage and the class-average percentage").
- Item 2 Kunal (C8M-1.3 q5): FIXED. Now "the percentage increase in his marks is 10%", base is the marks, key False, 10/40 = 25%. One reading.
- Item 3 metro (C8M-1.6 q11): FIXED. Promise 12.9%; 1.08 x 1.1 x 0.95 = 1.1286, so 12.86% is within 12.9% (kept) and the added-up 13% would say broken. The verdict now hinges on compounding.
- Item 4 tractor (C8M-1.5 q13): FIXED. 486000/0.9 = 5,40,000; 540000/0.9 = 6,00,000 (= 486000/0.81); sell today 4,86,000 = 81% of the price paid; keep 4,37,400 + 40,000 = 4,77,400 = 79.57%; sell today wins by Rs 8,600. (a) and (b) feed (c). Decision is still numerically close but is a real comparison.
- Items 5, 6 (templated thresholds, badam clone): C8M-1.3 q6 is now a basket-bill case (weighted change 11.84% vs simple average 14%) and C8M-1.1 q3 is now a per-glass trade-off (Y has smaller sugar share but 13.5 g vs 11.8 g per glass). Improved. Some threshold-style decisions remain (see LOW 3).
- Items 7-9 (repeats, easy, clones): substantially reduced; residue in LOW 4.
- Items 10-20: C8M-1.3 q13 now says groups differ in size (fixed); C8M-1.3 q17 / C8M-1.2 q17 tell fixed (correct option is no longer shortest or longest; "They are equal, both being 124.8"); C8M-1.2 q14 R reworded; C8M-1.4 q18(a) now needs the GST idea; C8M-1.5 q1 distractor replaced (p x (1.07 x 5)).

## HIGH

None. Every changed key recomputes:
C8M-1.1: q3 59%, 12%/12%, 54%, 11.8 g vs 13.5 g (sums 200 and 250 g check); q4 22.5 + 30 -> bus 47.5%; q8 62.5/25/12.5, 1.5 L, 5 L, 2.8/10 = 28%; q9 match 1-b 2-a 3-d 4-c; q10 12.5%, 37.5% left, 3 kurtas; q13 6.5/6.2/5.2/5.6% so Ward 1; q16 12/40 = 30% = 21/70; q17 75/78/77.5, 29/36 = 80.56 but 28/36 = 77.78 so 2; q18; q19 2.25/22.5/225; q21.
C8M-1.2: q1 65 (distractors 100, 91, 156 all distinct); q7 96, 240, 144 and 72 girls, 96 girls = 40%, 75%; q9 85%, 312, 180, 768/720 = 106.67%, June 85%; q11 135% vs 126%; q12 196/0.8 = 245, 45; q14 A true R false; q15 7.2 h = 30%, 7.5%, 108 min both ways; q17 124.8 both.
C8M-1.3: q0 25% vs 22.22%; q1 37.5% -> 55; q2 75/75/76; q4 6,000; q6 25/15/-4/20, Rs 397 -> 444, 11.84%; q9 67.5, 2,700 -> 20%, 72/72.5/67.5, 4,532 (32 more); q13; q16 75/70/60/75, 16.67%, 72.22 vs 68.18; q20 7,500 vs 7,200 = Rs 300; q21 85/85, 75/80, 10 vs 5 -> X.
C8M-1.4: q1 80/1920 = 4.17%; q2 3,570, 27.5%, 12.5%, 3,850 vs 4,200; q3 640 x 1.35 = 864, /0.9 = 960; q11 Rs 6,000, 7,200, 108 kg, 66.67; q13 A false R true; q14 16 pens, 20% loss; q18 48/700 = 6.86%, GST 84 (digits reversed), 784, 630 x 1.12 = 705.60 vs 714, saves 8.40; q20 Rs 40 a kg, 34 vs 46, 35.29%.
C8M-1.5: q1; q2 20,000, 22,000, 8,250 (750 more); q12 6000/3/20000 = 10%; q13 above; q14 46,656 vs 46,640 (+16), 43,200 vs 43,320; q15 8100/1.265625 = 6,400; q17 84,000/88,200/92,610, 11,059.2, 11.53%, 610 short, yearly 4,000/4,200/4,410; q18 interest in year 3 = 1,210.
C8M-1.6: q2 0.75 x 1.12 = 0.84; q3 6,120 (+2%), 6,210 (+3.5%), money left 2,800/3,400/2,530 so Plan 1; q7 2,832/1.18 = 2,400, 3,000, 2,400, 1.25 x 0.8 = 1, 1.2 x 0.8 = 0.96; q9 560 vs 540; q11 above; q15 1.3225 vs 1.32; q19 2,430, -2.8%, January 2.88%; q21 1,782/0.99 = 1,800.
All step marks of the 54 changed items (and of the rest of the file) sum to marks. For every option item the key is o[0] and no wrong option equals the key in value (checked in code). No option named by position. No "percentage points" left.

## MEDIUM

1. **C8M-1.3 q0 (mcq, museums): two options name the same museum.** Key "Museum A: 25% against 22.22%"; distractor "Museum A: 33.33% against 28.57%" (percent of the new value, the wrong base). Both options answer "A"; only the figures separate them, so a student who picks the verdict and skims the numbers has a second defensible answer. Fix: change the distractor to a different verdict that comes from the wrong base, e.g. "Museum B: 28.57% against 33.33%" is wrong because it swaps; better "Museum B: it lost 200 visitors, not 160" already exists, so replace the third option with "Neither: both fell by about a quarter" variant already present... simplest: rewrite option 3 as "Museum B: 28.57% against 25%" (an invented but plausible slip of dividing by the wrong number) so no two options name the same museum.

## LOW

1. **C8M-1.5 q12 (mcq, post office):** "pays back Rs 26,000 ... The interest is paid out every year" is self-contradictory (if interest is paid out yearly the final payback would be the deposit). Key 10% still unique, but reword: "The scheme gives Rs 6,000 of interest in all over 3 years, with no compounding."
2. **C8M-1.5 q13 tractor:** the "percentage of the price paid" in (c) adds nothing to the decision (the rupee comparison decides). Acceptable; optional: ask whether it is better to keep for a year if the rent were Rs 50,000 (a close call, 4,87,400 vs 4,86,000).
3. **Threshold-style decisions still exist** in C8M-1.2 q9 (90% rule), C8M-1.4 q18(d) (the stem gives the principle "GST is a percentage of the price charged", which gives away the answer), and C8M-1.5 q17(d). Not a template at the file level any more (C8M-1.1 q3, 1.3 q6, 1.4 q2, 1.6 q3 are genuine trade-offs). In C8M-1.4 q18(d) drop "given that GST is a percentage of the price charged".
4. **Single-step reverse or substitution items still labelled Analyse/Hard:** C8M-1.1 q16 (equivalent fraction 12/40 -> 21/70), C8M-1.3 q4 (2,400/0.4), C8M-1.3 q20 and C8M-1.6 q21 (one reverse step). They carry a trap (wrong base), so they are acceptable as 1-mark items, but none is a one-line book fact. Difficulty is Hard on all 130 items; the tag carries no information (unchanged from v2).
5. **C8M-1.1 q13, option 4 "Ward 4, as 7/125 is 7.5%":** false by arithmetic (7/125 = 5.6%), fine as a distractor, but it is a pure error rather than a chapter confusion. Optional: "as 7/125 is 0.7%".
6. **C8M-1.2 q14 (AR):** R ("whole number y itself, without dividing by 100") is clearly false and the key is right; no change needed.

## Counts read

- 54 changed items read in full, all 130 keys kept; MCQs 25; correct option longest by character count: 4 of 25 (all are ties on very short numeric options, not tells). Key at o[0] everywhere.
- No change to claim_check, true_false, AR or multi_statement spreads from v2 (verified by diff: only C8M-1.4 q13, C8M-1.2 q14 among AR items edited; keys remain "A true R false" and "A false R true").
- Slot order unchanged; ideas repeated within a concept: reduced, no concept now holds more than two of the same skill beyond the book's own pattern.

## Per-concept verdicts

- C8M-1.1: load-ready.
- C8M-1.2: load-ready.
- C8M-1.3: load-ready after the one-line option fix in MEDIUM 1 (not blocking; no wrong key).
- C8M-1.4: load-ready.
- C8M-1.5: load-ready (LOW 1 wording advised).
- C8M-1.6: load-ready.

Overall: 0 HIGH, 1 MEDIUM, 6 LOW. Verdict: load-ready (apply MEDIUM 1 and LOW 1 if a minute is available).
