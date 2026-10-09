# Review: DPS Class 7 Maths Part II ch 3 "Finding Common Ground" (content/authoring/dps/class7/p2ch03.json)

Read: all 142 questions (7 concepts, 20-21 each), no sampling. Every HCF/LCM, count, cost and remainder was recomputed in Python (all numeric keys are arithmetically correct; the HIGH items below are ambiguity defects, not arithmetic errors). Checked against the book text (content/extracted/gegp203) and the Part II Ch 3 scope.

## HIGH (second defensible answer / answer depends on unstated facts)

1. C7M-3.5 match (#6): "1. two consecutive numbers 2. two consecutive even numbers 3. 5 and 5n 4. two co-prime numbers / a. HCF is 5 b. HCF is 1 c. HCF is 2 d. HCF is 1 and LCM is the product". Key 1-b, 4-d. Consecutive numbers are co-prime, so both 1 and 4 satisfy both b and d; the distractor "1-d, 2-c, 3-a, 4-b" is equally defensible. Fix: make Column II d something only co-prime pairs in general fit and b something only consecutive pairs fit (e.g. b "HCF is 1 and the pair differs by 1"), or replace item 4 with "two even numbers" -> "HCF at least 2".
2. C7M-3.5 mcq (#2): "Two even numbers, like 18 and 40, always have an HCF that is" key "at least 2". HCF(18,40) = 2, so "exactly 2" is also true for the quoted example; a student who computes it picks it. Fix: use an example pair whose HCF is not 2 (e.g. 12 and 36) and drop "like 18 and 40".
3. C7M-3.7 short (#13): "In 'Fire in the Mountain', no one gets out at 6 or 9 but some get out at 10..." The game rule is not stated in the item; it is the book's Q9 relying on the page. Without the rule the key ("18, not a multiple of 10") cannot be derived. Fix: state the rule in the stem or replace with a self-contained item (also reuses the book item).
4. C7M-3.2 case study (#19): Guna says "the biggest number has the most primes". For the five numbers given the biggest (128) does have the most (key (c) itself says so), then (d) says the claim "falls". The claim as worded is true for this data; only the general claim "larger number => longer factorisation" falls. Fix: word Guna's claim generally ("a larger number always has more prime factors") and ask the student to test it on the five numbers.

## MEDIUM

5. Ambiguous counting/wording that changes the key: 
   - C7M-3.4 (#16): "between 6 a.m. and 12 noon, including 6 a.m." key 3 (6, 9, 12) counts 12 noon. Say "up to and including 12 noon".
   - C7M-3.7 (#18)(b): "between 8:00 and 12:00 including 8:00" key 5 counts 12:00 (8,9,10,11,12); without it 4. State "up to and including 12:00".
   - C7M-3.7 (#11)(b): "How many times in 5 minutes?" key 8 (300/36 = 8.33) does not count the start; say "after the start".
   - C7M-3.7 case (#19)(c): "Find the cost for the largest teams" key Rs 180 is per team; total would be Rs 1620. Say "per team".
   - C7M-3.6 long (#17)(a): "the HCF and LCM Guna gets for 300,150 (divide by 50 first)" key 50 x 3 = 150 assumes he then also divides by 3, which the stem does not say; stopping at 50 gives HCF 50. Say "divides by 50 first, then by 3".
   - C7M-3.6 case (#18)(d): "does that help the teacher?" is asked but the key only gives "22 rows"; no verdict, and the stem states no goal, so nothing to decide. Fix: add a stated goal (e.g. only boys-only or girls-only rows allowed) and key the verdict.
6. Claim-checks are strawmen, all seven end "No": C7M-3.1 (Sneha HCF = 36), 3.2 (Anshu), 3.3 (Ishan), 3.4 (Karan largest common multiple), 3.5 (Mohit LCM < product), 3.6 (Guna three numbers), 3.7 (Kabir 120 cm). Several are the book's own questions (Anshu's claim, largest common multiple of 6 and 8 = book "does such a number exist?", Mohit = book Q10, Guna three numbers = book Math Talk). Fix: make at least 2 or 3 claims correct or correct only in a limited case (e.g. "HCF of two consecutive even numbers is 2" -> right; "HCF of n and n+3 is 3" -> right only when 3 divides n), keep the verdict plus reason marking.
7. Assertion-reason: 6 of 7 are "both true, R explains A" (3.1, 3.3, 3.4, 3.5, 3.6, 3.7); only 3.2 differs. Standard wants "true but not the explanation" about as often. Rewrite 2-3 with a true but non-explaining R (e.g. 3.3: A "HCF of 12 and 35 is 1", R "12 and 35 are both greater than 10"-style is too trivial; better R "35 = 5 x 7 is odd"). Also C7M-3.3 AR: R merely restates A.
8. multi_statement: all seven keys are two-statement combos with exactly one false statement ("1 and 2 only" x3, "1 and 3 only" x2, "2 and 3 only" x2); never "1 only", "3 only" or all three. Vary the keyed combination and the number of false statements. C7M-3.1 #6 ("never larger than the smaller number") and C7M-3.6 AR #7 ("cannot exceed") carry a reversal word but lack "rev": true.
9. Items reuse the textbook's numbers unchanged (about 47 of 142). The standard says change numbers or setting. Verbatim book data:
   - 3.1: 7 and 11, 30 and 50, 28 and 42 (#2, #5, #7, #12), plus 12 and 16 in the match.
   - 3.2: 840 (#2, #10), 105 (#3), 1200 (#8), 225 (#9), 96/121 (#7 R), 360 with 24 factors (#16).
   - 3.3: 72/144 (#4), 24/180, 400/2500, 81/243, 77/725 (#5 and again #12), 42/75/24 (#8), 300/800 (#9), 370/592 (#10), 225/750 (#13), 30/72 (#14).
   - 3.4: 14/35 (#3), toran 6/8 (#4, #13, #19), gajak 7/10 (#5), 96/360 (#7, #11), 105/195/65 (#9), 222/370 (#10).
   - 3.5: 270/50 (#5), 14x6/14x9 (#8), 18x10/18x15 (#9), 10x38/10x21 (#10), LCM(3,24) (#12), 12x16/12x20 (#17), Mohit/Q10 (#14).
   - 3.6: 630/770 (#4, #17), 90/150 (#8), 84/132 (#9), "HCF 1 and LCM 66" (#15, book Q4 word for word), 300/150 (#16, #17), three-number test (#13).
   - 3.7: cowherd 3, 5, 7 gates under 200 (#4 and #15, book Q5 unchanged), box 12/18/36 (#5, #6), 84 kg and 108 kg rice (#10, book's Lekhana numbers), 306/36 (#17), Fire in the Mountain (#13), 3/4/5/7 (#9). Also 3.1 #16 is headed "Lekhana-style problem:" (remove this label from student text).
   Fix: change numbers/setting for each (keep the idea).
10. Near-duplicates inside and across concepts:
   - 3.3 match (#5) and short (#12): the same pairs 81/243 and 400/2500.
   - 3.7 #8 (AR: smallest number above 5 leaving remainder 5 on 8 and 12 = 29) and #12(a) are the same question.
   - 3.7 #4 and #15 are the same cowherd item.
   - 3.7 match #6 repeats 3.4 #4 (6 and 8 strips), 3.4 #5 (7 and 10 days) and 3.7 #5 (12/18/36 cube).
   - 3.6 #4 and #17(b) are the same 630/770; #16 and #17 the same 300/150.
   - 3.4 #16 (buses 20, 30, 45) and 3.7 #18 (bells 20, 30, 45) are the same problem with the same numbers.
   - 3.2: the claim "larger number has longer factorisation" appears in #7 (AR), #13 and #19.
   - 3.5: the "common multiplier k" idea fills #5, #8, #9, #10, #17 and #19.
   - Definitions asked twice per concept: 3.1 #0/#11, 3.4 #0/#12, 3.6 #1/#12.
11. Step marks that name nothing: 3.5 #11 ("Part (a)", "Part (b)"), 3.5 #17-#20 ("48", "12", "30", "60", "4", "Pairs", "Pattern"), 3.6 #17-#19 ("Reliable", "108", "factors", "check", "decision", "12", "1260"), 3.7 #10-#12 ("Part (a)"), 3.7 #17-#20 ("HCF", "bags", "a", "b", "c", "d"), 3.4 #17. These pass the loader but do not say what earns the mark. Rename like "Part (b): HCF 60 by doubling the multiplier rule".
12. Case studies that are not case studies or have no real decision (no setting, or the stated criterion fixes the answer):
   - No setting: 3.5 #20 (list of Guna conjectures; verdict, not a decision), 3.6 #19 (bare numbers), 3.2 #19.
   - Decision fixed by the criterion: 3.1 #18 (principal's 7 vs 14, "as few rows as possible"), 3.3 #18, 3.7 #19, 3.4 #18 (committee asks "twice", gets 4), 3.4 #19 (who spends more: just arithmetic), 3.5 #19, 3.2 #18 ((d) asks for the extremes 1 row / 21 rows).
   - Genuine trade-offs: 3.1 #19 (tile cost), 3.3 #19 (bed cost), 3.7 #20 (stock). Use these as the model.
   - 3.2 #18: part (a) is printed in the stem ("divide by 3, then by 5, then 7 is left") - a free mark; also 3.1 #19 (a) is nearly free (all shop sizes divide).
13. Scope/book fidelity: 3.2 #3 key ("stop when the last quotient is a prime") matches the book ("We stop when we reach a prime number"), but the scope record says "until the quotient is 1": both appear, so word the option so only one reading is right. 3.6 #13 (three numbers) is in the book as a Math Talk exploration, so it is not a scope_out breach, but the scope_out line "proof of HCF x LCM for three or more numbers" is adjacent: keep the item as a test, not a proof. 3.7 #2 uses the form "18k + 4"; the book never writes k-forms for remainders (only n and 5n), so use "a multiple of 18 plus 4".

## LOW

14. Templating (structural): every concept has the identical slot order - #0-#4/#5 MCQs, then match or MS/AR, five 2-mark (a)/(b), three 3-mark in the fixed order claim_check / "Show that ... cannot" / reverse-write-a-problem, two 5-mark (a)-(d), two case studies. The 3-mark triplet is the same frame seven times. The case-study endings repeat "an authority proposes a smaller divisor, compare the counts" (3.1 #16(d), #18(c,d); 3.3 #18(d), #19(c,d); 3.7 #19(d)). The two reverse items 3.1 #15 and 3.7 #16 both pack goods into equal groups; 3.1 #15 and 3.4 #15 and 3.7 #16 are "write a story ... then solve it" three times. Vary the order and the frame; the 5-mark "(a) factorise (b) HCF (c) count (d) twist" appears in 3.1 #16, 3.3 #16, 3.7 #17.
15. Distractors with no real confusion: 3.2 #0 ("x 1" options), 3.3 #4 ("Both 72 and 144 are prime", "use three numbers"), 3.2 #1 ("1 x 13"), 3.5 #4 (14, 30). Correct option is the longest in 3.4 #1 and 3.6 #0.
16. Several 2-mark (b) parts are trivial consequences: 3.3 #8(b), 3.4 #10(b), 3.6 #16(d) (150 x 300 = 300 x 150 is tautological). 3.1 #7 AR: R ("every common factor of 28 and 42 divides 14") is true but is a restatement of the HCF idea.
17. Level mix chapter-wide is fine (Remember/Understand 27%, Analyse/Evaluate/Create 37%); match count 4 meets the minimum (ceil(7/2) = 4). Names are mostly the book's (Anshu, Guna overused: 3.2, 3.4, 3.5, 3.6); add a few Indian names. Settings are Indian (rangoli, barfi, toran, gajak, sports day); no copy of a DPS paper detected.

## Per-concept verdict
- C7M-3.1: keys correct; strong items are the two cases (tile cost); fix claim-check strawman, textbook jump numbers, "Lekhana-style" label.
- C7M-3.2: keys correct; HIGH on the Guna case (#19); repeated "larger number" claim x3; #18 gives part (a) away.
- C7M-3.3: keys correct; heavy textbook reuse and duplicate pairs; case #19 is a good cost trade-off.
- C7M-3.4: keys correct; ambiguity in bus count (#16); 6/8 toran and 96/360 straight from the book.
- C7M-3.5: two HIGH defects (match, "always" MCQ); "common multiplier" repeated 6 times; weak step names.
- C7M-3.6: keys correct; ambiguous Guna shortcut (#17) and unanswered (d) in #18; reuse of 300/150, 630/770.
- C7M-3.7: keys correct; Fire in the Mountain not self-contained; 8-12 remainder item appears twice; cowherd twice; counting ambiguities; #20 is the best item of the chapter.

## Overall
All 142 numeric keys verified correct by code. The chapter is NOT ready to load: 4 HIGH ambiguity defects, many MEDIUM, and the bank is visibly templated and leans on the textbook's own numbers. Roughly 40-45 items need rewriting, about 15 need only a wording fix.
